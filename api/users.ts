import axios from "axios";
import { appState$ } from "../tools/state";

export const updateSettings = async (token: string) => {
  return await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/users/settings`,
    {
      appearance: appState$.localSettings.appearance.get(),
      language: appState$.localSettings.language.get(),
      visitedPublic: appState$.localSettings.visitedPublic.get(),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
