import { useCallback, useEffect, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";
import useElapsedTime from "./useElapsedTime";
import { usePathname } from "next/navigation";

const useRecordMedia = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

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
    mediaStream?.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  // NOTE: cleanup when page changed
  useEffect(() => {
    return () => {
      disconnect();
      if (recordBlobUrl) {
        URL.revokeObjectURL(recordBlobUrl);
      }
    };
  }, [disconnect, pathname]);

  useEffect(() => {
    if (!mediaRecorder) return;

    const handleDataAvailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        setRecordBlob(event.data);
        const url = URL.createObjectURL(event.data);

        setRecordBlobUrl(url);
      }
    };

    mediaRecorder.addEventListener("dataavailable", handleDataAvailable);

    return () => {
      mediaRecorder.removeEventListener("dataavailable", handleDataAvailable);
      if (recordBlobUrl) {
        URL.revokeObjectURL(recordBlobUrl);
      }
    };
  }, [mediaRecorder, recordBlobUrl]);

  const startRecording = async () => {
    if (mediaState === "recording") return;

    if (mediaRecorder === null) {
      setIsReady(undefined);
      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          MEDIA_CONSTRAINT
        );
        setMediaStream(stream);
        const recorder = new MediaRecorder(stream);
        recorder.start();
        setMediaRecorder(recorder);
        startTimer();
        setMediaState("recording");
        setIsReady(true);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setIsReady(false);
      }
    } else {
      mediaRecorder.start();
      startTimer();
      setMediaState("recording");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaState === "recording" || mediaState === "paused") {
      mediaRecorder.stop();
      resetTimer();
      setMediaState("inactive");
      disconnect();
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorder || mediaState !== "recording") return;
    mediaRecorder.pause();
    activeTimer(false);
    setMediaState("paused");
  };

  const resumeRecording = () => {
    if (!mediaRecorder || mediaState !== "paused") return;
    mediaRecorder.resume();
    activeTimer(true);
    setMediaState("recording");
  };

  const resetState = useCallback(() => {
    setMediaStream(null);
    setMediaRecorder(null);
    setRecordBlob(null);
    setRecordBlobUrl(null);
    setMediaState("inactive");
    resetTimer();
  }, []);

  const cleanupResources = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null);
    setMediaRecorder(null);
    setMediaState("inactive");
    resetTimer();
    if (recordBlobUrl) {
      URL.revokeObjectURL(recordBlobUrl);
      setRecordBlobUrl(null);
    }
    setRecordBlob(null);
  }, [mediaStream, recordBlobUrl]);

  // TODO: requsetData

  const returnState = {
    data: {
      srteam: mediaStream,
      blob: recordBlob,
      url: recordBlobUrl,
    },

    state: {
      mediaState: mediaState,
      deviceState: isReady,
    },

    utils: {
      start: startRecording,
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

export default useRecordMedia;
