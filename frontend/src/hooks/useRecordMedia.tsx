import React, { useEffect, useRef } from "react";

const useRecordMedia = () => {
  const mediaRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (navigator.mediaDevices) {
      console.log("getUserMedia supported.");
      const constraints = { audio: true };
      let chunks = [];
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          mediaRef.current = new MediaRecorder(stream);
        })
        .catch((err) => {
          console.log("mic is not available");
        });
    }
  }, []);

  function handleStartRecord() {
    if (mediaRef.current === null) return;
    mediaRef.current.start();
    console.log(mediaRef.current.state);
    console.log("recorder started");
    mediaRef.current.ondataavailable = (e) => {
      console.log("ondataavailable", e.data);
    };
  }

  function handleStopRecord() {
    if (mediaRef.current === null) return;
    mediaRef.current.stop();
    console.log(mediaRef.current.state);
    console.log("recorder stopped");
  }

  return { mediaRef, handleStartRecord, handleStopRecord };
};

export default useRecordMedia;
