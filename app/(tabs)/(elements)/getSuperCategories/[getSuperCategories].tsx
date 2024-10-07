import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderSuperCategories from "components/RenderSuperCategories";
import { Stack } from "expo-router";
import { useGetSuperCategories } from "components/useGetSuperCategories";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function getSuperCategories() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };
  const { tableNames, fetchErrorTableNames, isFetchingTable } =
  useGetSuperCategories();



  if (!category) {
    return (
      <View style={styles.container}>
        <RenderSuperCategories
          items={[]}
          fetchError='Kategorien konnten nicht geladen wereden. Bitte Überprüfe deine Internetverbindung und starte die App neu!'
          table=''
          isFetchinTable={isFetchingTable}
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
      <RenderSuperCategories
        items={categoryItems}
        fetchError={fetchErrorTableNames}
        table={encodeTable(category)}
        isFetchinTable={isFetchingTable}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
