/* eslint-disable react/jsx-no-undef */
// @ts-nocheck
import React from "react";

const AudioButtonGroup = () => {
  return (
    <div>
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

              progressRef.current.style.width = canvasRef.current.style.width;
              progressRef.current.style.height = canvasRef.current.style.height;
              progressRef.current.style.left = canvasRef.current.style.left;

              const ctx = progressRef.current.getContext("2d")!;
              const width = canvasRef.current.width;
              const audioDuration = audioBuffer.duration; // sec
              const startTime = leftPixelDistanceRef.current; // sec

              const triggerTime = performance.now(); // ms

              const startTimer = startTime;

              const playDuration = showResize
                ? ((width - selectedInterval.left - selectedInterval.right) /
                    width) *
                    audioDuration -
                  startTimer // sec
                : audioDuration - startTimer; // sec

              pauseProgressRef.current = false;

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
    </div>
  );
};

export default AudioButtonGroup;
