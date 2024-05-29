import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import RenderNestedItems from "components/RenderNestedItems";
import { Stack } from "expo-router";
import { useFetchTableNames } from "components/useFetchTableNames";
import { useEffect } from "react";
import useFetchSubCategories from "components/useFetchSubCategories";

export default function RenderNestedCategories() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  const { tableNames, fetchError } = useFetchTableNames();

  if (!category) {
    return (
      <View style={styles.container}>
        <RenderNestedItems items={[]} fetchError='Invalid category' table='' />
      </View>
    );
  }

  // Filter and map the category items
  const categoryItems = tableNames
    .filter((item) => item.category === category)
    .flatMap((item) =>
      item.tableNames.split(", ").map((tableName, index) => ({
        id: index,
        title: tableName.trim(),
      }))
    );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: category }} />
      <RenderNestedItems
        items={categoryItems}
        fetchError={fetchError}
        table={encodeTable(category)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
