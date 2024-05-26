import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Item {
  id: number;
  title: string;
  text: string;
}

const createStorageKey = (category: string) => `supabaseData-${category}`;

export default function useFetchCategory(categories: string[]) {
  const [fetchError, setFetchError] = useState<string>("");
  const [items, setItems] = useState<Record<string, Item[]>>({});

  const fetchItems = async (
    category: string,
    setItems: React.Dispatch<React.SetStateAction<Record<string, Item[]>>>
  ) => {
    const { data, error } = await supabase
      .from(category)
      .select("*")
      .order("title", { ascending: true });

    if (error) {
      setFetchError(
        `Elemente konnten nicht geladen werden für ${category}.\n Überprüfen Sie bitte Ihre Internet Verbindung!`
      );
      setItems((prevItems) => ({ ...prevItems, [category]: [] }));
      await AsyncStorage.setItem(createStorageKey(category), JSON.stringify([]));
    }

    if (data) {
      setItems((prevItems) => ({ ...prevItems, [category]: data }));
      setFetchError("");
      await AsyncStorage.setItem(createStorageKey(category), JSON.stringify(data));
    }
  };

  const loadItemsFromStorage = async (
    category: string,
    setItems: React.Dispatch<React.SetStateAction<Record<string, Item[]>>>
  ) => {
    const storedData = await AsyncStorage.getItem(createStorageKey(category));
    if (storedData) {
      setItems((prevItems) => ({ ...prevItems, [category]: JSON.parse(storedData) }));
    }
  };

  useEffect(() => {
    // Load initial data from AsyncStorage
    categories.forEach((category) => {
      loadItemsFromStorage(category, setItems);
    });

    // Fetch initial data from Supabase
    categories.forEach((category) => {
      fetchItems(category, setItems);
    });

    // Set up real-time subscriptions for each category
    const channels = categories.map((category) =>
      supabase
        .channel(`table-data-${category}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: category },
          () => {
            console.log(`Change received in ${category}!`);
            fetchItems(category, setItems);
          }
        )
        .subscribe()
    );

    // Cleanup subscriptions on unmount
    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [categories]);

  return {
    fetchError,
    items,
  };
}
