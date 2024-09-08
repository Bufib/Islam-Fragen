import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import useVersionStore from "components/versionStore";

// Custom hook to load and subscribe to version number updates
export default function useFetchVersion() {
  const [versionNumber, setVersionNumber] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { setIsDifferent, setIsEqual, setVersion } = useVersionStore();

  // Function to load the version number
  const fetchVersionNumber = async (): Promise<void> => {
    try {
      // Query the version table to get the version number
      const { data, error } = await supabase
        .from("Version")
        .select("version")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const fetchedVersion = data.version.trim();
        const storedVersion = (
          await AsyncStorage.getItem("dataVersion")
        )?.trim();

        if (storedVersion !== fetchedVersion) {
          // If versions are different, set new version in AsyncStorage and update state
          await AsyncStorage.setItem("dataVersion", fetchedVersion);
          setVersion(fetchedVersion)
          setIsDifferent();
        } else {
          setIsEqual();
        }
        setVersionNumber(fetchedVersion);
        setVersion(fetchedVersion)
      } else {
        console.log("No data found");
        setVersionNumber("");
        setVersion("")
      }
    } catch (error) {
      console.error("Error loading version number:", error);
    } finally {
      setLoading(false);
    }
  };

  return { versionNumber, loading, fetchVersionNumber };
}
