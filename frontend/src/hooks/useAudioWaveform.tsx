import { useCallback, useEffect, useRef, useState } from "react";

type UseAudioWaveformProps = {
  container: HTMLElement | null;

  canvas: HTMLCanvasElement | null;
  clipCanvas: HTMLCanvasElement | null;

  audioBlob: Blob | null;

  setCanvasStyle: React.Dispatch<
    React.SetStateAction<
      | {
          width: string;
          height: string;
          left: string;
        }
      | undefined
    >
  >;
};

const useAudioWaveform = (props: UseAudioWaveformProps) => {
  const { container, audioBlob, canvas, clipCanvas, setCanvasStyle } = props;
  const audioRef = useRef<AudioContext | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | undefined>(
    undefined,
  );

  // NOTE: ref : https://github.com/katspaugh/wavesurfer.js/blob/main/src/renderer.ts
  const drawCanvas = useCallback(
    (
      canvas: HTMLCanvasElement | null,
      channelData: Float32Array,
      width: number,
      height: number,
      canvasContainer: HTMLElement,
    ) => {
      if (!canvasContainer || !canvas) return;

      const start = 0;
      const end = channelData.length * 2;
      const pixelRatio = window.devicePixelRatio || 1;

      const length = channelData.length;

      canvas.width = Math.round((width * (end - start)) / length);
      canvas.height = height * pixelRatio;

      setCanvasStyle({
        width: `${Math.floor(canvas.width / pixelRatio)}px`,
        height: `${height}px`,
        left: `${Math.floor((start * width) / pixelRatio / length)}px`,
      });

      canvas.style.width = `${Math.floor(canvas.width / pixelRatio)}px`;
      canvas.style.height = `${height}px`;
      canvas.style.left = `${Math.floor(
        (start * width) / pixelRatio / length,
      )}px`;

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
      container,
    }: {
      canvas: HTMLCanvasElement | null;
      clipCanvas: HTMLCanvasElement | null;
      container: HTMLElement | null;
      audioBuffer: AudioBuffer | undefined;
    }) => {
      if (!canvas) return;
      if (!container) return;
      if (!audioBuffer) return;
      if (!clipCanvas) return;

      const channelData = audioBuffer.getChannelData(0);

      const ctx = drawCanvas(
        canvas,
        channelData,
        container.getBoundingClientRect().width,
        container.getBoundingClientRect().height,
        container,
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

      ctx.clearRect(
        0,
        0,
        container.getBoundingClientRect().width,
        container.getBoundingClientRect().height,
      );

      ctx.beginPath();
      drawChannel(0);
      drawChannel(1);

      ctx.fillStyle = "darkred";
      ctx.fill();
      ctx.closePath();

      // NOTE: ref: wavesurfer.js
      if (canvas && clipCanvas) {
        clipCanvas.width = canvas.width;
        clipCanvas.height = canvas.height;

        const clipCtx = clipCanvas.getContext("2d")!;

        clipCtx.clearRect(0, 0, canvas.width, canvas.height);

        clipCtx.drawImage(canvas, 0, 0);
        clipCtx.globalCompositeOperation = "source-in";
        clipCtx.fillStyle = "brown";
        clipCtx.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    [audioBuffer, container, drawCanvas],
  );

  //
  // TODO: clip path with progress
  //

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

  useEffect(() => {
    if (container) {
      window.addEventListener(
        "resize",
        drawWaveform.bind(null, {
          canvas,
          container,
          audioBuffer,
          clipCanvas,
        }),
      );
    }
    return () => {
      if (container)
        container.removeEventListener(
          "resize",
          drawWaveform.bind(null, {
            canvas,
            audioBuffer,
            container,
            clipCanvas,
          }),
        );
    };
  }, [audioBuffer, canvas, clipCanvas, container, drawWaveform]);

  useEffect(() => {
    if (canvas && clipCanvas && container && audioBuffer) {
      drawWaveform({
        canvas,
        container,
        audioBuffer,
        clipCanvas,
      });
    }
  }, [drawWaveform, audioBuffer, container, canvas, clipCanvas]);

  return {
    audioContext: audioRef.current,
    audioBuffer,
  };
};
export default useAudioWaveform;
