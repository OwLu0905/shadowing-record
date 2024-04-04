"use client";
import { useEffect, useRef, useState } from "react";
import useAudioWaveform from "@/hooks/useAudioWaveform";
import { CheckedState } from "@radix-ui/react-checkbox";

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
  }, [blobData, blob]);

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

  return (
    <>
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
    </>
  );
};

export default Waveform;
