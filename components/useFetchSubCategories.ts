import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchTableNames } from "./useFetchTableNames";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

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

  const fetchItems = async (specificTableName?: string) => {
    try {
      setIsFetchingSub(true);
      const newSubCategories: TableData[] = [];

      // Fetch data for a specific table if provided
      const fetchTableData = async (tableName: string) => {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("title", { ascending: true });

        if (error) {
          console.error(`Error fetching data for table ${tableName}:`, error);
          throw error;
        }

        if (data) {
          const updatedData = {
            tableName,
            questions: data as SubCategoryItem[],
          };
          // Update state with new data
          setSubCategories((prevSubCategories) => {
            const otherTables = prevSubCategories.filter(
              (item) => item.tableName !== tableName
            );
            return [...otherTables, updatedData];
          });

          // Update AsyncStorage with new data
          await AsyncStorage.setItem(tableName, JSON.stringify(data));
          await AsyncStorage.setItem(INITIAL_FETCH_KEY_SubCategory, "true");
        }
      };

      if (specificTableName) {
        await fetchTableData(specificTableName);
      } else {
        // Fetch all data per TableName from Supabase
        if (tableNames && tableNames.length > 0) {
          for (const table of tableNames) {
            const tablesArray = table.tableNames
              .split(",")
              .map((t) => t.trim());
            for (const tableName of tablesArray) {
              await fetchTableData(tableName);
            }
          }
        }
      }

      setFetchError("");
    } catch (error) {
      setSubCategories([]);
      await AsyncStorage.removeItem(INITIAL_FETCH_KEY_SubCategory);
      setFetchError(
        "Elemente konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internet Verbindung!"
      );
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
      await AsyncStorage.removeItem(INITIAL_FETCH_KEY_SubCategory);
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
                console.log(payload);
                console.log("INSERT");
                Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
                fetchItems(tableName);
                router.navigate("/");
              }
            )
            .on(
              "postgres_changes",
              { event: "UPDATE", schema: "public", table: tableName },
              (payload) => {
                console.log(payload);
                console.log("UPDATE");
                Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
                fetchItems(tableName);
                router.navigate("/");
              }
            )
            .on(
              "postgres_changes",
              { event: "DELETE", schema: "public", table: tableName },
              (payload) => {
                console.log(payload);
                console.log("DELETE");
                Toast.show({type:"info", text1: "Die Fragen und Antworten wurden aktualisiert!"})
                fetchItems(tableName);
                router.navigate("/");
              }
            )
            .subscribe();

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
