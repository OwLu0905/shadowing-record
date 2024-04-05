"use client";

import { useState } from "react";

import { keymap } from "prosemirror-keymap";
import { EditorState } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";

import { cn } from "@/lib/utils";

import { shiftEnterKeyMap } from "@/view/records/search/keymap";
import { editorStateSchema } from "@/view/records/search/editor-schema";
import SearchInput from "@/view/records/search/search-input";
import PasteButton from "@/view/records/search/paste-button";
import SubmitButton from "@/view/records/search/submit-button";

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
  setUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const RecordSearch = (props: RecordSearchProps) => {
  const { ytMutate, setUrl } = props;
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
          "mx-auto flex w-full max-w-2xl flex-col items-start justify-between gap-4 bg-popover/60 py-4 transition-colors duration-150 ease-in-out focus-within:bg-popover/60 focus-within:shadow-sm focus-within:outline focus-within:outline-1 focus-within:outline-ring/10 md:flex-row",
          line === 1 ? "rounded-xl" : "rounded-2xl",
        )}
      >
        {/** <div className="shrink-0">
          <RingLoader color="#9f0ff0" size={32} />
        </div> */}
        <ProseMirror
          mount={ytMutate.isPending ? null : mount}
          state={state}
          dispatchTransaction={(tr) => {
            setState((s) => s.apply(tr));
          }}
        >
          <SearchInput setMount={setMount} setLineHeight={setLineHeight} />
          <div className="flex shrink-0 items-center gap-2 self-end pr-4">
            <PasteButton />
            <SubmitButton
              mount={mount}
              state={state}
              ytMutate={ytMutate}
              setUrl={setUrl}
            />
          </div>
        </ProseMirror>
      </div>
    </>
  );
};

export default RecordSearch;
