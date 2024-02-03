"use client";
import React, { useEffect, useRef, useState } from "react";
import useAudioWaveform from "@/hooks/useAudioWaveform";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";
import { throttle } from "@/util/throttle";
import { Checkbox } from "../ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

const AudioWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showResize, setShowResize] = useState<CheckedState>(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

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

  const handleCanvasClick = async () => {
    await stopAudio(sourceRef.current)
      .then((message) => {
        console.log("mess", message);
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

      source.start(0, 10); // Adjust as needed
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
          if (sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current.disconnect();
            sourceRef.current = null; // Reset the ref after stopping
          }
        }}
      >
        stop
      </button>
      <div ref={containerRef} className="relative w-full h-[128px]">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-gray-200"
          onClick={async () => {
            await handleCanvasClick();
          }}
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
              onMouseDown={(e) => onMouseDown(e, "left")}
            ></div>
            <div
              aria-label="region-handle-right"
              className="border border-sky-700 z-10 h-[120%] top-0 bottom-0 my-auto absolute right-0 bg-pink-500 hover:cursor-ew-resize"
              onMouseDown={(e) => onMouseDown(e, "right")}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default AudioWaveform;
