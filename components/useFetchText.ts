import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Item {
  id: number;
  title: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
  question: string;
}

const createStorageKey = (table: string) => `${table}`;

export const useFetchText = (table: string, title: string) => {
  const [item, setItem] = useState<Item | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsFetching(true);

      const storageKey = createStorageKey(table);
      const storedData = await AsyncStorage.getItem(storageKey);

      if (storedData) {
        const parsedData: Item[] = JSON.parse(storedData);

        // Normalize title by trimming spaces
        const normalizedTitle = title.trim();
        const foundItem =
          parsedData.find((item) => item.title.trim() === normalizedTitle) ||
          null;

        if (foundItem) {
          setItem(foundItem);
        } else {
          setFetchError(`Item with title "${title}" not found in table "${table}"`);
        }
      } else {
        setFetchError(`Stored data not found for table "${table}"`);
      }
    } catch (error) {
      setFetchError(`Error fetching item by title: ${error}`);
      setItem(null);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, title]);

  return { item, fetchError, isFetching };
};
