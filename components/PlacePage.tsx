import { ObservableObject, opaqueObject } from "@legendapp/state";
import { Show, observer, useObservable } from "@legendapp/state/react";
import { FlashList } from "@shopify/flash-list";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Path, Svg } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";
import colors from "tailwindcss/colors";
import { removeVisitPlace } from "../api/places";
import {
  IPlace,
  appData$,
  appState$,
  getSocket,
  markPlaceVisited,
} from "../tools/state";
import { H1 } from "./Heading";

const page = observer(function Page({
  place,
}: {
  place: ObservableObject<IPlace>;
}) {
  const colorScheme = useColorScheme();
  const averageRating = useObservable<number>(-1);
  const visits = useObservable<number>(-1);
  const visited = appData$.loadedPlaces.find(
    (p) => p.id.get() == place.id.get()
  )?.visited;
  const toast = useToast();
  const { t } = useTranslation();

  const openGps = (lat: number, lng: number, label: string) => {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = scheme + `${lat},${lng}?q=${label}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    console.log("Page mounted, id:", place.id.get());
    const socket = getSocket();

    const handleSubscribed = (args: any) => {
      if (args.data.id !== place.id.get()) return;
      console.log("Subscribed to place:", args.data);
      averageRating.set(args.data.averageRating);
      visits.set(args.data.visits);
    };

    const handleUpdated = (args: any) => {
      if (args.id !== place.id.get()) return;
      visits.set(args.visits);
      averageRating.set(args.averageRating);
      console.log("Place updated:", args);
    };

    socket.get().on("place:subscribed", handleSubscribed);
    socket.get().on(`place:updated`, handleUpdated);
    socket
      .get()
      .emit("place:subscribe", opaqueObject({ placeId: place.id.get() }));

    return () => {
      socket.get().off("place:subscribed", handleSubscribed);
      socket.get().off(`place:updated`, handleUpdated);
      socket
        .get()
        .emit("place:unsubscribe", opaqueObject({ placeId: place.id.get() }));
    };
  }, [place.id.get()]);

  const handleBottomButton = () => {
    if (!place.visited.get()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push("/scanner");
    }
  };

  const handleMarkAsNotVisited = async () => {
    const res = await removeVisitPlace(
      appState$.user.token.get(),
      place.id.get()
    );

    if (res.status === 200) {
      visited?.set(false);
      markPlaceVisited(place.id.get(), false);
      toast.show(t("toasts.marked_as_not_visited"), { type: "success" });
    } else {
      toast.show(t("toasts.marked_as_not_visited_failed"), { type: "error" });
      console.log("Failed to mark place as not visited", res.data);
    }
  };

  const handleWriteReview = async () => {
    router.push("/places/" + place.id.get() + "/reviews/new");
  };

  return (
    <View className="flex flex-col justify-between h-full pb-12">
      <ScrollView className="h-full border border-yellow-500">
        <H1>{place.name.get()}</H1>
        <ScrollView className="px-6 mb-6" horizontal={true}>
          {place.images.get().map((image, i) => (
            <Image
              key={"image:" + i}
              className="w-64 h-40 mr-3 rounded-md"
              source={{ uri: `data:image/jpg;base64,${image.data}` }}
            />
          ))}
        </ScrollView>
        <View className="flex w-full gap-1 px-6 mb-2">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("place.about")}
          </Text>
          <Text className="text-base text-neutral-900 dark:text-neutral-100">
            {place.description.get()}
          </Text>
        </View>
        <View className="flex flex-row flex-wrap px-6 mb-6 space-x-3">
          <View className="flex flex-row items-center px-4 py-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
            <Svg
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              fill="none"
              color={
                colorScheme === "light"
                  ? colors.neutral[900]
                  : colors.neutral[100]
              }
            >
              <Path
                d="M3 13C6.6 5 17.4 5 21 13"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></Path>
              <Path
                d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></Path>
            </Svg>
            <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
              {visits.get() === -1 ? "Loading..." : visits.get()}
            </Text>
          </View>
          <View className="flex flex-row items-center px-4 py-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
            <Svg
              width="20px"
              height="20px"
              stroke-width="1.8"
              viewBox="0 0 24 24"
              fill="none"
              color={
                colorScheme === "light"
                  ? colors.neutral[900]
                  : colors.neutral[100]
              }
            >
              <Path
                d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></Path>
            </Svg>
            <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
              {averageRating.get() === -1
                ? t("constants.loading")
                : averageRating.get() === 0
                  ? t("place.no_rating")
                  : averageRating.get().toFixed(1) + "/5"}
            </Text>
          </View>
          <View className="flex flex-row items-center px-4 py-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800">
            <Svg
              width="20px"
              height="20px"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              fill="none"
              color={
                colorScheme === "light"
                  ? colors.neutral[900]
                  : colors.neutral[100]
              }
            >
              <Path
                d="M9 12H12M15 12H12M12 12V9M12 12V15"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></Path>
              <Path
                d="M11.7 1.1732C11.8856 1.06603 12.1144 1.06603 12.3 1.17321L21.2263 6.3268C21.4119 6.43397 21.5263 6.63205 21.5263 6.84641V17.1536C21.5263 17.3679 21.4119 17.566 21.2263 17.6732L12.3 22.8268C12.1144 22.934 11.8856 22.934 11.7 22.8268L2.77372 17.6732C2.58808 17.566 2.47372 17.3679 2.47372 17.1536V6.84641C2.47372 6.63205 2.58808 6.43397 2.77372 6.32679L11.7 1.1732Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></Path>
            </Svg>
            <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
              {place.points.get()}
            </Text>
          </View>
        </View>
        <View className="flex w-full gap-1 px-6 mb-6 h-44">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("place.location")}
          </Text>
          <MapView
            className="w-full h-36"
            region={{
              latitude: (place.latitude.get() as number) || 0,
              longitude: (place.longitude.get() as number) || 0,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
            onPress={() =>
              openGps(
                place.latitude.get() as number,
                place.longitude.get() as number,
                place.name.get()
              )
            }
          >
            <Marker
              coordinate={{
                latitude: place.latitude.get() as number,
                longitude: place.longitude.get() as number,
              }}
              title={place.name.get()}
            />
          </MapView>
        </View>
        <View className="flex w-full px-6 mb-6 space-y-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {(place.totalReviewCount.get() || 0) === 0
              ? t("place.no_reviews_title")
              : t("place.reviews_count", {
                  count: place.totalReviewCount.get(),
                })}
          </Text>
          <View>
            <Show
              if={
                place.reviews.get()?.length === 0 ||
                place.reviews.get() === undefined
              }
              else={() => (
                <View className="border border-red-500">
                  <View>
                    <FlashList
                      data={place.reviews.get() || []}
                      estimatedItemSize={5}
                      estimatedListSize={{ height: 48, width: 48 }}
                      renderItem={(review) => {
                        return (
                          <View className="mb-2">
                            <View className="flex flex-row items-center justify-between mb-1">
                              <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                {review.item.user.name ||
                                  review.item.user.email.split("@")[0]}
                              </Text>
                              <View className="flex flex-row space-x-1">
                                {/* Show stars */}
                                {Array.from(
                                  { length: review.item.rating },
                                  (_, i) => (
                                    <Svg
                                      key={"filledstar:" + i}
                                      width="16px"
                                      height="16px"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      color={
                                        colorScheme === "light"
                                          ? colors.neutral[600]
                                          : colors.neutral[400]
                                      }
                                      strokeWidth="1.8"
                                    >
                                      <Path
                                        d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></Path>
                                    </Svg>
                                  )
                                )}
                                {Array.from(
                                  { length: 5 - review.item.rating },
                                  (_, i) => (
                                    <Svg
                                      key={"hollowstar:" + i}
                                      width="16px"
                                      height="16px"
                                      strokeWidth="1.8"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      color={
                                        colorScheme === "light"
                                          ? colors.neutral[600]
                                          : colors.neutral[400]
                                      }
                                    >
                                      <Path
                                        d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></Path>
                                    </Svg>
                                  )
                                )}
                              </View>
                            </View>
                            <Text
                              className="text-sm text-neutral-900 dark:text-neutral-100"
                              numberOfLines={2}
                            >
                              {review.item.comment}
                            </Text>
                          </View>
                        );
                      }}
                    />
                  </View>

                  <Pressable
                    onPress={() => {
                      router.push(`/places/${place.id.get()}/reviews`);
                    }}
                  >
                    <Text className="font-semibold text-center uppercase text-neutral-900 dark:text-neutral-100">
                      {t("actions.show_all_reviews")}
                    </Text>
                  </Pressable>
                </View>
              )}
            >
              <Text className="text-neutral-900 dark:text-neutral-100">
                {t("place.no_reviews_text")}
              </Text>
            </Show>
          </View>
        </View>

        <View className="flex flex-row px-6 mb-6 space-x-3">
          <Show if={() => visited?.get()}>
            <Pressable
              className="flex flex-row items-center px-4 py-3 mr-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800"
              onPress={handleMarkAsNotVisited}
            >
              <Svg
                width="20px"
                height="20px"
                stroke-width="1.8"
                viewBox="0 0 24 24"
                fill="none"
                color={
                  colorScheme === "light"
                    ? colors.neutral[900]
                    : colors.neutral[100]
                }
              >
                <Path
                  d="M8.99219 13H11.9922H14.9922"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M3.03919 4.2939C3.01449 4.10866 3.0791 3.92338 3.23133 3.81499C3.9272 3.31953 6.3142 2 12 2C17.6858 2 20.0728 3.31952 20.7687 3.81499C20.9209 3.92338 20.9855 4.10866 20.9608 4.2939L19.2616 17.0378C19.0968 18.2744 18.3644 19.3632 17.2813 19.9821L16.9614 20.1649C13.8871 21.9217 10.1129 21.9217 7.03861 20.1649L6.71873 19.9821C5.6356 19.3632 4.90325 18.2744 4.73838 17.0378L3.03919 4.2939Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                ></Path>
                <Path
                  d="M3 5C5.57143 7.66666 18.4286 7.66662 21 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                ></Path>
              </Svg>
              <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
                {t("actions.mark_as_not_visited")}
              </Text>
            </Pressable>
            <Pressable
              className="flex flex-row items-center px-4 py-3 space-x-2 rounded-md bg-neutral-100 dark:bg-neutral-800"
              onPress={handleWriteReview}
            >
              <Svg
                width="20px"
                height="20px"
                stroke-width="1.8"
                viewBox="0 0 24 24"
                fill="none"
                color={
                  colorScheme === "light"
                    ? colors.neutral[900]
                    : colors.neutral[100]
                }
              >
                <Path
                  d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
              <Text className="font-semibold text-neutral-900 dark:text-neutral-100">
                {t("actions.write_review")}
              </Text>
            </Pressable>
          </Show>
        </View>
      </ScrollView>
      <Show if={visited !== undefined}>
        <Pressable
          className="px-6 border border-red-500"
          onPress={handleBottomButton}
        >
          <Text
            className={`w-full py-3 font-semibold text-center rounded-md bg-neutral-100 dark:bg-neutral-800 ${
              visited?.get()
                ? "text-neutral-400 dark:text-neutral-600"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {visited?.get()
              ? t("actions.visited_place")
              : t("actions.i_am_here")}
          </Text>
        </Pressable>
      </Show>
    </View>
  );
});

export default page;
