import { useMutation } from "@tanstack/react-query";
import httpAxios from "../http";

export interface YoutubeOEmbedResponse {
  type: "video";
  version: "1.0";
  title: string;
  author_name: string;
  author_url: string;
  provider_name: "YouTube";
  provider_url: "https://www.youtube.com/";
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  width: number;
  height: number;
}

async function getYtOembed(youtube_video_url: string) {
  const oembed_url =
    "https://www.youtube.com/oembed?format=json&url=" + youtube_video_url;

  try {
    const response = await fetch(oembed_url);

    if (response.status === 200) {
      const data = await response.json();

      return data as YoutubeOEmbedResponse;
    } else {
      throw Error("error");
    }
  } catch (error) {
    console.error("Error checking video:", error);
  }
}

const useYtCheckMutation = () => {
  return useMutation({
    mutationFn: (ytUrl: string) => getYtOembed(ytUrl),
  });
};

export { useYtCheckMutation };
