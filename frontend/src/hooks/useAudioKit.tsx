import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useElapsedTime from "./useElapsedTime";

import toast from "react-hot-toast";

import { DEFAULT_BITS_PER_SECOND, MEDIA_CONSTRAINT } from "@/lib/constants";

const useAudioKit = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Array<Float32Array>>([]);

  const [recordBlob, setRecordBlob] = useState<Blob | null>(null);
  const [recordBlobUrl, setRecordBlobUrl] = useState<string | null>(null);

  const [isReady, setIsReady] = useState<boolean | undefined>(undefined);
  const [mediaState, setMediaState] = useState<RecordingState>("inactive");

  const pathname = usePathname();

  const { time, startTimer, resetTimer, activeTimer } = useElapsedTime({
    targetSec: 100,
    type: "mm:ss",
  });

  const disconnect = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    if (!audioContextRef.current || !isReady) return;
    console.log("cool");

    function concatenateFloat32Arrays(arrays: Float32Array[]): Float32Array {
      const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
      const result = new Float32Array(totalLength);
      let offset = 0;
      for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
      }
      return result;
    }
    function encodeWAV(sampleRate: number, samples: Float32Array): ArrayBuffer {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);

      writeString(view, 0, "RIFF");
      view.setUint32(4, 36 + samples.length * 2, true);
      writeString(view, 8, "WAVE");
      writeString(view, 12, "fmt ");
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(view, 36, "data");
      view.setUint32(40, samples.length * 2, true);

      floatTo16BitPCM(view, 44, samples);

      return buffer;
    }

    function floatTo16BitPCM(
      output: DataView,
      offset: number,
      input: Float32Array,
    ) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
    }

    function writeString(view: DataView, offset: number, string: string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    const handleProcessorMessage = (event: any) => {
      console.log(event, "aaajhh");
      if (event.data.type === "recordingFinished") {
        const audioData = event.data.audioData;
        console.log(event.data);
        if (audioData.length > 0) {
          const concatenatedSamples = concatenateFloat32Arrays(audioData);

          if (concatenatedSamples.length > 0) {
            const audioBuffer = audioContextRef.current!.createBuffer(
              1,
              concatenatedSamples.length,
              audioContextRef.current!.sampleRate,
            );
            audioBuffer.copyToChannel(concatenatedSamples, 0);

            const arrayBuffer = encodeWAV(
              audioBuffer.sampleRate,
              concatenatedSamples,
            );

            const blob = new Blob([arrayBuffer], { type: "audio/wav" });
            console.log(blob);

            setRecordBlob(blob);
            const url = URL.createObjectURL(blob);
            setRecordBlobUrl(url);
          }
        }
      }
    };

    audioWorkletRef.current!.port.onmessage = handleProcessorMessage;

    // return () => {
    //   if (audioWorkletRef.current) {
    //     audioWorkletRef.current.port.onmessage = null;
    //   }
    //
    //   if (recordBlobUrl) {
    //     URL.revokeObjectURL(recordBlobUrl);
    //   }
    // };
  }, [isReady, recordBlobUrl]);

  // NOTE: cleanup when page changed
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        disconnect();
      }

      if (recordBlobUrl) {
        URL.revokeObjectURL(recordBlobUrl);
      }
    };
  }, [disconnect, pathname, recordBlobUrl]);

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      await audioContextRef.current.audioWorklet.addModule(
        "./recorder-processor.js",
      );

      const streamSource =
        audioContextRef.current.createMediaStreamSource(stream);

      audioWorkletRef.current = new AudioWorkletNode(
        audioContextRef.current,
        "recorder-processor",
      );

      streamSource.connect(audioWorkletRef.current);
      audioWorkletRef.current.connect(audioContextRef.current.destination);

      setIsReady(true);

      // NOTE: initial data state
      setRecordBlob(null);
      setRecordBlobUrl(null);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setIsReady(false);
      toast.error("Error accessing media devices");
    }
  };

  const startRecording = () => {
    if (mediaState === "recording") return;
    if (!audioWorkletRef.current) return;

    audioWorkletRef.current.port.postMessage({ type: "startRecording" });
    startTimer();
    setMediaState("recording");
  };

  const stopRecording = () => {
    console.log(audioWorkletRef.current, mediaState, "fwefwe");
    if (!audioWorkletRef.current) return;
    // if (mediaState === "recording" || mediaState === "paused") {
    audioWorkletRef.current.port.postMessage({ type: "stopRecording" });
    resetTimer();
    setMediaState("inactive");
    disconnect();
    setIsReady(undefined);
    // }
  };

  const pauseRecording = () => {
    if (!audioWorkletRef.current || mediaState !== "recording") return;
    audioWorkletRef.current.port.postMessage({ type: "pauseRecording" });
    activeTimer(false);
    setMediaState("paused");
  };

  const resumeRecording = () => {
    if (!audioWorkletRef.current || mediaState !== "paused") return;
    audioWorkletRef.current.port.postMessage({ type: "resumeRecording" });
    activeTimer(true);
    setMediaState("recording");
  };

  const cleanupResources = useCallback(() => {
    disconnect();
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    audioWorkletRef.current = null;
    recordedChunksRef.current = [];
    setMediaState("inactive");
    resetTimer();
    if (recordBlobUrl) {
      URL.revokeObjectURL(recordBlobUrl);
    }
    setRecordBlob(null);
    setIsReady(undefined);
  }, [disconnect, recordBlobUrl, resetTimer]);

  const returnState = {
    data: {
      stream: mediaStreamRef.current,
      blob: recordBlob,
      url: recordBlobUrl,
    },

    state: {
      mediaState: mediaState,
      deviceState: isReady,
    },

    utils: {
      start: initializeDevice,
      startRecording: startRecording,
      stop: stopRecording,
      pause: pauseRecording,
      resume: resumeRecording,
      disconnect: disconnect,
      cleanup: cleanupResources,
    },
    timer: {
      time,
    },
  };

  return returnState;
};

export default useAudioKit;
