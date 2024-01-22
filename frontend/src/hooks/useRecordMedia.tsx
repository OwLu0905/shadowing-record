import { useRef, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";

const useRecordMedia = () => {
  const mediaRef = useRef<MediaRecorder | null>(null);
  const [accept, setAccept] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  async function handleConnectRecord(): Promise<MediaRecorder | null> {
    return navigator.mediaDevices
      .getUserMedia(MEDIA_CONSTRAINT)
      .then((stream) => {
        return new MediaRecorder(stream);
      })
      .catch((_) => {
        throw Error("mic is not available");
      });
  }

  async function handleTriggerStart() {
    if (mediaRef.current) {
      await handleStartRecord(mediaRef.current);
      return;
    }
    try {
      const stream = await handleConnectRecord();
      if (stream) {
        setAccept(true);
        mediaRef.current = stream;
        await handleStartRecord(stream);
      }
    } catch (err) {
      console.error(err);
    }
  }
  async function handleStartRecord(stream: MediaRecorder) {
    if (stream === null) return;
    stream.start();
    console.log(stream.state);
    console.log("recorder started");
    setIsRecording(true);
    stream.ondataavailable = (e) => {
      console.log("ondataavailable", e.data);
    };
  }

  function handleStopRecord() {
    if (mediaRef.current === null) return;
    mediaRef.current.stop();
    console.log(mediaRef.current.state);
    console.log("recorder stopped");
  }

  function handlePauseRecord() {
    if (mediaRef.current === null) return;
    mediaRef.current.pause();
    setIsRecording(false);
    console.log(mediaRef.current.state);
    console.log("recorder paused");
  }

  async function handleAcceptRecord() {
    setAccept(true);
  }

  return {
    mediaRef,
    accept,
    handleAcceptRecord,
    handleTriggerStart,
    handleStartRecord,
    handlePauseRecord,
    handleStopRecord,
    isRecording,
    setIsRecording,
  };
};

export default useRecordMedia;
