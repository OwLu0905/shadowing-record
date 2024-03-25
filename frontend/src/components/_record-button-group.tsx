// @ts-nocheck
import React from "react";

const RecordButtonGroup = () => {
  return (
    <div>
      <div className="flex gap-2">
        {mediaState === "inactive" && (
          <Button
            type="button"
            variant={"secondary"}
            onClick={async () => await start()}
            title="Record"
            className="h-10 w-10 rounded-full p-0"
          >
            <Mic className="rounded-full p-0.5" />
          </Button>
        )}

        {mediaState === "paused" && (
          <Button
            type="button"
            variant="ghost"
            onClick={resume}
            className="h-10 w-10 rounded-full p-0"
          >
            <StepForward className="rounded-full p-0.5" />
          </Button>
        )}

        {mediaState === "recording" && (
          <Button
            type="button"
            variant="ghost"
            onClick={pause}
            className="h-10 w-10 rounded-full p-0"
          >
            <Pause className="rounded-full p-0.5" />
          </Button>
        )}

        {(mediaState === "recording" || mediaState === "paused") && (
          <Button
            type="button"
            variant="ghost"
            onClick={stop}
            className="h-10 w-10 rounded-full p-0"
          >
            <StopCircle className="rounded-full p-0.5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordButtonGroup;
