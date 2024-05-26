import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import { useFetchTableNames } from "./useFetchTableNames"; // Importing useFetchTableNames

interface SupabaseData<T> {
  data: Record<string, T[]> | null;
  loading: boolean;
  refetchData: () => void;
}

// Function to create a unique storage key for each table item
const createStorageKey = (tableName: string, id: string | number) => `supabaseData-${tableName}-${id}`;
const INITIAL_FETCH_KEY = "initialFetchDone";

export const useFetchAllAnswersFromAllTables = <T extends { id: string | number }>(): SupabaseData<T> => {
  const { tableNames, tableNamesLoading, refetchTableNames } = useFetchTableNames();
  const [data, setData] = useState<Record<string, T[]> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!tableNames || tableNames.length === 0) return;

    try {
      const allTableData: Record<string, T[]> = {};
      for (const tableName of tableNames) {
        const { data, error } = await supabase.from(tableName).select("*");

        if (error) {
          console.error(`Error fetching data from ${tableName}:`, error);
          continue;
        } else {
          allTableData[tableName] = data;
          // Store each item in AsyncStorage individually
          for (const item of data) {
            await AsyncStorage.setItem(createStorageKey(tableName, item.id), JSON.stringify(item));
          }
        }
      }
      await AsyncStorage.setItem(INITIAL_FETCH_KEY, "true");
      setData(allTableData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [tableNames]);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialFetchDone = await AsyncStorage.getItem(INITIAL_FETCH_KEY);

      if (initialFetchDone === "true" && tableNames) {
        const allTableData: Record<string, T[]> = {};
        for (const tableName of tableNames) {
          const storedData: T[] = [];
          const keys = await AsyncStorage.getAllKeys();
          for (const key of keys) {
            if (key.startsWith(`${tableName}-`)) {
              const item = await AsyncStorage.getItem(key);
              if (item) {
                storedData.push(JSON.parse(item));
              }
            }
          }
          allTableData[tableName] = storedData;
        }
        setData(allTableData);
        setLoading(false);
      } else {
        fetchData();
      }
    };

    if (!tableNamesLoading) {
      loadInitialData();
    }

    // Set up real-time subscriptions
    if (tableNames) {
      const channels = tableNames.map(tableName => 
        supabase
          .channel(`table-data-${tableName}`)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: tableName },
            (payload) => {
              console.log(`Change received in ${tableName}!`, payload);
              fetchData(); // Refetch data when a change occurs
            }
          )
          .subscribe()
      );

      return () => {
        channels.forEach(channel => supabase.removeChannel(channel));
      };
    }
  }, [fetchData, tableNames, tableNamesLoading]);

  useEffect(() => {
    if (!tableNamesLoading && tableNames) {
      fetchData();
    }
  }, [tableNames, tableNamesLoading, fetchData]);

  const refetchData = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, refetchData };
};
