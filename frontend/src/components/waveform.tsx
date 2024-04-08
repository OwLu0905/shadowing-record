"use client";
import { useEffect, useRef, useState } from "react";
import useAudioWaveform from "@/hooks/useAudioWaveform";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Button } from "./ui/button";
import { Pause, PlayIcon, StepForward, StopCircle } from "lucide-react";

type WaveformProps = {
  blobData: string;
};
const Waveform = (props: WaveformProps) => {
  const { blobData } = props;
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
  const [blob, setBlob] = useState<Blob | null>(null);

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
    audioBlob: blob,
  });

  useEffect(() => {
    let ignore = false;
    async function fetchAudioAsBlob(url: string) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();

        setBlob(blob);

        return blob;
      } catch (error) {
        console.error("Error fetching audio:", error);
        throw error;
      }
    }
    if (!ignore) {
      fetchAudioAsBlob(blobData);
    }
    return () => {
      ignore = true;
      setBlob(null);
    };
  }, [blobData]);

  useEffect(() => {
    if (blob && containerRef.current) {
      setContainer(containerRef.current);
    }

    return () => {
      setContainer(null);
    };
  }, [blob]);

  useEffect(() => {
    if (!clipRef.current || !canvasRef.current || !progressRef.current) return;

    const canvasRefItem = canvasRef.current;
    const ctx = canvasRef.current.getContext("2d");

    const progressCanvas = progressRef.current;
    const progressCtx = progressCanvas?.getContext("2d");

    const clipRefItem = clipRef.current;
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
          progressCanvas.width,
          progressCanvas.height,
        );
      }
    };
  }, [blob]);

  function stopAudio(sourceNode: AudioBufferSourceNode) {
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

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    if (pauseProgressRef.current === true) return;
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
            audioDuration -
          startTimer // sec
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

  return (
    <div className="mt-4 flex flex-col justify-center">
      <div
        className="relative flex w-full flex-col bg-card data-[recording=true]:animate-sparkup data-[recording=true]:outline data-[recording=true]:outline-red-500"
        onClick={handleCanvasClick}
      >
        <div ref={containerRef} className="relative h-[80px] w-full">
          <canvas
            ref={canvasRef}
            className="h-full w-full bg-secondary/20"
          ></canvas>
        </div>

        <div
          aria-label="clip-region"
          ref={clipRegionRef}
          className="absolute top-0 h-[80px] w-full"
        >
          <canvas
            ref={clipRef}
            className="h-full w-full bg-secondary/20"
          ></canvas>
        </div>

        <div
          aria-label="progress-resize-region"
          className="absolute top-0 h-[80px] w-full"
        >
          <canvas
            ref={progressRef}
            className="absolute top-0 h-full w-full"
          ></canvas>
        </div>
      </div>

      <div className="my-2 flex w-full items-center justify-start px-4">
        <Button
          onClick={async (e) => {
            e.stopPropagation();
            if (pauseProgressRef.current === false) {
              return;
            }
            if (!canvasRef.current || !audioBuffer) return;

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
                  console.log("Playback finished.");
                },
                { once: true },
              );

              if (!progressRef.current) return;
              const width = canvasRef.current.width;
              const height = canvasRef.current.height;
              progressRef.current.width = width;
              progressRef.current.height = height;

              progressRef.current.style.width = canvasRef.current.style.width;
              progressRef.current.style.height = canvasRef.current.style.height;
              progressRef.current.style.left = canvasRef.current.style.left;

              const ctx = progressRef.current.getContext("2d")!;

              const audioDuration = audioBuffer.duration; // sec

              const startTime = leftPixelDistanceRef.current ?? 0; // sec

              const triggerTime = performance.now(); // ms

              const startTimer = startTime;

              const playDuration = audioDuration - startTimer; // sec

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
          size="sm"
          className="text-cyan-600 hover:text-cyan-500"
        >
          <PlayIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={async (e) => {
            e.stopPropagation();

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
            }
          }}
          variant={"ghost"}
          size="sm"
          className="text-amber-600 hover:text-amber-500"
          aria-label="pause audio"
        >
          <Pause className="h-4 w-4" />
        </Button>
        <Button
          variant={"ghost"}
          onClick={async (e) => {
            e.stopPropagation();
            if (sourceRef.current) {
              await stopAudio(sourceRef.current);
            }

            if (requestIdRef.current) {
              cancelAnimationFrame(requestIdRef.current);
            }

            pauseProgressRef.current = null;
            leftPixelDistanceRef.current = null;

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
          size="sm"
          className="text-rose-600 hover:text-rose-500"
          aria-label="stop audio"
        >
          <StopCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Waveform;
