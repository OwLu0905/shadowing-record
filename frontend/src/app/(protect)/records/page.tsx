"use client";
import React, { useState } from "react";
import PreviewVideo from "@/view/record/preview-video";
import RecordSearch from "@/view/record/record-search";

import { useYtCheckMutation } from "@/api/youtube";

const RecordPage = () => {
  const ytMutate = useYtCheckMutation();

  const ytInfo = ytMutate?.data;
  return (
    <section className="container mx-auto flex flex-col py-10">
      <div className="mx-auto mb-4 flex">
        <PreviewVideo data={ytInfo} />
      </div>
      <RecordSearch ytMutate={ytMutate} />
    </section>
  );
};

export default RecordPage;
