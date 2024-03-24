"use client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import Player from "@/view/player/player";
import Record from "@/view/record/Record";

import useRecordMedia from "@/hooks/useRecordMedia";
import WarningDialog from "@/components/common/warn-dialog";

export default function RecordPage() {
  const { data, state, utils } = useRecordMedia();
  const playerRef = useRef<ReactPlayer>(null);

  const [sliderValue, setSliderValue] = useState<[start: number, end: number]>([
    0, 0,
  ]);
  const [playing, setPlaying] = useState(false);
  const [hasWindow, setHasWindow] = useState(false);

  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  async function onSyncRecord(sync: boolean) {
    if (data.blob) {
      setWarning(true);
      return;
    }

    await utils.start();

    if (!playerRef.current) return;
    playerRef.current?.seekTo(sliderValue[0]);

    setPlaying(true);
  }

  async function onConfirmSyncRecord(sync: boolean) {
    await utils.start();

    if (!playerRef.current) return;
    playerRef.current?.seekTo(sliderValue[0]);

    setPlaying(true);
  }

  function onSyncResume() {
    utils.resume();
    setPlaying(true);
  }
  function onSyncPause() {
    utils.pause();
    setPlaying(false);
  }
  function onSyncStop() {
    utils.stop();
    setPlaying(false);
  }

  return (
    <>
      <section className="container mx-auto flex flex-col py-10 lg:flex-row lg:gap-x-6">
        <div className="w-full lg:w-1/2">
          <Player
            playerRef={playerRef}
            playing={playing}
            setPlaying={setPlaying}
            hasWindow={hasWindow}
            setHasWindow={setHasWindow}
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            mediaState={state.mediaState}
            onSyncRecord={onSyncRecord}
            onSyncResume={onSyncResume}
            onSyncPause={onSyncPause}
            onSyncStop={onSyncStop}
          />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <h4 className="text-lg font-semibold md:text-2xl">Recordings</h4>
          <Record
            key={data?.strem?.id ?? "record-id"}
            data={data}
            state={state}
            utils={utils}
          />
        </div>
      </section>
      <WarningDialog
        show={warning}
        handleClose={setWarning}
        label={"test"}
        title="Sure"
        description="aaa"
        onConfirm={onConfirmSyncRecord}
      />
    </>
  );
}
