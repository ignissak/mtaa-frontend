import { For, Show, observer, useObservable } from "@legendapp/state/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { getVisitedPlaces } from "../api/places";
import { IPlace, appState$ } from "../tools/state";
import { H1 } from "./Heading";
import { PlaceCard } from "./PlaceCard";

const page = observer(function Page() {
  const isLoadingLocation$ = useObservable(true);
  const isErrored$ = useObservable<boolean | string>(false);
  const visitedPlaces$ = useObservable<IPlace[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchVisitedPlaces();
  }, []);

  const fetchVisitedPlaces = async () => {
    console.log("Fetching visited places...");
    try {
      const res = await getVisitedPlaces(
        appState$.user.token.get(),
        appState$.user.userId.get()
      );
      if (res.status != 200) {
        console.log("Error fetching visited places:", res.data);
        isErrored$.set("Error fetching visited places.");
        isLoadingLocation$.set(false);
        return;
      }
      const data = res.data;
      console.log("Visited places:", data.status);
      console.log(data.data);
      visitedPlaces$.set(data.data);
      isLoadingLocation$.set(false);
      console.log("Loaded visited places:", data.data.length);
    } catch (error) {
      console.log("Error fetching visited places:", error);
      isErrored$.set("Error fetching visited places.");
    }
  };

  return (
    <Show
      if={() => !isLoadingLocation$.get()}
      else={() => (
        <View className="pt-4">
          <H1>{t("constants.loading")}</H1>
          <ScrollView className="px-6" horizontal={true}>
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                className="w-64 h-40 mr-3 rounded-md bg-neutral-100 dark:bg-neutral-800"
              ></View>
            ))}
          </ScrollView>
        </View>
      )}
    >
      <Show
        if={isErrored$}
        else={() => (
          <View className="pt-4">
            <H1>{t("profile.visited_places")}</H1>
            <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              {t("profile.visited_count", { count: visitedPlaces$.length })}
            </Text>
            <ScrollView className="px-6 mb-6" horizontal={true}>
              <For each={visitedPlaces$}>
                {(item) => (
                  <PlaceCard
                    image={item.get()?.images[0].data}
                    title={item.get()?.name}
                    subtitle={t('constants.place_type.' + item.get()?.type.toLocaleLowerCase())}
                    url={`/places/${item.get()?.id}`}
                  />
                )}
              </For>
            </ScrollView>
          </View>
        )}
      >
        <View>
          <H1>{t("errors.visited_places")}</H1>
          <View className="px-6">
            <Text className="text-neutral-600 dark:text-neutral-400">
              {isErrored$.get()}
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-400">
              {t("errors.general")}
            </Text>
          </View>
        </View>
      </Show>
    </Show>
  );
});

export default page;
