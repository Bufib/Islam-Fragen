import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useAuthStore } from "./authStore";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  // weitere Felder je nach Schema Ihrer News-Tabelle
}

export default function fetchNews() {
  const [fetchError, setFetchError] = useState<string>("");
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const fetchItems = async () => {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from("News")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        throw Error;
      }

      if (data) {
        setPosts(data as NewsItem[]);
        setFetchError("");
      } else {
        setPosts([]);
      }
    } catch (error) {
      setFetchError(
        "Neuigkeiten konnten nicht geladen werden.\n Überprüfen Sie bitte Ihre Internetverbindung!"
      );
      setPosts([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchItems();
    const subscription = supabase
      .channel("News")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            fetchItems();
            setUpdateAvailable(false);
          } else {
            setUpdateAvailable(true);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            fetchItems();
            setUpdateAvailable(false);
          } else {
            setUpdateAvailable(true);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoggedIn]);

  const applyUpdates = () => {
    setUpdateAvailable(false);
  };

  return {
    fetchError,
    posts,
    refetch: fetchItems,
    updateAvailable,
    applyUpdates,
    isFetching,
  };
}
