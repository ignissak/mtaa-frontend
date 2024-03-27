import { For, Show, observer, useObservable } from "@legendapp/state/react";
import { useEffect } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { getTrendingPlaces } from "../api/places";
import { IPlace, appState$ } from "../tools/state";
import { H1 } from "./Heading";
import { PlaceCard } from "./PlaceCard";

const page = observer(function Page() {
  const isLoadingLocation$ = useObservable(true);
  const isErrored$ = useObservable<boolean | string>(false);
  const trendingPlaces$ = useObservable<IPlace[]>([]); // Array to store the fetched near places

  useEffect(() => {
    fetchTrendingPlaces();
  }, []);

  const fetchTrendingPlaces = async () => {
    try {
      // Make API request to fetch near places using the location coordinates

      const res = await getTrendingPlaces(appState$.user.token.get());
      if (res.status != 200) {
        console.log("Error fetching trending places:", res.data);
        isErrored$.set("Error fetching trending places.");
        isLoadingLocation$.set(false);
        return;
      }
      const data = res.data;
      trendingPlaces$.set(data.data);
      isLoadingLocation$.set(false);
      console.log("Loaded trending places:", data.data.length);
    } catch (error) {
      console.log("Error fetching trending places:", error);
      isErrored$.set("Error fetching trending places.");
    }
  };

  return (
    <Show
      if={() => !isLoadingLocation$.get()}
      else={() => (
        <View>
          <H1>Loading...</H1>
          <ScrollView className="px-6" horizontal={true}>
            {Array.from({ length: 5 }, (_, i) => (
              <View
                key={i}
                className="bg-neutral-100 dark:bg-neutral-800 h-40 w-64 mr-3 rounded-md"
              ></View>
            ))}
          </ScrollView>
        </View>
      )}
    >
      <Show
        if={isErrored$}
        else={() => (
          <View>
            <H1>Trending places</H1>
            <ScrollView className="px-6 mb-6" horizontal={true}>
              <For each={trendingPlaces$}>
                {(item) => (
                  <PlaceCard
                    image={item.get()?.images[0].data}
                    title={item.get()?.name}
                    subtitle={item.get()?.region}
                    url={`/places/${item.get()?.id}`}
                  />
                )}
              </For>
            </ScrollView>
          </View>
        )}
      >
        <View>
          <H1>Cannot load near places</H1>
          <View className="px-6">
            <Text className="text-neutral-600 dark:text-neutral-400">
              {isErrored$.get()}
            </Text>
            <Text className="text-neutral-600 dark:text-neutral-400">
              Make sure to allow location access in settings.
            </Text>
            <Pressable
              className="mt-6 p-3 w-full rounded-md bg-neutral-100 dark:bg-neutral-800"
              onPress={Linking.openSettings}
            >
              <Text className="text-center text-neutral-900 dark:text-neutral-100 font-semibold text-base">
                Open App Settings
              </Text>
            </Pressable>
          </View>
        </View>
      </Show>
    </Show>
  );
});

export default page;
