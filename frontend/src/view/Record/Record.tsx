"use client";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  DoorClosedIcon,
  Download,
  Mic,
  Pause,
  StepForward,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useRecordMedia from "@/hooks/useRecordMedia";
import useCountSec from "@/hooks/useCountSec";

const Record = () => {
  const {
    streamData,
    media,
    accept,
    mediaState,
    blobData,
    recordDataUrl,
    disconnect,
    handleTriggerStart,
    handleStopRecord,
    handlePauseRecord,
    handleResumeRecord,
  } = useRecordMedia();

  const [startTime, setStartTime] = useState(2);
  const [endTime, setEndTime] = useState(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { time, startTimer, toggleTimer, resetTimer } = useCountSec({
    targetSec: 100,
    type: "mm:ss",
  });

  useEffect(() => {
    const audioContext = new window.AudioContext();
    const ctx = canvasRef.current?.getContext("2d");

    function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    }

    async function drawWaveform(blob: Blob) {
      console.log("Fejio");
      if (canvasRef.current === null) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const arrayBuffer = await blobToArrayBuffer(blob);
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const dataArray = audioBuffer.getChannelData(0); // This is a Float32Array.

      // Find the maximum value in dataArray to use for normalization
      let maxVal = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const absValue = Math.abs(dataArray[i]);
        if (absValue > maxVal) {
          maxVal = absValue;
        }
      }
      const amplitudeScale = height / 2 / maxVal;

      // Clear the previous drawing
      ctx.clearRect(0, 0, width, height);

      // Set up the style of the waveform
      ctx.lineWidth = 2; // Increase this for thicker lines
      ctx.strokeStyle = "red";
      ctx.beginPath();

      // The vertical center of the canvas
      const centerY = height / 2;

      // Calculate the width of each segment of the line
      const sliceWidth = width / dataArray.length;

      // Start in the middle of the canvas
      ctx.moveTo(0, centerY);

      // Draw the waveform
      for (let i = 0; i < dataArray.length; i++) {
        const point = dataArray[i];

        // Scale the point's amplitude and offset it to the center
        const y = centerY - point * amplitudeScale;

        // Plot the point
        ctx.lineTo(i * sliceWidth, y);
      }

      // Finish plotting the waveform line
      ctx.lineTo(width, centerY);
      ctx.stroke();
    }
    if (blobData) {
      drawWaveform(blobData);
    }
  }, [blobData]);

  // Duration of the audio in seconds
  const audioDuration = 10; // You'll need to set this based on your audio's duration

  // Function to start playback from the selected interval
  function playSelectedInterval(audioBlob: Blob) {
    // Create an audio element
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);

    // Set the current time to the start time
    audioElement.currentTime = startTime;

    // Play the audio
    audioElement.play();

    // Stop the audio at the end time
    setTimeout(() => {
      audioElement.pause();
      // Revoke the object URL to free memory
      URL.revokeObjectURL(audioUrl);
    }, (endTime - startTime) * 1000);
  }

  function handleCanvasInterval(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the canvas

    // Convert x position to time
    const time = (x / canvas.width) * audioDuration;

    // Set start and end times for the interval
    // if (startTime === 0 || time < startTime) {
    //   setStartTime(time);
    //   setEndTime(0);
    // } else if (endTime === 0 || time > startTime) {
    //   setEndTime(time);
    //   // Now we have a valid interval, play it
    //   if (blobData) {
    //     playSelectedInterval(blobData);
    //   }
    // }

    if (blobData) {
      playSelectedInterval(blobData);
    }
  }
  return (
    <div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col ">
          {recordDataUrl ? <audio src={recordDataUrl} controls></audio> : null}
          <canvas
            onClick={(e) => handleCanvasInterval(e)}
            ref={canvasRef}
            className="w-[600px] h-[100px] bg-gray-300"
          ></canvas>
        </div>
        <div className="flex space-x-4 items-center">
          <Input placeholder="enter the url" />
          {!accept || mediaState === "inactive" ? (
            <Button
              type="button"
              variant={"secondary"}
              onClick={async () => {
                await handleTriggerStart();
              }}
            >
              <Mic className="mr-2 h-4 w-4" /> Record
            </Button>
          ) : null}

          {mediaState === "paused" ? (
            <Button
              type="button"
              variant={"secondary"}
              className="bg-sky-100 hover:bg-sky-200"
              onClick={() => {
                handleResumeRecord();
              }}
            >
              <StepForward className="mr-2 h-4 w-4" /> Resume
            </Button>
          ) : null}

          {mediaState === "recording" ? (
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                handlePauseRecord();
              }}
            >
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : null}

          {mediaState === "recording" || mediaState === "paused" ? (
            <Button
              type="button"
              onClick={() => {
                handleStopRecord();
              }}
            >
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : null}
          <Download
            className="w-10 h-10"
            onClick={() => {
              media?.requestData();
            }}
          />
        </div>

        <Button type="button" className="self-end p-2" onClick={disconnect}>
          <DoorClosedIcon className="w-6 h-6" />
        </Button>
        <div className="flex space-x-4">
          <Button onClick={startTimer}>count :{time}</Button>
          <Button onClick={toggleTimer}>stop</Button>
          <Button onClick={resetTimer}>rest</Button>
        </div>
      </div>
    </div>
  );
};

export default Record;
