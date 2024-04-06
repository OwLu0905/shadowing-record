import React, { useState } from "react";

import { useEditorEffect } from "@nytimes/react-prosemirror";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  setMount: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setLineHeight: React.Dispatch<React.SetStateAction<number>>;
};

const SearchInput = ({ setMount, setLineHeight }: SearchInputProps) => {
  const [emptyText, setEmptyText] = useState(true);

  useEditorEffect((view) => {
    const childDom = view.dom.childNodes[0] as HTMLElement;
    const viewClientRect = childDom.getBoundingClientRect();
    const line = Math.floor(viewClientRect.height / 24);

    setLineHeight(line);
    const isEmpty =
      view.dom.childNodes[0].childNodes[0].nodeType !== Node.TEXT_NODE;
    setEmptyText(isEmpty);
  });

  return (
    <div
      ref={setMount}
      tabIndex={0}
      data-placeholder={!emptyText ? undefined : "enter your shadowing url"}
      className={cn(
        "mx-6 mb-auto mt-[5px] h-full min-w-[50%] flex-grow overflow-hidden break-all outline-0 focus:outline focus:outline-sky-400",
        !emptyText
          ? ""
          : "before:float-left before:h-0 before:text-primary/60 before:content-[attr(data-placeholder)]",
      )}
    />
  );
};
export default SearchInput;
