"use client";
import { EditorState } from "prosemirror-state";

import { Schema } from "prosemirror-model";

import {
  ProseMirror,
  useEditorEffect,
  useEditorEventCallback,
} from "@nytimes/react-prosemirror";
import { RingLoader } from "react-spinners";

import { useEffect, useRef, useState, useTransition } from "react";
import { cn, convertToYoutubeIdUrl } from "@/lib/utils";
import { CopyCheck, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import * as z from "zod";

const schema = new Schema({
  nodes: {
    text: {},
    doc: { content: "text*" },
  },
});

const RecordSearch = () => {
  const [mount, setMount] = useState<HTMLElement | null>(null);

  const [line, setLineHeight] = useState(0);
  const [state, setState] = useState(EditorState.create({ schema }));

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
          mount={mount}
          state={state}
          dispatchTransaction={(tr) => {
            setState((s) => s.apply(tr));
          }}
        >
          <SelectionWidget setMount={setMount} setLineHeight={setLineHeight} />
          <div className="flex shrink-0 items-center space-x-2">
            <PasteButton />{" "}
            <Button
              size="sm"
              variant={"ghost"}
              onClick={() => {
                if (!mount?.innerHTML) return;
                let url = new URL(mount.innerHTML);
                const params = url.searchParams;

                const youtubeSchema = z.string().regex(/^[a-zA-Z0-9_-]{11}$/);
                const youtubeIdValid = youtubeSchema.safeParse(params);
                if (youtubeIdValid.success) {
                  const youtubeId = youtubeIdValid.data;
                  const validUrl = convertToYoutubeIdUrl(youtubeId);
                  // TODO: fetch to check vedio
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

function PasteButton() {
  const onClick = useEditorEventCallback(async (view) => {
    try {
      const text = await navigator.clipboard.readText();
      if (view && view.state && view.state.doc) {
        const { from, to } = view.state.selection;
        view.dispatch(view.state.tr.insertText(text, from, to));
      }
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  });

  return (
    <Button size="sm" variant={"secondary"} onClick={onClick}>
      Paste
      <CopyCheck className="ml-2 h-4 w-4" />
    </Button>
  );
}

function SelectionWidget({ setMount, setLineHeight }: any) {
  const [emptyText, setEmptyText] = useState(true);

  useEditorEffect((view) => {
    const viewClientRect = view.dom.getBoundingClientRect();
    const line = Math.floor(viewClientRect.height / 24);

    setLineHeight(line);
    const isEmpty = view.dom.childNodes[0].nodeType !== Node.TEXT_NODE;
    setEmptyText(isEmpty);
  });

  return (
    <p
      ref={setMount}
      tabIndex={0}
      data-placeholder={!emptyText ? undefined : "enter your shadowing url"}
      className={cn(
        "mx-6 mb-auto mt-[5px] h-full min-w-[50%] flex-grow outline-0 focus:outline focus:outline-sky-400",
        !emptyText
          ? ""
          : "before:float-left before:h-0 before:text-primary/80 before:content-[attr(data-placeholder)]",
      )}
    />
  );
}

export default RecordSearch;
