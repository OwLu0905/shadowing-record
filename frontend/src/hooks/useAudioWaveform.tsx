import { useCallback, useEffect, useState } from "react";

type UseAudioWaveformProps = {
  container: HTMLElement | null;
  audioBlob?: Blob;
};

const useAudioWaveform = (props: UseAudioWaveformProps) => {
  const { container } = props;
  const [blobData, setBlobData] = useState<AudioBuffer | undefined>(undefined);

  const [selectedInterval, setSelectedInterval] = useState({
    start: 0,
    end: 0,
  });

  // NOTE: ref : https://github.com/katspaugh/wavesurfer.js/blob/main/src/renderer.ts
  const drawCanvas = useCallback(
    (
      channelData: Float32Array,
      width: number,
      height: number,
      canvasContainer: HTMLElement
    ) => {
      if (!canvasContainer) return;
      const start = 0;
      const end = channelData.length * 2;
      const pixelRatio = window.devicePixelRatio || 1;
      const canvas =
        canvasContainer.querySelector("canvas") !== null
          ? canvasContainer.querySelector("canvas")!
          : document.createElement("canvas");

      const length = channelData.length;

      canvas.width = Math.round((width * (end - start)) / length);
      canvas.height = height * pixelRatio;
      canvas.style.width = `${Math.floor(canvas.width / pixelRatio)}px`;
      canvas.style.height = `${height}px`;
      canvas.style.left = `${Math.floor(
        (start * width) / pixelRatio / length
      )}px`;
      canvasContainer.appendChild(canvas);

      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      return ctx;

      // TODO: Draw a progress canvas
    },
    []
  );

  const drawWaveform = useCallback(async () => {
    if (!container) return;
    if (!blobData) return;

    // NOTE: canvas information
    // NOTE: PCM audio which is float32 or int16

    const channelData = blobData.getChannelData(0);

    const ctx = drawCanvas(
      channelData,
      container.getBoundingClientRect().width,
      container.getBoundingClientRect().height,
      container
    ) as CanvasRenderingContext2D;

    // NOTE: ref: wavesuerfer.js
    function drawChannel(index: number) {
      const channel = channelData;
      const length = channel.length;
      const { height } = ctx.canvas;
      const halfHeight = height / 2;
      const maxV = Array.from(channel).reduce(
        (max, value) => Math.max(max, Math.abs(value)),
        0
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
    ctx.clearRect(
      0,
      0,
      container.getBoundingClientRect().width,
      container.getBoundingClientRect().height
    );

    ctx.beginPath();
    drawChannel(0);
    drawChannel(1);
    ctx.fill();
    ctx.closePath();
  }, [blobData, container, drawCanvas]);

  //
  // TODO: clip path with progress
  //

  useEffect(() => {
    let ignore = false;
    const getAudio = async () => {
      const audioUrl = "/demo.wav";
      const data = await fetch(audioUrl, { method: "GET" });
      const arrayBuff = await data.arrayBuffer();

      const audioCtx = new AudioContext();
      const audioCtxDecode = await audioCtx.decodeAudioData(arrayBuff);
      setBlobData(audioCtxDecode);
    };
    if (!ignore) {
      getAudio();
    }
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (container) {
      window.addEventListener("resize", drawWaveform);
    }
    return () => {
      if (container) container.removeEventListener("resize", drawWaveform);
    };
  }, [blobData, container, drawWaveform]);

  useEffect(() => {
    if (container) {
      drawWaveform();
    }
  }, [drawWaveform, container]);

  return {
    selectedInterval,
    setSelectedInterval,
  };
};
export default useAudioWaveform;
