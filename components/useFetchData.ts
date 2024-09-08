import { useEffect } from "react";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchSubCategories from "components/useFetchSubCategories";
import useFetchVersion from "components/useFetchVersion";
import { useFetchStore } from "components/fetchStore";

export default function useFetchData() {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber } = useFetchVersion();
  const { isfetching, setIsfetching } = useFetchStore();

  useEffect(() => {
    const initialFetchData = async () => {
      setIsfetching(true);
      try {
        await fetchTableNames();         // Fetch table names from Supabase
        await fetchSubCategories();      // Fetch subcategories based on table names
        await fetchVersionNumber();      // Fetch the current version number
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setIsfetching(false);
      }
    };

    initialFetchData();
  }, []);
}
