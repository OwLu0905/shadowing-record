"use client";
import React, { useEffect, useRef, useState } from "react";
import useAudioWaveform from "@/hooks/useAudioWaveform";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

import { throttle } from "@/util/throttle";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";

type AudioWaveformProps = {
  blobData: Blob | null;
};

const AudioWaveform = (props: AudioWaveformProps) => {
  const { blobData } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLCanvasElement>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const requestIdRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPixelDistanceRef = useRef<number | null>(null);
  const pauseProgressRef = useRef<boolean | null>(null);

  const [showResize, setShowResize] = useState<CheckedState>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });
  const { audioBuffer, audioContext } = useAudioWaveform({
    container: container,
    audioBlob: blobData,
  });

  useEffect(() => {
    if (containerRef.current) {
      setContainer(containerRef.current);
    }
  }, []);

  const onMouseDown = (
    mouseDownEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
    type: "right" | "left"
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

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (!canvasRef.current || !audioBuffer) return;

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
          // Perform any additional cleanup or state updates needed here
        },
        { once: true }
      );

      if (!progressRef.current) return;
      progressRef.current.width = canvasRef.current.width;
      progressRef.current.height = canvasRef.current.height;
      progressRef.current.style.width = canvasRef.current.style.width;
      progressRef.current.style.height = canvasRef.current.style.height;
      progressRef.current.style.width = canvasRef.current.style.width;
      progressRef.current.style.left = canvasRef.current.style.left;

      const ctx = progressRef.current.getContext("2d")!;
      const rect = canvasRef.current.getBoundingClientRect();
      const leftPixelDistance = event.clientX - rect.left;
      const width = canvasRef.current.width / 2;

      const audioDuration = audioBuffer.duration;
      const clickPositionRatio = leftPixelDistance / width;
      const startTime = clickPositionRatio * audioDuration;
      const triggerTime = Date.now();

      const startTimer = showResize
        ? (selectedInterval.left / width) * audioDuration
        : startTime;

      const playDuration = showResize
        ? ((width - selectedInterval.left - selectedInterval.right) / width) *
          audioDuration // sec
        : audioDuration - startTimer; // sec ,sec

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
  };

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

    const currentTime = Date.now(); // ms

    const elapsedTime = currentTime - triggerTime; // ms

    // console.log("111aaa", elapsedTime / 1000, startTimer, playDuration);

    if (elapsedTime / 1000 > playDuration) return;

    const playedTime = startTimer + elapsedTime / 1000;
    const moveDistance = (playedTime * width * 2) / audioDuration;

    leftPixelDistanceRef.current = playedTime; // sec

    const rect = canvasRef.current.getBoundingClientRect();

    ctx?.clearRect(0, 0, rect.width * 2, rect.height * 2);
    ctx?.beginPath();
    ctx.lineWidth = 5;
    ctx?.moveTo(moveDistance, 0);
    ctx?.lineTo(moveDistance, rect.height * 2);

    ctx.strokeStyle = "orange";
    ctx?.stroke();

    requestIdRef.current = requestAnimationFrame(() =>
      drawProgress({
        triggerTime,
        playDuration,
        startTimer,
        audioDuration,
        width,
        canvas,
        ctx,
      })
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

  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="flex items-center my-4">
          <Checkbox
            id="resize"
            checked={showResize}
            onCheckedChange={(e) => {
              setShowResize(e);
            }}
          />
          <label htmlFor="resize">Resize Region</label>
        </div>

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

              const ctx = progressRef.current.getContext("2d")!;
              const width = canvasRef.current.width / 2;
              const audioDuration = audioBuffer.duration; // sec
              const startTime = leftPixelDistanceRef.current; // sec

              const triggerTime = Date.now(); // ms

              const startTimer = startTime;
              // const startTimer = showResize
              //   ? (selectedInterval.left / width) * audioDuration // sec
              //   : startTime; // sec

              const playDuration = showResize
                ? ((width - selectedInterval.left - selectedInterval.right) /
                    width) *
                    audioDuration -
                  startTimer // sec
                : audioDuration - startTimer; // sec

              await audioContext.resume();
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
            }}
          >
            Resume
          </Button>
          <Button
            className="mx-4"
            onClick={async () => {
              if (audioContext && requestIdRef.current && progressRef.current) {
                await audioContext.suspend();
                pauseProgressRef.current = true;
                cancelAnimationFrame(requestIdRef.current);
              }
            }}
          >
            stop
          </Button>
        </div>
      </div>

      <div
        onClick={async (e) => {
          if (requestIdRef.current !== null) {
            cancelAnimationFrame(requestIdRef.current);
          }
          if (
            audioContext &&
            pauseProgressRef.current &&
            audioContext.state === "suspended"
          ) {
            await audioContext.resume();
            pauseProgressRef.current = false;
          }
          await handleCanvasClick(e);
        }}
        ref={containerRef}
        className="relative w-full h-[128px]"
      >
        <canvas ref={canvasRef} className="w-full h-full bg-gray-200"></canvas>

        <canvas
          ref={progressRef}
          className="absolute w-full h-full bg-gray-200/10 top-0"
        ></canvas>

        {showResize && (
          <div
            className="progress-region bg-green-300/30 absolute top-0 z-5 h-full"
            style={{
              left: selectedInterval.left,
              right: selectedInterval.right,
            }}
          >
            <div
              aria-label="region-handle-left"
              className="border border-red-700 z-10 h-[120%] top-0 bottom-0 my-auto absolute left-0 bg-red-500 hover:cursor-ew-resize"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => onMouseDown(e, "left")}
            ></div>
            <div
              aria-label="region-handle-right"
              className="border border-sky-700 z-10 h-[120%] top-0 bottom-0 my-auto absolute right-0 bg-pink-500 hover:cursor-ew-resize"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => onMouseDown(e, "right")}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default AudioWaveform;
