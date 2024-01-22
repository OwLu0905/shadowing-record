"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Download, Mic, Pause, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRecordMedia from "@/hooks/useRecordMedia";

const Record = () => {
  const {
    media,
    accept,
    handleTriggerStart,
    handleStartRecord,
    handleStopRecord,
    handlePauseRecord,
    handleAcceptRecord,
    handleResumeRecord,
  } = useRecordMedia();

  return (
    <div>
      <div className="flex space-x-4 items-center">
        <Input placeholder="enter the url" />
        <Button
          type="button"
          variant={"secondary"}
          onClick={async () => {
            await handleTriggerStart();
          }}
        >
          <Mic className="mr-2 h-4 w-4" /> {media?.state ?? "Record"}
        </Button>

        <Button
          onClick={() => {
            handlePauseRecord();
          }}
        >
          <Pause className="mr-2 h-4 w-4" /> Paused
        </Button>

        <Button
          type="button"
          onClick={() => {
            handleStopRecord();
          }}
        >
          <StopCircle className="mr-2 h-4 w-4" />
        </Button>
        <Download className="w-10 h-10" />
      </div>
    </div>
  );
};

export default Record;
