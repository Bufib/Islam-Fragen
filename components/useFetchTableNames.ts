import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const TABLE_NAMES_KEY = "tableNames";
const INITIAL_FETCH_KEY_Table = "initialFetchDoneTable";

interface TableNamesData {
  tableNames: { category: string; tableNames: string }[];
  isFetchinTable: boolean;
  fetchError: string;
  fetchTableNames: () => Promise<void>;
}

export const useFetchTableNames = (): TableNamesData => {
  const [tableNames, setTableNames] = useState<
    { category: string; tableNames: string }[]
  >([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [isFetchinTable, setIsFetchinTable] = useState<boolean>(true);

  const fetchTableNames = useCallback(async () => {
    setIsFetchinTable(true);
    try {
      const { data, error } = await supabase
        .from("AllTableNames")
        .select("*")
        .order("tableName", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

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

      await AsyncStorage.setItem(
        TABLE_NAMES_KEY,
        JSON.stringify(tableNamesArray)
      );
      await AsyncStorage.setItem(INITIAL_FETCH_KEY_Table, "true");

      setTableNames(tableNamesArray);
      setIsFetchinTable(false);
      setFetchError("");
    } catch (error) {
      setTableNames([]);
      await AsyncStorage.removeItem(INITIAL_FETCH_KEY_Table);
      setFetchError(
        "Fehler beim Laden der Fragen. Bitte überpüfe deine Internetverbindung und versuch es zu einem späteren Zeitpunkt nochmal!"
      );
      console.error("Error fetching table names:", error);
      setIsFetchinTable(false);
    }
  }, []);

  const loadItemsFromStorage = useCallback(async () => {
    try {
      const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);
      if (storedTableNames) {
        const parsedTableNames = JSON.parse(storedTableNames);
        setTableNames(parsedTableNames);
        setIsFetchinTable(false);
      } else {
        throw new Error("Error loading initial data:");
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      await AsyncStorage.removeItem(INITIAL_FETCH_KEY_Table);
    }
  }, []);

  const subscribeToTable = useCallback(async () => {
    const subscription = supabase
      .channel("AllTableNames")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "AllTableNames" },
        (payload) => {
          Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
          fetchTableNames();
          router.navigate("/")

        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "AllTableNames" },
        (payload) => {
          Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
          fetchTableNames();
          router.navigate("/")
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "AllTableNames" },
        (payload) => {
          Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
          fetchTableNames();
          router.navigate("/")
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTableNames]);

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      const initialFetchDone = await AsyncStorage.getItem(
        INITIAL_FETCH_KEY_Table
      );
      if (initialFetchDone === "true") {
        await subscribeToTable();
        await loadItemsFromStorage();
      } else {
        await fetchTableNames();
      }
    };

    checkStorageAndFetch();
  }, [loadItemsFromStorage, subscribeToTable, fetchTableNames]);

  return { tableNames, fetchError, isFetchinTable, fetchTableNames };
};
