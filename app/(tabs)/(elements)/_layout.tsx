import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "components/useColorScheme";
import { QueryClient } from "@tanstack/react-query";
import useFetchVersion from "components/useFetchVersion";
import Toast from "react-native-toast-message";
import useNetworkStore from "components/useNetworkStore";
import { useNetworkInitializer } from "components/useNetworkInitializer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(elements)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { fetchVersionNumber, versionNumber } = useFetchVersion();
  useNetworkInitializer();
  const isConnected = useNetworkStore((state) => state.isConnected);

  // Check the internet connection when opening app and get the version number
  useEffect(() => {
    if (isConnected === null) {
      // Waiting for network state to be determined, so do nothing for now
      return;
    }
    if (isConnected === false) {
      Toast.show({
        type: "error",
        text1: "Keine Verbindung",
        text2:
          "Du hast keine Internetverbindung! Änderungen und neue Fragen könne somit nicht geladen werden!",
      });
    }

    // Set color Mode before opening
    const getColorMode = async () => {
      const colorMode = await AsyncStorage.getItem("ColorMode");
      // Set Colormode according to last session
      Appearance.setColorScheme(colorMode === "dark" ? "dark" : "light");
    };

    // Get the current Version Number
    fetchVersionNumber();
    getColorMode();
    SplashScreen.hideAsync();
  }, [isConnected]);

  return <RootLayoutNav />;
}

// Seperate header which is supabase table name
const separateWords = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/&/g, " & ")
    .trim();
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false, headerTitle: "" }}
        />

        <Stack.Screen
          name="getCategories/[getCategories]"
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="getSuperCategories/[getSuperCategories]"
          options={{
            headerShown: true,
          }}
        />
      </Stack>
      <Toast />
    </ThemeProvider>
  );
}
