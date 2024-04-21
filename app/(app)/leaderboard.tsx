import React, { useEffect } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { getTopLast30Days, getTopOverall } from "../../api/leaderboard";
import { appState$, IUser } from "../../tools/state";
import { H1 } from "../../components/Heading";
import { Show, observer, useObservable } from "@legendapp/state/react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const page = observer(function LeaderboardPage() {
  const last30DaysTop = useObservable<IUser[]>([]);
  const overallTop = useObservable<IUser[]>([]);
  const isLoading$ = useObservable(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    isLoading$.set(true);
    try {
      const overallTopRes = await getTopOverall(appState$.user.token.get());
      if (overallTopRes.status === 200) {
        overallTop.set(overallTopRes.data);
      }

      const last30DaysTopRes = await getTopLast30Days(
        appState$.user.token.get()
      );
      if (last30DaysTopRes.status === 200) {
        last30DaysTop.set(last30DaysTopRes.data);
      }

      isLoading$.set(false);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      isLoading$.set(false);
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <H1>{t("headings.leaderboard")}</H1>
      <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t("leaderboard.last_30_days_top")}
      </Text>
      <ScrollView className="px-6 mb-6">
        {/* Last 30 Days Top */}
        <View className="text-base text-neutral-900 dark:text-neutral-100">
          <Show
            if={isLoading$.get()}
            else={() =>
              last30DaysTop.get().map((user, index) => (
                <View
                  key={user.id}
                  className={`mb-1 flex flex-row items-center px-4 py-3 rounded-md ${
                    user.id === appState$.user.userId.get()
                      ? "bg-violet-200"
                      : ""
                  }`}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginRight: 5,
                    }}
                    className={`font-bold ${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {user.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: "auto",
                    }}
                    className={`${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {t("leaderboard.points_count", { count: user.points })}
                  </Text>
                  <Text
                    className={`ml-auto font-semibold ${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    #{index + 1}
                  </Text>
                </View>
              ))
            }
          >
            <ActivityIndicator size="small" color="#0000ff" />
          </Show>
        </View>
      </ScrollView>

      <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t("leaderboard.all_time_top")}
      </Text>
      <ScrollView className="px-6 mb-6">
        {/* Overall Top */}
        <View className="text-base text-neutral-900 dark:text-neutral-100">
          <Show
            if={isLoading$.get()}
            else={() =>
              overallTop.get().map((user, index) => (
                <View
                  key={user.id}
                  className={`mb-1 flex flex-row items-center px-4 py-3 rounded-md ${
                    user.id === appState$.user.userId.get()
                      ? "bg-violet-200"
                      : ""
                  }`}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      marginRight: 5,
                    }}
                    className={`font-bold ${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {user.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      marginRight: "auto",
                    }}
                    className={`${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    {t("leaderboard.points_count", { count: user.points })}
                  </Text>
                  <Text
                    className={`ml-auto font-semibold ${
                      user.id === appState$.user.userId.get()
                        ? "text-neutral-900"
                        : "text-neutral-900 dark:text-neutral-100"
                    }`}
                  >
                    #{index + 1}
                  </Text>
                </View>
              ))
            }
          >
            <ActivityIndicator size="small" color="#0000ff" />
          </Show>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default page;
