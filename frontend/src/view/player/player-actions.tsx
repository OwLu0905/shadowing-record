"use client";
import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, FastForward, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import * as Slider from "@radix-ui/react-slider";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PlayerActionsProps = {
  playerRef: React.RefObject<ReactPlayer>;
  sliderValue: [start: number, end: number];

  playing: boolean;
  setPlaying: (value: React.SetStateAction<boolean>) => void;

  playbackRate: number;
  setPlaybackRate: (value: React.SetStateAction<number>) => void;

  volume: number;
  setVolume: (value: React.SetStateAction<number>) => void;

  disableActions: boolean;
};
const PlayerActions = (props: PlayerActionsProps) => {
  const {
    playerRef,
    sliderValue,
    playing,
    setPlaying,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    disableActions,
  } = props;

  const rateListBack = [0.5, 0.75, 1];
  const rateListForward = [1.25, 1.5, 2];

  function clickPlaybackRate(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target instanceof HTMLElement) {
      const dataRate = e.target.dataset["rate"];
      const rate = dataRate ? +dataRate : 1;
      setPlaybackRate(rate);
    }
  }

  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div
        className="col-span-3 col-start-1 flex justify-center gap-x-2 xl:col-span-1 xl:justify-self-start"
        onClick={clickPlaybackRate}
      >
        {rateListBack.map((i) => {
          return (
            <Badge
              key={i}
              data-rate={i}
              variant={playbackRate === i ? "default" : "secondary"}
              className="my-1 cursor-pointer py-1 hover:bg-primary/80 hover:text-primary-foreground/80"
            >
              {i}
            </Badge>
          );
        })}
        {rateListForward.map((i) => {
          return (
            <Badge
              key={i}
              data-rate={i}
              variant={playbackRate === i ? "default" : "secondary"}
              className="my-1 cursor-pointer py-1 hover:bg-primary/80 hover:text-primary-foreground/80 xl:hidden"
            >
              {i}
            </Badge>
          );
        })}
      </div>
      <div className="col-span-3 col-start-1 flex justify-center xl:col-span-1 xl:col-start-2">
        <Button size="sm" variant="ghost" disabled={disableActions}>
          <FastForward className="h-4 w-4 rotate-180" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (playerRef.current) {
              const currentTime = playerRef.current.getCurrentTime();
              if (
                currentTime >= sliderValue[1] ||
                currentTime <= sliderValue[0]
              ) {
                playerRef.current?.seekTo(sliderValue[0]);
                setPlaying(true);
                return;
              }
            }
            setPlaying((prev) => !prev);
          }}
          disabled={disableActions}
        >
          {playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button size="sm" variant="ghost" disabled={disableActions}>
          <FastForward className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            playerRef.current?.seekTo(sliderValue[0]);
            setPlaying(true);
          }}
          disabled={disableActions}
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Popover modal={true}>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              disabled={disableActions}
              className="lg:hidden"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="m-0 w-fit bg-secondary p-4">
            <Slider.Root
              className="relative flex h-40 w-2 touch-none select-none items-center rounded-full bg-popover"
              max={1}
              step={0.05}
              value={[volume]}
              onValueChange={(e) => {
                setVolume(e[0]);
              }}
              orientation="vertical"
            >
              <Slider.Thumb
                className="block h-4 w-4 -translate-x-1 rounded-full bg-secondary p-2 shadow-primary outline-none ring-1 ring-primary hover:bg-primary/80 focus:outline-none"
                aria-label="Volume"
              />
            </Slider.Root>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className="hidden gap-x-2 justify-self-end xl:col-start-3 xl:flex"
        onClick={clickPlaybackRate}
      >
        {rateListForward.map((i) => {
          return (
            <Badge
              key={i}
              data-rate={i}
              variant={playbackRate === i ? "default" : "secondary"}
              className="my-1 cursor-pointer py-1 hover:bg-primary/80 hover:text-primary-foreground/80"
            >
              {i}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerActions;
