import * as z from "zod";
import React from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";

import { type YoutubeOEmbedResponse } from "@/api/youtube";
import { type UseMutationResult } from "@tanstack/react-query";
import { convertToYoutubeIdUrl } from "@/lib/utils";
import { useEditorEventCallback } from "@nytimes/react-prosemirror";
import { EditorState } from "prosemirror-state";
import { YOUTUBE_MOBILE_DOMAIN } from "@/lib/constants";
import { AudioInfoType } from "@/app/(protect)/records/page";

type SubmitButtonProps = {
  mount: HTMLElement | null;
  state: EditorState;
  ytMutate: UseMutationResult<
    YoutubeOEmbedResponse | undefined,
    Error,
    string,
    unknown
  >;
  setAudioInfo: React.Dispatch<React.SetStateAction<AudioInfoType | undefined>>;
};

const SubmitButton = (props: SubmitButtonProps) => {
  const { mount, state, ytMutate, setAudioInfo } = props;

  const onClick = useEditorEventCallback((view) => {
    const tr = state.tr.delete(0, state.doc.content.size);

    view.dispatch(tr);

    if (mount) {
      mount.focus();
    }
  });

  return (
    <Button
      size="sm"
      variant={"ghost"}
      onClick={async () => {
        if (!mount?.innerHTML) return;
        const paragra = mount.children[0] as HTMLParagraphElement;

        const checkUrlSchema = z.string().url();
        const urlV = checkUrlSchema.safeParse(paragra.innerHTML);
        if (!urlV.success) return;

        let url = new URL(urlV.data);
        const params = url.searchParams;

        const domain = url.hostname;
        console.log({ domain });

        const youtubeSchema = z.string().regex(/^[a-zA-Z0-9_-]{11}$/);

        const parseId =
          domain === YOUTUBE_MOBILE_DOMAIN
            ? url.pathname.slice(1)
            : params.get("v");
        // NOTE: PC
        const youtubeIdValid = youtubeSchema.safeParse(parseId);

        // NOTE: mobile

        if (youtubeIdValid.success) {
          const youtubeId = youtubeIdValid.data;
          const validUrl = convertToYoutubeIdUrl(youtubeId);

          await ytMutate.mutateAsync(validUrl, {
            onSuccess(data) {
              setAudioInfo({
                url: url.toString(),
                title: data?.title ?? "",
                provider_name: data?.provider_name ?? "YouTube",
                thumbnail_url: data?.thumbnail_url ?? "",
              });
              onClick();
            },
            onError(error) {
              console.log(error);
            },
          });
        }
      }}
    >
      <SendHorizontal className="h-4 w-4" />
    </Button>
  );
};

export default SubmitButton;
