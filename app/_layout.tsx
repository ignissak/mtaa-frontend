import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { observer, useMount } from "@legendapp/state/react";
import { Slot } from "expo-router";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ToastProvider } from "react-native-toast-notifications";
import { SWRConfig } from "swr";

const page = observer(function HomeLayout() {
  useMount(() => {
    console.log("Home layout mounted");
  });

  return (
    <SWRConfig>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider
          placement="bottom"
          duration={4000}
          offsetBottom={128}
          renderType={{
            success: (toast) => (
              <View className="w-full px-6 my-2">
                <View className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md border-l-2 border-emerald-500">
                  <Text className="text-neutral-900 dark:text-neutral-100 text-sm ">
                    {toast.message}
                  </Text>
                </View>
              </View>
            ),
            danger: (toast) => (
              <View className="w-full px-6 my-2">
                <View className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md border-l-2 border-red-500">
                  <Text className="text-neutral-900 dark:text-neutral-100 text-sm ">
                    {toast.message}
                  </Text>
                </View>
              </View>
            ),
          }}
        >
          <BottomSheetModalProvider>
            <Slot />
          </BottomSheetModalProvider>
        </ToastProvider>
      </GestureHandlerRootView>
    </SWRConfig>
  );
});

export default page;
