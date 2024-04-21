import { Show, observer, useObservable } from "@legendapp/state/react";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { deleteReviewById, getUserReviews } from "../../../../api/users";
import { H1 } from "../../../../components/Heading";
import ProfileHeading from "../../../../components/ProfileHeading";
import Review from "../../../../components/Review";
import VisitedPlaces from "../../../../components/VisitedPlaces";
import { IUserReview, appState$ } from "../../../../tools/state";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import colors from "tailwindcss/colors";

const page = observer(function ProfilePage() {
  const { slug } = useLocalSearchParams();
  const userReviews = useObservable<IUserReview[]>([]);
  const targetUserId = slug === "me" ? appState$.user.userId.get() : slug;
  const isLoading$ = useObservable(true);
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    isLoading$.set(true);
    try {
      console.log("Fetching user reviews...");
      const userReviewsRes = await getUserReviews(
        appState$.user.token.get(),
        appState$.user.userId.get()
      );
      if (userReviewsRes.status === 200) {
        console.log("User Reviews:", userReviewsRes.status);
        console.log("User Reviews Data:", userReviewsRes.data);

        userReviews.set(userReviewsRes.data);
      }
      isLoading$.set(false);
    } catch (error) {
      console.error("Error fetching user review data:", error);
      isLoading$.set(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    try {
      await deleteReviewById(appState$.user.token.get(), reviewId);
      fetchUserData();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <ProfileHeading targetUserId={targetUserId as string} />
      <H1>{t("profile.my_reviews")}</H1>
      <Text className="px-6 mb-4 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
        {t("profile.reviews_count", { count: userReviews.length })}
      </Text>
      <View className="px-6 text-base text-neutral-900 dark:text-neutral-100">
        <Show
          if={isLoading$.get()}
          else={() =>
            userReviews
              .get()
              .map((review) => (
                <Review
                  key={review.id}
                  review={review}
                  onDelete={() => handleDeleteReview(review.id)}
                />
              ))
          }
        >
          <ActivityIndicator size="small" color={
                      colorScheme === "dark"
                        ? colors.neutral[400]
                        : colors.neutral[600]
                    } />
        </Show>
      </View>
      <VisitedPlaces />
    </SafeAreaView>
  );
});

export default page;
