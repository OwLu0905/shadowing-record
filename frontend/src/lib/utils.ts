import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export function convertToYoutubeIdUrl(videoId: string) {
  const videoUrl = `https://noembed.com/embed?format=json&url=https://www.youtube.com/watch?v=${videoId}`;

  return videoUrl;
}
