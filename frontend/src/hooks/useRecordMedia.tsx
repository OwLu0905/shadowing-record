import { useEffect, useState } from "react";
import { MEDIA_CONSTRAINT } from "@/lib/constants";

const useRecordMedia = () => {
  const [media, setMedia] = useState<MediaRecorder | null>(null);
  const [accept, setAccept] = useState(false);
  const [mediaState, setMediaState] = useState<RecordingState | undefined>(
    undefined
  );
  const [streamData, setStreamData] = useState<MediaStream | undefined>(
    undefined
  );
  const [blobData, setBlobData] = useState<Blob | undefined>(undefined);
  const [recordData, setRecordData] = useState<Blob[]>([]);
  const [recordDataUrl, setRecordDataUrl] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (media) {
      media.ondataavailable = (e) => {
        console.log("ondataavailable", e.data);
        setRecordData((prev) => {
          // Create a new blob including the new data
          const updatedRecordData = [...prev, e.data];
          const blob = new Blob(updatedRecordData, { type: "video/webm" });
          setBlobData(blob);

          // Update the recordDataUrl
          setRecordDataUrl((prevUrl) => {
            // Revoke the previous URL to free up memory
            if (prevUrl) {
              URL.revokeObjectURL(prevUrl);
            }
            return URL.createObjectURL(blob);
          });

          return updatedRecordData;
        });
      };
    }
  }, [media]);

  async function handleConnectRecord(): Promise<MediaRecorder | null> {
    return navigator.mediaDevices
      .getUserMedia(MEDIA_CONSTRAINT)
      .then((stream) => {
        setStreamData(stream);
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

  async function handleStartRecord(media: MediaRecorder) {
    if (media === null) return;
    media.start();
    setMediaState("recording");
  }

  function handleStopRecord() {
    if (media === null) return;
    media.stop();
    setMediaState("inactive");
  }

  function handlePauseRecord() {
    if (media === null) return;
    media.pause();
    setMediaState("paused");
  }

  function handleResumeRecord() {
    if (media === null) return;
    media.resume();
    setMediaState("recording");
  }

  function disconnect() {
    if (recordDataUrl) {
      URL.revokeObjectURL(recordDataUrl);
    }
    if (streamData) {
      streamData.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setStreamData(undefined);
    setMedia(null);
    setMediaState(undefined);
    setAccept(false);
  }

  return {
    streamData,
    media,
    accept,
    mediaState,
    recordData,
    blobData,
    recordDataUrl,
    disconnect,
    handleTriggerStart,
    handlePauseRecord,
    handleStopRecord,
    handleResumeRecord,
  };
};

export default useRecordMedia;
