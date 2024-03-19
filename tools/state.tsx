import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeWindStyleSheet } from "nativewind";
import { Appearance } from "react-native";

export type IAppearance = "SYSTEM" | "LIGHT_MODE" | "DARK_MODE";

export type ILanguage = "EN_GB" | "SK_SK";

export type ISettings = {
  language: ILanguage;
  appearance: IAppearance;
  visitedPublic: boolean;
  name?: string;
};

export type IUser = {
  token?: string;
  userId?: number;
};

export const appState$ = observable({
  savedSettings: {
    language: "EN_GB",
    appearance: "SYSTEM",
    visitedPublic: true,
    name: undefined,
  } as ISettings,
  localSettings: {
    language: "EN_GB",
    appearance: "SYSTEM",
    visitedPublic: true,
    name: undefined,
  } as ISettings,
  user: {
    token: undefined,
    userId: undefined,
  } as IUser,
});

// Global configuration
configureObservablePersistence({
  // Use AsyncStorage in React Native
  pluginLocal: ObservablePersistAsyncStorage,
  localOptions: {
    asyncStorage: {
      // The AsyncStorage plugin needs to be given the implementation of AsyncStorage
      AsyncStorage,
    },
  },
});

persistObservable(appState$, {
  local: "appStore",
});

appState$.savedSettings.onChange((newSettings) => {
  const setColorScheme = Appearance.setColorScheme;
  const setColorSchemeNativeWind = NativeWindStyleSheet.setColorScheme;
  if (newSettings.value.appearance === "SYSTEM") {
    setColorScheme(null);
    setColorSchemeNativeWind("system");
  } else if (newSettings.value.appearance === "LIGHT_MODE") {
    setColorScheme("light");
    setColorSchemeNativeWind("light");
  } else {
    setColorScheme("dark");
    setColorSchemeNativeWind("dark");
  }
});
