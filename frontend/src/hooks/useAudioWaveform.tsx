import { CheckedState } from "@radix-ui/react-checkbox";
import { useCallback, useEffect, useRef, useState } from "react";

type UseAudioWaveformProps = {
  containerState: HTMLElement | null;
  canvas: HTMLCanvasElement | null;
  clipCanvas: HTMLCanvasElement | null;
  audioBlob: Blob | null;
};

const useAudioWaveform = (props: UseAudioWaveformProps) => {
  const { containerState, audioBlob, canvas, clipCanvas } = props;
  const audioRef = useRef<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>(
    undefined,
  );

  // NOTE: ref : https://github.com/katspaugh/wavesurfer.js/blob/main/src/renderer.ts
  const drawCanvas = useCallback(
    (
      canvas: HTMLCanvasElement,
      channelData: Float32Array,
      width: number,
      height: number,
    ) => {
      const start = 0;
      const end = channelData.length;
      const pixelRatio = window.devicePixelRatio || 1;

      const length = channelData.length;

      canvas.width = Math.round((width * pixelRatio * (end - start)) / length);
      canvas.height = height * pixelRatio;

      const calculateWidth = `${Math.floor(canvas.width / pixelRatio)}px`;
      const calculateHeight = `${height}px`;
      const calculateLeft = `${Math.floor((start * width) / pixelRatio / length)}px`;

      canvas.style.width = calculateWidth;
      canvas.style.height = calculateHeight;
      canvas.style.left = calculateLeft;

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      return ctx;
    },
    [],
  );

  const drawWaveform = useCallback(
    async ({
      canvas,
      clipCanvas,
      audioBuffer,
      containerState,
    }: {
      canvas: HTMLCanvasElement;
      clipCanvas: HTMLCanvasElement;
      containerState: HTMLElement;
      audioBuffer: AudioBuffer;
    }) => {
      const channelData = audioBuffer.getChannelData(0);

      const ctx = drawCanvas(
        canvas,
        channelData,
        containerState.getBoundingClientRect().width,
        containerState.getBoundingClientRect().height,
      ) as CanvasRenderingContext2D;

      // NOTE: ref: wavesuerfer.js
      function drawChannel(index: number) {
        const channel = channelData;
        const length = channel.length;
        const { height } = ctx.canvas;
        const halfHeight = height / 2;
        const maxV = Array.from(channel).reduce(
          (max, value) => Math.max(max, Math.abs(value)),
          0,
        );
        const hScale = ctx.canvas.width / length;
        const vScale = maxV ? 1 / maxV : 1;

        ctx.moveTo(0, halfHeight);

        let prevX = 0;
        let max = 0;
        for (let i = 0; i < length; i++) {
          const x = Math.round(i * hScale);

          if (x > prevX) {
            const h = Math.round(max * halfHeight * vScale) || 1;
            const y = halfHeight + h * (index === 0 ? -1 : 1);
            ctx.lineTo(prevX, y);
            prevX = x;
            max = 0;
          }
          const value = Math.abs(channel[i] || 0);
          if (value > max) max = value;
        }
        ctx.lineTo(prevX, halfHeight);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height * 2);

      ctx.beginPath();
      drawChannel(0);
      drawChannel(1);

      ctx.fillStyle = "indigo";
      ctx.fill();
      ctx.closePath();

      // NOTE: ref: wavesurfer.js
      if (canvas && clipCanvas) {
        clipCanvas.width = canvas.width;
        clipCanvas.height = canvas.height;

        clipCanvas.style.width = canvas.style.width;
        clipCanvas.style.height = canvas.style.height;
        clipCanvas.style.left = canvas.style.left;

        const clipCtx = clipCanvas.getContext("2d")!;

        clipCtx.clearRect(0, 0, canvas.width, canvas.height * 2);

        clipCtx.drawImage(canvas, 0, 0);
        clipCtx.globalCompositeOperation = "source-in";
        clipCtx.fillStyle = "purple";
        clipCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    [drawCanvas],
  );

  function drawProgress({
    showResize,
    triggerTime,
    playDuration,
    startTimer,
    audioDuration,
    width,
    canvas,
    ctx,
    clipRegionRef,
    pauseProgressRef,
    leftPixelDistanceRef,
    requestIdRef,
  }: {
    showResize: CheckedState;
    triggerTime: number; // ms
    playDuration: number; // sec
    startTimer: number | null; // sec
    audioDuration: number; // sec
    width: number;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    clipRegionRef: any;
    pauseProgressRef: any;
    leftPixelDistanceRef: any;
    requestIdRef: any;
  }) {
    if (startTimer === null) return;
    if (pauseProgressRef.current) return;
    console.log("check render progress");

    const currentTime = performance.now();
    const elapsedTime = currentTime - triggerTime; // ms

    const playedTime = startTimer + elapsedTime / 1000;
    const moveDistance = (playedTime * width) / audioDuration;

    leftPixelDistanceRef.current = playedTime; // sec

    if (elapsedTime > playDuration * 1000) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height * 2);
      ctx?.beginPath();
      ctx.lineWidth = 5;
      ctx?.moveTo(
        !showResize
          ? width
          : ((startTimer + playDuration) * width) / audioDuration,
        0,
      );
      ctx?.lineTo(
        !showResize
          ? width
          : ((startTimer + playDuration) * width) / audioDuration,
        canvas.height * 2,
      );

      ctx.strokeStyle = "orange";
      ctx?.stroke();

      if (clipRegionRef) {
        // clipRegionRef.style.clipPath = `polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)`;
        // clipRegionRef.style.clipPath =
        //   "polygon(100% 0px, 100% 0px, 100% 100%, 100% 100%)";
      }

      return;
    }

    ctx?.clearRect(0, 0, canvas.width, canvas.height * 2);
    ctx?.beginPath();
    ctx.lineWidth = 5;
    ctx?.moveTo(moveDistance, 0);
    ctx?.lineTo(moveDistance, canvas.height * 2);

    ctx.strokeStyle = "orange";
    ctx?.stroke();

    if (clipRegionRef) {
      clipRegionRef.style.clipPath = `polygon(0% 0%, 0% 100%, ${
        ((startTimer * 1000 + elapsedTime) / (audioDuration * 1000)) * 100
      }% 100%, ${
        ((startTimer * 1000 + elapsedTime) / (audioDuration * 1000)) * 100
      }% 0%)`;
    }

    requestIdRef.current = requestAnimationFrame(() =>
      drawProgress({
        showResize,
        triggerTime,
        playDuration,
        startTimer,
        audioDuration,
        width,
        canvas,
        ctx,
        clipRegionRef,
        pauseProgressRef,
        leftPixelDistanceRef,
        requestIdRef,
      }),
    );
  }

  // NOTE: data processing
  useEffect(() => {
    let ignore = false;
    async function getAudio() {
      if (audioBlob) {
        audioRef.current = new AudioContext();
        const arrayBuff = await audioBlob.arrayBuffer();
        const audioCtxDecode =
          await audioRef.current.decodeAudioData(arrayBuff);
        setAudioBuffer(audioCtxDecode);
      }
    }
    if (!ignore) {
      getAudio();
    }
    return () => {
      ignore = true;
    };
  }, [audioBlob]);

  //
  // TODO:  get toggle sidebar event to re-render canvas
  //

  // NOTE: resize
  useEffect(() => {
    if (canvas && clipCanvas && containerState && audioBuffer) {
      window.addEventListener(
        "resize",
        drawWaveform.bind(null, {
          canvas,
          containerState,
          audioBuffer,
          clipCanvas,
        }),
      );
    }
    return () => {
      if (canvas && clipCanvas && containerState && audioBuffer)
        containerState.removeEventListener(
          "resize",
          drawWaveform.bind(null, {
            canvas,
            audioBuffer,
            containerState,
            clipCanvas,
          }),
        );
    };
  }, [audioBuffer, canvas, clipCanvas, containerState, drawWaveform]);

  // NOTE: draw
  useEffect(() => {
    if (canvas && clipCanvas && containerState && audioBuffer) {
      drawWaveform({
        canvas,
        containerState,
        audioBuffer,
        clipCanvas,
      });
    }
  }, [drawWaveform, audioBuffer, containerState, canvas, clipCanvas]);

  return {
    audioContext: audioRef.current,
    audioBuffer,
    drawProgress,
  };
};
export default useAudioWaveform;
