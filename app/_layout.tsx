import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SWRConfig } from "swr";
import { SessionProvider } from "../tools/session";

export default function HomeLayout() {
  return (
    <SWRConfig>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SessionProvider>
            <Slot />
          </SessionProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SWRConfig>
  );
}
