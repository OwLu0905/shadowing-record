import React, { useEffect, useRef } from "react";

type UseWavePlayerProps = {
  container: HTMLElement;
};

const useWavePlayer = (props: UseWavePlayerProps) => {
  const { container } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const audioContext = new window.AudioContext();

    function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    }

    async function drawWaveform(blob: Blob) {
      if (canvasRef.current === null) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const arrayBuffer = await blobToArrayBuffer(blob);
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const dataArray = audioBuffer.getChannelData(0); // This is a Float32Array.

      // Clear the canvas
      ctx.clearRect(0, 0, width, height);

      // Create a vertical gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      // Begin the path for the waveform
      ctx.beginPath();
      ctx.moveTo(0, height / 2); // Start in the middle of the canvas

      const segmentWidth = width / dataArray.length;
      for (let i = 0; i < dataArray.length; i++) {
        // Calculate the Y position for this sample
        const y = (0.5 - dataArray[i] / 2) * height;

        // Draw the upper half of the waveform
        ctx.lineTo(i * segmentWidth, y);
      }

      // Now draw the lower half of the waveform by going backwards
      for (let i = dataArray.length - 1; i >= 0; i--) {
        // Calculate the Y position for this sample
        const y = (0.5 - dataArray[i] / -2) * height;

        // Draw the lower half of the waveform
        ctx.lineTo(i * segmentWidth, y);
      }

      ctx.closePath(); // Close the path

      // Set the gradient and fill the waveform
      ctx.fillStyle = gradient;
      ctx.fill();

      // Optionally, draw an outline around the waveform
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "orange";
      ctx.stroke();
    }
    if (blobData) {
      drawWaveform(blobData);
    }
  }, [blobData]);

  // Duration of the audio in seconds
  const audioDuration = 100; // You'll need to set this based on your audio's duration

  // Function to start playback from the selected interval
  function playSelectedInterval(audioBlob: Blob) {
    // Create an audio element
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);

    // Set the current time to the start time
    audioElement.currentTime = startTime;

    // Play the audio
    audioElement.play();

    // Stop the audio at the end time
    setTimeout(() => {
      audioElement.pause();
      // Revoke the object URL to free memory
      URL.revokeObjectURL(audioUrl);
    }, (endTime - startTime) * 1000);
  }

  function handleCanvasInterval(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the canvas

    // Convert x position to time
  }
  return <div>useWavePlayer</div>;
};

export default useWavePlayer;
