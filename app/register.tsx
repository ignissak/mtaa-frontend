import {
  Reactive,
  Show,
  observer,
  useObservable,
} from "@legendapp/state/react";
import { router } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import colors from "tailwindcss/colors";
import { register } from "../api/auth";
import { appState$ } from "../tools/state";

const page = observer(function Page() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const email = useObservable("");
  const password = useObservable("");
  const repeatPassword = useObservable("");
  const isLoading = useObservable(false);
  const emailError = useObservable("");
  const passwordError = useObservable("");
  const showPassword = useObservable(false);

  useEffect(() => {
    if (appState$.user.token.get()) {
      router.replace("/explore");
    }
  }, []);

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(email.get());
    if (!valid) {
      emailError.set(t("errors.invalid_email"));
    } else if (email.get().length === 0) {
      emailError.set(t("errors.email_required"));
    } else {
      emailError.set("");
    }
  };

  const validatePassword = () => {
    if (password.get().length === 0) {
      passwordError.set(t("errors.password_required"));
    } else if (password.get().length > 0 && repeatPassword.get().length > 0 && password.get() !== repeatPassword.get()) {
      passwordError.set(t("errors.password_mismatch"));
    } else {
      passwordError.set("");
    }
  };

  const handleRegister = async () => {
    if (email.get().length === 0) {
      emailError.set(t("errors.email_required"));
    }
    if (password.get().length === 0) {
      passwordError.set(t("errors.password_required"));
    }
    if (emailError.get().length > 0 || passwordError.get().length > 0) {
      return;
    }
    isLoading.set(true);
    const json = await register(email.get(), password.get());

    if (json.status === 201) {
      console.log("Registered");
      emailError.set("");
      passwordError.set("");
      router.replace("/explore");
    } else if (json.status === 409) {
      emailError.set(t("errors.register_conflict"));
    } else {
      console.log("Failed to register", json);
      passwordError.set(t("errors.failed_register"));
    }
    isLoading.set(false);
  };

  return (
    <SafeAreaView className="flex items-start justify-center h-full min-h-screen px-6 bg-neutral-50 dark:bg-neutral-900">
      <Text className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {t("headings.register")}
      </Text>
      <View className="flex w-full gap-3">
        {/* EMAIL */}
        <View className="flex w-full gap-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("auth.email")}
          </Text>
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full flex-row items-center justify-between${
              emailError.get().length > 0 ? " border-red-500 border" : ""
            }`}
          >
            <Reactive.TextInput
              $value={email}
              placeholder="johndoe@example.com"
              keyboardType="email-address"
              placeholderTextColor={"#a3a3a3"}
              autoCapitalize="none"
              onEndEditing={validateEmail}
              className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
            />
          </View>
          {emailError.get().length > 0 && (
            <Text className="text-red-500">{emailError.get()}</Text>
          )}
        </View>
        {/* PASSWORD */}
        <View className="flex w-full gap-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("auth.password")}
          </Text>
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full flex-row items-center justify-between${
              passwordError.get().length > 0 ? " border-red-500 border" : ""
            }`}
          >
            <Reactive.TextInput
              $value={password}
              $secureTextEntry={() => !showPassword.get()}
              placeholder={t("actions.type_your_password")}
              placeholderTextColor={"#a3a3a3"}
              autoCapitalize="none"
              onEndEditing={validatePassword}
              className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
            />
            <Show
              if={() => !showPassword.get()}
              else={() => (
                <Svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  fill="none"
                  color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  onPress={() => showPassword.set(!showPassword.get())}
                >
                  <Path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></Path>
                  <Path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></Path>
                </Svg>
              )}
            >
              <Svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                fill="none"
                color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                onPress={() => showPassword.set(!showPassword.get())}
              >
                <Path
                  d="M19.5 16L17.0248 12.6038"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M12 17.5V14"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M4.5 16L6.96895 12.6124"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M3 8C6.6 16 17.4 16 21 8"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Show>
          </View>
          {passwordError.get().length > 0 && (
            <Text className="text-red-500">{passwordError.get()}</Text>
          )}
        </View>
        {/* REPEAT PASSWORD */}
        <View className="flex w-full gap-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            {t("auth.repeat_password")}
          </Text>
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full flex-row items-center justify-between${
              passwordError.get().length > 0 ? " border-red-500 border" : ""
            }`}
          >
            <Reactive.TextInput
              $value={repeatPassword}
              $secureTextEntry={() => !showPassword.get()}
              placeholder={t("actions.type_your_password")}
              placeholderTextColor={"#a3a3a3"}
              autoCapitalize="none"
              onEndEditing={validatePassword}
              className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
            />
            <Show
              if={() => !showPassword.get()}
              else={() => (
                <Svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  fill="none"
                  color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  onPress={() => showPassword.set(!showPassword.get())}
                >
                  <Path
                    d="M3 13C6.6 5 17.4 5 21 13"
                    stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></Path>
                  <Path
                    d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
                    stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></Path>
                </Svg>
              )}
            >
              <Svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                fill="none"
                color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                onPress={() => showPassword.set(!showPassword.get())}
              >
                <Path
                  d="M19.5 16L17.0248 12.6038"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M12 17.5V14"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M4.5 16L6.96895 12.6124"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
                <Path
                  d="M3 8C6.6 16 17.4 16 21 8"
                  stroke={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></Path>
              </Svg>
            </Show>
          </View>
          {passwordError.get().length > 0 && (
            <Text className="text-red-500">{passwordError.get()}</Text>
          )}
        </View>
        <Pressable
          className="flex items-center justify-center w-full p-3 rounded-md bg-violet-200"
          onPress={handleRegister}
        >
          <Text className="text-base font-semibold text-center text-violet-700">
            <Show if={() => isLoading.get()} else={() => t("actions.register")}>
              <ActivityIndicator color={colors.violet[700]} />
            </Show>
          </Text>
        </Pressable>
        <Pressable
          className="w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800"
          onPress={() => router.navigate("/login")}
        >
          <Text className="text-base font-semibold text-center text-neutral-900 dark:text-neutral-100">
            {t("actions.i_have_account")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
});

export default page;
