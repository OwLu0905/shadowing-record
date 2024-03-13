"use client";
import { CheckedState } from "@radix-ui/react-checkbox";
import { throttle } from "@/util/throttle";
import { THROTTLE_MOUSE_MOVE_RESIZE } from "@/lib/constants";

type AudioWaveformProps = {
  requestIdRef: React.MutableRefObject<number | null>;
  audioContext: AudioContext | null;
  pauseProgressRef: React.MutableRefObject<boolean | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;

  audioBuffer: AudioBuffer | undefined;

  sourceRef: React.MutableRefObject<AudioBufferSourceNode | null>;
  stopAudio: (data: any) => Promise<unknown>;

  progressRef: React.RefObject<HTMLCanvasElement>;
  showResize: CheckedState;
  selectedInterval: {
    left: number;
    right: number;
  };

  setSelectedInterval: React.Dispatch<
    React.SetStateAction<{
      left: number;
      right: number;
    }>
  >;

  canvasStyle:
    | {
        width: string;
        height: string;
        left: string;
      }
    | undefined;

  containerRef: React.RefObject<HTMLDivElement>;

  clipRegionRef: React.RefObject<HTMLDivElement>;

  clipRef: React.RefObject<HTMLCanvasElement>;
  clipStyle: string;

  drawProgress: (data: {
    triggerTime: number;
    playDuration: number;
    startTimer: number | null;
    audioDuration: number;
    width: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
  }) => void;
};

const AudioWaveform = (props: AudioWaveformProps) => {
  const {
    requestIdRef,
    audioContext,
    pauseProgressRef,
    canvasRef,
    audioBuffer,
    sourceRef,
    stopAudio,
    progressRef,
    showResize,
    selectedInterval,
    canvasStyle,
    setSelectedInterval,
    containerRef,
    clipRegionRef,
    clipRef,
    clipStyle,
    drawProgress,
  } = props;

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
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
          // Perform any additional cleanup or state updates needed here
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
      const clickPositionRatio = leftPixelDistance / width;
      const startTime = clickPositionRatio * audioDuration;

      const triggerTime = performance.now();

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
  return (
    <>
      <div
        className="relative"
        id="wrapper"
        onClick={async (e) => {
          if (requestIdRef.current !== null) {
            cancelAnimationFrame(requestIdRef.current);
          }
          if (audioContext && pauseProgressRef.current) {
            pauseProgressRef.current = false;
          }
          await handleCanvasClick(e);
        }}
      >
        <div ref={containerRef} className="relative h-[128px] w-full">
          <canvas
            ref={canvasRef}
            style={canvasStyle ? { ...canvasStyle } : {}}
            className="h-full w-full bg-secondary/60"
          ></canvas>
        </div>

        <div
          aria-label="clip-region"
          ref={clipRegionRef}
          style={{ clipPath: clipStyle }}
          className="absolute top-0 h-[128px] w-full"
        >
          <canvas
            ref={clipRef}
            style={canvasStyle ? { ...canvasStyle } : {}}
            className="h-full w-full bg-zinc-100/60"
          ></canvas>
        </div>

        <div
          aria-label="progress-resize-region"
          className="absolute top-0 h-[128px] w-full"
        >
          <canvas
            ref={progressRef}
            className="absolute top-0 h-full w-full"
            style={canvasStyle ? { ...canvasStyle } : {}}
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
    </>
  );
};

export default AudioWaveform;
