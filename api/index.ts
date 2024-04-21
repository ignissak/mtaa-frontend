import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { Toast } from "react-native-toast-notifications";
import { BareFetcher } from "swr";

axios.defaults.validateStatus = (status) => status >= 200 && status <= 500;

axios.interceptors.request.use((config) => {
  NetInfo.fetch().then((state) => {
    console.log("Am I connected?", state.isConnected);
    if (!state.isConnected) {
      Toast.show("No internet connection", { type: "danger", duration: 10000 });
      return;
    }
  });
  return config;
});

export const swrGET: BareFetcher<any> = async (url: string, token: string) => {
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
