// useTableNames.ts
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";

const TABLE_NAMES_KEY = "tableNames";
const INITIAL_FETCH_KEY = "initialFetchDone";

interface TableNamesData {
  tableNames: string[] | null;
  tableNamesLoading: boolean;
  refetchTableNames: () => void;
}

export const useFetchTableNames = (): TableNamesData => {
  const [tableNames, setTableNames] = useState<string[] | null>(null);
  const [tableNamesLoading, setTableNamesLoading] = useState<boolean>(true);

  const fetchTableNames = useCallback(async () => {
    try {
      setTableNamesLoading(true);
      const { data, error } = await supabase
        .from("All table Names")
        .select("tableName");

      if (error) {
        throw new Error(error.message);
      } else {
        const tableNamesList = data.map((item) => item.tableName);
        await AsyncStorage.setItem(
          TABLE_NAMES_KEY,
          JSON.stringify(tableNamesList)
        );
        await AsyncStorage.setItem(INITIAL_FETCH_KEY, "true");
        setTableNames(tableNamesList);
        setTableNamesLoading(false);
      }
    } catch (error) {
      console.error("Error fetching table names:", error);
      setTableNamesLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialFetchDone = await AsyncStorage.getItem(INITIAL_FETCH_KEY);

      if (initialFetchDone === "true") {
        const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);

        if (storedTableNames) {
          setTableNames(JSON.parse(storedTableNames));
        }
        setTableNamesLoading(false);
      } else {
        fetchTableNames();
      }
    };
    loadInitialData();

    // Set up real-time subscriptions to listen to changes
    const channel = supabase
      .channel("All table Names")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "All table Names" },
        (payload) => {
          console.log("Table names change received!", payload);
          fetchTableNames(); // Refetch data when a change occurs
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTableNames]);

  const refetchTableNames = useCallback(() => {
    setTableNamesLoading(true);
    fetchTableNames();
  }, [fetchTableNames]);

  return { tableNames, tableNamesLoading, refetchTableNames };
};
