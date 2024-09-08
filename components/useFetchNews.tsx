// import { supabase } from "@/utils/supabase";
// import { useEffect, useState } from "react";
// import { useAuthStore } from "./authStore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useIsNewUpdateAvailable } from "components/newsUpdateStore";

// interface NewsItem {
//   id: number;
//   title: string;
//   content: string;
//   created_at: Date;

// }

// const INITIAL_FETCH_KEY_NEWS = "initialFetchDoneNEWS";

// export default function fetchNews() {
//   const [fetchError, setFetchError] = useState<string>("");
//   const [posts, setPosts] = useState<NewsItem[]>([]);
//   const [updateAvailable, setUpdateAvailable] = useState(false);
//   const [isFetching, setIsFetching] = useState(false);
//   const { isLoggedIn } = useAuthStore();
//   const { newUpdateAvailable, update } = useIsNewUpdateAvailable();

//   const storeItems = async (items: NewsItem[]) => {
//     try {
//       const jsonValue = JSON.stringify(items);
//       await AsyncStorage.setItem("newsItems", jsonValue);
//     } catch (error) {
//       console.error("Error storing data", error);
//     }
//   };

//   const loadItemsFromStorage = async () => {
//     try {
//       const jsonValue = await AsyncStorage.getItem("newsItems");
//       return jsonValue != null ? JSON.parse(jsonValue) : null;
//     } catch (error) {
//       console.error("Error loading data from storage", error);
//       return null;
//     }
//   };

//   const setInitialFetchDone = async () => {
//     try {
//       await AsyncStorage.setItem(INITIAL_FETCH_KEY_NEWS, "true");
//     } catch (error) {
//       console.error("Error setting initial fetch key", error);
//     }
//   };

//   const checkInitialFetchDone = async () => {
//     try {
//       const value = await AsyncStorage.getItem(INITIAL_FETCH_KEY_NEWS);
//       return value === "true";
//     } catch (error) {
//       console.error("Error checking initial fetch key", error);
//       return false;
//     }
//   };

//   const fetchItems = async () => {
//     try {
//       setIsFetching(true);
//       const { data, error } = await supabase
//         .from("News")
//         .select("*")
//         .order("id", { ascending: false });

//       if (error) {
//         throw Error;
//       }

//       if (data) {
//         setPosts(data as NewsItem[]);
//         setFetchError("");
//         await storeItems(data as NewsItem[]);
//         await setInitialFetchDone();
//       } else {
//         setPosts([]);
//       }
//     } catch (error) {
//       await AsyncStorage.removeItem(INITIAL_FETCH_KEY_NEWS);
//       setFetchError(
//         "Neuigkeiten konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internetverbindung!"
//       );
//       setPosts([]);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       const initialFetchDone = await checkInitialFetchDone();
//       if (initialFetchDone) {
//         const storedItems = await loadItemsFromStorage();
//         if (storedItems) {
//           setPosts(storedItems);
//         } else {
//           fetchItems();
//         }
//       } else {
//         fetchItems();
//       }
//     };

//     initializeData();

//     const subscription = supabase
//       .channel("News")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "News" },
//         (payload) => {
//           if (isLoggedIn) {
//             fetchItems();
//             setUpdateAvailable(false);
//           } else {
//             if(!newUpdateAvailable) {
//               update(true)
//             }
//             setUpdateAvailable(true);
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         { event: "DELETE", schema: "public", table: "News" },
//         (payload) => {
//           if (isLoggedIn) {
//             fetchItems();
//             setUpdateAvailable(false);
//           } else {
//             if(!newUpdateAvailable) {
//               update(true)
//             }
//             setUpdateAvailable(true);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [isLoggedIn]);

//   const applyUpdates = () => {
//     setUpdateAvailable(false);
//   };

//   return {
//     fetchError,
//     posts,
//     refetch: fetchItems,
//     updateAvailable,
//     applyUpdates,
//     isFetching,
//   };
// }

import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "./authStore";
import { useQuery } from "@tanstack/react-query";
import { useIsNewUpdateAvailable } from "components/newsUpdateStore";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: Date;
}

const fetchNewsData = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from("News")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch news");
  }

  return data as NewsItem[];
};

export default function useFetchNews() {
  const { isLoggedIn } = useAuthStore();
  const { newUpdateAvailable, update } = useIsNewUpdateAvailable();

  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useQuery<NewsItem[], Error>({
    queryKey: ["news"],
    queryFn: fetchNewsData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("News")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch();
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch();
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch();
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoggedIn, newUpdateAvailable, refetch, update]);

  const applyUpdates = () => {
    update(false);
  };

  return {
    fetchError: error?.message || "",
    posts: posts || [],
    refetch,
    updateAvailable: newUpdateAvailable,
    applyUpdates,
    isFetchingNews: isLoading,
  };
}
