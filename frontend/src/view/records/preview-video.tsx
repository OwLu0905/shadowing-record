"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ClimbingBoxLoader } from "react-spinners";

import SubmitForm from "@/view/records/search/submit-form";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioInfoType } from "@/app/(protect)/records/page";

type PreviewVideoProps = {
  data: AudioInfoType | undefined;
};

const PreviewVideo = (props: PreviewVideoProps) => {
  const { data } = props;
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, [setHasWindow]);

  if (!data || !data.url)
    return (
      <div className="mx-auto mb-4 w-full max-w-xl">
        <Skeleton className="h-60 w-full" />
      </div>
    );

  if (!hasWindow)
    return (
      <div className="mx-auto mb-4 w-full max-w-xl">
        <ClimbingBoxLoader />
      </div>
    );
  return (
    <div className="mx-auto mb-4 w-full max-w-screen-lg">
      <h2 className="mb-4 block text-xl font-semibold">{data.title}</h2>

      <div className="flex flex-col items-start gap-8 py-4 md:flex-row">
        <div className="w-full md:w-1/2">
          {hasWindow && (
            <ReactPlayer
              width="100%"
              height={"300px"}
              controls={true}
              url={data.url}
            />
          )}
        </div>

        <div className="w-full md:w-1/2">
          <SubmitForm data={data} />
        </div>
      </div>
    </div>
  );
};

export default PreviewVideo;
