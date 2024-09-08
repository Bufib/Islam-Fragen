import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderSubCategories from "components/RenderSubCategories";
import { Stack } from "expo-router";
import  useFetchTableNames  from "components/useFetchTableNames";

export default function getSubCategories() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };
  const { tableNames, fetchError, isFetchinTable } =
    useFetchTableNames();


  if (!category) {
    return (
      <View style={styles.container}>
        <RenderSubCategories
          items={[]}
          fetchError='Invalid category'
          table=''
          isFetchinTable={isFetchinTable}
        />
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
      <RenderSubCategories
        items={categoryItems}
        fetchError={fetchError}
        table={encodeTable(category)}
        isFetchinTable={isFetchinTable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
