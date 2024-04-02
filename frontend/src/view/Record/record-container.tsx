"use client";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

import Player from "@/view/player/player";
import Record from "@/view/record/Record";

import useRecordMedia from "@/hooks/useRecordMedia";
import WarningDialog from "@/components/common/warn-dialog";
import History from "./History";
import { useForm } from "react-hook-form";

type RecordContainerProps = {
  recordInfo:
    | {
        title: string;
        description: string | null;
        shadowingUrl: string;
        shadowingType: number;
        userId: string;
        recordId: string;
        createdAt: Date;
      }[]
    | null;
};

export type AudioSubmitForm = {
  start: string;
  end: string;
};

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

    forms.setValue("start", sliderValue[0].toString());
    forms.setValue("end", sliderValue[1].toString());
  }

  if (!recordInfo) return <></>;

  return (
    <>
      <section className="container mx-auto flex flex-col py-10 lg:flex-row lg:gap-x-6">
        <div className="w-full lg:w-1/2">
          <Player
            url={recordInfo[0].shadowingUrl}
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
          />
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <h4 className="text-lg font-semibold md:text-2xl"></h4>
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
      <section className="container mx-auto flex flex-col">
        <History />
      </section>
    </>
  );
};
export default RecordContainer;
