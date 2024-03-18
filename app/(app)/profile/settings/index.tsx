import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { observer } from "@legendapp/state/react";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Pressable, Text, TextInput, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import colors from "tailwindcss/colors";
import ToggleSwitch from "toggle-switch-react-native";
import CustomSheetBackdrop from "../../../../components/CustomSheetBackdrop";
import Radio from "../../../../components/Radio";
import { H1 } from "../../../../components/headings";
import { IAppearance, appState$ } from "../../../../tools/state";

const page = observer(function SettingsPage() {
  const [name, setName] = React.useState("");
  const colorScheme = useColorScheme();

  const { savedSettings, localSettings } = appState$;

  useEffect(() => {
    console.log("Saved settings: ", savedSettings.get());
    // set initial values
    localSettings.language.set(savedSettings.language.get());
    localSettings.appearance.set(savedSettings.appearance.get());
    localSettings.visitedPublic.set(savedSettings.visitedPublic.get());
  }, []);

  // appearanceSheetModal
  const appearanceSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["35%"], []);
  const handleAppearanceSheetModalPress = useCallback(() => {
    appearanceSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const handleAppearanceChange = (value: IAppearance) => {
    console.log("Changing appearance (local settings) to: ", value);
    localSettings.appearance.set(value);
  };

  const handleUpdate = () => {
    console.log("Saving settings: ", localSettings.get());
    savedSettings.language.set(localSettings.language.get());
    savedSettings.appearance.set(localSettings.appearance.get());
    savedSettings.visitedPublic.set(localSettings.visitedPublic.get());
    console.log("Saved settings: ", savedSettings.get());
  };

  return (
    <SafeAreaView className="my-4 bg-neutral-50 dark:bg-neutral-950 min-h-screen h-full w-full border border-blue-500">
      <H1>Settings</H1>
      <View className="flex flex-col justify-between px-6 grow border border-red-800">
        {/* SETTINGS */}
        <View className="flex flex-col gap-4">
          <View className="flex flex-col gap-1">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              DISPLAY NAME
            </Text>
            <View
              className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md flex-row items-center justify-between`}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="John Doe"
                placeholderTextColor={"#a3a3a3"}
                autoCapitalize="none"
                className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
              />
            </View>
          </View>
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              SHOW MY VISITED PLACES PUBLICLY
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
          <View className="flex flex-row items-center justify-between ">
            <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              APPEARANCE
            </Text>
            <Pressable
              className="flex flex-row gap-1 items-center"
              onPress={handleAppearanceSheetModalPress}
            >
              <Text className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                {localSettings.appearance.get() === "SYSTEM"
                  ? "System"
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
              onChange={handleSheetChanges}
              backdropComponent={(backdropProps) => (
                <CustomSheetBackdrop {...backdropProps} />
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
                    <Text className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-4">
                      Appearance settings
                    </Text>
                    <Pressable
                      className="flex flex-row justify-between mb-3"
                      onPress={() => handleAppearanceChange("SYSTEM")}
                    >
                      <Text className="text-base text-neutral-900 dark:text-neutral-100">
                        System default
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
                        Light mode
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
                        Dark mode
                      </Text>
                      <Radio
                        checked={localSettings.appearance.get() === "DARK_MODE"}
                      />
                    </Pressable>
                  </View>
                  {/* <View className="flex flex-row space-x-6 px-6 mb-6 justify-between">
                    <Pressable className="grow">
                      <Text className="p-3 text-center bg-neutral-200 dark:bg-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 font-semibold text-base">
                        Cancel
                      </Text>
                    </Pressable>
                    <Pressable className="grow">
                      <Text className="p-3 text-center bg-violet-200 rounded-md text-violet-900 font-semibold text-base">
                        Save
                      </Text>
                    </Pressable>
                  </View> */}
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </View>
        {/* BOTTOM BUTTONS */}
        <View className="flex flex-row space-x-6 mb-8 justify-between">
          <Pressable className="grow">
            <Text className="p-3 text-center bg-neutral-200 dark:bg-neutral-800 rounded-md text-neutral-900 dark:text-neutral-100 font-semibold text-base">
              Cancel
            </Text>
          </Pressable>
          <Pressable className="grow" onPress={handleUpdate}>
            <Text className="p-3 text-center bg-violet-200 rounded-md text-violet-900 font-semibold text-base">
              Save
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
});

export default page;
