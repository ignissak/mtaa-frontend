import {
  Reactive,
  Show,
  observer,
  useObservable,
} from "@legendapp/state/react";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";
import colors from "tailwindcss/colors";
import {
  deleteReview,
  getPlaceById,
  putReview,
} from "../../../../../../api/places";
import { getUserReviews } from "../../../../../../api/users";
import { H1 } from "../../../../../../components/Heading";
import {
  IPlace,
  appState$,
  findLoadedPlace,
} from "../../../../../../tools/state";

const page = observer(function Page() {
  const { slug } = useLocalSearchParams();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const place = useObservable({} as IPlace);
  const exists = useObservable(false);
  const isLoading = useObservable(true);
  const isErrored = useObservable<boolean | string>(false);
  const review = useObservable({
    rating: 0,
    comment: "",
    image: null as ImagePicker.ImagePickerAsset | null,
  });
  const toast = useToast();

  const errors = useObservable({
    rating: false,
    comment: false,
  } as { rating: boolean | string; comment: boolean | string });

  useEffect(() => {
    const fetchReview = async () => {
      console.log("Fetching review for place with slug:", slug);

      const res = await getUserReviews(
        appState$.user.token.get(),
        appState$.user.userId.get(),
        parseInt(slug as string)
      );

      if (res.status === 200) {
        if (res.data.length > 0) {
          exists.set(true);
          review.set({
            rating: res.data[0].rating,
            comment: res.data[0].comment,
            image: null,
          });
          if (res.data[0].images.length > 0) {
            review.image.set({
              uri: `data:image/png;base64,${res.data[0].images[0].data}`,
              base64: res.data[0].images[0].data,
              width: 0,
              height: 0,
            });
          }
        }
        isLoading.set(false);
      } else {
        isErrored.set("An error occured!");
        isLoading.set(false);
      }
    };

    const fetchPlace = async () => {
      console.log("Fetching place with slug:", slug);

      try {
        const res = await getPlaceById(
          appState$.user.token.get(),
          slug as string
        );

        if (res.status === 200) {
          place.set(res.data.data);
        } else {
          isErrored.set("An error occured!");
        }
      } catch (e) {
        console.log(e);
        isErrored.set("An error occured! " + e);
      } finally {
        isLoading.set(false);
      }
    };

    const found = findLoadedPlace(parseInt(slug as string));
    if (!found) {
      fetchPlace().then(fetchReview);
    } else {
      place.set(found);
      fetchReview();
    }
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });

    if (!result.canceled) {
      review.image.set(result.assets[0]);
    }
  };

  const removeImage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    review.image.set(null);
  };

  const handleSubmit = async () => {
    if (review.comment.get().length === 0) {
      errors.comment.set(t("errors.comment_required"));
    } else errors.comment.set(false);
    if (review.rating.get() === 0) {
      errors.rating.set(t("errors.rating_required"));
    } else errors.rating.set(false);
    if (errors.comment.get() || errors.rating.get()) {
      return;
    }
    const formData = new FormData();
    formData.append("rating", review.rating.get().toString());
    formData.append("comment", review.comment.get());
    if (review.image.get()) {
      /** @ts-ignore */
      formData.append("image", {
        uri: review.image.get().uri,
        name: "image.jpg",
        type: review.image.get()?.mimeType,
      });
    }

    const res = await putReview(
      appState$.user.token.get(),
      place.id.get(),
      formData
    );

    if (res.status === 200) {
      toast.show(t("toasts.review_saved"), { type: "success" });
      exists.set(true);
      router.navigate(`/places/${place.id.get()}`);
    } else {
      console.log(res.data);
      toast.show(t("errors.general"), { type: "error" });
    }
  };

  const handleDelete = async () => {
    const res = await deleteReview(appState$.user.token.get(), place.id.get());

    if (res.status === 200) {
      toast.show(t("toasts.review_deleted"), { type: "success" });
      exists.set(false);
      review.set({
        rating: 0,
        comment: "",
        image: null,
      });
      router.navigate(`/places/${place.id.get()}`);
    } else {
      console.log(res.data);
      toast.show(t("errors.general"), { type: "error" });
    }
  };

  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <View className="flex flex-col justify-between grow">
        <View>
          <Show
            if={() => !isLoading.get()}
            else={() => (
              <>
                <H1>{t("constants.loading")}</H1>
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
              </>
            )}
          >
            <H1>{t("reviews.reviewing", { place: place.name.get() })}</H1>
            <View className="px-6">
              <Text className="mb-1 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {t("reviews.rating")}
              </Text>
              <View className="mb-6">
                <View className="flex flex-row items-center w-full mb-1 space-x-4">
                  {Array.from({ length: review.rating.get() }, (_, i) => (
                    <Pressable
                      key={"star:" + i}
                      onPress={() => review.rating.set(i + 1)}
                    >
                      <Svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="currentColor"
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
                    </Pressable>
                  ))}
                  {Array.from({ length: 5 - review.rating.get() }, (_, i) => (
                    <Pressable
                      key={"star-empty:" + i}
                      onPress={() =>
                        review.rating.set(review.rating.get() + i + 1)
                      }
                    >
                      <Svg
                        width="20px"
                        height="20px"
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
                    </Pressable>
                  ))}
                  <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {review.rating.get()}/5
                  </Text>
                </View>
                <Show if={() => errors.rating.get()}>
                  <Text className="text-red-500">{errors.rating.get()}</Text>
                </Show>
              </View>

              <Text className="mb-1 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {t("reviews.comment")}
              </Text>
              <View className="mb-6">
                <View className="flex-row items-start justify-between w-full p-3 mb-1 rounded-md bg-neutral-100 dark:bg-neutral-800">
                  <Reactive.TextInput
                    $value={review.comment}
                    className={`text-neutral-900 vertical dark:text-neutral-100 rounded-md text-base flex-1`}
                    autoCapitalize={"sentences"}
                    placeholderTextColor={colors.neutral[400]}
                    multiline={true}
                    numberOfLines={4}
                    style={{ textAlignVertical: "top" }}
                  />
                </View>
                <Show if={() => errors.comment.get()}>
                  <Text className="text-red-500">{errors.comment.get()}</Text>
                </Show>
              </View>
              <Text className="mb-1 text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
                {t("reviews.image")}
              </Text>
              <Show
                if={() => review.image.get() == null}
                else={() => (
                  <View>
                    <Pressable onPress={pickImage}>
                      <Image
                        source={{
                          uri: `data:image/png;base64,${review.image.get()?.base64}`,
                        }}
                        className="w-full h-48 rounded-md"
                      />
                    </Pressable>
                    <Pressable
                      className="absolute p-3 rounded-full -bottom-4 -right-0 bg-violet-100"
                      onPress={removeImage}
                    >
                      <Svg
                        width="20px"
                        height="20px"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                        fill="none"
                        color={colors.violet[600]}
                      >
                        <Path
                          d="M3 16L10 13L14 14.8182"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M16.8786 21.1213L19 19M21.1213 16.8787L19 19M19 19L16.8786 16.8787M19 19L21.1213 21.1213"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M13 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V13"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                      </Svg>
                    </Pressable>
                  </View>
                )}
              >
                <Pressable onPress={pickImage}>
                  <View className="flex items-center justify-center w-full h-48 border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                    <View className="flex flex-col items-center justify-center gap-2">
                      <Svg
                        width="20px"
                        height="20px"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                        fill="none"
                        color={
                          colorScheme === "dark"
                            ? colors.neutral[600]
                            : colors.neutral[400]
                        }
                      >
                        <Path
                          d="M13 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V13"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M3 16L10 13L15.5 15.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M16 10C14.8954 10 14 9.10457 14 8C14 6.89543 14.8954 6 16 6C17.1046 6 18 6.89543 18 8C18 9.10457 17.1046 10 16 10Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                        <Path
                          d="M16 19H19M22 19H19M19 19V16M19 19V22"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></Path>
                      </Svg>
                      <Text className="text-base text-neutral-400 dark:text-neutral-600">
                        Click here to attach an image.
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Show>
            </View>
          </Show>
        </View>
        {/* BOTTOM BUTTONS */}
        <View className="flex flex-row justify-between px-6 mb-12 space-x-6">
          <Show if={() => exists.get()}>
            <Pressable className="flex-1" onPress={handleDelete}>
              <Text className="p-3 text-base font-semibold text-center rounded-md bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
                {t("actions.delete_review")}
              </Text>
            </Pressable>
          </Show>
          <Pressable className="flex-1" onPress={handleSubmit}>
            <Text className="p-3 text-base font-semibold text-center rounded-md bg-violet-200 text-violet-900">
              {exists.get() ? t("actions.save") : t("actions.submit_review")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default page;
