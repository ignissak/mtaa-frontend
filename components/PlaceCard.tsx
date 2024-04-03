import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export function PlaceCard(props: {
  image?: string;
  title?: string;
  subtitle?: string;
  url: string;
}) {
  const reroute = () => {
    router.navigate(props.url);
    console.log("Rerouting to:", props.url);
  };

  return (
    <Pressable onPress={reroute}>
      <View className="w-64 h-40 mr-3 overflow-hidden rounded-md">
        <Image
          className="absolute inset-0 object-cover w-full h-full"
          source={{ uri: `data:image/jpg;base64,${props.image}` }}
        />

        <View
          className="relative flex justify-end w-full h-full p-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Text className="text-lg font-semibold text-neutral-100">
            {props.title}
          </Text>
          <Text className="text-neutral-400">{props.subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}
