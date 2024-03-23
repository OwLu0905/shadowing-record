"use client";
import React, { useEffect, useRef, useState } from "react";

import useRecordMedia from "@/hooks/useRecordMedia";
import useAudioWaveform from "@/hooks/useAudioWaveform";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

import { Mic, Pause, StepForward, StopCircle, Trash2 } from "lucide-react";
import { throttle } from "@/util/throttle";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";

const Record = () => {
  // NOTE: audio
  const { data, state, utils } = useRecordMedia();
  const blobData = data.blob;
  const mediaState = state.mediaState;
  const isAvailable = state.deviceState;

  const { start, stop, pause, resume, cleanup } = utils;

  // NOTE: Draw canvas
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const progressRef = useRef<HTMLCanvasElement>(null);

  const clipRegionRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLCanvasElement>(null);

  // NOTE: canvas actions
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const leftPixelDistanceRef = useRef<number | null>(null);
  const pauseProgressRef = useRef<boolean | null>(null);

  const [showResize, setShowResize] = useState<CheckedState>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

  const {
    audioBuffer,
    audioContext,
    drawProgress,
    clean: clearnAudioWave,
  } = useAudioWaveform({
    containerState: container,
    canvas: canvasRef.current,
    clipCanvas: clipRef.current,
    audioBlob: blobData,
  });

  useEffect(() => {
    if (blobData && containerRef.current) {
      setContainer(containerRef.current);
    } else {
      setContainer(null);
    }
  }, [blobData]);

  useEffect(() => {
    if (!clipRef.current || !canvasRef.current || !progressRef.current) return;

    const canvasRefItem = canvasRef.current;
    const clipRefItem = clipRef.current;

    const ctx = canvasRef.current.getContext("2d");

    const progressCanvas = progressRef.current;
    const progressCtx = progressCanvas?.getContext("2d");

    const clipCtx = clipRef.current.getContext("2d");

    const source = sourceRef.current;

    return () => {
      if (source) {
        source.stop();
        source.disconnect();
      }
      if (ctx && canvasRefItem && clipRefItem && clipCtx && progressCtx) {
        ctx.clearRect(0, 0, canvasRefItem.width, canvasRefItem.height);

        clipCtx.clearRect(0, 0, clipRefItem.width, clipRefItem.height);
        progressCtx.clearRect(
          0,
          0,
          progressCanvas?.width,
          progressCanvas.height,
        );
      }
    };
  }, [blobData]);

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

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (!canvasRef.current || !audioBuffer) return;

    // NOTE: clear
    if (requestIdRef.current) {
      cancelAnimationFrame(requestIdRef.current);
    }

    if (sourceRef.current) {
      await stopAudio(sourceRef.current)
        .then((message) => {
          console.log("message:", message);
        })
        .catch((error) => {
          console.error("error", error);
        });
    }

    if (audioContext && audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);

      source.addEventListener(
        "ended",
        () => {
          // Perform any additional cleanup or state updates needed here
          console.log("Playback finished.");
        },
        { once: true },
      );

      if (!progressRef.current) return;
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      progressRef.current.width = width;
      progressRef.current.height = height;

      const ctx = progressRef.current.getContext("2d")!;
      const rect = canvasRef.current.getBoundingClientRect();
      const leftPixelDistance = event.clientX - rect.left;

      ctx.clearRect(0, 0, width, height);

      const audioDuration = audioBuffer.duration;

      const pixelRatio = window.devicePixelRatio || 1;

      const clickPositionRatio = leftPixelDistance / (width / pixelRatio);

      const startTime = clickPositionRatio * audioDuration;

      const triggerTime = performance.now();

      const startTimer = showResize
        ? (selectedInterval.left / (width / pixelRatio)) * audioDuration
        : startTime;

      const playDuration = showResize
        ? ((width / pixelRatio -
            selectedInterval.left -
            selectedInterval.right) /
            (width / pixelRatio)) *
          audioDuration // sec
        : audioDuration - startTimer; // sec ,sec

      drawProgress({
        showResize,
        triggerTime,
        playDuration,
        startTimer,
        audioDuration,
        width,
        canvas: progressRef.current,
        ctx,
        clipRegionRef: clipRegionRef.current,
        pauseProgressRef,
        leftPixelDistanceRef,
        requestIdRef,
      });

      source.start(0, startTimer, playDuration);
      sourceRef.current = source;
    }
  };

  const onMouseDown = (
    mouseDownEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: "right" | "left",
  ) => {
    mouseDownEvent.stopPropagation();
    const startPosition = { x: mouseDownEvent.clientX };
    const startSize = selectedInterval;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      mouseMoveEvent.stopPropagation();

      const distance =
        type === "right"
          ? startSize.right + startPosition.x - mouseMoveEvent.clientX
          : startSize.left - startPosition.x + mouseMoveEvent.clientX;

      const distanceBound = distance >= 0 ? distance : 0;

      const boundry = type === "right" ? startSize.left : startSize.right;
      if (
        canvasRef.current &&
        distance + boundry + 0 >=
          canvasRef.current?.getBoundingClientRect().width
      ) {
        return;
      }

      if (type === "left") {
        setSelectedInterval((currentSize) => ({
          ...currentSize,
          left: distanceBound,
        }));
      }

      if (type === "right") {
        setSelectedInterval((currentSize) => ({
          ...currentSize,
          right: distanceBound,
        }));
      }
    };

    const throttleMove = throttle(onMouseMove, THROTTLE_MOUSE_MOVE_RESIZE);
    const onMouseUp = () => {
      document.removeEventListener("mousemove", throttleMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", throttleMove);
    document.addEventListener("mouseup", onMouseUp);
  };

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
        <div
          className="relative flex w-full flex-col"
          onClick={handleCanvasClick}
        >
          <div ref={containerRef} className="relative h-[128px] w-full">
            <canvas
              ref={canvasRef}
              className="h-full w-full bg-secondary/20"
            ></canvas>
          </div>

          <div
            aria-label="clip-region"
            ref={clipRegionRef}
            className="absolute top-0 h-[128px] w-full"
          >
            <canvas
              ref={clipRef}
              className="h-full w-full bg-secondary/20"
            ></canvas>
          </div>

          <div
            aria-label="progress-resize-region"
            className="absolute top-0 h-[128px] w-full"
          >
            <canvas
              ref={progressRef}
              className="absolute top-0 h-full w-full"
            ></canvas>
            {showResize && (
              <div
                className="progress-region z  absolute top-0 h-full bg-lime-300/40 shadow-sm"
                style={{
                  left: selectedInterval.left,
                  right: selectedInterval.right,
                }}
              >
                <div
                  aria-label="region-handle-left"
                  className="absolute bottom-0 left-0 top-0 z-10 my-auto h-[120%] border border-red-700 bg-red-500 hover:cursor-ew-resize"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => onMouseDown(e, "left")}
                ></div>
                <div
                  aria-label="region-handle-right"
                  className="absolute bottom-0 right-0 top-0 z-10 my-auto h-[120%] border border-sky-700 bg-pink-500 hover:cursor-ew-resize"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => onMouseDown(e, "right")}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="flex items-center gap-x-2">
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

            {(mediaState === "recording" || mediaState === "paused") && (
              <Button
                type="button"
                variant="ghost"
                onClick={stop}
                className="h-10 w-10 rounded-full p-0"
              >
                <StopCircle className="rounded-full p-0.5" />
              </Button>
            )}
            <Button
              variant={"ghost"}
              onClick={() => {
                cleanup();
                clearnAudioWave();
                if (requestIdRef.current) {
                  cancelAnimationFrame(requestIdRef.current);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
