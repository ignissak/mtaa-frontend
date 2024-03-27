import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";
import Svg, { Path } from "react-native-svg";
import useSWR from "swr";
import { swrGET } from "../api";
import { signOut } from "../api/auth";
import { appState$ } from "../tools/state";
import { observer } from "@legendapp/state/react";

const page = observer(function ProfileHeading({
  targetUserId,
}: {
  targetUserId: string;
}) {
  const colorScheme = useColorScheme();

  const { data, error, isLoading } = useSWR<
    {
      data: {
        id?: number;
        name?: string;
        points?: number;
        settings?: {
          appearance: "SYSTEM" | "LIGHT_MODE" | "DARK_MODE";
          language: "EN_GB" | "SK_SK";
          visitedPublic: boolean;
        };
        status: number;
        success: boolean;
      };
    },
    any
  >(
    [
      `${process.env.EXPO_PUBLIC_API_URL}/v1/users/${targetUserId}`,
      appState$.user.token.get(),
    ],
    ([url, token]) => swrGET(url, token)
  );

  const handleLogOut = () => {
    signOut();
    router.replace("/");
  };

  useEffect(() => {
    if (data) {
      console.log("Loaded profile data:", data.data);
      appState$.savedSettings.language.set(
        data.data.settings?.language || "EN_GB"
      );
      appState$.savedSettings.appearance.set(
        data.data.settings?.appearance || "SYSTEM"
      );
      appState$.savedSettings.visitedPublic.set(
        data.data.settings?.visitedPublic || false
      );
      appState$.savedSettings.name.set(data.data.name);
      appState$.user.points.set(data.data.points);
    }
  }, [data]);

  if (isLoading && !data && !error) {
    return (
      <View className="flex flex-row w-full justify-between px-6">
        <View className="flex flex-1 gap-2">
          <View className="bg-neutral-100 dark:bg-neutral-800 h-6 w-1/2 rounded-md"></View>
          <View className="bg-neutral-100 dark:bg-neutral-800 h-4 w-1/3 rounded-md"></View>
        </View>
        <View className="flex gap-8 flex-row">
          <View className="bg-neutral-100 dark:bg-neutral-800 h-6 w-6 rounded-md"></View>
          <View className="bg-neutral-100 dark:bg-neutral-800 h-6 w-6 rounded-md"></View>
        </View>
      </View>
    );
  }

  return (
    <View id="profile.details">
      {error ? (
        <View className="flex items-center flex-col gap-4 w-full px-6 mb-4">
          <Text className=" text-red-500 font-semibold text-base">
            {error.message}
          </Text>
          <Pressable
            onPress={() => {
              signOut();
              router.replace("/login");
            }}
          >
            <Text className="text-red-500 font-semibold text-base">
              Log out
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="flex justify-between items-center flex-row w-full px-6 mb-4">
          <View>
            <Text className="text-xl text-neutral-900 dark:text-neutral-100 font-semibold">
              {appState$.savedSettings.name.get()}
            </Text>
            <Text className="text-base text-neutral-600 dark:text-neutral-400">
              {appState$.user.points.get()} points
            </Text>
          </View>
          <View className="flex gap-8 flex-row">
            <Pressable
              onPress={() => {
                router.push(`/profile/settings`);
              }}
            >
              <Svg
                width="24px"
                height="24px"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                fill="none"
                color={colorScheme === "light" ? "#525252" : "#a3a3a3"}
              >
                <Path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke={colorScheme === "light" ? "#525252" : "#a3a3a3"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                  stroke={colorScheme === "light" ? "#525252" : "#a3a3a3"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Pressable>
            <Pressable onPress={handleLogOut}>
              <Svg
                width="24px"
                height="24px"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
                fill="none"
                color={colorScheme === "light" ? "#525252" : "#a3a3a3"}
              >
                <Path
                  d="M12 12H19M19 12L16 15M19 12L16 9"
                  stroke={colorScheme === "light" ? "#525252" : "#a3a3a3"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                  stroke={colorScheme === "light" ? "#525252" : "#a3a3a3"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
});
export default page;
