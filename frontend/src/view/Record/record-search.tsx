"use client";

import { useState } from "react";
import { RingLoader } from "react-spinners";

import { keymap } from "prosemirror-keymap";
import { EditorState } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";

import { cn } from "@/lib/utils";

import { shiftEnterKeyMap } from "@/view/record/search/keymap";
import { editorStateSchema } from "@/view/record/search/editor-schema";
import SearchInput from "@/view/record/search/search-input";
import PasteButton from "@/view/record/search/paste-button";
import SubmitButton from "@/view/record/search/submit-button";

import { type YoutubeOEmbedResponse } from "@/api/youtube";
import { type UseMutationResult } from "@tanstack/react-query";

const shiftEnterPlugin = keymap(shiftEnterKeyMap);

type RecordSearchProps = {
  ytMutate: UseMutationResult<
    YoutubeOEmbedResponse | undefined,
    Error,
    string,
    unknown
  >;
};
const RecordSearch = (props: RecordSearchProps) => {
  const { ytMutate } = props;
  const [mount, setMount] = useState<HTMLElement | null>(null);

  const [line, setLineHeight] = useState(0);
  const [state, setState] = useState(
    EditorState.create({
      schema: editorStateSchema,
      plugins: [shiftEnterPlugin],
    }),
  );

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full max-w-2xl items-start justify-between bg-secondary/50 p-4 px-6 transition-all duration-150 ease-in-out focus-within:bg-secondary/60 focus-within:shadow-sm focus-within:outline focus-within:outline-1  focus-within:outline-gray-300/80",
          line === 1 ? "rounded-2xl" : "rounded-xl",
        )}
      >
        <div className="shrink-0">
          <RingLoader color="#9f0ff0" size={32} />
        </div>
        <ProseMirror
          mount={ytMutate.isPending ? null : mount}
          state={state}
          dispatchTransaction={(tr) => {
            setState((s) => s.apply(tr));
          }}
        >
          <SearchInput setMount={setMount} setLineHeight={setLineHeight} />
          <div className="flex shrink-0 items-center space-x-2">
            <PasteButton />{" "}
            <SubmitButton mount={mount} state={state} ytMutate={ytMutate} />
          </div>
        </ProseMirror>
      </div>
    </>
  );
};

export default RecordSearch;
