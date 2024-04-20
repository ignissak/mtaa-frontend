import { useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import { IUserReview, appState$ } from '../tools/state';
import Svg, { Path } from 'react-native-svg';
import colors from 'tailwindcss/colors';

export default function Review({
  review,
  onDelete,
}: {
  review: IUserReview;
  onDelete: () => void;
}) {
  const colorScheme = useColorScheme();
  return (
    <View className="px-6 mb-4">
      <View className="flex flex-row items-center justify-between mb-1">
        <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {review.place.name}
        </Text>
        <View className="ml-auto flex flex-row space-x-1">
          {Array.from({ length: review.rating }, (_, i) => (
            <Svg
              key={i}
              width="16px"
              height="16px"
              viewBox="0 0 24 24"
              fill="none"
              color={
                colorScheme === 'light'
                  ? colors.neutral[600]
                  : colors.neutral[400]
              }
              strokeWidth="1.8">
              <Path
                d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"></Path>
            </Svg>
          ))}
          {Array.from({ length: 5 - review.rating }, (_, i) => (
            <Svg
              key={i}
              width="16px"
              height="16px"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
              fill="none"
              color={
                colorScheme === 'light'
                  ? colors.neutral[600]
                  : colors.neutral[400]
              }>
              <Path
                d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"></Path>
            </Svg>
          ))}
        </View>
        <TouchableOpacity onPress={onDelete}>
          <View className="ml-4 rounded-md p-1 bg-violet-200">
            <Text className=" text-sm font-semibold text-violet-700 dark:text-violet-700">
              X
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text className="text-sm text-neutral-900 dark:text-neutral-100">
        {review.comment}
      </Text>
    </View>
  );
}
