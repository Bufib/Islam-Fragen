import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchTableNames } from "./useFetchTableNames";
import { useIsInitialFetching } from "components/fetchStore";
import { Alert } from "react-native";

interface SubCategoryItem {
  id: number;
  title: string;
}

interface TableData {
  tableName: string;
  questions: SubCategoryItem[];
}

// Hook that accepts an optional onFetching callback
export default function useFetchSubCategories() {
  const [fetchError, setFetchError] = useState<string>("");
  const [subCategories, setSubCategories] = useState<TableData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const { tableNames } = useFetchTableNames();
  const { initialFetch, setInitialFetch } = useIsInitialFetching();

  const fetchItems = async () => {
    try {
      setIsFetching(true);

      const newSubCategories: TableData[] = [];

      // Fetch all data per TableName from Supabase
      if (tableNames) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(",").map((t) => t.trim());
          for (const tableName of tablesArray) {
            const { data, error } = await supabase
              .from(tableName)
              .select("*")
              .order("title", { ascending: true });

            if (error) {
              throw error;
            }

            if (data) {
              newSubCategories.push({
                tableName,
                questions: data as SubCategoryItem[],
              });
              await AsyncStorage.setItem(tableName, JSON.stringify(data));
            }
          }
        }
      }
      setSubCategories(newSubCategories);
      setFetchError("");
    } catch (error) {
      setFetchError(
        "Elemente konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internet Verbindung!"
      );
      setSubCategories([]);
    } finally {
      setIsFetching(false);
    
      if (!initialFetch) await setInitialFetch(); // Mark initial fetch as done
    }
  };

  const loadItemsFromStorage = async () => {
    try {
      // Get all the data from the storage
      setIsFetching(true);
     
      const storedCategories: TableData[] = [];
      if (tableNames) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(",").map((t) => t.trim());
          for (const tableName of tablesArray) {
            const storedData = await AsyncStorage.getItem(tableName);
            if (storedData) {
              storedCategories.push({
                tableName,
                questions: JSON.parse(storedData),
              });
            }
          }
        }
      }
      setSubCategories(storedCategories);
    } catch (error) {
      console.log("Failed to load items from storage", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      if (!initialFetch) {
        Alert.alert(
          "Fetching data...",
          "Please wait while we fetch the latest data."
        );
        await fetchItems();
      } else {
        await loadItemsFromStorage();
      }
    };

    checkStorageAndFetch();
  }, [tableNames, initialFetch]);

  return {
    fetchError,
    subCategories,
    refetch: fetchItems,
    isFetching,
  };
}
