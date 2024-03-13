import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView>
      <Text className="text-3xl text-amber-500">Hello World!</Text>
      <Link href="/explore" className="font-bold text-lg">
        Explore
      </Link>
      <Link href="/login" className="text-blue-500 text-3xl">
        Login
      </Link>
      <Text>API URL: {process.env.EXPO_PUBLIC_API_URL}</Text>
    </SafeAreaView>
  );
}
