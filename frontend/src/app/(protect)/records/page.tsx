import RecordSearch from "@/view/record/record-search";
import React from "react";

const RecordPage = () => {
  return (
    <section className="container mx-auto flex flex-col py-10 lg:flex-row lg:gap-x-6">
      <RecordSearch />
    </section>
  );
};

export default RecordPage;
