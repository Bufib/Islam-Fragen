import { useState } from "react";
import { useLayoutEffect } from "react";
import useFetchTableNames from "components/useFetchTableNames";
import useFetchSubCategories from "components/useFetchSubCategories";
useFetchVersion;

import useFetchVersion from "components/useFetchVersion";
import { useFetchStore } from "components/fetchStore";

export default function useFetchData() {
  const { fetchTableNames } = useFetchTableNames();
  const { fetchSubCategories } = useFetchSubCategories();
  const { fetchVersionNumber, versionNumber } = useFetchVersion();
  const [initialFetchDone, setInitialFetchDone] = useState(true);
  const { isfetching, setIsfetching } = useFetchStore();

  useLayoutEffect(() => {
    const initialFetchDone = async () => {
      setIsfetching(true);
      try {
        await fetchTableNames();
        await fetchSubCategories();
        await fetchVersionNumber();
      } catch (error) {
        console.log(error);
      } finally {
        setIsfetching(false);
      }
    };

    initialFetchDone();
  }, []);
}
