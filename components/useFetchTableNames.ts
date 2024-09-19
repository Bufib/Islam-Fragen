// import { useState, useEffect, useCallback } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "utils/supabase";
// import { router } from "expo-router";
// import Toast from "react-native-toast-message";
// import { useHasFetchedTableNames } from "components/hasFetchedTableNamesStore";

// const TABLE_NAMES_KEY = "tableNames";

// interface TableNamesData {
//   tableNames: { category: string; tableNames: string }[];
//   isFetchingTable: boolean;
//   fetchErrorTableNames: string;
//   fetchTableNames: () => Promise<void>;
// }

// export const useFetchTableNames = (): TableNamesData => {
//   const { hasFetchedTableNames, setHasFetchedTableNames } =
//     useHasFetchedTableNames();
//   const [tableNames, setTableNames] = useState<
//     { category: string; tableNames: string }[]
//   >([]);
//   const [fetchErrorTableNames, setFetchErrorTableNames] = useState<string>("");
//   const [isFetchingTable, setisFetchingTable] = useState<boolean>(true);

//   const fetchTableNames = useCallback(async () => {
//     setisFetchingTable(true);
//     try {
//       const { data, error } = await supabase
//         .from("AllTableNames")
//         .select("*")
//         .order("tableName", { ascending: true });

//       if (error) {
//         throw new Error(error.message);
//       }

//       const tableNamesObject = data.reduce((acc, item) => {
//         const category = item.category;
//         acc[category] =
//           (acc[category] || "") +
//           (acc[category] ? `, ${item.tableName}` : item.tableName);
//         return acc;
//       }, {});

//       const tableNamesArray = Object.keys(tableNamesObject).map((category) => ({
//         category,
//         tableNames: tableNamesObject[category],
//       }));

//       await AsyncStorage.setItem(
//         TABLE_NAMES_KEY,
//         JSON.stringify(tableNamesArray)
//       );
//       setHasFetchedTableNames(true);

//       setTableNames(tableNamesArray);
//       setisFetchingTable(false);
//       setFetchErrorTableNames("");
//     } catch (error) {
//       setTableNames([]);
//       setHasFetchedTableNames(false);
//       setFetchErrorTableNames(
//         "Fehler beim Laden der Fragen. Bitte überpüfe deine Internetverbindung und versuch es zu einem späteren Zeitpunkt nochmal!"
//       );
//       console.error("Error fetching table names:", error);
//       setisFetchingTable(false);
//     }
//   }, []);

//   const loadItemsFromStorage = useCallback(async () => {
//     try {
//       const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);
//       if (storedTableNames) {
//         const parsedTableNames = JSON.parse(storedTableNames);
//         setTableNames(parsedTableNames);
//         setisFetchingTable(false);
//       } else {
//         throw new Error("Error loading initial data:");
//       }
//     } catch (error) {
//       console.error("Error loading initial data:", error);
//       setHasFetchedTableNames(false);
//     }
//   }, []);

//   const subscribeToTable = useCallback(async () => {
//     const subscription = supabase
//       .channel("AllTableNames")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "AllTableNames" },
//         (payload) => {
//           Toast.show({
//             type: "info",
//             text1: "Die Fragen und Antworten wurden aktualisiert!",
//           });
//           fetchTableNames();
//           router.navigate("/");
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [fetchTableNames]);

//   useEffect(() => {
//     const checkStorageAndFetch = async () => {
//       if (hasFetchedTableNames === true) {
//         await subscribeToTable();
//         await loadItemsFromStorage();
//       } else {
//         await fetchTableNames();
//       }
//     };

//     checkStorageAndFetch();
//   }, [loadItemsFromStorage, subscribeToTable, fetchTableNames]);

//   return { tableNames, fetchErrorTableNames, isFetchingTable, fetchTableNames };
// };

import { useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useHasFetchedTableNames } from "components/hasFetchedTableNamesStore";
import { useQuery } from "@tanstack/react-query";

const TABLE_NAMES_KEY = "tableNames";

interface TableNamesData {
  tableNames: { category: string; tableNames: string }[];
  isFetchingTable: boolean;
  fetchErrorTableNames: string;
  fetchTableNames: () => void;
}

const fetchTableNamesFromSupabase = async () => {
  const { data, error } = await supabase
    .from("AllTableNames")
    .select("*")
    .order("tableName", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const tableNamesObject = data.reduce((acc, item) => {
    const category = item.category;
    acc[category] =
      (acc[category] || "") +
      (acc[category] ? `, ${item.tableName}` : item.tableName);
    return acc;
  }, {});

  const tableNamesArray = Object.keys(tableNamesObject).map((category) => ({
    category,
    tableNames: tableNamesObject[category],
  }));

  await AsyncStorage.setItem(TABLE_NAMES_KEY, JSON.stringify(tableNamesArray));

  return tableNamesArray;
};

export const useFetchTableNames = (): TableNamesData => {
  const { hasFetchedTableNames, setHasFetchedTableNames } =
    useHasFetchedTableNames();

  const {
    data: tableNames = [],
    error: fetchErrorTableNames,
    fetchStatus, // Now using fetchStatus to monitor the fetch lifecycle
    isError,
    isSuccess,
    refetch: fetchTableNames,
  } = useQuery({
    queryKey: ["tableNames"],
    queryFn: fetchTableNamesFromSupabase,
    enabled: !hasFetchedTableNames,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  // Handling states manually based on the result
  useEffect(() => {
    if (isError) {
      setHasFetchedTableNames(false);
    }
    if (isSuccess) {
      setHasFetchedTableNames(true);
    }
  }, []);

  const loadItemsFromStorage = useCallback(async () => {
    try {
      const storedTableNames = await AsyncStorage.getItem(TABLE_NAMES_KEY);
      if (storedTableNames) {
        const parsedTableNames = JSON.parse(storedTableNames);
        setHasFetchedTableNames(true);
      } else {
        throw new Error("Error loading initial data:");
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setHasFetchedTableNames(false);
    }
  }, []);

  const subscribeToTable = useCallback(async () => {
    const subscription = supabase
      .channel("AllTableNames")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AllTableNames" },
        (payload) => {
          Toast.show({
            type: "info",
            text1: "Die Fragen und Antworten wurden aktualisiert!",
          });
          fetchTableNames();
          router.navigate("/");
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchTableNames]);

  useEffect(() => {
    const checkStorageAndFetch = async () => {
      if (hasFetchedTableNames === true) {
        await subscribeToTable();
        await loadItemsFromStorage();
      } else {
        await fetchTableNames();
      }
    };

    checkStorageAndFetch();
  }, [loadItemsFromStorage, subscribeToTable, fetchTableNames, hasFetchedTableNames]);

  return {
    tableNames,
    fetchErrorTableNames: fetchErrorTableNames ? fetchErrorTableNames.message : "",
    isFetchingTable: fetchStatus === 'fetching',
    fetchTableNames,
  };
};
