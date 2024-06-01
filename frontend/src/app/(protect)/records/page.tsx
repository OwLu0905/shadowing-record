"use client";
import React, { useState } from "react";
import PreviewVideo from "@/view/records/preview-video";
import RecordSearch from "@/view/records/record-search";

import { useYtCheckMutation } from "@/api/youtube";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import RecordUplaod from "@/view/records/record-upload";
import { ShadowingString } from "@/type/kinds";

export type AudioInfoType = {
  title: string;
  provider_name: ShadowingString;
  thumbnail_url: string;
  blob?: Blob;
  url: string;
};

const RecordPage = () => {
  const [audioInfo, setAudioInfo] = useState<AudioInfoType | undefined>(
    undefined,
  );
  const ytMutate = useYtCheckMutation();

  return (
    <>
      <section className="container mx-auto flex flex-col py-4 md:py-10">
        <PreviewVideo data={audioInfo} />
      </section>
      <section className="flex flex-col px-4 md:pb-4 md:pt-8">
        <div
          className={cn(
            "mx-auto flex w-full max-w-2xl flex-col items-start justify-between gap-4 py-4  md:flex-row",
          )}
        >
          <Label className="text-foreground">Youtube</Label>
        </div>

        <RecordSearch ytMutate={ytMutate} setAudioInfo={setAudioInfo} />
      </section>

      <section className="flex flex-col px-4 md:pb-4 md:pt-8">
        <div
          className={cn(
            "mx-auto flex w-full max-w-2xl flex-col items-start justify-between gap-4 py-4  md:flex-row",
          )}
        >
          <Label className="text-foreground">Upload File</Label>
        </div>

        <RecordUplaod setAudioInfo={setAudioInfo} />
      </section>
    </>
  );
};

export default RecordPage;
