import { View } from "react-native";

export default function Radio({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <View className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-neutral-900 dark:border-neutral-100">
        <View className="rounded-full w-4 h-4 bg-neutral-900 dark:bg-neutral-100 border-2 border-neutral-50 dark:border-neutral-900"></View>
      </View>
    );
  }
  return (
    <View className="rounded-full w-6 h-6 bg-neutral-50 dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-500"></View>
  );
}
