"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { AudioInfoType } from "@/app/(protect)/records/page";

type RecordSearchProps = {
  setAudioInfo: React.Dispatch<React.SetStateAction<AudioInfoType | undefined>>;
};
const RecordUplaod = (props: RecordSearchProps) => {
  const { setAudioInfo } = props;

  const onDrop = useCallback(
    <T,>(acceptedFiles: T[]) => {
      const file = acceptedFiles[0] as File;
      if (file) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          if (fileReader.result) {
            const blob = new Blob([fileReader.result], {
              type: file.type,
            });

            const tmpUrl = URL.createObjectURL(blob);

            setAudioInfo({
              title: file.name ?? "",
              thumbnail_url: "",
              provider_name: "File",
              blob: blob,
              url: tmpUrl,
            });
          }
        };

        fileReader.readAsArrayBuffer(file);
      }
    },
    [setAudioInfo],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "audio/mpeg": [".mp3"],
        "audio/x-m4a": [".m4a"],
      },
    });

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full max-w-2xl flex-col items-start justify-between gap-4 py-4  md:flex-row",
        )}
      >
        <div
          {...getRootProps()}
          className={cn(
            "border-popper group w-full cursor-pointer border-2 border-dashed py-12",
            "data-[drag=active]:border-popper",
          )}
          data-drag={isDragActive ? "active" : "inactive"}
        >
          <input {...getInputProps()} className="p-8" />
          <div className="flex flex-col items-center gap-2">
            <span>Drag your mp3 file here, or click to select files</span>
            <Button
              className="w-fit cursor-pointer"
              size="sm"
              variant="outline"
            >
              上傳檔案
            </Button>
          </div>
        </div>
        <div>
          {acceptedFiles.map((i) => (
            <div key={i.name}>{i.name}</div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RecordUplaod;
