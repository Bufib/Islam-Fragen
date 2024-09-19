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

  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useQuery<NewsItem[], Error>({
    queryKey: ["news"],
    queryFn: fetchNewsData,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (hasFetchedNews == false) {
      refetch();
      setHasFetchedNews(true)
    }
    const subscription = supabase
      .channel("News")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "News" },
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
