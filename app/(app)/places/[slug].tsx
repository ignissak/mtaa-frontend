import { Show, useObservable } from "@legendapp/state/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlaceById, hasVisitedPlace } from "../../../api/places";
import { H1 } from "../../../components/Heading";
import PlacePage from "../../../components/PlacePage";
import {
  IPlace,
  addLoadedPlace,
  appState$,
  findLoadedPlace,
  markPlaceVisited,
} from "../../../tools/state";

export default function PlacePageParent() {
  const { slug } = useLocalSearchParams();
  const isLoading$ = useObservable(true);
  const isErrored$ = useObservable<boolean | string>(false);
  const place$ = useObservable<IPlace>();

  useEffect(() => {
    isLoading$.set(true);
    isErrored$.set(false);
    place$.set(undefined);
    fetchPlace();
  }, [slug]);

  const fetchPlace = async () => {
    try {
      const loadedPlace = findLoadedPlace(parseInt(slug as string));
      if (loadedPlace) {
        place$.set(loadedPlace);
        isLoading$.set(false);
        return;
      }
      // Make API request to fetch place by ID
      const res = await getPlaceById(
        slug as string,
        appState$.user.token.get()
      );
      if (res.status != 200) {
        console.log("Error fetching place:", res.data);
        isErrored$.set("Error fetching place.");
        isLoading$.set(false);
        return;
      }
      const data = res.data;
      place$.set(data.data);
      isLoading$.set(false);
      console.log("Loaded place:", data.data.id);

      // Add the loaded place to the app state
      addLoadedPlace(data.data);

      const hasVisited = await hasVisitedPlace(
        appState$.user.token.get(),
        appState$.user.userId.get(),
        data.data.id
      );
      const status = hasVisited.status;

      if (status === 200) {
        markPlaceVisited(data.data.id, hasVisited.data.data.length > 0);
        place$.visited.set(hasVisited.data.data.length > 0);
      }
    } catch (error) {
      console.log("Error fetching place:", error);
      isErrored$.set("Error fetching place.");
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen mt-4 bg-neutral-50 dark:bg-neutral-950">
      <Show
        if={() => !isLoading$.get()}
        else={() => (
          <View>
            <H1>Loading...</H1>
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
        <Show if={isErrored$} else={() => <PlacePage place={place$} />}>
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
                className="w-full p-3 mt-6 rounded-md bg-neutral-100 dark:bg-neutral-800"
                onPress={Linking.openSettings}
              >
                <Text className="text-base font-semibold text-center text-neutral-900 dark:text-neutral-100">
                  Open App Settings
                </Text>
              </Pressable>
            </View>
          </View>
        </Show>
      </Show>
    </SafeAreaView>
  );
}
