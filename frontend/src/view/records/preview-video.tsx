"use client";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { ClimbingBoxLoader } from "react-spinners";

import { YoutubeOEmbedResponse } from "@/api/youtube";
import SubmitForm from "@/view/records/search/submit-form";
import { Skeleton } from "@/components/ui/skeleton";

type PreviewVideoProps = {
  data: YoutubeOEmbedResponse | undefined;
  url?: string;
};

const PreviewVideo = (props: PreviewVideoProps) => {
  const { data, url } = props;
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, [setHasWindow]);

  if (!data || !url)
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
              url={url}
            />
          )}
        </div>

        <div className="w-full md:w-1/2">
          <SubmitForm data={data} url={url} />
        </div>
      </div>
    </div>
  );
};

export default PreviewVideo;
