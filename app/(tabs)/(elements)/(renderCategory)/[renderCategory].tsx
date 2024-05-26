import { View } from "components/Themed";
import { StyleSheet, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderItems from "components/RenderItems";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RenderCategory() {
  const { subCategory } = useLocalSearchParams<{ subCategory: string }>();
  const [subCategoryItems, setSubCategoryItems] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string>("");

  const encodeTable = (title: string) => {
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  useEffect(() => {
    const fetchSubCategoryItems = async () => {
      try {
        const storedData = await AsyncStorage.getItem(`supabaseData-${subCategory}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
            const subCategoryItems = parsedData[subCategory];
            if (subCategoryItems) {
              setSubCategoryItems(subCategoryItems);
            } else {
              console.error("No subcategory items found for:", subCategory);
              setFetchError(`No subcategory items found for ${subCategory}`);
            }
          } else {
            console.error("Parsed data is not an object:", parsedData);
            setFetchError(`Data format error for ${subCategory}`);
          }
        } else {
          console.error("No data found for:", subCategory);
          setFetchError(`No data found for ${subCategory}`);
        }
      } catch (error) {
        console.error("Error loading subcategory elements:", error);
        setFetchError("Error loading data from storage.");
      }
    };

    if (subCategory) {
      fetchSubCategoryItems();
    }
  }, [subCategory]);

  if (!subCategory) {
    return (
      <View style={styles.container}>
        <RenderItems items={[]} fetchError="Invalid category" table="" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: subCategory }} />
      <RenderItems
        items={subCategoryItems}
        fetchError={fetchError}
        table={encodeTable(subCategory)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
