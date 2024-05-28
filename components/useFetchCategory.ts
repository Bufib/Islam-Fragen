// import { supabase } from "@/utils/supabase";
// import { useEffect, useState, useCallback } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// interface Item {
//   id: number;
//   title: string;
//   text: string;
// }

// const topCategories = ["Rechtsfragen", "Glaubensfragen", "Quran", "Ethik", "Historie", "Ratschläge"];
// const createStorageKey = (category: string) => `supabaseData-${category}`;

// export default function useFetchCategory() {
//   const [fetchError, setFetchError] = useState<string>("");
//   const [items, setItems] = useState<Record<string, Item[]>>({});
//   const [initialized, setInitialized] = useState<boolean>(false);

//   const fetchItems = useCallback(async (category: string) => {
//     const { data, error } = await supabase
//       .from(category)
//       .select("*")
//       .order("title", { ascending: true });

//     if (error) {
//       setFetchError(`Elemente konnten nicht geladen werden für ${category}.\n Überprüfen Sie bitte Ihre Internet Verbindung!`);
//       setItems((prevItems) => ({ ...prevItems, [category]: [] }));
//       await AsyncStorage.setItem(createStorageKey(category), JSON.stringify([]));
//       return;
//     }

//     if (data) {
//       setItems((prevItems) => ({ ...prevItems, [category]: data }));
//       setFetchError("");
//       await AsyncStorage.setItem(createStorageKey(category), JSON.stringify(data));
//     }
//   }, []);

//   const loadItemsFromStorage = useCallback(async () => {
//     try {
//       const keys = topCategories.map(createStorageKey);
//       const storedData = await AsyncStorage.multiGet(keys);
//       storedData.forEach(([key, value]) => {
//         if (value) {
//           const category = key.split('-').pop();
//           if (category) {
//             setItems((prevItems) => ({
//               ...prevItems,
//               [category]: JSON.parse(value),
//             }));
//           }
//         }
//       });
//       setInitialized(true);
//     } catch (error) {
//       console.error('Error loading items from storage:', error);
//     }
//   }, []);

//   useEffect(() => {
//     loadItemsFromStorage();
//   }, [loadItemsFromStorage]);

//   useEffect(() => {
//     if (!initialized) return;

//     topCategories.forEach((category) => {
//       fetchItems(category);
//     });

//     const channels = topCategories.map((category) =>
//       supabase
//         .channel(`table-data-${category}`)
//         .on(
//           "postgres_changes",
//           { event: "*", schema: "public", table: category },
//           () => {
//             console.log(`Change received in ${category}!`);
//             fetchItems(category);
//           }
//         )
//         .subscribe()
//     );

//     return () => {
//       channels.forEach((channel) => {
//         supabase.removeChannel(channel);
//       });
//     };
//   }, [initialized, fetchItems]);

//   return {
//     fetchError,
//     items,
//   };
// }
