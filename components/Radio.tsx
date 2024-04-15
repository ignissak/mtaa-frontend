import { View } from "react-native";

export default function Radio({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <View className="flex items-center justify-center w-6 h-6 border-2 rounded-full border-neutral-900 dark:border-neutral-100">
        <View className="w-4 h-4 border-2 rounded-full bg-neutral-900 dark:bg-neutral-100 border-neutral-50 dark:border-neutral-900"></View>
      </View>
    );
  }
  return (
    <View className="w-6 h-6 border-2 rounded-full bg-neutral-50 dark:bg-neutral-900 border-neutral-400 dark:border-neutral-500"></View>
  );
}
