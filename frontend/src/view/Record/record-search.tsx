"use client";

import * as z from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { RingLoader } from "react-spinners";
import { keymap } from "prosemirror-keymap";
import { EditorState } from "prosemirror-state";
import { ProseMirror } from "@nytimes/react-prosemirror";

import { cn, convertToYoutubeIdUrl } from "@/lib/utils";
import { SendHorizontal } from "lucide-react";

import { useYtCheckMutation } from "@/api/youtube";

import { shiftEnterKeyMap } from "@/view/record/search/keymap";
import { editorStateSchema } from "@/view/record/search/editor-schema";
import SearchInput from "@/view/record/search/search-input";
import PasteButton from "@/view/record/search/paste-button";

const shiftEnterPlugin = keymap(shiftEnterKeyMap);

const RecordSearch = () => {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const ytMutate = useYtCheckMutation();

  const [isLoading, setIsLoading] = useState(false);
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
          "mx-auto flex w-full max-w-xl items-start justify-between bg-secondary/50 p-4 px-6 transition-all duration-150 ease-in-out focus-within:bg-secondary/60 focus-within:shadow-sm focus-within:outline focus-within:outline-1  focus-within:outline-gray-300/80",
          line === 1 ? "rounded-2xl" : "rounded-xl",
        )}
      >
        <div className="shrink-0">
          <RingLoader color="#9f0ff0" size={32} />
        </div>
        <ProseMirror
          mount={isLoading || ytMutate.isPending ? null : mount}
          state={state}
          dispatchTransaction={(tr) => {
            setState((s) => s.apply(tr));
          }}
        >
          <SearchInput setMount={setMount} setLineHeight={setLineHeight} />
          <div className="flex shrink-0 items-center space-x-2">
            <PasteButton />{" "}
            <Button
              size="sm"
              variant={"ghost"}
              onClick={async () => {
                if (!mount?.innerHTML) return;
                // TODO: use zod url to check
                const paragra = mount.children[0] as HTMLParagraphElement;

                const checkUrlSchema = z.string().url();
                const urlV = checkUrlSchema.safeParse(paragra.innerHTML);
                if (!urlV.success) return;

                let url = new URL(urlV.data);
                const params = url.searchParams;

                const youtubeSchema = z.string().regex(/^[a-zA-Z0-9_-]{11}$/);

                const youtubeIdValid = youtubeSchema.safeParse(params.get("v"));
                if (youtubeIdValid.success) {
                  const youtubeId = youtubeIdValid.data;
                  const validUrl = convertToYoutubeIdUrl(youtubeId);

                  const data = await ytMutate.mutateAsync(validUrl, {
                    onSuccess(data, variables, context) {
                      console.log(data);
                    },
                    onError(error, variables, context) {
                      console.log(error);
                    },
                  });
                }
              }}
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </ProseMirror>
      </div>
    </>
  );
};

export default RecordSearch;
