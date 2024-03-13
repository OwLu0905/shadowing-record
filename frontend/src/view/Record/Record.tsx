"use client";
import React, { useEffect, useRef, useState } from "react";

import useRecordMedia from "@/hooks/useRecordMedia";
import useAudioWaveform from "@/hooks/useAudioWaveform";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

import AudioWaveform from "@/components/audio/AudioWaveform";

import { Mic, Pause, StepForward, StopCircle } from "lucide-react";

const Record = () => {
  const { data, state, utils } = useRecordMedia();
  const blobData = data.blob;
  const mediaState = state.mediaState;
  const isAvailable = state.deviceState;

  const { start, stop, pause, resume } = utils;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clipRegionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLCanvasElement>(null);
  const clipRef = useRef<HTMLCanvasElement>(null);

  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPixelDistanceRef = useRef<number | null>(null);
  const pauseProgressRef = useRef<boolean | null>(null);

  const [showResize, setShowResize] = useState<CheckedState>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const [clipStyle, setClipStyle] = useState("none");
  const [canvasStyle, setCanvasStyle] = useState<
    | {
        width: string;
        height: string;
        left: string;
      }
    | undefined
  >(undefined);

  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

  const { audioBuffer, audioContext } = useAudioWaveform({
    container: container,

    canvas: canvasRef.current,
    clipCanvas: clipRef.current,

    audioBlob: blobData,

    setCanvasStyle: setCanvasStyle,
  });

  useEffect(() => {
    if (blobData && containerRef.current) {
      setContainer(containerRef.current);
      setCanvasStyle(undefined);
    } else {
      setContainer(null);
      setCanvasStyle(undefined);
    }
  }, [blobData]);

  useEffect(() => {
    if (!clipRef.current || !canvasRef.current || !progressRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    const progressCanvas = progressRef.current;
    const progressCtx = progressCanvas?.getContext("2d");

    const clipCtx = clipRef.current.getContext("2d");

    const source = sourceRef.current;

    return () => {
      if (source) {
        stopAudio(source);
      }
      if (
        ctx &&
        canvasRef.current &&
        clipRef.current &&
        clipCtx &&
        progressCtx
      ) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        clipCtx.clearRect(0, 0, clipRef.current.width, clipRef.current.height);
        progressCtx.clearRect(
          0,
          0,
          progressCanvas?.width,
          progressCanvas.height,
        );
      }
    };
  }, [blobData]);

  function drawProgress(props: {
    triggerTime: number; // ms
    playDuration: number; // sec
    startTimer: number | null; // sec
    audioDuration: number; // sec
    width: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) {
    console.log("check render");
    const {
      triggerTime,
      playDuration,
      startTimer,
      audioDuration,
      width,
      canvas,
      ctx,
    } = props;

    if (!canvasRef.current || startTimer === null) return;
    if (pauseProgressRef.current) {
      return;
    }

    const currentTime = performance.now();

    const elapsedTime = currentTime - triggerTime; // ms

    const playedTime = startTimer + elapsedTime / 1000;
    const moveDistance = (playedTime * width * 2) / audioDuration;

    leftPixelDistanceRef.current = playedTime; // sec

    const rect = canvasRef.current.getBoundingClientRect();

    if (elapsedTime > playDuration * 1000) {
      ctx?.clearRect(0, 0, rect.width * 2, rect.height * 2);
      ctx?.beginPath();
      ctx.lineWidth = 5;
      ctx?.moveTo(
        !showResize
          ? width * 2
          : ((startTimer + playDuration) * width * 2) / audioDuration,
        0,
      );
      ctx?.lineTo(
        !showResize
          ? width * 2
          : ((startTimer + playDuration) * width * 2) / audioDuration,
        rect.height * 2,
      );

      ctx.strokeStyle = "orange";
      ctx?.stroke();
      setClipStyle(`polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)`);
      return;
    }

    ctx?.clearRect(0, 0, rect.width * 2, rect.height * 2);
    ctx?.beginPath();
    ctx.lineWidth = 5;
    ctx?.moveTo(moveDistance, 0);
    ctx?.lineTo(moveDistance, rect.height * 2);

    ctx.strokeStyle = "orange";
    ctx?.stroke();

    setClipStyle(
      `polygon(0% 0%, 0% 100%, ${
        ((startTimer * 1000 + elapsedTime) / (audioDuration * 1000)) * 100
      }% 100%, ${
        ((startTimer * 1000 + elapsedTime) / (audioDuration * 1000)) * 100
      }% 0%)`,
    );

    requestIdRef.current = requestAnimationFrame(() =>
      drawProgress({
        triggerTime,
        playDuration,
        startTimer,
        audioDuration,
        width,
        canvas,
        ctx,
      }),
    );
  }

  function stopAudio(sourceNode: any) {
    return new Promise((resolve, reject) => {
      if (!sourceNode) {
        resolve("No audio source to stop.");
        return;
      }

      sourceNode.onended = () => {
        sourceNode.disconnect();
        resolve("Audio stopped and disconnected.");
      };

      try {
        if (sourceRef.current) {
          sourceRef.current.stop();
          sourceRef.current.disconnect();
          sourceRef.current = null;
          resolve("play...");
        }
      } catch (error: unknown) {
        reject("Error stopping audio: " + (error as Error).message);
      }
    });
  }

  async function saveAudioToFile() {
    if (!data.blob) return;
    const formData = new FormData();
    formData.append("file", data.blob);
    try {
      const response = await fetch("http://localhost:3001/audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Audio uploaded successfully");
      } else {
        alert("Error uploading audio");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  }

  if (isAvailable === false)
    return (
      <div>
        Please check whether the record device available or the permission of
        mic
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col">
          {mediaState === "inactive" && data.blob ? (
            <AudioWaveform
              requestIdRef={requestIdRef}
              audioContext={audioContext}
              pauseProgressRef={pauseProgressRef}
              canvasRef={canvasRef}
              audioBuffer={audioBuffer}
              sourceRef={sourceRef}
              stopAudio={stopAudio}
              progressRef={progressRef}
              showResize={showResize}
              selectedInterval={selectedInterval}
              leftPixelDistanceRef={leftPixelDistanceRef}
              canvasStyle={canvasStyle}
              setSelectedInterval={setSelectedInterval}
              containerRef={containerRef}
              clipRegionRef={clipRegionRef}
              clipRef={clipRef}
              clipStyle={clipStyle}
              setClipStyle={setClipStyle}
              drawProgress={drawProgress}
            />
          ) : (
            <div className="h-[128px] bg-zinc-100"></div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <Button
                  onClick={async () => {
                    if (!pauseProgressRef.current) {
                      return;
                    }

                    if (
                      !audioContext ||
                      !progressRef.current ||
                      !canvasRef.current ||
                      !audioBuffer ||
                      leftPixelDistanceRef.current === null
                    )
                      return;

                    await stopAudio(sourceRef.current)
                      .then((message) => {
                        console.log("message:", message);
                      })
                      .catch((error) => {
                        console.error("error", error);
                      });

                    if (audioContext && audioBuffer) {
                      const source = audioContext.createBufferSource();
                      source.buffer = audioBuffer;
                      source.connect(audioContext.destination);

                      source.addEventListener(
                        "ended",
                        () => {
                          console.log("Playback finished.");
                        },
                        { once: true },
                      );

                      if (!progressRef.current) return;
                      progressRef.current.width = canvasRef.current.width;
                      progressRef.current.height = canvasRef.current.height;

                      const ctx = progressRef.current.getContext("2d")!;
                      const width = canvasRef.current.width / 2;
                      const audioDuration = audioBuffer.duration; // sec
                      const startTime = leftPixelDistanceRef.current; // sec

                      const triggerTime = performance.now(); // ms

                      const startTimer = startTime;

                      const playDuration = showResize
                        ? ((width -
                            selectedInterval.left -
                            selectedInterval.right) /
                            width) *
                            audioDuration -
                          startTimer // sec
                        : audioDuration - startTimer; // sec

                      pauseProgressRef.current = false;

                      drawProgress({
                        triggerTime,
                        playDuration,
                        startTimer,
                        audioDuration,
                        width,
                        canvas: progressRef.current,
                        ctx,
                      });

                      source.start(0, startTimer, playDuration);
                      sourceRef.current = source;
                    }
                  }}
                  variant={"ghost"}
                  className="h-10 w-10 rounded-full p-0 text-cyan-600 hover:text-cyan-600/80"
                >
                  <StepForward className="rounded-full p-0.5" />
                </Button>
                <Button
                  onClick={async () => {
                    if (
                      sourceRef.current &&
                      requestIdRef.current &&
                      progressRef.current
                    ) {
                      // await audioContext.suspend();
                      await stopAudio(sourceRef.current)
                        .then((message) => {
                          console.log("message:", message);
                        })
                        .catch((error) => {
                          console.error("error", error);
                        });

                      pauseProgressRef.current = true;
                      cancelAnimationFrame(requestIdRef.current);
                    }
                  }}
                  variant={"ghost"}
                  className="h-10 w-10 rounded-full p-0"
                  aria-label="pause audio"
                >
                  <Pause className="rounded-full p-0.5 text-amber-600 hover:text-amber-600/80" />
                </Button>
                <Button
                  variant={"ghost"}
                  onClick={async () => {
                    await stopAudio(sourceRef.current);

                    if (requestIdRef.current) {
                      cancelAnimationFrame(requestIdRef.current);
                    }

                    pauseProgressRef.current = false;

                    if (progressRef.current && canvasRef.current) {
                      const progressCtx = progressRef.current.getContext("2d");
                      progressCtx?.clearRect(
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height,
                      );
                    }

                    if (clipRegionRef.current) {
                      clipRegionRef.current.style["clipPath"] = "none";
                    }
                  }}
                  className="h-10 w-10 rounded-full p-0 text-rose-600 hover:text-rose-600/80"
                  aria-label="stop audio"
                >
                  <StopCircle className="rounded-full p-0.5" />
                </Button>
              </div>

              <div className="my-4 flex items-center gap-2">
                <Checkbox
                  id="resize"
                  checked={showResize}
                  onCheckedChange={(e) => {
                    setShowResize(e);
                  }}
                  className="border-lime-500 data-[state=checked]:bg-lime-500"
                />
                <label
                  htmlFor="resize"
                  className="text-sm font-medium text-lime-600"
                >
                  Show Region
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {mediaState === "inactive" && (
              <Button
                type="button"
                variant={"secondary"}
                onClick={async () => await start()}
                title="Record"
                className="h-10 w-10 rounded-full p-0"
              >
                <Mic className="rounded-full p-0.5" />
              </Button>
            )}

            {mediaState === "paused" && (
              <Button
                type="button"
                variant="ghost"
                onClick={resume}
                className="h-10 w-10 rounded-full p-0"
              >
                <StepForward className="rounded-full p-0.5" />
              </Button>
            )}

            {mediaState === "recording" && (
              <Button
                type="button"
                variant="ghost"
                onClick={pause}
                className="h-10 w-10 rounded-full p-0"
              >
                <Pause className="rounded-full p-0.5" />
              </Button>
            )}

            {mediaState === "recording" ||
              (mediaState === "paused" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={stop}
                  className="h-10 w-10 rounded-full p-0"
                >
                  <StopCircle className="rounded-full p-0.5" />
                </Button>
              ))}
          </div>
        </div>

        <Button
          onClick={async () => {
            await saveAudioToFile();
          }}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default Record;
