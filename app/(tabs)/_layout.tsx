import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Colors from "constants/Colors";
import { useColorScheme } from "components/useColorScheme";
import { useClientOnlyValue } from "components/useClientOnlyValue";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { useAuthStore } from "components/authStore";
import { Entypo } from "@expo/vector-icons";
import { Platform } from "react-native";
import { View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useIsNewUpdateAvailable } from "components/newsUpdateStore";
import BackIcon from "components/BackIcon";
import Toast from "react-native-toast-message";
import { QueryClient } from "@tanstack/react-query";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome
      size={30}
      style={
        Platform.OS == "ios" ? { marginBottom: -20 } : { marginBottom: -10 }
      }
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const headerBackground =
    colorScheme === "light" ? Colors.light.white : Colors.dark.black;

  const IconBackground =
    colorScheme === "light" ? Colors.light.black : Colors.dark.white;

  const { isLoggedIn, logout } = useAuthStore();
  const { newUpdateAvailable, update } = useIsNewUpdateAvailable();

  return (
    <>
      <Tabs
        initialRouteName='(elements)'
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: useClientOnlyValue(false, false),
        }}
      >
        <Tabs.Screen
          name='(elements)'
          options={{
            title: "",
            headerShown: false,
            tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
          }}
        />

        <Tabs.Screen
          name='news'
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.newsContainer}>
                {newUpdateAvailable && <View style={styles.newsButton}></View>}
                <TabBarIcon name='bars' color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name='search'
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='search' color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name='askQuestion'
          options={{
            title: "",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name='question-circle' color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name='favorites'
          options={{
            title: "",
            headerTitle: "Favoriten",
            headerShown: true,
            headerStyle: { backgroundColor: headerBackground },
            tabBarIcon: ({ color }) => <TabBarIcon name='star' color={color} />,
          }}
        />

        <Tabs.Screen
          name='settings'
          options={{
            title: "",
            headerTitle: "Einstellungen",
            headerShown: true,
            headerRight: () =>
              isLoggedIn ? (
                <Link href='/settings' asChild style={{ marginRight: 15 }}>
                  <Pressable onPress={() => logout()}>
                    <Entypo name='log-out' size={24} color={IconBackground} />
                  </Pressable>
                </Link>
              ) : (
                <Link href='/modal' asChild style={{ marginRight: 15 }}>
                  <Pressable>
                    <Entypo name='login' size={24} color={IconBackground} />
                  </Pressable>
                </Link>
              ),
            tabBarIcon: ({ color }) => <TabBarIcon name='cog' color={color} />,
          }}
        />
        <Tabs.Screen
          name='(links)/impressum'
          options={{
            headerShown: true,
            headerTitle: "Impressum",
            tabBarButton: () => null,
            headerLeft: () => <BackIcon />,
          }}
        />
        <Tabs.Screen
          name='(links)/about'
          options={{
            headerShown: true,
            headerTitle: "Über",
            tabBarButton: () => null,
            headerLeft: () => <BackIcon />,
          }}
        />
        <Tabs.Screen
          name='(links)/datenschutz'
          options={{
            headerShown: true,
            headerTitle: "Datenschutz",
            tabBarButton: () => null,
            headerLeft: () => <BackIcon />,
          }}
        />
        <Tabs.Screen
          name='(links)/adminDashboard'
          options={{
            headerShown: true,
            headerTitle: "Admin Dashboard",
            tabBarButton: () => null,
            headerLeft: () => <BackIcon />,
          }}
        />
      </Tabs>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  newsContainer: {
    backgroundColor: "transparent",
  },
  newsButton: {
    position: "absolute",
    alignSelf: "flex-end",
    backgroundColor: "red",
    borderRadius: 30,
    width: 10,
    height: 10,
    zIndex: 1,
  },
});
