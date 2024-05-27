import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/utils/supabase";
import useFetchSubCategories from "./useFetchSubCategories";

interface Item {
  id: number;
  title: string;
  text: string;
}

interface TableData {
  tableName: string;
  questions: Item[];
}

const createStorageKey = (table: string) => `supabaseData-${table}`;

export const useFetchText = (table: string, title: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { subCategories, refetch } = useFetchSubCategories();

  const fetchData = async () => {
    try {
      setIsFetching(true);
      await refetch();

      const storageKey = createStorageKey(table);
      const storedData = await AsyncStorage.getItem(storageKey);
      if (storedData) {
        console.log("Stored data found:", storedData);
        const parsedData: TableData[] = JSON.parse(storedData);
        for (const subCategory of parsedData) {
          if (subCategory.tableName === table) {
            const foundItem = subCategory.questions.find((item: Item) => item.title === title) || null;
            if (foundItem) {
              setItem(foundItem);
              setIsFetching(false);
              return;
            }
          }
        }
      }

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("title", title)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newItem = data as Item;
        setItem(newItem);

        const newStoredData = storedData ? JSON.parse(storedData) : [];
        const updatedStoredData = newStoredData.map((subCategory: TableData) => {
          if (subCategory.tableName === table) {
            subCategory.questions.push(newItem);
          }
          return subCategory;
        });

        await AsyncStorage.setItem(storageKey, JSON.stringify(updatedStoredData));
      } else {
        setFetchError(`Item with title "${title}" not found in table "${table}"`);
      }
    } catch (error) {
      console.error(`Error fetching item by title: ${error}`);
      setFetchError(`Error fetching item by title: ${error}`);
      setItem(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();

    const subscription = supabase
      .channel(`public:${table}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table }, (payload) => {
        fetchData();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table }, (payload) => {
        fetchData();
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table }, (payload) => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [table, title]);

  return { item, fetchError, isFetching };
};
