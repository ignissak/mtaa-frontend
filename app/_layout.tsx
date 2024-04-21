import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { observer, useMount } from "@legendapp/state/react";
import { Slot } from "expo-router";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Path, Svg } from "react-native-svg";
import { ToastProvider } from "react-native-toast-notifications";
import { SWRConfig } from "swr";
import colors from "tailwindcss/colors";

const page = observer(function HomeLayout() {
  const colorScheme = useColorScheme();

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
                <View className="flex flex-row items-center p-3 space-x-2 border-l-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Svg
                    width="20px"
                    height="20px"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    fill="none"
                    color={colors.emerald[500]}
                  >
                    <Path
                      d="M5 13L9 17L19 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></Path>
                  </Svg>
                  <Text className="text-sm text-neutral-900 dark:text-neutral-100 ">
                    {toast.message}
                  </Text>
                </View>
              </View>
            ),
            danger: (toast) => (
              <View className="w-full px-6 my-2">
                <View className="flex flex-row items-center p-3 space-x-2 border-l-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Svg
                    width="20px"
                    height="20px"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                    fill="none"
                    color={colors.red[500]}
                  >
                    <Path
                      d="M12 7L12 13"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></Path>
                    <Path
                      d="M12 17.01L12.01 16.9989"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></Path>
                    <Path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></Path>
                  </Svg>
                  <Text className="text-sm text-neutral-900 dark:text-neutral-100 ">
                    {toast.message}
                  </Text>
                </View>
              </View>
            ),
            loading: (toast) => (
              <View className="w-full px-6 my-2">
                <View className="flex flex-row items-center p-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <ActivityIndicator
                    size="small"
                    color={
                      colorScheme === "dark"
                        ? colors.neutral[400]
                        : colors.neutral[400]
                    }
                  />
                  <Text className="text-sm text-neutral-900 dark:text-neutral-100 ">
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
