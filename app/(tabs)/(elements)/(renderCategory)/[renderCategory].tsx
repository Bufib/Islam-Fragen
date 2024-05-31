import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderItems from "components/RenderItems";
import { Stack } from "expo-router";
import useFetchSubCategories from "components/useFetchSubCategories";

export default function RenderCategory() {
  const { subCategory } = useLocalSearchParams<{ subCategory: string }>();

  const {
    fetchError,
    subCategories,
    refetch: fetchItems,
    isFetching,
  } = useFetchSubCategories();



  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  if (!subCategory) {
    return (
      <View style={styles.container}>
        <RenderItems items={[]} fetchError='Invalid category' table='' />
      </View>
    );
  } else {
    const matchedTable = subCategories.find(
      (table) => table.tableName === subCategory
    );
    const filteredItems = matchedTable ? matchedTable.questions : [];

    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerTitle: subCategory }} />
        <RenderItems
          items={filteredItems}
          fetchError={fetchError}
          table={encodeTable(subCategory)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
