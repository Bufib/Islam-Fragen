import { useEffect, useState } from "react";
import { AppState, Alert } from "react-native";
import useFetchSubCategories from "components/useFetchSubCategories";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchVersion from "components/useFetchVersion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useRefetchStore } from "components/refetchStore";

export const useRefetchOnAppStateChange = () => {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber, versionNumber } = useFetchVersion();

  const [appState, setAppState] = useState(AppState.currentState);
  const { isRefetching, setIsRefetching } = useRefetchStore();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      // Check if app has come to the foreground
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");

        // Fetch current version after coming to the foreground
        await fetchVersionNumber();
        const storedVersion = (
          await AsyncStorage.getItem("dataVersion")
        )?.trim();

        if (storedVersion !== null && storedVersion !== versionNumber?.trim()) {
          refetchData();
        }
      }

      setAppState(nextAppState);
    };

    // Function to refetch data
    const refetchData = async () => {
      // If already updating return
      if (isRefetching) return;

      // Start update
      setIsRefetching(true);

      // Back to index
      router.navigate("/");
      Toast.show({
        type: "info",
        text1: "Updates werden Geladen",
        text2: "Das kann einen kleinen Augenblick dauern!",
      });

      try {
        await fetchTableNames();
        await fetchSubCategories();
        await fetchVersionNumber();
      } catch (error) {
        console.log(error);
      } finally {
        // Finishid updating
        setIsRefetching(false);
        Toast.show({
          type: "success",
          text1: "Updates abgeschlossen",
          text2: "Alle Daten sind aktuell!",
        });
      }
    };

    // AppState-Change-Listener hinzufügen
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Listener beim Unmount aufräumen
    return () => {
      subscription.remove();
    };
  }, [
    appState,
    fetchTableNames,
    fetchSubCategories,
    fetchVersionNumber,
    versionNumber,
    isRefetching,
  ]);
};
