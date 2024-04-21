import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import {
  Reactive,
  Show,
  observer,
  useObservable,
} from "@legendapp/state/react";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";
import colors from "tailwindcss/colors";
import { searchPlaces } from "../../api/places";
import CustomSheetBackdrop from "../../components/CustomSheetBackdrop";
import { H1 } from "../../components/Heading";
import { PlaceSearchCard } from "../../components/PlaceSearchCard";
import { PlaceType, Region } from "../../tools/constants";
import {
  ILocation,
  IPlace,
  addLoadedPlace,
  appState$,
} from "../../tools/state";

const page = observer(function SearchPage() {
  const query = useObservable("");
  const allCategories = useObservable(Object.entries(PlaceType));
  const categories = useObservable([] as string[]);
  const allRegions = useObservable(Object.entries(Region));
  const regions = useObservable([] as Region[]);
  const colorScheme = useColorScheme();

  const loading = useObservable(false);
  const data = useObservable<any[] | undefined>(undefined);
  const error = useObservable("");
  const page = useObservable(1);
  const numOfPages = useObservable(0);
  const totalResults = useObservable(0);

  const PAGE_LIMIT = 5;

  const filtersSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const toast = useToast();
  const { t } = useTranslation();

  const handleFiltersSheetModalPress = useCallback(() => {
    if (loading.get()) return;
    Keyboard.dismiss();
    filtersSheetModalRef.current?.present();
  }, []);

  const handleFiltersSheetModalClose = useCallback(() => {
    filtersSheetModalRef.current?.dismiss();
  }, []);

  const handleCategoryPress = useCallback((category: string) => {
    if (categories.includes(category)) {
      categories.splice(categories.indexOf(category), 1);
    } else {
      categories.push(category);
    }
  }, []);

  const handleRegionPress = useCallback((region: Region) => {
    if (regions.includes(region)) {
      regions.splice(regions.indexOf(region), 1);
    } else {
      regions.push(region);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    const formattedQuery = query.get().trim();
    const formattedCategories = categories
      .get()
      .join(";")
      .replaceAll(" ", "_")
      .toUpperCase();
    const formattedRegions = regions
      .get()
      .join(";")
      .replaceAll(" ", "_")
      .toUpperCase();

    handleFiltersSheetModalClose();

    loading.set(true);
    data.set([]);
    page.set(1);
    numOfPages.set(0);
    totalResults.set(0);

    if (!appState$.location.get().coords) {
      // Get location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        error.set("Location permission is required to use this feature.");
        loading.set(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      appState$.location.set(location as ILocation);
    }

    console.log(
      "Searching for places...",
      formattedQuery,
      formattedCategories,
      formattedRegions
    );

    const res = await searchPlaces(
      appState$.user.token.get(),
      PAGE_LIMIT,
      page.get(),
      appState$.location.coords.latitude.get(),
      appState$.location.coords.longitude.get(),
      formattedQuery,
      formattedRegions,
      formattedCategories
    );

    if (res.status !== 200) {
      error.set("Error fetching search results.");
      loading.set(false);
      return;
    }

    data.set(res.data.data);
    numOfPages.set(res.data.numOfPages);
    loading.set(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    for (const place of res.data.data) {
      addLoadedPlace(place);
    }

    if (res.data.data.length > 0) {
      totalResults.set(res.data.data[0].total);
    }
  }, []);

  const handleInfiniteScroll = async () => {
    console.log("Infinite scrolling...");
    if (page.get() < numOfPages.get()) {
      page.set((prev) => prev + 1);
    } else return;

    const formattedQuery = query.get().trim();
    const formattedCategories = categories
      .get()
      .join(";")
      .replaceAll(" ", "_")
      .toUpperCase();
    const formattedRegions = regions
      .get()
      .join(";")
      .replaceAll(" ", "_")
      .toUpperCase();

    handleFiltersSheetModalClose();

    const res = await searchPlaces(
      appState$.user.token.get(),
      PAGE_LIMIT,
      page.get(),
      appState$.location.coords.latitude.get(),
      appState$.location.coords.longitude.get(),
      formattedQuery,
      formattedRegions,
      formattedCategories
    );

    if (res.status !== 200) {
      toast.show(t('toasts.fetch_error'), { type: "danger" });
      return;
    }

    const newData: any[] = res.data.data;
    const old = data.get() || ([] as any[]);
    const merged = old.concat(newData);
    data.set(merged);

    console.log("Added more places to the list, length:", merged.length);

    for (const place of res.data.data) {
      addLoadedPlace(place);
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen mt-4 bg-neutral-50 dark:bg-neutral-950">
      <H1>{t("headings.search")}</H1>

      <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t("search.results_count", { count: totalResults.get() })}
      </Text>

      <View className="flex flex-col h-full pb-24 ">
        <View className="flex flex-row items-center gap-3 px-6 mb-2">
          {/* Input */}
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md grow `}
          >
            <Reactive.TextInput
              $value={query}
              className="text-base rounded-md text-neutral-900 dark:text-neutral-100"
              placeholder={t('actions.search_for_places')}
              placeholderTextColor={colors.neutral[400]}
              onSubmitEditing={handleSearch}
              $editable={!loading.get()}
              $selectTextOnFocus={!loading.get()}
            />
          </View>
          {/* Filter button */}
          <Pressable onPress={handleFiltersSheetModalPress}>
            <View className="p-4 rounded-md bg-neutral-100 dark:bg-neutral-800">
              <Svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                fill="none"
                color={
                  colorScheme === "dark"
                    ? colors.neutral[400]
                    : colors.neutral[600]
                }
              >
                <Path
                  d="M3 6H21"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M7 12L17 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M11 18L13 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </View>
          </Pressable>
        </View>
        <Show
          if={() => error.get().length === 0}
          else={() => (
            <View className="flex items-center justify-center grow">
              <Text className="text-red-500">{t('errors.general')}</Text>
            </View>
          )}
        >
          <Show
            if={() => !loading.get() && data.get()}
            else={() => (
              <View className="flex items-center justify-center grow">
                <Show
                  if={() => loading.get()}
                  else={() => (
                    <Text className="text-neutral-600 dark:text-neutral-400">
                      {t('search.search_placeholder')}
                    </Text>
                  )}
                >
                  {/* loading == true and there is data */}
                  <ActivityIndicator
                    size="large"
                    color={
                      colorScheme === "dark"
                        ? colors.neutral[400]
                        : colors.neutral[600]
                    }
                  />
                </Show>
              </View>
            )}
          >
            <Show
              if={() => data.get()?.length!! > 0}
              else={() => (
                <View className="flex items-center justify-center grow">
                  <Text className="text-neutral-600 dark:text-neutral-400">
                    {t('search.no_results')}
                  </Text>
                </View>
              )}
            >
              <FlashList
                data={data.get() || []} // Add a default empty array if data is undefined
                estimatedItemSize={10}
                renderItem={({ item }: { item: IPlace }) => (
                  <PlaceSearchCard
                    key={item.id}
                    url={`/places/${item.id}`}
                    title={item.name}
                    subtitle={t('constants.place_type.' + item.type.toLocaleLowerCase())}
                    image={item.images[0].data}
                  />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={handleInfiniteScroll}
              />
            </Show>
          </Show>
        </Show>
      </View>
      <BottomSheetModal
        ref={filtersSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={(backdropProps) => (
          <CustomSheetBackdrop
            {...backdropProps}
            close={handleFiltersSheetModalClose}
          />
        )}
        backgroundStyle={{
          backgroundColor:
            colorScheme === "light" ? colors.neutral[50] : colors.neutral[900],
        }}
        handleIndicatorStyle={{
          backgroundColor:
            colorScheme === "light" ? colors.neutral[300] : colors.neutral[600],
        }}
      >
        <BottomSheetView>
          <View className="flex flex-col justify-between h-full">
            <View className="px-6 py-2">
              <Text className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {t('search.filters')}
              </Text>

              <Text className="mb-2 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {t('search.categories')}
              </Text>

              <View className="flex flex-row flex-wrap gap-2 mb-3">
                {allCategories.get().map((category) => (
                  <Pressable
                    key={category[0]}
                    onPress={() => handleCategoryPress(category[1])}
                  >
                    <Text
                      className={`text-sm text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 ${
                        categories.get().includes(category[1])
                          ? "bg-neutral-200 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      {t('constants.place_type.' + category[0].toLocaleLowerCase())}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text className="mb-2 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {t('search.regions')}
              </Text>

              <View className="flex flex-row flex-wrap gap-2 mb-3">
                {allRegions.get().map((region) => (
                  <Pressable
                    key={region[0]}
                    onPress={() => handleRegionPress(region[1])}
                  >
                    <Text
                      className={`text-sm text-neutral-900 dark:text-neutral-100 px-3 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 ${
                        regions.get().includes(region[1])
                          ? "bg-neutral-200 dark:bg-neutral-800"
                          : ""
                      }`}
                    >
                      {t('constants.region.' + region[0].toLocaleLowerCase())}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {/* Sheet buttons */}
            <View className="flex flex-row justify-between px-6 mb-8 space-x-6">
              <Pressable className="grow" onPress={handleSearch}>
                <Text className="p-3 text-base font-semibold text-center rounded-md bg-violet-200 text-violet-900">
                  {t('actions.search')}
                </Text>
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      {/* Controls */}
    </SafeAreaView>
  );
});

export default page;
