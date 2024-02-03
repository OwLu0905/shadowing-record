"use client";
import React, { useEffect, useRef, useState } from "react";
import useAudioWaveform from "@/hooks/useAudioWaveform";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";
import { throttle } from "@/util/throttle";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

const AudioWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<HTMLCanvasElement>(null);
  const [showResize, setShowResize] = useState<CheckedState>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

  const requestIdRef = useRef<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { audioBuffer, audioContext } = useAudioWaveform({
    container: container,
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

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left; // Get the x position within the canvas
    const width = canvasRef.current.width / 2; // The total width of the canvas

    const audioDuration = audioBuffer.duration;
    const clickPositionRatio = x / width; // Calculate the ratio of the click position to the width of the canvas
    const startTime = clickPositionRatio * audioDuration; // Calculate the start time in the audio

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

      const startPointTime = Date.now(); // Record the start time

      const startTimer = showResize
        ? (selectedInterval.left / width) * audioDuration
        : startTime;
      const playDuration = showResize
        ? ((width - selectedInterval.left - selectedInterval.right) / width) *
          audioDuration
        : audioDuration - startTimer;

      if (!progressRef.current) return;

      progressRef.current.width = canvasRef.current.width;
      progressRef.current.height = canvasRef.current.height;
      progressRef.current.style.width = canvasRef.current.style.width;
      progressRef.current.style.height = canvasRef.current.style.height;

      progressRef.current.style.width = canvasRef.current.style.width;
      progressRef.current.style.left = canvasRef.current.style.left;

      const ctx = progressRef.current.getContext("2d")!;

      const drawProgress = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startPointTime;
        if (elapsedTime > playDuration * 1000) return;

        const moveDistance =
          ((startTimer + elapsedTime / 1000) * width * 2) / audioDuration;

        ctx?.clearRect(0, 0, rect.width * 2, rect.height * 2);
        ctx?.beginPath();
        ctx.lineWidth = 5;
        ctx?.moveTo(moveDistance, 0);
        ctx?.lineTo(moveDistance, rect.height * 2);

        ctx.strokeStyle = "orange";
        ctx?.stroke();

        requestIdRef.current = requestAnimationFrame(drawProgress);
      };
      drawProgress();

      source.start(0, startTimer, playDuration);
      sourceRef.current = source;
    }
  };
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

  console.log(audioContext?.currentTime, "currentTime");

  return (
    <>
      <div className="flex items-center gap-x-2">
        <Checkbox
          id="resize"
          checked={showResize}
          onCheckedChange={(e) => {
            setShowResize(e);
          }}
        />
        <label htmlFor="resize">Resize Region</label>
      </div>
      <button
        onClick={() => {
          audioContext?.resume();

          // sourceRef?.current?.start(0, 3, 10);
        }}
      >
        conee
      </button>
      <button
        onClick={() => {
          audioContext?.suspend();
          if (requestIdRef.current && progressRef.current) {
            // cancelAnimationFrame(requestIdRef.current);
            //
            // const progress = progressRef.current?.getContext("2d");
            // progress?.clearRect(
            //   0,
            //   0,
            //   progressRef.current.width,
            //   progressRef.current.height
            // );
          }
          if (sourceRef.current) {
            // sourceRef.current.stop();
            // sourceRef.current.disconnect();
            // sourceRef.current = null; // Reset the ref after stopping
          }
        }}
      >
        stop
      </button>
      <div
        onClick={async (e) => {
          console.log("??");
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
