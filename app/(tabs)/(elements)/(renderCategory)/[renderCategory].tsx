import { View } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import RenderItems from "components/RenderItems";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFetchAllAnswersFromAllTables } from "components/useFetchAllAnswersFromAllTables";

export default function RenderCategory() {
  const { subCategory, id, fetchError } = useLocalSearchParams<{ subCategory: string, id: string, fetchError: string; }>();
  const [subCategoryElements, setSubCategoryElements] = useState([]);

  const encodeTable = (title: string) => {
    // Clean the title by trimming and removing new lines
    // Encode all characters with encodeURIComponent and manually encode parentheses since they cause trouble in the URL
    const cleanTable = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanTable)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };
  const {data} = useFetchAllAnswersFromAllTables();

  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        const storedData = await AsyncStorage.getItem(`supabaseData-${subCategory}`);
        console.log(storedData)
        console.log(subCategory, id)
        if (storedData) {
          setSubCategoryElements(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading subcategory elements:", error);
      }
    };

    if (subCategory && id) {
      fetchSubCategory();
    }
  }, [subCategory, id]);

  if (!subCategory) {
    return <View style={styles.container}><RenderItems items={[]} fetchError="Invalid category" table="" /></View>;
  }

  return (
    <View style={styles.container}>
      {/* Change header Title */}
      <Stack.Screen options={{ headerTitle: subCategory }} />

      <RenderItems
        items={subCategoryElements}
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
