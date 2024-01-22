import { useRef, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";

const useRecordMedia = () => {
  const [media, setMedia] = useState<MediaRecorder | null>(null);
  const [accept, setAccept] = useState(false);

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
    if (media) {
      await handleStartRecord(media);
      return;
    }
    try {
      const stream = await handleConnectRecord();
      if (stream) {
        setAccept(true);
        setMedia(stream);
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
    stream.ondataavailable = (e) => {
      console.log("ondataavailable", e.data);
    };
  }

  function handleStopRecord() {
    if (media === null) return;
    media.stop();
    console.log(media.state);
    console.log("recorder stopped");
  }

  function handlePauseRecord() {
    if (media === null) return;
    media.pause();
    console.log(media.state);
    console.log("recorder paused");
  }

  function handleResumeRecord() {
    if (media === null) return;
    media.resume();
    console.log(media.state);
    console.log("recorder resume");
  }

  async function handleAcceptRecord() {
    setAccept(true);
  }

  return {
    media,
    accept,
    handleAcceptRecord,
    handleTriggerStart,
    handleStartRecord,
    handlePauseRecord,
    handleStopRecord,
    handleResumeRecord,
  };
};

export default useRecordMedia;
