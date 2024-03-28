import axios from "axios";

const httpAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ANTIQUE_REST_API_ENDPOINT,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Cache-Control": `max-age=${86400 * 7}`,
    "Access-Control-Allow-Origin": "*",
  },
});

export default httpAxios;
