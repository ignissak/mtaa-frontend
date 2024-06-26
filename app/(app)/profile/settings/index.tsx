import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useToast } from "react-native-toast-notifications";
import colors from "tailwindcss/colors";
import ToggleSwitch from "toggle-switch-react-native";
import { updateSettings } from "../../../../api/users";
import CustomSheetBackdrop from "../../../../components/CustomSheetBackdrop";
import { H1 } from "../../../../components/Heading";
import Radio from "../../../../components/Radio";
import { IAppearance, ILanguage, appState$ } from "../../../../tools/state";

const page = observer(function SettingsPage() {
  const colorScheme = useColorScheme();
  const toast = useToast();
  const { t } = useTranslation();

  const { savedSettings, localSettings } = appState$;

  useEffect(() => {
    console.log("Saved settings: ", savedSettings.get());
    // set initial values
    localSettings.language.set(savedSettings.language.get());
    localSettings.appearance.set(savedSettings.appearance.get());
    localSettings.visitedPublic.set(savedSettings.visitedPublic.get());
    localSettings.name.set(savedSettings.name.get());
  }, []);

  // references
  const appearanceSheetModalRef = useRef<BottomSheetModal>(null);
  const languageSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["35%"], []);

  const handleAppearanceSheetModalPress = useCallback(() => {
    appearanceSheetModalRef.current?.present();
  }, []);
  const handleAppearanceSheetModalClose = useCallback(() => {
    appearanceSheetModalRef.current?.dismiss();
  }, []);

  const handleLanguageSheetModalPress = useCallback(() => {
    languageSheetModalRef.current?.present();
  }, []);
  const handleLanguageSheetModalClose = useCallback(() => {
    languageSheetModalRef.current?.dismiss();
  }, []);

  const handleAppearanceChange = (value: IAppearance) => {
    console.log("Changing appearance (local settings) to:", value);
    localSettings.appearance.set(value);
  };

  const handleLanguageChange = (value: ILanguage) => {
    console.log("Changing language (local settings) to:", value);
    localSettings.language.set(value);
  };

  const handleUpdate = async () => {
    console.log("Saving settings: ", localSettings.get());
    const res = await updateSettings(appState$.user.token.get());
    const status = res.status;

    if (status !== 200) {
      console.log("Failed to update settings: ", res);
      toast.show(t("toasts.settings_save_failed", { error: res.data.error }), {
        type: "danger",
      });
      return;
    }
    savedSettings.language.set(localSettings.language.get());
    savedSettings.appearance.set(localSettings.appearance.get());
    savedSettings.visitedPublic.set(localSettings.visitedPublic.get());
    console.log("Saved settings: ", savedSettings.get());
    toast.show(t('toasts.settings_saved'), { type: "success" });
  };

  const handleCancel = async () => {
    console.log("Canceling settings: ", localSettings.get());
    localSettings.language.set(savedSettings.language.get());
    localSettings.appearance.set(savedSettings.appearance.get());
    localSettings.visitedPublic.set(savedSettings.visitedPublic.get());
    localSettings.name.set(savedSettings.name.get());

    console.log("Local settings after cancel: ", localSettings.get());
    router.back();
  };

  return (
    <SafeAreaView className="w-full h-full min-h-screen my-4 bg-neutral-50 dark:bg-neutral-950">
      <H1>{t("headings.settings")}</H1>
      <View className="flex flex-col justify-between px-6 grow">
        {/* SETTINGS */}
        <View className="flex flex-col gap-4">
          <View className="flex flex-col space-y-1">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              {t("settings.display_name")}
            </Text>
            <View
              className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md flex-row items-center justify-between`}
            >
              <TextInput
                value={localSettings.name.get()}
                onChangeText={(value) => localSettings.name.set(value)}
                placeholder="John Doe"
                placeholderTextColor={"#a3a3a3"}
                autoCapitalize="words"
                className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
                maxLength={20}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              {t("settings.show_visited_public")}
            </Text>
            <ToggleSwitch
              size="medium"
              isOn={localSettings.visitedPublic.get()}
              onColor={"#8b5cf6"}
              onToggle={() =>
                localSettings.visitedPublic.set(
                  !localSettings.visitedPublic.get()
                )
              }
            />
          </View>
          {/* APPEARANCE */}
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              {t("settings.appearance")}
            </Text>
            <Pressable
              className="flex flex-row items-center gap-1"
              onPress={handleAppearanceSheetModalPress}
            >
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {localSettings.appearance.get() === "SYSTEM"
                  ? "System default"
                  : localSettings.appearance.get() === "LIGHT_MODE"
                  ? "Light mode"
                  : "Dark mode"}
              </Text>
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
                  d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Pressable>
            <BottomSheetModal
              ref={appearanceSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              backdropComponent={(backdropProps) => (
                <CustomSheetBackdrop
                  {...backdropProps}
                  close={handleAppearanceSheetModalClose}
                />
              )}
              backgroundStyle={{
                backgroundColor:
                  colorScheme === "light"
                    ? colors.neutral[50]
                    : colors.neutral[900],
              }}
              handleIndicatorStyle={{
                backgroundColor:
                  colorScheme === "light"
                    ? colors.neutral[300]
                    : colors.neutral[600],
              }}
            >
              <BottomSheetView>
                <View className="flex flex-col justify-between h-full">
                  <View className="px-6 py-2">
                    <Text className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {t("settings.appearance_settings")}
                    </Text>
                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleAppearanceChange("SYSTEM")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        {t("settings.system")}
                      </Text>
                      <Radio
                        checked={localSettings.appearance.get() === "SYSTEM"}
                      />
                    </Pressable>

                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleAppearanceChange("LIGHT_MODE")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        {t("settings.light")}
                      </Text>
                      <Radio
                        checked={
                          localSettings.appearance.get() === "LIGHT_MODE"
                        }
                      />
                    </Pressable>
                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleAppearanceChange("DARK_MODE")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        {t("settings.dark")}
                      </Text>
                      <Radio
                        checked={localSettings.appearance.get() === "DARK_MODE"}
                      />
                    </Pressable>
                  </View>
                  {/* <View className="flex flex-row justify-between px-6 mb-6 space-x-6">
                    <Pressable className="grow">
                      <Text className="p-3 text-base font-semibold text-center rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
                        Cancel
                      </Text>
                    </Pressable>
                    <Pressable className="grow">
                      <Text className="p-3 text-base font-semibold text-center rounded-md bg-violet-200 text-violet-900">
                        Save
                      </Text>
                    </Pressable>
                  </View> */}
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
          {/* LANGUAGE */}
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              {t("settings.language")}
            </Text>
            <Pressable
              className="flex flex-row items-center gap-1"
              onPress={handleLanguageSheetModalPress}
            >
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {localSettings.language.get() === "EN_GB"
                  ? "English"
                  : "Slovensky"}
              </Text>
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
                  d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Pressable>
            <BottomSheetModal
              ref={languageSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              backdropComponent={(backdropProps) => (
                <CustomSheetBackdrop
                  {...backdropProps}
                  close={handleLanguageSheetModalClose}
                />
              )}
              backgroundStyle={{
                backgroundColor:
                  colorScheme === "light"
                    ? colors.neutral[50]
                    : colors.neutral[900],
              }}
              handleIndicatorStyle={{
                backgroundColor:
                  colorScheme === "light"
                    ? colors.neutral[300]
                    : colors.neutral[600],
              }}
            >
              <BottomSheetView>
                <View className="flex flex-col justify-between h-full">
                  <View className="px-6 py-2">
                    <Text className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {t("settings.language_settings")}
                    </Text>
                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleLanguageChange("EN_GB")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        English
                      </Text>
                      <Radio
                        checked={localSettings.language.get() === "EN_GB"}
                      />
                    </Pressable>

                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleLanguageChange("SK_SK")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        Slovensky
                      </Text>
                      <Radio
                        checked={localSettings.language.get() === "SK_SK"}
                      />
                    </Pressable>
                  </View>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </View>
        {/* BOTTOM BUTTONS */}
        <View className="flex flex-row justify-between mb-12 space-x-6">
          <Pressable className="grow" onPress={handleCancel}>
            <Text className="p-3 text-base font-semibold text-center rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">
              {t("actions.cancel")}
            </Text>
          </Pressable>
          <Pressable className="grow" onPress={handleUpdate}>
            <Text className="p-3 text-base font-semibold text-center rounded-md bg-violet-200 text-violet-900">
              {t("actions.save")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default page;
