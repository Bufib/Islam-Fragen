import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "components/useColorScheme";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  return <RootLayoutNav />;
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();

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
