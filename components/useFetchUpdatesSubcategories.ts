import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface SubCategoryItem {
  id: number;
  title: string;
}

interface TableData {
  tableName: string;
  questions: SubCategoryItem[];
}

export default function useFetchUpdatesSubcategories(tableName: string) {
  const [fetchErrorUpdate, setFetchErrorUpdate] = useState<string>("");
  const [subCategoriesUpdate, setSubCategoriesUpdate] = useState<TableData[]>([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const fetchUpdates = async (showToast: boolean = false) => {
    try {
      if (showToast) {
        Toast.show({
          type: "info",
          text1: "Fragen und Antworten werden aktualisiert!",
        });
      }
      setIsUpdating(true);
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("title", { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const newTopCategories: TableData[] = [
          {
            tableName,
            questions: data as SubCategoryItem[],
          },
        ];

        setSubCategoriesUpdate(newTopCategories);
        await AsyncStorage.setItem(tableName, JSON.stringify(data));
      }

      setFetchErrorUpdate("");
      if (showToast) {
        Toast.show({
          type: "info",
          text1: "Aktualisierung fertig!",
        });
      }
    } catch (error) {
      setFetchErrorUpdate(
        "Elemente konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internet Verbindung!"
      );
      setSubCategoriesUpdate([]);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const loadItemsFromStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem(tableName);
        if (storedData) {
          setSubCategoriesUpdate([
            {
              tableName,
              questions: JSON.parse(storedData),
            },
          ]);
        } else {
          await fetchUpdates(false);  // Fetch without showing toast
        }
        setInitialLoad(false);
      } catch (error) {
        console.log("Failed to load items from storage", error);
      }
    };

    loadItemsFromStorage();

    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: tableName },
        async (payload) => {
          console.log(`Received event on table ${tableName}:`, payload);
          await fetchUpdates(true);  // Fetch with showing toast
          setUpdateAvailable(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: tableName },
        async (payload) => {
          console.log(`Received event on table ${tableName}:`, payload);
          await fetchUpdates(true);  // Fetch with showing toast
          setUpdateAvailable(true);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: tableName },
        async (payload) => {
          console.log(`Received event on table ${tableName}:`, payload);
          await fetchUpdates(true);  // Fetch with showing toast
          setUpdateAvailable(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [tableName]);

  const applyUpdates = () => {
    setUpdateAvailable(false);
  };

  return {
    fetchErrorUpdate,
    subCategoriesUpdate,
    fetchUpdates,
    updateAvailable,
    applyUpdates,
    isUpdating,
  };
}
