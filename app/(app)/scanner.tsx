import { observer, useObservable } from "@legendapp/state/react";
import { CameraView, useCameraPermissions } from "expo-camera/next";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useToast } from "react-native-toast-notifications";
import colors from "tailwindcss/colors";
import { visitPlace } from "../../api/places";
import { H1 } from "../../components/Heading";
import { ILocation, appState$, markPlaceVisited } from "../../tools/state";
import { useTranslation } from "react-i18next";

const page = observer(function ScannerPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const toast = useToast();
  const codes = useObservable<string[]>([]);
  const processing = useObservable(false);
  const colorScheme = useColorScheme();
  const isErrored = useObservable<boolean | string>(false);
  const { t } = useTranslation();

  const addCode = async (code: string) => {
    try {
      if (codes.includes(code)) return;
      codes.push(code);
      processing.set(true);

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        isErrored.set("Location permission is required to use this feature.");
        processing.set(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      appState$.location.set(location as ILocation);

      const res = await visitPlace(
        appState$.user.token.get(),
        code,
        location.coords.latitude,
        location.coords.longitude
      );

      const data = res.data;
      if (data.error) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (res.status === 409) {
          toast.show(t('toasts.already_visited'), { type: "danger" });
          return;
        }
        toast.show(data.error, { type: "danger" });
        return;
      }
      if (res.status === 200) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        router.navigate("/places/" + data.data.placeId);
        toast.show(t('toasts.marked_as_visited'), { type: "success" });
        markPlaceVisited(data.data.placeId);
        appState$.user.points.set((p) => p + data.data.place.points);
      }
    } catch (e) {
      toast.show(t('toasts.error_qr'), { type: "danger" });
      console.log(e);
    } finally {
      processing.set(false);
      // remove the code
      setTimeout(() => {
        codes.splice(codes.indexOf(code), 1);
      }, 5000);
    }
  };

  const requestPermissions = async () => {
    if (!permission) {
      const result = await requestPermission();
      if (!result.granted) {
        isErrored.set("Camera permission is required to use this feature.");
        processing.set(false);
        return;
      }
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  if (permission?.status === "undetermined") {
    return (
      <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
        <H1>{t('headings.camera_access')}</H1>
        <Text className="text-neutral-600 dark:text-neutral-400">
          {t('scanner.camera_access_text')}
        </Text>
      </SafeAreaView>
    );
  }

  if (isErrored.get()) {
    return (
      <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
        <H1>{t('headings.error')}</H1>
        <View className="px-6">
          <Text className="text-neutral-600 dark:text-neutral-400">
            {isErrored.get()}
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
      </SafeAreaView>
    );
  }

  if (processing.get()) {
    return (
      <SafeAreaView className="flex flex-col h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
        <H1>{t('headings.processing_qr')}</H1>
        <Text className="px-6 text-neutral-600 dark:text-neutral-400">
          {t('scanner.processing_qr_text')}
        </Text>

        <View className="flex items-center justify-center grow">
          <ActivityIndicator
            size="large"
            color={
              colorScheme === "dark" ? colors.neutral[600] : colors.neutral[400]
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <H1>{t('headings.scan_qr')}</H1>
      <Text className="px-6 mb-2 text-neutral-600 dark:text-neutral-400">
        {t('scanner.scan_text')}
      </Text>
      <View className="h-full px-6">
        <CameraView
          facing={"back"}
          style={{ flex: 1 }}
          className="h-full"
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={(data) => {
            addCode(data.data);
          }}
          onMountError={() => {
            toast.show(t('toasts.camera_error'), { type: "danger" });
          }}
        />
      </View>
    </SafeAreaView>
  );
});

export default page;
