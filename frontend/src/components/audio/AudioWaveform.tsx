"use client";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";
import { throttle } from "@/util/throttle";
import React, { useRef, useState } from "react";

const AudioWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

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

      const boundry = type === "right" ? startSize.left : startSize.right;
      if (
        canvasRef.current &&
        distance + boundry + 8 >=
          canvasRef.current?.getBoundingClientRect().width
      ) {
        return;
      }

      if (type === "left") {
        if (distance >= 0) {
          setSelectedInterval((currentSize) => ({
            ...currentSize,
            left: distance,
          }));
        }
      }

      if (type === "right") {
        if (distance >= 0) {
          setSelectedInterval((currentSize) => ({
            ...currentSize,
            right: distance,
          }));
        }
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

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="h-full bg-gray-200"></canvas>

      <div
        className="progress-region bg-green-300/30 absolute top-0 z-5 h-full"
        style={{
          left: selectedInterval.left,
          right: selectedInterval.right,
        }}
      >
        <div
          className="border border-red-700 z-10 h-full region-handle region-handle-right absolute left-0 bg-red-500 hover:cursor-ew-resize"
          onMouseDown={(e) => onMouseDown(e, "left")}
        ></div>
        <div
          className="border border-sky-700 z-10 h-full region-handle region-handle-right absolute right-0 bg-pink-500 hover:cursor-ew-resize"
          onMouseDown={(e) => onMouseDown(e, "right")}
        ></div>
      </div>
    </div>
  );
};

export default AudioWaveform;
