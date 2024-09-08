// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";
// import useFetchTableNames from "components/useFetchTableNames";
// import useFetchSubCategories from "components/useFetchSubCategories";
// import useFetchVersion from "components/useFetchVersion";

// export const useInitialFetch = () => {
//   const [isInitialized, setIsInitialized] = useState<boolean>(false); // State to prevent multiple initializations
//   const { fetchTableNames } = useFetchTableNames(); // Function to fetch table names
//   const { fetchSubCategories } = useFetchSubCategories(); // Function to fetch subcategories
//   const { loadVersionNumber } = useFetchVersion(); // Function to load version number

//   // Effect to check and perform initial fetch if not done
//   useEffect(() => {
//     const initialFetch = async () => {
//       const initialTable = await AsyncStorage.getItem("initialFetchDoneTable");
//       const initialSub = await AsyncStorage.getItem("initialFetchDoneSub");
//       const dataVersion = await AsyncStorage.getItem("dataVersion");

//       console.log("initialTable:", initialTable);
//       console.log("initialSub:", initialSub);
//       console.log("dataVersion:", dataVersion);

//       if (!initialTable || !initialSub || !dataVersion) {
//         Alert.alert(
//           "Daten werden geladen! Es kann einen kurzen Augenblick dauern, bis du alle Fragen angezeigt bekommst"
//         );

//         // Perform the initial data fetches
//         await fetchTableNames();
//         await fetchSubCategories();
//         await loadVersionNumber();

//         // Set flags to indicate initial fetch is done
//         await AsyncStorage.setItem("initialFetchDoneTable", "true");
//         await AsyncStorage.setItem("initialFetchDoneSub", "true");

//         // Set initialized state after fetching is done
//         setIsInitialized(true);
//       } else {
//         // If everything is already initialized, set the state to true
//         setIsInitialized(true);
//       }
//     };

//     // Ensure this effect only runs if not initialized
//     if (!isInitialized) {
//       initialFetch();
//     }
//   }, [isInitialized, fetchTableNames, fetchSubCategories, loadVersionNumber]);
// };
