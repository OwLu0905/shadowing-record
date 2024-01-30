"use client";
import React, { useRef } from "react";

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
import Link from "next/link";

const Record = () => {
  const { data, state, utils, timer } = useRecordMedia();
  const recordDataUrl = data.url;
  const mediaState = state.mediaState;
  const isAvailable = state.deviceState;
  const time = timer.time;

  const { start, stop, pause, resume, disconnect, cleanup } = utils;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (isAvailable === false)
    return (
      <div>
        Please check whether the record device available or the permission of
        mic
      </div>
    );

  return (
    <div>
      <Link href="/test">Link test</Link>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-col ">
          {mediaState !== "inactive" ? (
            <div className="animate-sparkup">{mediaState}</div>
          ) : recordDataUrl ? (
            <audio src={recordDataUrl} controls></audio>
          ) : null}
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
          <Button>count :{time}</Button>
        </div>
      </div>
    </div>
  );
};

export default Record;
