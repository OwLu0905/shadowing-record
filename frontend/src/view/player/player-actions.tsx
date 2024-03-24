import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, FastForward } from "lucide-react";

type PlayerActionsProps = {
  playerRef: React.RefObject<ReactPlayer>;
  sliderValue: [start: number, end: number];
  playing: boolean;
  setPlaying: (value: React.SetStateAction<boolean>) => void;
  disableActions: boolean;
};
const PlayerActions = (props: PlayerActionsProps) => {
  const { playerRef, sliderValue, playing, setPlaying, disableActions } = props;
  return (
    <div className="flex items-center">
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
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
  );
};

export default PlayerActions;
