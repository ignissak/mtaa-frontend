import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import colors from "tailwindcss/colors";
import { login } from "../api/auth";
import { appState$ } from "../tools/state";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (appState$.user.token.get()) {
      router.replace("/explore");
    }
  }, []);

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(email);
    if (!valid) {
      setEmailError("Invalid email address");
    } else if (email.length === 0) {
      setEmailError("Email is required");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (password.length === 0) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  const handleSignIn = async () => {
    if (email.length === 0) {
      setEmailError("Email is required");
    }
    if (password.length === 0) {
      setPasswordError("Password is required");
    }
    if (emailError.length > 0) {
      return;
    }
    setIsLoading(true);
    const json = await login(email, password);

    if (json.data.status === 401) {
      setPasswordError("Invalid login credentials");
    } else if (json.data.status === 200) {
      console.log("Logged in");
      setPasswordError("");
      router.replace("/explore");
    } else {
      console.log("Failed to log in", json);
      setPasswordError("Failed to log in");
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex items-start justify-center h-full min-h-screen px-6 bg-neutral-50 dark:bg-neutral-900">
      <Text className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        Log In
      </Text>
      <View className="flex w-full gap-3">
        {/* EMAIL */}
        <View className="flex w-full gap-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            EMAIL ADDRESS
          </Text>
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full flex-row items-center justify-between${
              emailError.length > 0 ? " border-red-500 border" : ""
            }`}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@example.com"
              keyboardType="email-address"
              placeholderTextColor={"#a3a3a3"}
              autoCapitalize="none"
              onEndEditing={validateEmail}
              className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
            />
          </View>
          {emailError.length > 0 && (
            <Text className="text-red-500">{emailError}</Text>
          )}
        </View>
        {/* PASSWORD */}
        <View className="flex w-full gap-1">
          <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
            PASSWORD
          </Text>
          <View
            className={`p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md w-full flex-row items-center justify-between${
              passwordError.length > 0 ? " border-red-500 border" : ""
            }`}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Type your password"
              placeholderTextColor={"#a3a3a3"}
              autoCapitalize="none"
              onEndEditing={validatePassword}
              className={`text-neutral-900 dark:text-neutral-100 rounded-md text-base flex-1`}
            />
            {!showPassword ? (
              <Svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                fill="none"
                color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                onPress={() => setShowPassword(!showPassword)}
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
            ) : (
              <Svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                fill="none"
                color={colorScheme === "light" ? "#a3a3a3" : "#737373"}
                onPress={() => setShowPassword(!showPassword)}
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
          </View>
          {passwordError.length > 0 && (
            <Text className="text-red-500">{passwordError}</Text>
          )}
        </View>
        <View className="flex items-end w-full">
          <Pressable>
            <Text className="text-base font-semibold text-violet-700">
              Forgot your password?
            </Text>
          </Pressable>
        </View>
        <Pressable
          className="flex items-center justify-center w-full p-3 rounded-md bg-violet-200"
          onPress={handleSignIn}
        >
          <Text className="text-base font-semibold text-center text-violet-700">
            {isLoading ? (
              <ActivityIndicator color={colors.violet[700]} />
            ) : (
              "Log In"
            )}
          </Text>
        </Pressable>
        <Pressable className="w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800">
          <Text className="text-base font-semibold text-center text-neutral-900 dark:text-neutral-100">
            Create New Account
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
