"use client";
import React, { useState } from "react";
import PreviewVideo from "@/view/record/preview-video";
import RecordSearch from "@/view/record/record-search";

const RecordPage = () => {
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

  return (
    <section className="container mx-auto flex flex-col py-10">
      <div className="mx-auto mb-4 flex">
        <PreviewVideo />
      </div>
      <RecordSearch />
    </section>
  );
};

export default RecordPage;
