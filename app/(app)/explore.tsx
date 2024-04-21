import { observer } from "@legendapp/state/react";
import { SafeAreaView } from "react-native-safe-area-context";
import NearPlaces from "../../components/NearPlaces";
import TrendingPlaces from "../../components/TrendingPlaces";

const page = observer(function ExplorePage() {
  return (
    <SafeAreaView className="h-full min-h-screen pt-4 bg-neutral-50 dark:bg-neutral-950">
      <NearPlaces />
      <TrendingPlaces />
    </SafeAreaView>
  );
});

export default page;
