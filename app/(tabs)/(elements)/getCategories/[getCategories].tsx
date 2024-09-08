import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderCategories from "components/RenderCategories";
import { Stack } from "expo-router";
import useFetchSubCategories from "components/useFetchSubCategories";
import { useRefetchSubeStore } from "components/refetchSubStore";

export default function RenderCategory() {
  const { subCategory } = useLocalSearchParams<{ subCategory: string }>();
  const { fetchError, subCategories, fetchSubCategories, isFetchingSub } =
    useFetchSubCategories();

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };


  const matchedTable = subCategories.find(
    (table) => table.tableName === subCategory
  );
  const filteredItems = matchedTable ? matchedTable.questions : [];

  return (
    <View style={styles.container}>
      {!subCategory ? (
        <RenderCategories
          items={[]}
          fetchError={fetchError}
          table=''
          isFetching={isFetchingSub}
        />
      ) : (
        <>
          <Stack.Screen options={{ headerTitle: subCategory }} />
          <RenderCategories
            items={filteredItems}
            fetchError={fetchError}
            table={encodeTable(subCategory)}
            isFetching={isFetchingSub}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
