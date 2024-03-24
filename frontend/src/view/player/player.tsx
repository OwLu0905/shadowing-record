"use client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { format } from "date-fns/format";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SliderWithLabel } from "@/components/custom/ui/slider";

import PlayerActions from "@/view/player/player-actions";

import { MicIcon, Pause, Pencil, StepForward, StopCircle } from "lucide-react";

const outurl = "https://www.youtube.com/embed/69kQ7S0_fO4";

type SliderState = [start: number, end: number];

type PlayerProps = {
  playerRef: React.RefObject<ReactPlayer>;

  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  hasWindow: boolean;
  setHasWindow: React.Dispatch<React.SetStateAction<boolean>>;

  sliderValue: SliderState;
  setSliderValue: React.Dispatch<React.SetStateAction<SliderState>>;
  onSyncRecord: (sync: boolean) => Promise<void>;
  onSyncResume: () => void;
  onSyncPause: () => void;
  onSyncStop: () => void;
  mediaState: RecordingState;
};

const Player = (props: PlayerProps) => {
  const {
    playerRef,
    playing,
    setPlaying,
    hasWindow,
    setHasWindow,
    sliderValue,
    setSliderValue,
    onSyncRecord,
    onSyncResume,
    onSyncPause,
    onSyncStop,
    mediaState,
  } = props;

  const disablePlayerActions =
    mediaState === "recording" || mediaState === "paused";

  const handleProgress = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();

      if (currentTime <= sliderValue[0]) {
        setPlaying(false);
      }
      if (currentTime >= sliderValue[1]) {
        // playerRef.current.seekTo(startTime); // Loop back to start
        setPlaying(false);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, [setHasWindow]);

  function startPlaying() {
    setPlaying(true);
  }

  function calculateDuration(e: ReactPlayer) {
    setSliderValue([0, e.getDuration()]);
  }

  return (
    <>
      <Card className="mb-4 w-full">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-1.5">
            <CardTitle>Lorem, ipsum dolor.</CardTitle>
            <CardDescription>Lorem ipsum dolor sit. vitae!</CardDescription>
          </div>
          <Button className="ml-auto" size="sm">
            <Pencil className="mr-1 h-4 w-4" />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          {hasWindow && (
            <ReactPlayer
              width="100%"
              height="240px"
              controls={true}
              ref={playerRef}
              url={outurl}
              playing={playing}
              onPlay={startPlaying}
              onReady={calculateDuration}
              onProgress={handleProgress}
            />
          )}
        </CardContent>
        <CardContent className="flex flex-col items-center">
          <div className="w-full pb-8 pt-2">
            {hasWindow && playerRef.current && (
              <SliderWithLabel
                className=""
                defaultValue={[0, playerRef.current.getDuration()]}
                onValueChange={
                  setSliderValue as React.Dispatch<
                    React.SetStateAction<number[]>
                  >
                }
                step={1}
                max={playerRef.current?.getDuration() ?? 100}
                subLabel={[
                  format(sliderValue[0] * 1000, "mm:ss"),
                  format(sliderValue[1] * 1000, "mm:ss"),
                ]}
                disabled={disablePlayerActions}
              />
            )}
          </div>
          <PlayerActions
            playerRef={playerRef}
            sliderValue={sliderValue}
            playing={playing}
            setPlaying={setPlaying}
            disableActions={disablePlayerActions}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        {mediaState === "inactive" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSyncRecord(false)}
          >
            <MicIcon className="mr-1 h-5 w-5 text-orange-400" /> Without Sound
          </Button>
        )}
        {mediaState === "inactive" && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onSyncRecord(true)}
          >
            <MicIcon className="mr-1 h-5 w-5 text-red-600" />
            Sync
          </Button>
        )}

        {mediaState === "paused" && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSyncResume}
            className="h-10 w-10 rounded-full p-0"
          >
            <StepForward className="rounded-full p-0.5" />
          </Button>
        )}

        {mediaState === "recording" && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSyncPause}
            className="h-10 w-10 rounded-full p-0"
          >
            <Pause className="rounded-full p-0.5" />
          </Button>
        )}

        {(mediaState === "recording" || mediaState === "paused") && (
          <Button
            type="button"
            variant="ghost"
            onClick={onSyncStop}
            className="h-10 w-10 rounded-full p-0"
          >
            <StopCircle className="rounded-full p-0.5" />
          </Button>
        )}
      </div>
    </>
  );
};

export default Player;
