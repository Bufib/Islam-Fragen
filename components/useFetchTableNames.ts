import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";

const TABLE_NAMES_KEY = "tableNames";
const INITIAL_FETCH_KEY_Table = "initialFetchDoneTable";

interface TableNamesData {
  tableNames: { category: string; tableNames: string }[];
  tableNamesLoading: boolean;
  fetchError: string;
}

export const useFetchTableNames = (): TableNamesData => {
  const [tableNames, setTableNames] = useState<
    { category: string; tableNames: string }[]
  >([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [tableNamesLoading, setTableNamesLoading] = useState<boolean>(true);

  const fetchTableNames = async () => {
    setTableNamesLoading(true);
    try {
      const { data, error } = await supabase
        .from("All table Names")
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
      setTableNamesLoading(false);
    } catch (error) {
      setFetchError(
        "Error fetching data. Please check your connection and try again."
      );
      console.error("Error fetching table names:", error);
      setTableNamesLoading(false);
    }
  };

  const loadItemsFromStorage = async () => {
    try {
      const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);
      if (storedTableNames) {
        const parsedTableNames = JSON.parse(storedTableNames);
        setTableNames(parsedTableNames);
        setTableNamesLoading(false);
      } else {
        throw new Error("Error loading initial data:");
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  };

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      const initialFetchDone = await AsyncStorage.getItem(
        INITIAL_FETCH_KEY_Table
      );
      if (initialFetchDone === "true") {
        await loadItemsFromStorage();
      } else {
        await fetchTableNames();
      }
    };

    checkStorageAndFetch();
  }, [INITIAL_FETCH_KEY_Table]);

  return { tableNames, fetchError, tableNamesLoading };
};
