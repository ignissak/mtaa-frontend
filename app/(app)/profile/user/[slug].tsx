import { observer } from "@legendapp/state/react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileHeading from "../../../../components/ProfileHeading";
import { appState$ } from "../../../../tools/state";

const page = observer(function ProfilePage() {
  const { slug } = useLocalSearchParams();

  const targetUserId = slug === "me" ? appState$.user.userId.get() : slug;

  return (
    <SafeAreaView className="h-full min-h-screen mt-4 bg-neutral-50 dark:bg-neutral-950">
      <ProfileHeading targetUserId={targetUserId as string} />
    </SafeAreaView>
  );
});

export default page;
