import { useCallback, useEffect, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";
import useElapsedTime from "./useElapsedTime";

const useRecordMedia = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [recordBlob, setRecordBlob] = useState<Blob | null>(null);
  const [recordBlobUrl, setRecordBlobUrl] = useState<string | null>(null);

  const [isReady, setIsReady] = useState(false); // Reintroduced isReady state
  const [mediaState, setMediaState] = useState<RecordingState>("inactive");

  // NOTE: integrate the timer
  const { time, startTimer, resetTimer, activeTimer } = useElapsedTime({
    targetSec: 100,
    type: "mm:ss",
  });

  /** Function to initialize media stream and recorder */
  const initMediaStream = useCallback(async () => {
    setIsReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        MEDIA_CONSTRAINT
      );
      setMediaStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsReady(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setIsReady(false);
    }
  }, []);

  useEffect(() => {
    initMediaStream();

    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
      setIsReady(false); // Reset isReady when cleaning up
    };
  }, [initMediaStream]);

  // Setup event listeners for the media recorder.
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

  // Start recording
  const startRecording = () => {
    if (!mediaRecorder || mediaState === "recording") return;
    mediaRecorder.start();
    startTimer();
    setMediaState("recording");
  };

  // Stop recording
  const stopRecording = () => {
    if (!mediaRecorder) return;
    if (mediaState === "recording" || mediaState === "paused") {
      mediaRecorder.stop();
      resetTimer();
      setMediaState("inactive");
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (!mediaRecorder || mediaState !== "recording") return;
    mediaRecorder.pause();
    activeTimer(false);
    setMediaState("paused");
  };

  // Resume recording
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
  // Disconnect and cleanup
  const disconnect = useCallback(() => {
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
      initialize: initMediaStream,
    },
    timer: {
      time,
    },
  };

  return returnState;
};

export default useRecordMedia;
