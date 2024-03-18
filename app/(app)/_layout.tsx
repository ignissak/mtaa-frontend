import { Redirect, Tabs } from "expo-router";
import { Text, useColorScheme } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSession } from "../../tools/session";

export default function TabLayout() {
  const { session, isLoading, userId } = useSession();

  const colorScheme = useColorScheme();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs screenOptions={{}}>
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M10 18V15C10 13.8954 10.8954 13 12 13C13.1046 13 14 13.8954 14 15V18"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M2 7.99998L11.7317 3.13414C11.9006 3.04969 12.0994 3.04968 12.2683 3.13414L22 7.99998"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
              <Path
                d="M17.75 17L21.75 21"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M3.75 11C3.75 15.4183 7.33172 19 11.75 19C13.963 19 15.9661 18.1015 17.4144 16.6493C18.8577 15.2022 19.75 13.2053 19.75 11C19.75 6.58172 16.1683 3 11.75 3C7.33172 3 3.75 6.58172 3.75 11Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scanner",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
              <Path
                d="M9.5 6.6V8.4C9.5 8.73137 9.23137 9 8.9 9H7.1C6.76863 9 6.5 8.73137 6.5 8.4V6.6C6.5 6.26863 6.76863 6 7.1 6H8.9C9.23137 6 9.5 6.26863 9.5 6.6Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6.5 12H9.5"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M15.5 12V15"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.5 18H15.5"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.5 12.0111L12.51 12"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 12.0111L18.51 12"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.5 15.0111L12.51 15"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 15.0111L18.51 15"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 18.0111L18.51 18"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.5 9.01111L12.51 9"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12.5 6.01111L12.51 6"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9.5 15.6V17.4C9.5 17.7314 9.23137 18 8.9 18H7.1C6.76863 18 6.5 17.7314 6.5 17.4V15.6C6.5 15.2686 6.76863 15 7.1 15H8.9C9.23137 15 9.5 15.2686 9.5 15.6Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 6.6V8.4C18.5 8.73137 18.2314 9 17.9 9H16.1C15.7686 9 15.5 8.73137 15.5 8.4V6.6C15.5 6.26863 15.7686 6 16.1 6H17.9C18.2314 6 18.5 6.26863 18.5 6.6Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 3H21.5V6"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M18.5 21H21.5V18"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6.5 3H3.5V6"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6.5 21H3.5V18"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
              <Path
                d="M15.25 19H9.25V12.5V8.6C9.25 8.26863 9.51863 8 9.85 8H14.65C14.9814 8 15.25 8.26863 15.25 8.6V14.5V19Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M15.25 5H9.25"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M20.65 19H15.25V15.1C15.25 14.7686 15.5186 14.5 15.85 14.5H20.65C20.9814 14.5 21.25 14.7686 21.25 15.1V18.4C21.25 18.7314 20.9814 19 20.65 19Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M9.25 19V13.1C9.25 12.7686 8.98137 12.5 8.65 12.5H3.85C3.51863 12.5 3.25 12.7686 3.25 13.1V18.4C3.25 18.7314 3.51863 19 3.85 19H9.25Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/user/[slug]"
        options={{
          title: "Profile",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
          headerShown: false,
          tabBarShowLabel: false,
          href: {
            pathname: "/profile/user/[slug]",
            params: {
              slug: "me",
            },
          },
          tabBarIcon: ({ focused }) => (
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 20V19C5 15.134 8.13401 12 12 12C15.866 12 19 15.134 19 19V20"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke={
                  focused
                    ? colorScheme === "light"
                      ? "#171717"
                      : "#f5f5f5"
                    : colorScheme === "light"
                    ? "#D4D4D4"
                    : "#525252"
                }
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tabs.Screen
        name="places/[slug]"
        options={{
          href: null,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
        }}
      />
      <Tabs.Screen
        name="profile/settings/index"
        options={{
          href: null,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "light" ? "#ffffff" : "#171717",
          },
        }}
      />
    </Tabs>
  );
}
