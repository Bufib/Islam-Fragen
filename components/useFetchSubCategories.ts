import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useFetchTableNames } from "./useFetchTableNames";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TopCategoryItem {
  id: number;
  title: string;
}

interface TableData {
  tableName: string;
  questions: TopCategoryItem[];
}

export default function useFetchSubCategories() {
  const [fetchError, setFetchError] = useState<string>("");
  const [subCategories, setSubCategories] = useState<TableData[]>([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { tableNames } = useFetchTableNames();

  const fetchItems = async () => {
    try {
      setIsFetching(true);
      const newTopCategories: TableData[] = [];
      if (tableNames) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(',').map(t => t.trim());
          for (const tableName of tablesArray) {
            const { data, error } = await supabase
              .from(tableName)
              .select("*")
              .order("title", { ascending: true });

            if (error) {
              throw error;
            }

            if (data) {
              newTopCategories.push({ tableName, questions: data as TopCategoryItem[] });
              await AsyncStorage.setItem(tableName, JSON.stringify(data));
            }
          }
        }
      }
      setSubCategories(newTopCategories);
      setFetchError("");
    } catch (error) {
      setFetchError(
        "Elemente konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internet Verbindung!"
      );
      setSubCategories([]);
    } finally {
      setIsFetching(false);
    }
  };

  const loadItemsFromStorage = async () => {
    try {
      const storedCategories: TableData[] = [];
      if (tableNames) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(',').map(t => t.trim());
          for (const tableName of tablesArray) {
            const storedData = await AsyncStorage.getItem(tableName);
            if (storedData) {
              storedCategories.push({ tableName, questions: JSON.parse(storedData) });
            }
          }
        }
      }
      setSubCategories(storedCategories);
    } catch (error) {
      console.log("Failed to load items from storage", error);
    }
  };

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      const storedCategories: TableData[] = [];
      let needsFetch = false;

      if (tableNames) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(',').map(t => t.trim());
          for (const tableName of tablesArray) {
            const storedData = await AsyncStorage.getItem(tableName);
            if (storedData) {
              storedCategories.push({ tableName, questions: JSON.parse(storedData) });
            } else {
              needsFetch = true;
            }
          }
        }
      }

      if (storedCategories.length > 0) {
        setSubCategories(storedCategories);
      }

      if (needsFetch) {
        await fetchItems();
      }
    };

    loadItemsFromStorage().then(checkStorageAndFetch);

    if (tableNames) {
      const subscriptions = tableNames.flatMap((table) => {
        const tablesArray = table.tableNames.split(',').map(t => t.trim());
        return tablesArray.map((tableName) => 
          supabase
            .channel("public:" + tableName)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: tableName },
              async (payload) => {
                await fetchItems();
                setUpdateAvailable(true);
              }
            )
            .subscribe()
        );
      });

      return () => {
        subscriptions.forEach((subscription) => {
          supabase.removeChannel(subscription);
        });
      };
    }
  }, [tableNames]);

  const applyUpdates = () => {
    setUpdateAvailable(false);
  };

  return {
    fetchError,
    subCategories,
    refetch: fetchItems,
    updateAvailable,
    applyUpdates,
    isFetching,
  };
}
