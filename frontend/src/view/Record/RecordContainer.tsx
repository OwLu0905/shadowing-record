"use client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

import Player from "@/view/player/player";
import Record from "@/view/record/Record";
import History from "@/view/record/History";
import HistoryMobile from "@/view/record/HistoryMobile";

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
        <div className="w-full lg:w-1/2">
          <Player />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <h4 className="text-lg font-semibold md:text-2xl">Recordings</h4>
          <Record />
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
