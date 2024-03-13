import ReactPlayer from "react-player";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCw, StepForward, StopCircle } from "lucide-react";

type PlayerActionsProps = {
  playerRef: React.RefObject<ReactPlayer>;
  sliderValue: [start: number, end: number];
  playing: boolean;
  setPlaying: (value: React.SetStateAction<boolean>) => void;
};
const PlayerActions = (props: PlayerActionsProps) => {
  const { playerRef, sliderValue, playing, setPlaying } = props;
  return (
    <div className="space-x-4">
      <Button
        variant={"ghost"}
        size="icon"
        className=""
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
      >
        {playing ? <Pause /> : <Play />}
      </Button>
      <Button
        size="icon"
        onClick={() => {
          playerRef.current?.seekTo(sliderValue[0]);
          setPlaying(true);
        }}
      >
        <RotateCw />
      </Button>
    </div>
  );
};

export default PlayerActions;
