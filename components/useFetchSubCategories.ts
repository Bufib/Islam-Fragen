import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useFetchTableNames } from "./useFetchTableNames";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TopCategoryItem {
  id: number;
  title: string;
  // weitere Felder je nach Schema Ihrer Tabellen
}

export default function useFetchSubCategories() {
  const [fetchError, setFetchError] = useState<string>("");
  const [subCategories, setSubCategories] = useState<TopCategoryItem[]>([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { tableNames } = useFetchTableNames();
console.log(tableNames)
  const fetchItems = async () => {
    try {
      setIsFetching(true);
      const newTopCategories: TopCategoryItem[] = [];
      if (tableNames) {
        for (const tableName of tableNames) {
          const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .order("title", { ascending: true });

          if (error) {
            throw Error;
          }

          if (data) {
            newTopCategories.push(...(data as TopCategoryItem[]));
            await AsyncStorage.setItem(tableName, JSON.stringify(data));
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
      const storedCategories: TopCategoryItem[] = [];
      if (tableNames) {
        for (const tableName of tableNames) {
          const storedData = await AsyncStorage.getItem(tableName);
          if (storedData) {
            storedCategories.push(...JSON.parse(storedData));
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
      const storedCategories: TopCategoryItem[] = [];
      let needsFetch = false;

      if (tableNames) {
        for (const tableName of tableNames) {
          const storedData = await AsyncStorage.getItem(tableName);
          if (storedData) {
            storedCategories.push(...JSON.parse(storedData));
          } else {
            needsFetch = true;
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
      const subscriptions = tableNames.map((tableName) =>
        supabase
          .channel(tableName)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: tableName },
            async (payload) => {
              await fetchItems();
              setUpdateAvailable(false);
            }
          )
          .subscribe()
      );

      return () => {
        subscriptions.forEach((subscription) => {
          subscription.unsubscribe();
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
