import { opaqueObject } from "@legendapp/state";
import { observer, useObservable } from "@legendapp/state/react";
import { useEffect } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Path, Svg } from "react-native-svg";
import colors from "tailwindcss/colors";
import { IPlace, getSocket } from "../tools/state";
import { H1 } from "./Heading";

const page = observer(function Page({ place }: { place: IPlace }) {
  const colorScheme = useColorScheme();
  const averageRating = useObservable<number>(0);
  const visits = useObservable<number>(0);

  const openGps = (lat: number, lng: number, label: string) => {
    const scheme = Platform.OS === "ios" ? "maps:" : "geo:";
    const url = scheme + `${lat},${lng}?q=${label}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    console.log("Page mounted, id:", place.id);
    const socket = getSocket();

    const handleSubscribed = (args: any) => {
      if (args.data.id !== place.id) return;
      console.log("Subscribed to place:", args.data);
      averageRating.set(args.data.averageRating);
      visits.set(args.data.visits);
    };

    const handleUpdated = (args: any) => {
      if (args.id !== place.id) return;
      visits.set(args.visits);
      averageRating.set(args.averageRating);
      console.log("Place updated:", args);
    };

    socket.get().on("place:subscribed", handleSubscribed);
    socket.get().on(`place:updated`, handleUpdated);
    socket.get().emit("place:subscribe", opaqueObject({ placeId: place.id }));

    return () => {
      socket.get().off("place:subscribed", handleSubscribed);
      socket.get().off(`place:updated`, handleUpdated);
      socket
        .get()
        .emit("place:unsubscribe", opaqueObject({ placeId: place.id }));
    };
  }, [place.id]);

  return (
    <View>
      <H1>{place.name}</H1>
      <ScrollView className="px-6 mb-6" horizontal={true}>
        {place.images.map((image, i) => (
          <Image
            key={i}
            className="h-40 w-64 rounded-md mr-3"
            source={{ uri: `data:image/jpg;base64,${image.data}` }}
          />
        ))}
      </ScrollView>
      <View className="flex gap-1 w-full px-6 mb-2">
        <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
          ABOUT
        </Text>
        <Text className="text-base text-neutral-900 dark:text-neutral-100">
          {place.description}
        </Text>
      </View>
      <View className="flex flex-row flex-wrap space-x-3 px-6 mb-6">
        <View className="px-4 py-3 rounded-md flex flex-row space-x-2 items-center bg-neutral-100 dark:bg-neutral-800">
          <Svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            fill="none"
            color={
              colorScheme === "light"
                ? colors.neutral[900]
                : colors.neutral[100]
            }
          >
            <Path
              d="M3 13C6.6 5 17.4 5 21 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
            <Path
              d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
          </Svg>
          <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">
            {visits.get()}
          </Text>
        </View>
        <View className="px-4 py-3 rounded-md flex flex-row space-x-2 items-center bg-neutral-100 dark:bg-neutral-800">
          <Svg
            width="20px"
            height="20px"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
            fill="none"
            color={
              colorScheme === "light"
                ? colors.neutral[900]
                : colors.neutral[100]
            }
          >
            <Path
              d="M9 12H12M15 12H12M12 12V9M12 12V15"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
            <Path
              d="M11.7 1.1732C11.8856 1.06603 12.1144 1.06603 12.3 1.17321L21.2263 6.3268C21.4119 6.43397 21.5263 6.63205 21.5263 6.84641V17.1536C21.5263 17.3679 21.4119 17.566 21.2263 17.6732L12.3 22.8268C12.1144 22.934 11.8856 22.934 11.7 22.8268L2.77372 17.6732C2.58808 17.566 2.47372 17.3679 2.47372 17.1536V6.84641C2.47372 6.63205 2.58808 6.43397 2.77372 6.32679L11.7 1.1732Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
          </Svg>
          <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">
            {place.points}
          </Text>
        </View>
        {/* <View className="px-4 py-3 rounded-md flex flex-row space-x-2 items-center bg-neutral-100 dark:bg-neutral-800">
          <Svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            fill="none"
            color={
              colorScheme === "light"
                ? colors.neutral[900]
                : colors.neutral[100]
            }
          >
            <Path
              d="M3 13C6.6 5 17.4 5 21 13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
            <Path
              d="M12 17C10.3431 17 9 15.6569 9 14C9 12.3431 10.3431 11 12 11C13.6569 11 15 12.3431 15 14C15 15.6569 13.6569 17 12 17Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></Path>
          </Svg>
          <Text className="text-neutral-900 dark:text-neutral-100 font-semibold">
            432 123
          </Text>
        </View> */}
      </View>
      <View className="px-6 w-full h-44 flex gap-1">
        <Text className="text-sm font-semibold uppercase text-neutral-500 dark:text-neutral-400">
          LOCATION
        </Text>
        <MapView
          className="w-full h-full"
          region={{
            latitude: place.latitude as number,
            longitude: place.longitude as number,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          onPress={() =>
            openGps(
              place.latitude as number,
              place.longitude as number,
              place.name
            )
          }
        >
          <Marker
            coordinate={{
              latitude: place.latitude as number,
              longitude: place.longitude as number,
            }}
            title={place.name}
          />
        </MapView>
      </View>
    </View>
  );
});

export default page;
