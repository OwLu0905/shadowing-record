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

const outurl = "https://www.youtube.com/embed/6O3B8XwvKuc";

export default function RecordPage() {
  const playerRef = useRef<ReactPlayer>(null);
  const [sliderValue, setSliderValue] = useState<[start: number, end: number]>([
    0, 0,
  ]);
  const [playing, setPlaying] = useState(false);
  // const [prepared, setPrepared] = useState(false);

  const [hasWindow, setHasWindow] = useState(false);

  const handleProgress = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();

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
    <div className="flex flex-col h-screen">
      <main className="flex flex-1 flex-col lg:flex-row gap-4 p-4 md:gap-8 md:py-6 md:px-40 ">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-200">
          {hasWindow && (
            <ReactPlayer
              ref={playerRef}
              url={outurl}
              width="100%"
              height="100%"
              onPlay={() => {
                setPlaying(true);
              }}
              playing={playing}
              onProgress={handleProgress}
              onReady={(e) => {
                setSliderValue([0, e.getDuration()]);
                // setPrepared(true);
              }}
              controls={true}
            />
          )}

          <Button
            className="my-4"
            onClick={() => {
              setPlaying((prev) => !prev);
            }}
          >
            {playing ? "paused" : "play"}
          </Button>
          <div className="p-8 bg-white w-full">
            {hasWindow && playerRef.current && (
              <SliderWithLabel
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

          <Button
            onClick={() => {
              playerRef.current?.seekTo(sliderValue[0]);
              setPlaying(true);
            }}
          >
            apply
          </Button>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex items-center">
            <h1 className="font-semibold text-lg md:text-2xl">Recordings</h1>
            <Button className="ml-auto" size="sm">
              New Recording
            </Button>
          </div>
          <Card className="border shadow-sm rounded-lg">
            <CardHeader>
              <h2 className="font-semibold text-lg md:text-2xl">Waveform</h2>
            </CardHeader>
            <CardContent>
              <Record />
            </CardContent>
          </Card>
          <Card className="border shadow-sm rounded-lg mt-4">
            <CardHeader>
              <h2 className="font-semibold text-lg md:text-2xl">
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
      </main>

      <section className="flex flex-col gap-4 p-4 md:gap-8 md:py-6 md:px-40">
        <div className="mt-8">
          <History />
          <HistoryMobile />
        </div>
      </section>
    </div>
  );
}
