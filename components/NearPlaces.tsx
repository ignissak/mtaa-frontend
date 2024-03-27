import {
  For,
  Show,
  observer,
  useObservable,
  useObserve,
} from "@legendapp/state/react";
import * as Location from "expo-location";
import { useEffect } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { getNearPlaces } from "../api/places";
import { ILocation, IPlace, appState$ } from "../tools/state";
import { H1 } from "./Heading";
import { PlaceCard } from "./PlaceCard";

const page = observer(function Page() {
  const isLoadingLocation$ = useObservable(true);
  const isErrored$ = useObservable<boolean | string>(false);
  const nearPlaces$ = useObservable<IPlace[]>([]); // Array to store the fetched near places

  useEffect(() => {
    const getLocation = async () => {
      console.log("Getting location");
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        isErrored$.set("Location permission is required to use this feature.");
        isLoadingLocation$.set(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      appState$.location.set(location as ILocation);

      // Fetch API data after getting the location
      fetchNearPlaces(location);
    };

    getLocation();
  }, []);

  const fetchNearPlaces = async (location: ILocation) => {
    try {
      // Make API request to fetch near places using the location coordinates
      if (!location.coords) {
        console.log("No location coordinates found.");
        isErrored$.set("No location coordinates found.");
        return;
      }

      const res = await getNearPlaces(
        appState$.user.token.get(),
        location.coords?.latitude,
        location.coords?.longitude
      );
      if (res.status != 200) {
        console.log("Error fetching near places:", res.data);
        isErrored$.set("Error fetching near places.");
        isLoadingLocation$.set(false);
        return;
      }
      const data = res.data;
      nearPlaces$.set(data.data);
      isLoadingLocation$.set(false);
      console.log("Loaded near places:", data.data.length);
    } catch (error) {
      console.error("Error fetching near places:", error);
      isErrored$.set("Error fetching near places.");
    }
  };

  useObserve(() => {
    console.log("Loading changed:", isLoadingLocation$.get());
  });

  return (
    <Show
      if={() => !isLoadingLocation$.get()}
      else={() => (
        <View>
          <H1>Loading...</H1>
          <ScrollView className="px-6 mb-6" horizontal={true}>
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
            <H1>Near You</H1>
            <ScrollView className="px-6 mb-6" horizontal={true}>
              <For each={nearPlaces$}>
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