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
  const { data, state, utils } = useRecordMedia();
  const recordDataUrl = data.url;
  const mediaState = state.mediaState;
  const isAvailable = state.deviceState;

  const { start, stop, pause, resume, disconnect, initialize } = utils;

  const [startTime, setStartTime] = useState(2);
  const [endTime, setEndTime] = useState(5);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { time, startTimer, toggleTimer, resetTimer } = useCountSec({
    targetSec: 100,
    type: "mm:ss",
  });

  if (!isAvailable)
    return (
      <div>
        Please check whether the record device available or the permission of
        mic
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col ">
          {recordDataUrl ? <audio src={recordDataUrl} controls></audio> : null}
          <canvas
            ref={canvasRef}
            width="550"
            height="128"
            className="rounded-xl bg-gray-100 fill-amber-500"
          ></canvas>
        </div>
        <div className="flex space-x-4 items-center">
          <Input placeholder="enter the url" />
          {mediaState === "inactive" ? (
            <Button type="button" variant={"secondary"} onClick={start}>
              <Mic className="mr-2 h-4 w-4" /> Record
            </Button>
          ) : null}

          {mediaState === "paused" ? (
            <Button
              type="button"
              variant={"secondary"}
              className="bg-sky-100 hover:bg-sky-200"
              onClick={resume}
            >
              <StepForward className="mr-2 h-4 w-4" /> Resume
            </Button>
          ) : null}

          {mediaState === "recording" ? (
            <Button type="button" variant="destructive" onClick={pause}>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
          ) : null}

          {mediaState === "recording" || mediaState === "paused" ? (
            <Button type="button" onClick={stop}>
              <StopCircle className="mr-2 h-4 w-4" /> Stop
            </Button>
          ) : null}
          <Download className="w-10 h-10" />
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
