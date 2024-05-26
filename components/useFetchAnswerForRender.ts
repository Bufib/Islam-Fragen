// // useFetchAnswersForRender.ts
// import { useEffect, useState, useCallback } from "react";
// import { useFetchTableNames } from "./useFetchTableNames";
// import { useFetchAllAnswersFromAllTables } from "./useFetchAllAnswersFromAllTables";

// interface TableData {
//   id: number;
//   [key: string]: any; // Generic field for table columns
// }

// interface UseFetchAnswersForRenderResult {
//   allData: { [key: string]: TableData[] | null };
//   dataLoading: boolean;
//   tableNamesLoading: boolean;
//   refetchAllData: () => void;
//   refetchTableNames: () => void;
// }

// export function useFetchAnswersForRender(): UseFetchAnswersForRenderResult {
//   const { tableNames, tableNamesLoading, refetchTableNames } = useFetchTableNames();
//   const [allData, setAllData] = useState<{ [key: string]: TableData[] | null }>({});
//   const [dataLoading, setDataLoading] = useState<boolean>(true);

//   const fetchAllTablesData = useCallback(async () => {
//     if (!tableNames) return;
//     setDataLoading(true);
//     const newData: { [key: string]: TableData[] | null } = {};
//     await Promise.all(tableNames.map(async (tableName) => {
//       const { data } = useFetchAllAnswersFromAllTables<TableData>(tableName);
//       newData[tableName] = data;
//     }));
//     setAllData(newData);
//     setDataLoading(false);
//   }, [tableNames]);

//   useEffect(() => {
//     fetchAllTablesData();
//   }, [tableNames, fetchAllTablesData]);

//   const refetchAllData = useCallback(() => {
//     fetchAllTablesData();
//   }, [fetchAllTablesData]);

//   return {
//     allData,
//     dataLoading,
//     tableNamesLoading,
//     refetchAllData,
//     refetchTableNames,
//   };
// }
