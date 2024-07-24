"use client";
import { useReducer, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { format } from "date-fns/format";

import { Button } from "@/components/ui/button";
import { SliderWithLabel } from "@/components/custom/ui/slider";

import PlayerActions from "@/view/player/player-actions";

import { MicIcon, Pause, StepForward, StopCircle } from "lucide-react";

import type { UseFormReturn } from "react-hook-form";

import type {
  SliderState,
  AudioSubmitForm,
} from "@/view/records/record-container";

import type { RecordItem } from "@/db/schema/type";

type PlayerProps = {
  playerRef: React.RefObject<ReactPlayer>;

  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  hasWindow: boolean;
  setHasWindow: React.Dispatch<React.SetStateAction<boolean>>;

  sliderValue: SliderState | undefined;
  setSliderValue: React.Dispatch<React.SetStateAction<SliderState | undefined>>;

  mediaState: RecordingState;
  onSyncRecord: (sync: boolean) => Promise<void>;
  onSyncResume: () => void;
  onSyncPause: () => void;
  onSyncStop: () => void;

  forms: UseFormReturn<AudioSubmitForm, any, undefined>;
  recordInfo: RecordItem;
};

const Player = (props: PlayerProps) => {
  const {
    playerRef,
    playing,
    setPlaying,
    hasWindow,
    sliderValue,
    setSliderValue,
    mediaState,
    onSyncRecord,
    onSyncResume,
    onSyncPause,
    onSyncStop,
    forms,
    recordInfo,
  } = props;

  const [playbackRate, setPlaybackRate] = useState(1);

  const [loop, dispatchLoop] = useReducer((value) => !value, true);

  const url = recordInfo.shadowingUrl;

  const [volume, setVolume] = useState(1);

  const isRecording = mediaState === "recording" || mediaState === "paused";

  const slideRef = useRef<HTMLSpanElement>(null);

  const handleProgress = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();

      // NOTE: show current progressbar
      // if (slideRef.current) {
      //   let slider = slideRef.current.firstChild as HTMLSpanElement;
      //   if (!slider) return;
      //   slideRef.current.classList.add("bg-primary/10", "rounded-full");
      //   const proportion =
      //     (currentTime / playerRef.current.getDuration()) * 100;
      //   slider.style.clipPath = `polygon(0% 0%, 0% 100%, ${proportion}% 100%, ${proportion}% 0%)`;
      //   slider.style.zIndex = "0";
      // }

      if (!sliderValue) return;

      if (currentTime <= sliderValue[0]) {
        setPlaying(false);
      }
      if (currentTime >= sliderValue[1]) {
        if (loop) {
          playerRef.current?.seekTo(sliderValue[0]);
        }
        setPlaying(loop);
      }
    }
  };

  function startPlaying() {
    setPlaying(true);
  }

  function calculateDuration(e: ReactPlayer) {
    if (sliderValue) {
      forms.setValue("start", `${sliderValue[0]}`);
      forms.setValue("start", `${sliderValue[1]}`);
      setSliderValue(sliderValue);
    } else {
      forms.setValue("start", "0");
      forms.setValue("end", e.getDuration().toString());
      setSliderValue([0, e.getDuration()]);
    }
  }

  return (
    <>
      <div className="mb-4 w-full">
        <div className="mb-4 h-40 sm:h-64 lg:h-[22rem]">
          {hasWindow && (
            <ReactPlayer
              width="100%"
              height="100%"
              controls={true}
              volume={volume}
              ref={playerRef}
              url={url}
              playing={playing}
              onPlay={startPlaying}
              onReady={calculateDuration}
              onProgress={handleProgress}
              playbackRate={playbackRate}
            />
          )}
        </div>

        <div className="h-12 w-full px-4 pb-12 pt-4">
          {hasWindow && playerRef.current && (
            <SliderWithLabel
              ref={slideRef}
              value={sliderValue}
              step={1}
              max={playerRef.current?.getDuration() ?? 100}
              disabled={isRecording}
              subLabel={
                !sliderValue
                  ? sliderValue
                  : [
                      format(sliderValue[0] * 1000, "mm:ss"),
                      format(sliderValue[1] * 1000, "mm:ss"),
                    ]
              }
              onValueChange={
                setSliderValue as React.Dispatch<React.SetStateAction<number[]>>
              }
            />
          )}
        </div>
        <div className="flex flex-col items-center rounded-xl bg-card px-4 py-2 md:py-2">
          <PlayerActions
            playerRef={playerRef}
            sliderValue={sliderValue}
            playing={playing}
            setPlaying={setPlaying}
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
            volume={volume}
            setVolume={setVolume}
            disableActions={isRecording}
            dispatchLoop={dispatchLoop}
          />
        </div>
      </div>

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
          <Button size="sm" variant="secondary" onClick={onSyncResume}>
            <StepForward className="mr-1 h-5 w-5" />
          </Button>
        )}

        {mediaState === "recording" && (
          <Button size="sm" variant="secondary" onClick={onSyncPause}>
            <Pause className="mr-1 h-5 w-5" />
          </Button>
        )}

        {(mediaState === "recording" || mediaState === "paused") && (
          <Button
            size="sm"
            type="button"
            variant="secondary"
            onClick={onSyncStop}
            data-recording={isRecording}
            className="data-[recording=true]:animate-sparkup"
          >
            <StopCircle className="mr-1 h-5 w-5 text-red-600" />
            End
          </Button>
        )}
      </div>
    </>
  );
};

export default Player;
