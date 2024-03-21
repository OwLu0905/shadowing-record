"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import Record from "./Record";
import History from "./History";
import HistoryMobile from "./HistoryMobile";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { SliderWithLabel } from "@/components/custom/ui/slider";
import { format } from "date-fns/format";
import PlayerActions from "../player/player-actions";

const outurl = "https://www.youtube.com/embed/69kQ7S0_fO4";

export default function RecordPage() {
  const playerRef = useRef<ReactPlayer>(null);
  const [sliderValue, setSliderValue] = useState<[start: number, end: number]>([
    0, 0,
  ]);
  const [playing, setPlaying] = useState(false);

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

  return (
    <>
      <section className="container mx-auto flex flex-col py-10 lg:flex-row lg:gap-x-6">
        <div className="flex_0_0_auto flex w-full flex-col items-center justify-center lg:w-1/2">
          {hasWindow && (
            <ReactPlayer
              ref={playerRef}
              url={outurl}
              width="100%"
              height="400px"
              onPlay={() => {
                setPlaying(true);
              }}
              playing={playing}
              onProgress={handleProgress}
              onReady={(e) => {
                setSliderValue([0, e.getDuration()]);
              }}
              controls={true}
            />
          )}

          <div className="w-full bg-background py-10">
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
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <div className="flex items-center">
            <h4 className="text-lg font-semibold md:text-2xl">Recordings</h4>
            <Button className="ml-auto" size="sm">
              New Recording
            </Button>
          </div>
          <Card className="rounded-lg border shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold md:text-2xl">Waveform</h2>
            </CardHeader>
            <CardContent>
              <Record />
            </CardContent>
          </Card>
          <Card className="mt-4 rounded-lg border shadow-sm">
            <CardHeader>
              <h2 className="text-lg font-semibold md:text-2xl">
                Recording Meta Data
              </h2>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4">
                <Input
                  className="w-full"
                  placeholder="Enter topic"
                  type="text"
                />
                <Input
                  className="w-full"
                  placeholder="Enter description"
                  type="text"
                />
                <Button className="self-end" type="submit">
                  Save
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="flex flex-col gap-4 p-4 md:gap-8 md:px-40 md:py-6">
        <div className="mt-8">
          <History />
          <HistoryMobile />
        </div>
      </section>
    </>
  );
}
