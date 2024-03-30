"use client";
import React, { useState } from "react";
import PreviewVideo from "@/view/record/preview-video";
import RecordSearch from "@/view/record/record-search";

import { useYtCheckMutation } from "@/api/youtube";

const RecordPage = () => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const ytMutate = useYtCheckMutation();

  const ytInfo = ytMutate?.data;

  return (
    <section className="container mx-auto flex flex-col py-10">
      <PreviewVideo data={ytInfo} url={url} />
      <RecordSearch ytMutate={ytMutate} setUrl={setUrl} />
    </section>
  );
};

export default RecordPage;
