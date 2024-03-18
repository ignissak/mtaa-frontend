import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Path, Svg } from "react-native-svg";
import useSWR, { BareFetcher } from "swr";
import { useSession } from "../../../../tools/session";
import ProfileHeading from "../../../../components/ProfileHeading";


export default function ProfilePage() {
  const { slug } = useLocalSearchParams();
  const { session, signOut, userId } = useSession();
  const colorScheme = useColorScheme();

  const targetUserId = slug === "me" ? userId : slug;

  return (
    <SafeAreaView className="bg-neutral-50 dark:bg-neutral-900 min-h-screen h-full mt-4">
      <ProfileHeading targetUserId={targetUserId as string} />
    </SafeAreaView>
  );
}
