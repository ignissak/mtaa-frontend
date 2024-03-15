import axios from "axios";
import { BareFetcher } from "swr";

export const swrFetcher: BareFetcher<any> = async (url: string, token: string) => {
  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 200) {
    const error = new Error(
      "An error occurred while fetching data, url: " + url
    );
    // Attach extra info to the error object.
    error.stack = response.data;
    error.cause = response.status;
    throw error;
  }
  return response.data;
};
