"use client";
import React from "react";

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
    media,
    accept,
    mediaState,
    recordDataUrl,
    disconnect,
    handleTriggerStart,
    handleStopRecord,
    handlePauseRecord,
    handleResumeRecord,
  } = useRecordMedia();

  const { time, startTimer, toggleTimer, resetTimer } = useCountSec({
    targetSec: 100,
    type: "mm:ss",
  });

  return (
    <div>
      <div className="flex flex-col gap-4 items-center">
        <div className="">
          {recordDataUrl ? <audio src={recordDataUrl} controls></audio> : null}
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
