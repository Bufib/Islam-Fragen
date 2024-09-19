// import { useEffect } from "react";
// import { supabase } from "@/utils/supabase";
// import { useAuthStore } from "./authStore";
// import { useQuery } from "@tanstack/react-query";
// import { useIsNewUpdateAvailable } from "components/newsUpdateStore";
// import { useHasfetchedNews } from "components/hasFetchedNews";

// interface NewsItem {
//   id: number;
//   title: string;
//   content: string;
//   created_at: Date;
// }

// const fetchNewsData = async (): Promise<NewsItem[]> => {
//   const { data, error } = await supabase
//     .from("News")
//     .select("*")
//     .order("id", { ascending: false });

//   if (error) {
//     throw new Error("Failed to fetch news");
//   }

//   return data as NewsItem[];
// };

// export default function useFetchNews() {
//   const { isLoggedIn } = useAuthStore();
//   const { newUpdateAvailable, update } = useIsNewUpdateAvailable();
//   const { hasFetchedNews, setHasFetchedNews } = useHasfetchedNews();

//   // Verwende `enabled`, um die Abfrage nur auszuführen, wenn `hasFetchedNews` false ist
//   const {
//     data: posts,
//     error,
//     isLoading,
//     isError,
//     isSuccess,
//     refetch,
//   } = useQuery<NewsItem[], Error>({
//     queryKey: ["news"],
//     queryFn: fetchNewsData,
//     staleTime: Infinity,
//     gcTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: true,
//     refetchOnMount: false,
//     enabled: !hasFetchedNews, // Abfrage nur ausführen, wenn noch nicht geladen
//   });

//   if (isSuccess) {
//     setHasFetchedNews(true); //
//   }

//   if (isError) {
//     setHasFetchedNews(false); 
//   }

//   useEffect(() => {
//     // Supabase-Subscription für Echtzeit-Updates
//     const subscription = supabase
//       .channel("News")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "News" },
//         (payload) => {
//           if (isLoggedIn) {
//             refetch(); // Refetch bei Datenänderungen, wenn eingeloggt
//             update(false);
//           } else {
//             if (!newUpdateAvailable) {
//               update(true); // Benachrichtigung über neue Updates, wenn nicht eingeloggt
//             }
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [isLoggedIn, newUpdateAvailable, refetch, update]);

//   const applyUpdates = () => {
//     update(false); // Update nach der Anwendung der Änderungen
//   };

//   return {
//     fetchError: error?.message || "",
//     posts: posts || [],
//     refetch,
//     updateAvailable: newUpdateAvailable,
//     applyUpdates,
//     isFetchingNews: isLoading,
//   };
// }

import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "./authStore";
import { useQuery } from "@tanstack/react-query";
import { useIsNewUpdateAvailable } from "components/newsUpdateStore";
import { useHasfetchedNews } from "components/hasFetchedNews";

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
  const { hasFetchedNews, setHasFetchedNews } = useHasfetchedNews();

  // Fetch data using React Query
  const {
    data: posts,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
  } = useQuery<NewsItem[], Error>({
    queryKey: ["news"],
    queryFn: fetchNewsData,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
    enabled: !hasFetchedNews, // Only fetch if news has not been fetched yet
  });

  // Handle side effects for success and error states using useEffect
  useEffect(() => {
    if (isSuccess) {
      setHasFetchedNews(true); // Set state to true when fetch is successful
    }

    if (isError) {
      setHasFetchedNews(false); // Set state to false on fetch error
    }
  }, [isSuccess, isError, setHasFetchedNews]);

  useEffect(() => {
    // Supabase subscription for real-time updates
    const subscription = supabase
      .channel("News")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch(); // Refetch when logged in and changes detected
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true); // Notify about new updates when logged out
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
    update(false); // Clear the update notification after applying updates
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

