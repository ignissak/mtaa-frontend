import { observer } from "@legendapp/state/react";
import * as BackgroundFetch from "expo-background-fetch";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as TaskManager from "expo-task-manager";
import { useCallback, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { testAuth } from "../api/auth";
import "../tools/locales/index";
import { appState$, pushToken } from "../tools/state";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { enableReactNativeComponents } from "@legendapp/state/config/enableReactNativeComponents";
import { getUserPosition } from "../api/leaderboard";
enableReactNativeComponents();

const BACKGROUND_FETCH_TASK = "background-leaderboard-check2";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log("Running background task...");
  if (!appState$.user.token.get()) return;

  const pos = await getUserPosition(
    appState$.user.userId.get(),
    appState$.user.token.get()
  );

  let title, body;
  if (pos === 1) {
    title = "💫 You are the star!";
    body = "You are currently in the first place!";
  } else {
    title = "💫 Your position";
    body = `You are currently in the ${pos}. place!`;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { minute: 1 },
  });

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // 10 seconds
    stopOnTerminate: false, // android only,
    startOnBoot: false, // android only
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const page = observer(function Page() {
  const token = appState$.user.token.get();
  const [isReady, setIsReady] = useState(false);

  const checkRegisteredTask = async () => {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );

    if (!isRegistered) {
      console.log("Registering background task...");
      await registerBackgroundFetchAsync();
    }
  };

  useEffect(() => {
    checkRegisteredTask();
    registerForPushNotificationsAsync().then((token) => pushToken.set(token));
  }, []);

  useEffect(() => {
    testAuth(token).finally(() => {
      setIsReady(true);
    });
  }, []);

  const onLayoutRootView = useCallback(async () => {
    console.log(isReady);
    if (isReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
      if (token) {
        router.replace("/explore");
      } else {
        router.replace("/login");
      }
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <View
      onLayout={onLayoutRootView}
      className="bg-neutral-50 dark:bg-neutral-900"
    ></View>
  );
});

export default page;
