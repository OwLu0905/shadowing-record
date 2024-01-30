import { useCallback, useEffect, useRef, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";
import useElapsedTime from "./useElapsedTime";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

const useRecordMedia = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);

  const [recordBlob, setRecordBlob] = useState<Blob | null>(null);
  const [recordBlobUrl, setRecordBlobUrl] = useState<string | null>(null);

  const [isReady, setIsReady] = useState<boolean | undefined>(undefined);
  const [mediaState, setMediaState] = useState<RecordingState>("inactive");

  const pathname = usePathname();

  const { time, startTimer, resetTimer, activeTimer } = useElapsedTime({
    targetSec: 100,
    type: "mm:ss",
  });

  const _startRecording = useCallback(() => {
    if (mediaState === "recording") return;
    if (mediaRef.current === null) return;

    mediaRef.current.start();
    startTimer();
    setMediaState("recording");
  }, [mediaState, startTimer]);

  const disconnect = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  useEffect(() => {
    if (isReady && mediaRef.current) {
      mediaRef.current.start();
      startTimer();
      setMediaState("recording");
    }
  }, [isReady, startTimer]);

  useEffect(() => {
    if (!mediaRef.current || !isReady) return;

    const handleDataAvailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        setRecordBlob(event.data);
        const url = URL.createObjectURL(event.data);

        setRecordBlobUrl(url);
      }
    };

    mediaRef.current.addEventListener("dataavailable", handleDataAvailable);

    return () => {
      if (mediaRef.current) {
        mediaRef.current.removeEventListener(
          "dataavailable",
          handleDataAvailable
        );
      }
      if (recordBlobUrl) {
        console.log("fe");
        URL.revokeObjectURL(recordBlobUrl);
      }
    };
  }, [isReady, recordBlobUrl]);

  // NOTE: cleanup when page changed
  useEffect(() => {
    return () => {
      if (mediaRef.current) {
        disconnect();
      }

      if (recordBlobUrl) {
        URL.revokeObjectURL(recordBlobUrl);
      }
    };
  }, [disconnect, pathname, recordBlobUrl]);

  const initializeDevice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        MEDIA_CONSTRAINT
      );
      setIsReady(true);
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setIsReady(false);
      toast.error("Error accessing media devices");
    }
  };

  const stopRecording = () => {
    if (!mediaRef.current) return;
    if (mediaState === "recording" || mediaState === "paused") {
      mediaRef.current.stop();
      resetTimer();
      setMediaState("inactive");
      mediaRef.current = null;
      disconnect();
      setIsReady(undefined);
    }
  };

  const pauseRecording = () => {
    if (!mediaRef.current || mediaState !== "recording") return;
    mediaRef.current.pause();
    activeTimer(false);
    setMediaState("paused");
  };

  const resumeRecording = () => {
    if (!mediaRef.current || mediaState !== "paused") return;

    if (recordBlobUrl) {
      URL.revokeObjectURL(recordBlobUrl);
    }
    mediaRef.current.resume();

    activeTimer(true);
    setMediaState("recording");
  };

  const cleanupResources = useCallback(() => {
    mediaStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null);
    mediaRef.current = null;
    setMediaState("inactive");
    resetTimer();
    if (recordBlobUrl) {
      URL.revokeObjectURL(recordBlobUrl);
      setRecordBlobUrl(null);
    }
    setRecordBlob(null);
    setIsReady(undefined);
  }, [mediaStream, recordBlobUrl, resetTimer]);

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
      start: initializeDevice,
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
