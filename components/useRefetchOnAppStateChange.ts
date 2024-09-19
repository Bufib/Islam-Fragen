import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import useFetchSubCategories from "components/useFetchSubCategories";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchVersion from "components/useFetchVersion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useRefetchStore } from "components/refetchStore";
import useVersionStore from "components/versionStore";

export const useRefetchOnAppStateChange = () => {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber } = useFetchVersion();
  const { isRefetching, setIsRefetching } = useRefetchStore();
  const { dataVersion } = useVersionStore();

  // Reference to store the background timestamp
  const backgroundTimestampRef = useRef<number | null>(null);
  const isFirstLaunch = useRef(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (isRefetching) return;
      setIsRefetching(true);

      Toast.show({
        type: "info",
        text1: "Daten werden geladen",
        text2: "Es kann einen Augenblick dauern, bis die Fragen vorhanden sind!",
      });

      try {
        await fetchTableNames(); // Fetch table names
        await fetchSubCategories(); // Fetch subcategories
        await fetchVersionNumber(); // Fetch version number

        Toast.show({
          type: "success",
          text1: "Updates abgeschlossen",
          text2: "Alle Daten sind aktuell!",
        });
      } catch (error) {
        console.log("Error during initial data fetching:", error);
        Toast.show({
          type: "error",
          text1: "Fehler beim Laden der Daten",
          text2: "Bitte überprüfe deine Internetverbindung.",
        });
      } finally {
        setIsRefetching(false);
      }
    };

    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "active") {
        // App has come to the foreground
        if (isFirstLaunch.current) {
          // First launch of the app
          isFirstLaunch.current = false;
          await fetchInitialData();
        } else {
          await handleForeground();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App is going to the background
        backgroundTimestampRef.current = Date.now();
      }
    };

    const handleForeground = async () => {
      const now = Date.now();
      let timeInBackground = 0;

      if (backgroundTimestampRef.current) {
        timeInBackground = now - backgroundTimestampRef.current;
      }

      // Check if the app was in the background for more than one minute
      if (timeInBackground > 60000) {
        // Fetch current version after coming to the foreground
        await fetchVersionNumber();
        const storedVersion = (await AsyncStorage.getItem("dataVersion"))?.trim();

        if (storedVersion !== null && storedVersion !== dataVersion?.trim()) {
          refetchData();
        }
      } else {
        console.log(
          "App was in the background for less than one minute, not refetching."
        );
      }

      // Reset the background timestamp
      backgroundTimestampRef.current = null;
    };

    const refetchData = async () => {
      if (isRefetching) return;

      setIsRefetching(true);
      router.navigate("/");
      Toast.show({
        type: "info",
        text1: "Updates werden geladen",
        text2: "Das kann einen kleinen Augenblick dauern!",
      });

      try {
        await fetchTableNames();
        await fetchSubCategories();
        await fetchVersionNumber();
      } catch (error) {
        console.log("Error during refetching:", error);
        Toast.show({
          type: "error",
          text1: "Fehler beim Aktualisieren der Daten",
          text2: "Bitte überprüfe deine Internetverbindung.",
        });
      } finally {
        setIsRefetching(false);
        Toast.show({
          type: "success",
          text1: "Updates abgeschlossen",
          text2: "Alle Daten sind aktuell!",
        });
      }
    };

    // Add AppState change listener
    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Manually trigger the initial data fetch
    handleAppStateChange(AppState.currentState);

    // Clean up the subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [
    fetchTableNames,
    fetchSubCategories,
    fetchVersionNumber,
    isRefetching,
    dataVersion,
  ]);
};
