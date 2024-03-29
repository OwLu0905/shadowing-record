"use client";
import { YoutubeOEmbedResponse } from "@/api/youtube";
import React from "react";
import { useForm } from "react-hook-form";

type PreviewVideoProps = {
  data: YoutubeOEmbedResponse | undefined;
};
const PreviewVideo = (props: PreviewVideoProps) => {
  const { data } = props;
  const forms = useForm();

  if (!data) return <div>Empty </div>;

  return (
    <div>
      <h1>{data.title}</h1>
    </div>
  );
};

export default PreviewVideo;
