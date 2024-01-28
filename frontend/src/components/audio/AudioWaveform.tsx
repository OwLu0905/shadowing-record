"use client";
import React, { useEffect, useRef, useState } from "react";

const AudioWaveform = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const [selectedInterval, setSelectedInterval] = useState({
    left: 0,
    right: 0,
  });

  const onMouseDown = (mouseDownEvent: MouseEvent) => {
    mouseDownEvent.stopPropagation();
    const startPosition = { x: mouseDownEvent.clientX };
    const startSize = selectedInterval;

    const onMouseMove = (mouseMoveEvent: MouseEvent) => {
      mouseMoveEvent.stopPropagation();
      const rightDistance =
        startSize.right + startPosition.x - mouseMoveEvent.clientX;

      if (
        canvasRef.current &&
        rightDistance + startSize.right + 32 >=
          canvasRef.current?.getBoundingClientRect().width
      ) {
        return;
      }
      if (rightDistance >= 0) {
        setSelectedInterval((currentSize) => ({
          ...currentSize,
          right: rightDistance,
        }));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  console.log(selectedInterval);
  return (
    <div className="waveform-container relative">
      <canvas ref={canvasRef} className="h-full bg-gray-100"></canvas>

      <div
        ref={regionRef}
        className="progress-region bg-teal-300 absolute top-0 z-5 h-full"
        style={{
          left: selectedInterval.left,
          right: selectedInterval.right,
        }}
      >
        <div
          className="w-4 z-10 h-full region-handle region-handle-right absolute left-0 bg-red-500 hover:cursor-ew-resize"
          onMouseDown={(mouseDownEvent) => {
            mouseDownEvent.stopPropagation();
            const startPosition = {
              x: mouseDownEvent.clientX,
            };

            if (!regionRef.current) return;
            function onMouseMove(mouseMoveEvent: MouseEvent) {
              mouseMoveEvent.stopPropagation();
              const startSize = selectedInterval;
              const leftDistance =
                startSize.left - startPosition.x + mouseMoveEvent.clientX;
              if (leftDistance < 0) return;
              if (
                canvasRef.current &&
                leftDistance + startSize.right + 32 >=
                  canvasRef.current?.getBoundingClientRect().width
              ) {
                return;
              }
              setSelectedInterval((currentSize) => ({
                ...currentSize,
                left: leftDistance,
              }));
            }
            function onMouseUp() {
              if (regionRef.current === null) return;
              regionRef.current.removeEventListener("mousemove", onMouseMove);
            }

            regionRef.current.addEventListener("mousemove", onMouseMove);
            regionRef.current.addEventListener("mouseup", onMouseUp, {
              once: true,
            });
          }}
        ></div>
        <div
          className="w-4 z-10 h-full region-handle region-handle-right absolute right-0 bg-pink-500 hover:cursor-ew-resize"
          onMouseDown={onMouseDown}
        ></div>
      </div>
      {/**  <button onClick={handlePlayClick}>Play Selected Region</button> */}
    </div>
  );
};

export default AudioWaveform;
