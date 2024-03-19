import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { testAuth } from "../api/auth";
import { appState$ } from "../tools/state";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const page = observer(function Page() {
  const token = appState$.user.token.get();
  const [isReady, setIsReady] = useState(false);

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
