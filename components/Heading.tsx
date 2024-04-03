import { Text } from "react-native";

export const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Text className="px-6 mb-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
      {children}
    </Text>
  );
};
