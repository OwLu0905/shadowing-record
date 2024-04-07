import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, FastForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type PlayerActionsProps = {
  playerRef: React.RefObject<ReactPlayer>;
  sliderValue: [start: number, end: number];

  playing: boolean;
  setPlaying: (value: React.SetStateAction<boolean>) => void;

  playbackRate: number;
  setPlaybackRate: (value: React.SetStateAction<number>) => void;

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
    disableActions,
  } = props;

  const rateListBack = [0.5, 0.75, 1];
  const rateListForward = [1.2, 1.5, 2];

  function clickPlaybackRate(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.target instanceof HTMLElement) {
      const dataRate = e.target.dataset["rate"];
      const rate = dataRate ? +dataRate : 1;
      setPlaybackRate(rate);
    }
  }

  return (
    <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
      <div
        className="col-span-3 col-start-1 flex justify-center gap-x-2 md:col-span-1 md:justify-self-start"
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
              className="my-1 cursor-pointer py-1 hover:bg-primary/80 hover:text-primary-foreground/80 md:hidden"
            >
              {i}
            </Badge>
          );
        })}
      </div>
      <div className="col-span-3 col-start-1 flex justify-center md:col-span-1 md:col-start-2">
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
      </div>
      <div
        className="hidden gap-x-2 justify-self-end md:col-start-3 md:flex"
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
