// import { useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { supabase } from "utils/supabase";
// import useVersionStore from "components/versionStore";
// import useNetworkStore from "./useNetworkStore";

// import Toast from "react-native-toast-message";
// import { NO_INTERNET, NO_UPADTES_FETCHABLE } from "components/messages";

// // Custom hook to load and subscribe to version number updates
// export default function useFetchVersion() {
//   const [versionNumber, setVersionNumber] = useState<string>();
//   const [loading, setLoading] = useState<boolean>(true);
//   const { setIsDifferent, setIsEqual, setVersion } = useVersionStore();
//   const isConnected = useNetworkStore((state) => state.isConnected);
//   // Function to get the version number
//   const fetchVersionNumber = async (): Promise<void> => {
//     if (isConnected) {
//       try {
//         // Query the version table to get the version number
//         setLoading(true);
//         const { data, error } = await supabase
//           .from("Version")
//           .select("version")
//           .single();

//         if (error) {
//           throw error;
//         }

//         if (data) {
//           const fetchedVersion = data.version.trim();
//           const storedVersion = (
//             await AsyncStorage.getItem("dataVersion")
//           )?.trim();

//           // If versions are different, set new version in AsyncStorage and update state
//           if (storedVersion !== fetchedVersion) {
//             await AsyncStorage.setItem("dataVersion", fetchedVersion);
//             setIsDifferent();
//           } else {
//             setIsEqual();
//           }
//           setVersionNumber(fetchedVersion);
//           setVersion(fetchedVersion);
//         } else {

//           setVersionNumber("");
//           setVersion("");
//         }
//       } catch (error) {
//         console.error("Error loading version number:", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       const storedVersion = (
//         (await AsyncStorage.getItem("dataVersion")) || ""
//       )?.trim();
//       setVersionNumber(storedVersion);
//       setVersion(storedVersion);
//       Toast.show({
//         type: "info",
//         text1: NO_INTERNET,
//         text2: NO_UPADTES_FETCHABLE,
//       });
//     }
//   };

//   return { versionNumber, loading, fetchVersionNumber };
// }
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "utils/supabase";
import useVersionStore from "components/versionStore";
import useNetworkStore from "components/useNetworkStore";
import { UPDATED_MESSAGE } from "components/messages";
import Toast from "react-native-toast-message";
import { NO_INTERNET, NO_UPADTES_FETCHABLE } from "components/messages";
import { router } from "expo-router";

// Custom hook to load and subscribe to version number updates
export default function useFetchVersion() {
  const [versionNumber, setVersionNumber] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const { setIsDifferent, setIsEqual, setVersion } = useVersionStore();
  const isConnected = useNetworkStore((state) => state.isConnected);

  // Function to get the version number
  const fetchVersionNumber = async (): Promise<void> => {
    if (isConnected) {
      try {
        // Query the version table to get the version number
        setLoading(true);
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

          // If versions are different, set new version in AsyncStorage and update state
          if (storedVersion !== fetchedVersion) {
            await AsyncStorage.setItem("dataVersion", fetchedVersion);
            setIsDifferent();
          } else {
            setIsEqual();
          }
          setVersionNumber(fetchedVersion);
          setVersion(fetchedVersion);
        } else {
          setVersionNumber("");
          setVersion("");
        }
      } catch (error) {
        console.error("Error loading version number:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const storedVersion = (
        (await AsyncStorage.getItem("dataVersion")) || ""
      )?.trim();
      setVersionNumber(storedVersion);
      setVersion(storedVersion);
      Toast.show({
        type: "info",
        text1: NO_INTERNET,
        text2: NO_UPADTES_FETCHABLE,
      });
    }
  };

  // Subscribe to version updates
  useEffect(() => {
    const channel = supabase
      .channel("version-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Version" },
        (payload) => {
          console.log("Version updated: ", payload);
          fetchVersionNumber();
          router.navigate("/");
          Toast.show({
            type: "info",
            text1: UPDATED_MESSAGE,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { versionNumber, loading, fetchVersionNumber };
}
