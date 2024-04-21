import { Show, observer, useObservable } from "@legendapp/state/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getPlaceById,
  getPlaceReviews,
  hasVisitedPlace,
} from "../../../../api/places";
import { H1 } from "../../../../components/Heading";
import PlacePage from "../../../../components/PlacePage";
import {
  IPlace,
  IReview,
  addLoadedPlace,
  addReviewsForPlace,
  appState$,
  findLoadedPlace,
  markPlaceVisited,
  setTotalReviewCountForPlace,
} from "../../../../tools/state";
import { useTranslation } from "react-i18next";

const page = observer(function PlacePageParent() {
  const { slug } = useLocalSearchParams();
  const isLoading$ = useObservable(true);
  const isErrored$ = useObservable<boolean | string>(false);
  const place$ = useObservable<IPlace>();
  const { t } = useTranslation();

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
        isErrored$.set("Error fetching place. " + res.data);
        isLoading$.set(false);
        return;
      }
      const data = res.data;
      place$.set(data.data);
      isLoading$.set(false);
      console.log("Loaded place:", data.data.id);

      // Add the loaded place to the app state
      addLoadedPlace(data.data);

      console.log("Checking if user has visited place", data.data.id);
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

      console.log("Fetching reviews for place:", data.data.id);
      const reviews = await getPlaceReviews(
        appState$.user.token.get(),
        data.data.id
      );

      if (reviews.status === 200) {
        place$.reviews.set(reviews.data.data as IReview[]);
        place$.totalReviewCount.set(reviews.data.countOfReviews);
        addReviewsForPlace(data.data.id, reviews.data.data as IReview[]);
        setTotalReviewCountForPlace(data.data.id, reviews.data.countOfReviews);
      }
    } catch (error) {
      console.log("Error fetching place:", error);
      isErrored$.set("Error fetching place. " + error);
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen mt-4 bg-neutral-50 dark:bg-neutral-950">
      <Show
        if={() => !isLoading$.get()}
        else={() => (
          <View>
            <H1>{t('constants.loading')}</H1>
            <ScrollView className="px-6 mb-6" horizontal={true}>
              {Array.from({ length: 5 }, (_, i) => (
                <View
                  key={i}
                  className="w-64 h-40 mr-3 rounded-md bg-neutral-100 dark:bg-neutral-800"
                ></View>
              ))}
            </ScrollView>
            <View className="px-6">
              <View className="w-16 h-5 mb-2 rounded-md bg-neutral-100 dark:bg-neutral-800"></View>
              <View className="w-full h-20 mb-2 rounded-md bg-neutral-100 dark:bg-neutral-800"></View>
              <View className="flex flex-row mb-6 space-x-3">
                <View className="h-8 rounded-md w-14 bg-neutral-100 dark:bg-neutral-800"></View>
                <View className="h-8 rounded-md w-14 bg-neutral-100 dark:bg-neutral-800"></View>
              </View>
              <View className="w-16 h-5 mb-2 rounded-md bg-neutral-100 dark:bg-neutral-800"></View>
              <View className="w-full rounded-md h-44 bg-neutral-100 dark:bg-neutral-800"></View>
            </View>
          </View>
        )}
      >
        <Show if={isErrored$} else={() => <PlacePage place={place$} />}>
          <View>
            <H1>{t('errors.general')}</H1>
            <View className="px-6">
              <Text className="text-neutral-600 dark:text-neutral-400">
                {isErrored$.get()}
              </Text>
              <Text className="text-neutral-600 dark:text-neutral-400">
                {t('errors.allow_location')}
              </Text>
              <Pressable
                className="w-full p-3 mt-6 rounded-md bg-neutral-100 dark:bg-neutral-800"
                onPress={Linking.openSettings}
              >
                <Text className="text-base font-semibold text-center text-neutral-900 dark:text-neutral-100">
                  {t('actions.open_app_settings')}
                </Text>
              </Pressable>
            </View>
          </View>
        </Show>
      </Show>
    </SafeAreaView>
  );
});

export default page;
