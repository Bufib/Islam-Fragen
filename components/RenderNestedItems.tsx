import Colors from "constants/Colors";
import { Text, View } from "components/Themed";
import { FlatList, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Appearance } from "react-native";
import { coustomTheme } from "./coustomTheme";

interface NestedItem {
  id: number;
  title: string;
}

interface RenderNestedItemsProps {
  items: NestedItem[];
  fetchError?: string;
  table: string;
}

const RenderNestedItems: React.FC<RenderNestedItemsProps> = ({
  items,
  fetchError,
}) => {
  const encodeTitle = (title: string) => {
    const cleanedTitle = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanedTitle)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);
  const appColor = Appearance.getColorScheme();

console.log
  return (
    <View style={styles.container}>
      {fetchError && (
        <View style={styles.renderError}>
          <Text style={[styles.errorText, themeStyles.error]}>
            {fetchError}
          </Text>
        </View>
      )}
      {items && (
        <View style={styles.itemsContainer}>
          <FlashList
            data={items}
            extraData={appColor}
            estimatedItemSize={63}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Link
                style={styles.FlashListItems}
                key={item.id.toString()}
                href={{
                  pathname: "(renderCategory)/[renderCategory]",
                  params: {
                    subCategory: `${encodeTitle(item.title)}`,
                    id: item.id.toString(),
                    fetchError: fetchError,
                  },
                }}
                asChild
              >
                <Pressable>
                  <View
                    style={[
                      styles.renderItem,
                      themeStyles.containerContrast,
                    ]}
                  >
                    <Text style={styles.itemText}>{item.title.trim()}</Text>
                    <Feather
                      name="arrow-right-circle"
                      size={25}
                      color={colorScheme == "light" ? "black" : "white"}
                    />
                  </View>
                </Pressable>
              </Link>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  itemsContainer: {
    flex: 1,
  },
  FlashListItems: {
    paddingTop: 15,
  },
  renderItem: {
    flexDirection: "row",
    padding: 20,
    borderWidth: 0.2,
    alignItems: "center",
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 20,
    lineHeight: 30,
  },
  renderError: {
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
  },
});

export default RenderNestedItems;
