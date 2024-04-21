import { Show, observer, useObservable } from "@legendapp/state/react";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import colors from "tailwindcss/colors";
import { getPlaceReviews } from "../../../../../api/places";
import { H1 } from "../../../../../components/Heading";
import { appState$ } from "../../../../../tools/state";
import { useTranslation } from "react-i18next";

const page = observer(function Page() {
  const { slug } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const PAGE_LIMIT = 3;
  const data = useObservable<any[]>([]);
  const error = useObservable("");
  const page = useObservable(1);
  const numOfPages = useObservable(0);
  const totalResults = useObservable(0);
  const isLoading = useObservable(true);
  const averageRating = useObservable(-1);
  const { t } = useTranslation();

  useEffect(() => {
    fetchReviews(true);
  }, [page]);

  const fetchReviews = useCallback(async (reset: boolean = false) => {
    isLoading.set(true);
    if (reset) {
      data.set([]);
      page.set(1);
      numOfPages.set(0);
      totalResults.set(0);
      averageRating.set(-1);
    }

    try {
      const reviews = await getPlaceReviews(
        appState$.user.token.get(),
        parseInt(slug as string),
        page.get(),
        PAGE_LIMIT
      );

      if (reviews.status !== 200) {
        error.set("Error fetching reviews");
        isLoading.set(false);
        return;
      }

      const newData: any[] = reviews.data.data;
      const old = data.get() || ([] as any[]);
      const merged = old.concat(newData);
      data.set(merged);

      numOfPages.set(reviews.data.numOfPages);
      totalResults.set(reviews.data.countOfReviews);
      averageRating.set(reviews.data.averageRating._avg.rating);

      console.log(data.get());
    } catch (e) {
      console.log("Error fetching reviews:", e);
      error.set("Error fetching reviews. " + e);
    } finally {
      isLoading.set(false);
    }
  }, []);

  const handleInfiniteScroll = useCallback(() => {
    console.log("Infinite scrolling...");
    if (page.get() < numOfPages.get()) {
      page.set(page.get() + 1);
    } else return;

    fetchReviews();
  }, []);

  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <H1>{t('headings.reviews')}</H1>
      <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t('reviews.reviews_count', {count: totalResults.get()})}
      </Text>
      <Show
        else={() => (
          <Show
            if={() =>
              isLoading.get() &&
              data.get().length === 0 &&
              averageRating.get() === -1
            }
            else={() => (
              <View className="flex items-center justify-center h-full">
                <Text className="text-neutral-600 dark:text-neutral-400">
                  {t('reviews.no_reviews')}
                </Text>
              </View>
            )}
          >
            <View className="flex items-center justify-center h-full">
              <ActivityIndicator
                size="large"
                color={
                  colorScheme === "dark"
                    ? colors.neutral[400]
                    : colors.neutral[600]
                }
              />
            </View>
          </Show>
        )}
        if={() =>
          (!isLoading.get() && data.get().length > 0) ||
          (isLoading.get() && data.get().length > 0)
        }
      >
        <FlashList
          data={data.get()}
          estimatedItemSize={10}
          onEndReachedThreshold={0.5}
          onEndReached={handleInfiniteScroll}
          onRefresh={() => fetchReviews(true)}
          refreshing={isLoading.get()}
          renderItem={(review) => (
            <View className="px-6 mb-4">
              <View className="flex flex-row items-center justify-between mb-1">
                <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {review.item.user.name ||
                    review.item.user.email.split("@")[0]}
                </Text>
                <View className="flex flex-row space-x-1">
                  {/* Show stars */}
                  {Array.from({ length: review.item.rating }, (_, i) => (
                    <Svg
                      key={i}
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
                  ))}
                  {Array.from({ length: 5 - review.item.rating }, (_, i) => (
                    <Svg
                      key={i}
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
                  ))}
                </View>
              </View>
              <Text className="text-sm text-neutral-900 dark:text-neutral-100">
                {review.item.comment}
              </Text>
              <Show if={() => review.item.images.length > 0}>
                <Image
                  source={{
                    uri: `data:image/jpg;base64,${review.item.images[0]?.data}`,
                  }}
                  className="w-full h-40 mt-2 rounded-md"
                />
              </Show>
            </View>
          )}
        />
      </Show>
    </SafeAreaView>
  );
});

export default page;
