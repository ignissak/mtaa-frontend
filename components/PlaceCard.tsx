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
      <View className="rounded-md overflow-hidden h-40 w-64 mr-3">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          source={{ uri: `data:image/jpg;base64,${props.image}` }}
        />

        <View
          className="relative flex justify-end h-full w-full p-3"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Text className="text-neutral-100 text-lg font-semibold">
            {props.title}
          </Text>
          <Text className="text-neutral-400">{props.subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}
