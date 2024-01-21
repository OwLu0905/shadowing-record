"use client";
import React from "react";

import { Input } from "@/components/ui/input";
import { Download, Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRecordMedia from "@/components/ui/hooks/useRecordMedia";

const Record = () => {
  const { mediaRef, handleStartRecord, handleStopRecord } = useRecordMedia();

  return (
    <div>
      <div className="flex space-x-4 items-center">
        <Input placeholder="enter the url" />
        <Button
          type="button"
          variant={"secondary"}
          onClick={() => handleStartRecord()}
        >
          <Mic className="mr-2 h-4 w-4" /> Record
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
