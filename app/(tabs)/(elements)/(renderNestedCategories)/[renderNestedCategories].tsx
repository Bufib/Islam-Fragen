import { View } from "components/Themed";
import { StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import RenderNestedItems from "components/RenderNestedItems";
import useFetchCategory from "components/useFetchCategory";
import { Stack } from "expo-router";

export default function RenderCategory() {
  const { category } = useLocalSearchParams<{ category: string }>();

  const encodeTable = (title: string) => {
    // Clean the title by trimming and removing new lines
    // Encode all characters with encodeURIComponent and manually encode parentheses since the cause trouble in the url
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  const { items, fetchError} = useFetchCategory();


  if (!category) {
    return (
      <View style={styles.container}>
        <RenderNestedItems items={[]} fetchError='Invalid category' table='' />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Change header Title */}
      <Stack.Screen options={{ headerTitle: category }} />

      <RenderNestedItems
        items={items[category] || []}
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
