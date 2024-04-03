import { observable, opaqueObject } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocationObjectCoords } from "expo-location";
import { NativeWindStyleSheet } from "nativewind";
import { Appearance } from "react-native";
import { Socket, io } from "socket.io-client";

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
  points?: number;
};

export type ILocation = {
  coords?: LocationObjectCoords;
  mocked?: boolean;
  timestamp?: number;
};

export type IImage = {
  data: string;
};

export type IPlace = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  points: number;
  region: string;
  images: IImage[];
  distance?: number;
  fetchedAt?: Date;
  longitude?: number;
  latitude?: number;
  visited?: boolean;
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
    points: undefined,
  } as IUser,
  location: {} as ILocation,
});

export const appData$ = observable({
  loadedPlaces: [] as IPlace[],
  socket: undefined as Socket | undefined,
});

export const findLoadedPlace = (id: number) => {
  const place = appData$.loadedPlaces.find((place) => place.id.get() === id);
  if (
    place?.fetchedAt.get() &&
    Date.now() - place.fetchedAt.get().getTime() < 1000 * 60 * 5
  ) {
    // If the place was fetched less than 5 minutes ago, return it
    return place.get();
  }
  return undefined;
};

export const addLoadedPlace = (data: IPlace) => {
  if (findLoadedPlace(data.id)) {
    return;
  }
  appData$.loadedPlaces.push({ ...data, fetchedAt: new Date() });
};

export const markPlaceVisited = (id: number, visited: boolean = true) => {
  // set the place in the appData
  appData$.loadedPlaces.map((place) => {
    if (place.id.get() === id) {
      place.visited.set(visited);
    }
  });
};

export const initSocket = () => {
  // Initialize socket.io
  const socket = io(process.env.EXPO_PUBLIC_API_URL as string, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
    auth: {
      token: appState$.user.token.get(),
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  appData$.socket.set(opaqueObject(socket));
};

export const getSocket = () => {
  if (!appData$.socket.get()) {
    console.log("Initializing socket");
    initSocket();
  }
  return appData$.socket;
};

/* TODO: Unsubscribe */

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
