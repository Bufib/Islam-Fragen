import { useEffect } from "react";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchSubCategories from "components/useFetchSubCategories";
import useFetchVersion from "components/useFetchVersion";
import { useFetchStore } from "components/fetchStore";
import Toast from "react-native-toast-message";

export default function useFetchData() {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber } = useFetchVersion();
  const { isfetching, setIsfetching } = useFetchStore();

  useEffect(() => {
    const initialFetchData = async () => {
      
      setIsfetching(true);
      try {
        Toast.show({
          type: "info",
          text1: "Daten werden geladen",
          text2:
            "Es kann einen Augenblick dauern, bis die Fragen vorhanden sind!",
        });
        await fetchTableNames(); // Fetch table names from Supabase
        await fetchSubCategories(); // Fetch subcategories based on table names
        await fetchVersionNumber(); // Fetch the current version number

        // Show Success
        Toast.show({
          type: "success",
          text1: "Updates abgeschlossen",
          text2: "Alle Daten sind aktuell!",
        });
      } catch (error) {
        console.log("Error fetching data:", error);
        Toast.show({
          type: "error",
          text1: "Daten konnten nicht geladen werden",
          text2: "Überprüfe deine Internetverbindung und starte die App neu!",
        });
      } finally {
        setIsfetching(false);
      }
    };

    initialFetchData();
  }, []);
}
