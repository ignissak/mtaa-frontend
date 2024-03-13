import { Slot } from "expo-router";
import { SWRConfig } from "swr";
import { SessionProvider } from "../tools/session";

export default function HomeLayout() {
  return (
    <SWRConfig>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </SWRConfig>
  );
}
