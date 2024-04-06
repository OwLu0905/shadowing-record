"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecordMedia } from "@/hooks/useRecordMedia";

import Player from "@/view/player/player";
import Record from "@/view/records/Record";
import WarningDialog from "@/components/common/warn-dialog";

import ReactPlayer from "react-player";
import toast from "react-hot-toast";

import { type RecordItem } from "@/db/schema/type";
import { format } from "date-fns";

type RecordContainerProps = {
  recordInfo: RecordItem[];
};

export type AudioSubmitForm = {
  start: string;
  end: string;
};

export type SliderState = [start: number, end: number];

const RecordContainer = (props: RecordContainerProps) => {
  const { recordInfo } = props;
  const { data, state, utils } = useRecordMedia();
  const forms = useForm<AudioSubmitForm>({
    defaultValues: {
      start: "",
      end: "",
    },
  });

  const playerRef = useRef<ReactPlayer>(null);

  const [sliderValue, setSliderValue] = useState<SliderState>([0, 0]);
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

    onConfirmSyncRecord(sync);
  }

  async function onConfirmSyncRecord(sync: boolean) {
    try {
      await utils.start();

      if (sync && playerRef.current) {
        playerRef.current?.seekTo(sliderValue[0]);

        setPlaying(true);
      }
    } catch (error) {
      toast.error("Error accessing media devices");
    }
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

    forms.setValue("start", sliderValue[0].toString());
    forms.setValue("end", sliderValue[1].toString());
  }

  if (!recordInfo) return <></>;

  return (
    <>
      <section className="container flex flex-col items-center gap-1 px-4 pt-8 md:px-10 lg:flex-row lg:gap-x-4">
        <div className="flex w-full flex-col truncate">
          <h2 className="w-full truncate text-xl font-semibold md:text-2xl">
            {recordInfo[0].title}
          </h2>
          <p>{recordInfo[0].description}</p>
        </div>
        <p className="ml-auto shrink-0 text-xs font-medium text-foreground/50 md:text-sm">
          {format(recordInfo[0].createdAt, "yyyy-MM-dd")}
        </p>
      </section>
      <section className="container flex flex-col px-4 py-6 md:px-10 md:py-10 lg:flex-row lg:gap-x-6">
        <div className="mb-4 w-full lg:w-1/2">
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
            forms={forms}
            recordInfo={recordInfo}
          />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <Record
            recordInfo={recordInfo}
            key={data?.strem?.id ?? "record-id"}
            data={data}
            state={state}
            utils={utils}
            forms={forms}
            startTime={sliderValue[0]}
            endTime={sliderValue[1]}
          />
        </div>
      </section>
      <WarningDialog
        show={warning}
        handleClose={setWarning}
        label={"test"}
        title="Warning: Unsaved Data"
        description="You have unsaved changes. Do you want to continue editing or discard the changes and start new?"
        onConfirm={onConfirmSyncRecord}
      />
    </>
  );
};
export default RecordContainer;
