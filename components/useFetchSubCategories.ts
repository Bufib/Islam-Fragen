import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchTableNames } from "./useFetchTableNames";
import { Alert } from "react-native";

interface SubCategoryItem {
  id: number;
  title: string;
}

interface TableData {
  tableName: string;
  questions: SubCategoryItem[];
}

const INITIAL_FETCH_KEY_SubCategory = "initialFetchDoneSub";

export default function useFetchSubCategories() {
  const [fetchError, setFetchError] = useState<string>("");
  const [subCategories, setSubCategories] = useState<TableData[]>([]);
  const [isFetchingSub, setIsFetchingSub] = useState(false);
  const { tableNames } = useFetchTableNames();

  const fetchItems = async () => {
    try {
      setIsFetchingSub(true);
      const newSubCategories: TableData[] = [];
      // Fetch all data per TableName from Supabase
      if (tableNames && tableNames.length > 0) {
        for (const table of tableNames) {
          const tablesArray = table.tableNames.split(",").map((t) => t.trim());
          for (const tableName of tablesArray) {
            const { data, error } = await supabase
              .from(tableName)
              .select("*")
              .order("title", { ascending: true });

            if (error) {
              console.error(
                `Error fetching data for table ${tableName}:`,
                error
              );
              throw error;
            }

            if (data) {
              newSubCategories.push({
                tableName,
                questions: data as SubCategoryItem[],
              });
              await AsyncStorage.setItem(tableName, JSON.stringify(data));
              await AsyncStorage.setItem(INITIAL_FETCH_KEY_SubCategory, "true");
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
      console.error("Error fetching items:", error);
    } finally {
      setIsFetchingSub(false);
    }
  };

  const loadItemsFromStorage = async () => {
    try {
      setIsFetchingSub(true);

      const storedCategories: TableData[] = [];
      if (tableNames && tableNames.length > 0) {
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
      } else {
        console.log("No table names available to load data from storage.");
      }
      setSubCategories(storedCategories);
      console.log("Loaded items from AsyncStorage successfully.");
    } catch (error) {
      console.log("Failed to load items from storage", error);
    } finally {
      setIsFetchingSub(false);
    }
  };

  const subscribeToTable = async () => {
    if (tableNames && tableNames.length > 0) {
      const subscriptions = [];
      for (const table of tableNames) {
        const tablesArray = table.tableNames.split(",").map((t) => t.trim());
        for (const tableName of tablesArray) {
          const subscription = supabase
            .channel(tableName)
            .on(
              "postgres_changes",
              { event: "INSERT", schema: "public", table: tableName },
              (payload) => {
                console.log(payload)
                console.log("INSERT")
                fetchItems();
              }
            )
            .on(
              "postgres_changes",
              { event: "UPDATE", schema: "public", table: tableName },
              (payload) => {
                console.log(payload)
                console.log("UPDATE")
                fetchItems();
              }
            )
            .on(
              "postgres_changes",
              { event: "DELETE", schema: "public", table: tableName },
              (payload) => {
                console.log(payload)
                console.log("DELETE")
                fetchItems();
              }
            )
            .subscribe(status => console.log(status));

          subscriptions.push(subscription);
        }
      }

      return () => {
        subscriptions.forEach((subscription) => subscription.unsubscribe());
      };
    }
  };

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      const initialFetchDone = await AsyncStorage.getItem(
        INITIAL_FETCH_KEY_SubCategory
      );
      
      if (initialFetchDone == "true") {
        await subscribeToTable();
        await loadItemsFromStorage();
      } else {
        await fetchItems();
      }
    };

    checkStorageAndFetch();
  }, [tableNames]);

  return {
    fetchError,
    subCategories,
    refetch: fetchItems,
    isFetchingSub,
  };
}
