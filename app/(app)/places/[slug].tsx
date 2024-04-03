import { Show, useObservable } from "@legendapp/state/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPlaceById } from "../../../api/places";
import { H1 } from "../../../components/Heading";
import PlacePage from "../../../components/PlacePage";
import {
  IPlace,
  addLoadedPlacee,
  appState$,
  findLoadedPlace,
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
      addLoadedPlacee(data.data);
    } catch (error) {
      console.log("Error fetching place:", error);
      isErrored$.set("Error fetching place.");
    }
  };

  return (
    <SafeAreaView className="bg-neutral-50 dark:bg-neutral-950 min-h-screen h-full mt-4">
      <Show
        if={() => !isLoading$.get()}
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
        <Show if={isErrored$} else={() => <PlacePage place={place$.get()} />}>
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
    </SafeAreaView>
  );
}
