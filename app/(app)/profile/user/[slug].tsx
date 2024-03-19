import { observe } from "@legendapp/state";
import { useLocalSearchParams } from "expo-router";
import { useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeading from "../../../../components/ProfileHeading";
import { appState$ } from "../../../../tools/state";
import { observer } from "@legendapp/state/react";

const page = observer(function ProfilePage() {
  const { slug } = useLocalSearchParams();
  const colorScheme = useColorScheme();

  const targetUserId = slug === "me" ? appState$.user.userId.get() : slug;

  return (
    <SafeAreaView className="bg-neutral-50 dark:bg-neutral-900 min-h-screen h-full mt-4">
      <ProfileHeading targetUserId={targetUserId as string} />
    </SafeAreaView>
  );
});

export default page;
