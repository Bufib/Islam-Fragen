import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetSuperCategories } from "components/useGetSuperCategories";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  ERROR_LOADING_DATA,
  NO_UPADTES_FETCHABLE,
  NO_INTERNET,
} from "components/messages";
import useNetworkStore from "./useNetworkStore";
import useVersionStore from "components/versionStore";
interface SubCategoryItem {
  id: number;
  title: string;
}

interface TableData {
  tableName: string;
  questions: SubCategoryItem[];
}

const FIRST_FETCH_SUBCATEGORY = "firstFetchSubCategory";

export default function useGetCategories() {
  const [fetchErrorSuperCategories, setFetchErrorSuperCategories] =
    useState<string>("");
  const [subCategories, setSubCategories] = useState<TableData[]>([]);
  const [isFetchingSub, setIsFetchingSub] = useState(false);
  const { tableNames } = useGetSuperCategories();
  const isConnected = useNetworkStore((state) => state.isConnected);
  const { isDifferent, setIsEqual } = useVersionStore();

  const fetchSuperCategories = async (specificTableName?: string) => {
    try {
      setIsFetchingSub(true);
      // Fetch data for a specific table if provided
      const fetchTableData = async (tableName: string) => {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("title", { ascending: true });

        if (error) {
          console.error(`Error fetching data for table ${tableName}:`, error);
          throw new Error(error.message);
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
      setFetchErrorSuperCategories("");
      await AsyncStorage.setItem(FIRST_FETCH_SUBCATEGORY, "true");
      // Refetched now we can say the version is equal
      setIsEqual();
    } catch (error) {
      setSubCategories([]);
      setFetchErrorSuperCategories(ERROR_LOADING_DATA);
      console.error("Error fetching items:", error);
      await AsyncStorage.setItem(FIRST_FETCH_SUBCATEGORY, "false");
    } finally {
      setIsFetchingSub(false);
    }
  };

  const loadItemsFromStorage = async () => {
    try {
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
        throw new Error();
      }
      setSubCategories(storedCategories);
      console.log("Loaded items from AsyncStorage successfully.");
    } catch (error) {
      console.log("Failed to load items from storage");
    } finally {
      setIsFetchingSub(false);
    }
  };

  const subscribeToTable = async () => {
    if (tableNames && tableNames.length > 0) {
      const subscriptions: any = [];
      for (const table of tableNames) {
        const tablesArray = table.tableNames.split(",").map((t) => t.trim());
        for (const tableName of tablesArray) {
          const subscription = supabase
            .channel(tableName)
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: tableName },
              (payload) => {
                Toast.show({
                  type: "info",
                  text1: "Die Fragen und Antworten wurden aktualisiert!",
                });
                fetchSuperCategories(tableName);
                router.navigate("/");
              }
            )
            .subscribe();
          subscriptions.push(subscription);
        }
      }

      return () => {
        subscriptions.forEach((subscription: any) =>
          subscription.unsubscribe()
        );
      };
    }
  };

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      // Get first fetch status from AsyncStorage
      const firstFetch = await AsyncStorage.getItem(FIRST_FETCH_SUBCATEGORY);

      if (!tableNames || tableNames.length === 0) {
        console.log("Table names not yet available.");
        return;
      }
      // Add logic to check network status and handle no internet case
      if (
        (isDifferent || firstFetch === "false" || firstFetch === null) &&
        isConnected
      ) {
        await fetchSuperCategories();
      } else if (isConnected === false && isConnected != null) {
        Toast.show({
          type: "info",
          text1: NO_INTERNET,
          text2: NO_UPADTES_FETCHABLE,
        });
        await loadItemsFromStorage();
      } else {
        await loadItemsFromStorage();
        await subscribeToTable();
      }
    };

    checkStorageAndFetch();
  }, [isConnected, tableNames]);

  return {
    fetchErrorSuperCategories,
    subCategories,
    fetchSuperCategories,
    isFetchingSub,
  };
}
