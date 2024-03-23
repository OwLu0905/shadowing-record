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

import { MicIcon, Pause, Pencil } from "lucide-react";

const outurl = "https://www.youtube.com/embed/69kQ7S0_fO4";
const Player = () => {
  const playerRef = useRef<ReactPlayer>(null);

  const [playing, setPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState<[start: number, end: number]>([
    0, 0,
  ]);
  const [hasWindow, setHasWindow] = useState(false);

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
  }, []);

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
              />
            )}
          </div>
          <PlayerActions
            playerRef={playerRef}
            sliderValue={sliderValue}
            playing={playing}
            setPlaying={setPlaying}
          />
        </CardContent>
      </Card>

      <div className="flex justify-center space-x-4">
        <Button size="sm" variant="secondary">
          {false ? (
            <Pause className="h-5 w-5 text-red-600" />
          ) : (
            <>
              <MicIcon className="mr-1 h-5 w-5 text-orange-400" /> Without Sound
            </>
          )}
        </Button>
        <Button size="sm" variant="secondary">
          {false ? (
            <Pause className="h-5 w-5 text-red-600" />
          ) : (
            <>
              <MicIcon className="mr-1 h-5 w-5 text-red-600" />
              Sync
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default Player;
