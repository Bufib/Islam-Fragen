import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import useNetworkStore from "./useNetworkStore";
import useVersionStore from "components/versionStore";
import {
  UPDATED_MESSAGE,
  ERROR_LOADING_DATA,
  CHECK_CONNECTION_RESTART_APP,
  NO_UPADTES_FETCHABLE,
  NO_INTERNET,
} from "components/messages";

const TABLE_NAMES_KEY = "tableNames";
const FIRST_FETCH_TABLE_NAMES = "firstFetchTableNames";

interface TableNamesData {
  tableNames: { category: string; tableNames: string }[];
  isFetchingTable: boolean;
  fetchErrorTableNames: string;
  fetchTableNames: () => Promise<void>;
}

export const useFetchTableNames = (): TableNamesData => {
  const [tableNames, setTableNames] = useState<
    { category: string; tableNames: string }[]
  >([]);
  const [fetchErrorTableNames, setFetchErrorTableNames] = useState<string>("");
  const [isFetchingTable, setisFetchingTable] = useState<boolean>(true);
  const isConnected = useNetworkStore((state) => state.isConnected);
  const { isDifferent } = useVersionStore();

  const fetchTableNames = useCallback(async () => {
    setisFetchingTable(true);
    try {
      const { data, error } = await supabase
        .from("AllTableNames")
        .select("*")
        .order("tableName", { ascending: true });

      // Show Error from Supabase
      if (error) {
        throw new Error(error.message);
      }

      // Set first Fetch to true
      await AsyncStorage.setItem(FIRST_FETCH_TABLE_NAMES, "true");

      // Get the format: [{"category": "Glaubensfragen", "tableNames": "Ahlulbayt(a.)"}, ...
      const tableNamesObject = data.reduce((acc, item) => {
        const category = item.category;
        acc[category] =
          (acc[category] || "") +
          (acc[category] ? `, ${item.tableName}` : item.tableName);
        return acc;
      }, {});

      const tableNamesArray = Object.keys(tableNamesObject).map((category) => ({
        category,
        tableNames: tableNamesObject[category],
      }));

      // Store data to Storage
      await AsyncStorage.setItem(
        TABLE_NAMES_KEY,
        JSON.stringify(tableNamesArray)
      );

      // Data to return
      setTableNames(tableNamesArray);

      // Finished fetching
      setisFetchingTable(false);

      // Reset Error
      setFetchErrorTableNames("");
    } catch (error) {
      setTableNames([]);

      // Display error on screen
      setFetchErrorTableNames(ERROR_LOADING_DATA);

      // Show error for debuging
      console.error("Error fetching table names:", error);

      // Initial Fetch not done due to error:
      await AsyncStorage.setItem(FIRST_FETCH_TABLE_NAMES, "false");

      // Not fetching anymore
      setisFetchingTable(false);
    }
  }, []);

  // Get saved items from storage
  const loadItemsFromStorage = useCallback(async () => {
    try {
      // Get stored Data
      const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);
      if (storedTableNames) {
        const parsedTableNames = JSON.parse(storedTableNames);
        setTableNames(parsedTableNames);
        setisFetchingTable(false);
      } else {
        throw new Error("Keine Daten Gefunden");
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      Toast.show({
        type: "error",
        text1: `${error}`,
        text2: CHECK_CONNECTION_RESTART_APP,
      });
    }
  }, []);

  const subscribeToTable = useCallback(async () => {
    const subscription = supabase
      .channel("AllTableNames")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AllTableNames" },
        (payload) => {
          Toast.show({
            type: "info",
            text1: UPDATED_MESSAGE,
          });

          // Refetch Tablenames -> maybe only add new Data instead of Refetch everything!
          fetchTableNames();
          router.navigate("/");
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTableNames]);

  useEffect(() => {
    /* Fetch date when:
       1. First open
       2. Explicit called to do so
       3. Upadtes available
       4. Error while first open
       5. New Version */

    const checkStorageAndFetch = async () => {
      // Get first fetch status from AsyncStorage
      const firstFetch = await AsyncStorage.getItem(FIRST_FETCH_TABLE_NAMES);
      console.log(firstFetch);

      // Add logic to check network status and handle no internet case
      if (
        (isDifferent || firstFetch === "false" || firstFetch === null) &&
        isConnected
      ) {
        await fetchTableNames();
      } else if (isConnected === false && isConnected != null) {
        Toast.show({
          type: "info",
          text1: NO_INTERNET,
          text2: NO_UPADTES_FETCHABLE,
        });
        setFetchErrorTableNames(CHECK_CONNECTION_RESTART_APP);
      } else {
        await loadItemsFromStorage();
        await subscribeToTable();
      }
    };

    checkStorageAndFetch();
  }, [isConnected, isDifferent]);

  return { tableNames, fetchErrorTableNames, isFetchingTable, fetchTableNames };
};
