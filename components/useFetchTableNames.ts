import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";

const TABLE_NAMES_KEY = "tableNames";
const INITIAL_FETCH_KEY = "initialFetchDone";
const DEFAULT_CATEGORY = "Uncategorized";

interface TableNamesData {
  tableNames: { category: string; tableNames: string }[];
  tableNamesLoading: boolean;
  refetchTableNames: () => void;
  fetchError: string;
}

export const useFetchTableNames = (): TableNamesData => {
  AsyncStorage.clear();
  const [tableNames, setTableNames] = useState<
    { category: string; tableNames: string }[]
  >([]);
  const [fetchError, setFetchError] = useState<string>("");
  const [tableNamesLoading, setTableNamesLoading] = useState<boolean>(true);

  const fetchTableNames = useCallback(async () => {
    try {
      setTableNamesLoading(true);
      console.log("Fetching table names from Supabase...");

      const { data, error } = await supabase
        .from("All table Names")
        .select("*");
      if (error) {
        throw new Error(error.message);
      } else {
        console.log("Data fetched from Supabase:", data);

        const tableNamesObject: { [category: string]: string } = {};

        data.forEach((item) => {
          const category = item.category || DEFAULT_CATEGORY;
          if (!tableNamesObject[category]) {
            tableNamesObject[category] = item.tableName;
          } else {
            tableNamesObject[category] += `, ${item.tableName}`;
          }
        });

        const tableNamesArray = Object.keys(tableNamesObject).map(
          (category) => ({
            category,
            tableNames: tableNamesObject[category],
          })
        );

        console.log("Processed table names array:", tableNamesArray);

        await AsyncStorage.setItem(
          TABLE_NAMES_KEY,
          JSON.stringify(tableNamesArray)
        );
        await AsyncStorage.setItem(INITIAL_FETCH_KEY, "true");

        console.log("Stored table names in AsyncStorage:", tableNamesArray);

        setTableNames(tableNamesArray);
        setTableNamesLoading(false);
      }
    } catch (error) {
      setFetchError(
        "Fehler: Bitte überprüfe deine Internetverbindung und versuch es später nochmal"
      );
      console.error("Error fetching table names:", error);
      setTableNamesLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      console.log("Loading initial data from AsyncStorage...");
      const initialFetchDone = await AsyncStorage.getItem(INITIAL_FETCH_KEY);

      if (initialFetchDone === "true") {
        const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);

        if (storedTableNames) {
          const parsedTableNames = JSON.parse(storedTableNames);
          console.log(
            "Loaded and parsed table names from AsyncStorage:",
            parsedTableNames
          );
          setTableNames(parsedTableNames);
          setTableNamesLoading(false);
        } else {
          fetchTableNames();
        }
      } else {
        fetchTableNames();
      }
    };
    loadInitialData();

    // Set up real-time subscriptions to listen to changes
    const channel = supabase
      .channel("public:All table Names")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "All table Names" },
        (payload) => {
          console.log("Table names change received!", payload);
          fetchTableNames(); // Refetch data when a change occurs
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "All table Names" },
        (payload) => {
          console.log("Table names change received!", payload);
          fetchTableNames(); // Refetch data when a change occurs
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "All table Names" },
        (payload) => {
          console.log("Table names change received!", payload);
          fetchTableNames(); // Refetch data when a change occurs
        }
      )
      .subscribe();

    console.log("Subscription setup completed.");

    return () => {
      console.log("Cleaning up subscription...");
      supabase.removeChannel(channel);
    };
  }, [fetchTableNames]);

  const refetchTableNames = useCallback(() => {
    setTableNamesLoading(true);
    fetchTableNames();
  }, [fetchTableNames]);

  return { tableNames, fetchError, tableNamesLoading, refetchTableNames };
};
