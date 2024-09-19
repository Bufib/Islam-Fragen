import FontAwesome from "@expo/vector-icons/FontAwesome";
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
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRefetchOnAppStateChange } from "components/useRefetchOnAppStateChange";
import useFetchData from "components/useFetchData";
import useNetworkStatus from "components/useNetworkStatus";


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isConnected } = useNetworkStatus();

  // Check the internet connection when opening app
  useEffect(() => {
    if (isConnected === false) {
      Toast.show({
        type: "error",
        text1: "Keine Verbindung",
        text2:
          "Du hast keine Internetverbindung! Änderungen und neue Fragen könne somit nicht geladen werden!",
      });
    }
  }, [isConnected]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false, headerTitle: "" }}
          />
          <Stack.Screen
            name='modal'
            options={{
              headerTitle: "Admin Login",
              presentation: "modal",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name='(text)/[renderText]'
            options={{
              headerShown: true,
            }}
          />

          <Stack.Screen
            name='rulesModal'
            options={{
              headerShown: false,
              presentation: "modal",
            }}
          />
        </Stack>
        <Toast />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
