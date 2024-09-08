import { useEffect, useState } from "react";
import { AppState } from "react-native";
import useFetchSubCategories from "components/useFetchSubCategories";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchVersion from "components/useFetchVersion";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useRefetchStore } from "components/refetchStore";
import useVersionStore from "./versionStore";

export const useRefetchOnAppStateChange = () => {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber } = useFetchVersion();
  const { isRefetching, setIsRefetching } = useRefetchStore();
  const { dataVersion } = useVersionStore();

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: any) => {
      if (nextAppState === "active") {
        console.log("App has come to the foreground!");

        // Fetch current version after coming to the foreground
        await fetchVersionNumber();
        const storedVersion = (
          await AsyncStorage.getItem("dataVersion")
        )?.trim();

        if (storedVersion !== null && storedVersion !== dataVersion?.trim()) {
          refetchData();
        }
      }
    };

    const refetchData = async () => {
      if (isRefetching) return;

      setIsRefetching(true);
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
        console.log("Error during refetching:", error);
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
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup the listener on unmount
    return () => {
      subscription.remove();
    };
  }, [fetchTableNames, fetchSubCategories, fetchVersionNumber, isRefetching]);
};
