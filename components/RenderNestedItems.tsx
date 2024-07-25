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
import { ActivityIndicator } from "react-native";
import { formatTitle } from "components/formatTitle";

interface NestedItem {
  id: number;
  title: string;
}

interface RenderNestedItemsProps {
  items: NestedItem[];
  fetchError?: string;
  table: string;
  isFetchinTable: boolean;
}

const RenderNestedItems: React.FC<RenderNestedItemsProps> = ({
  items,
  fetchError,
  isFetchinTable,
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

  return (
    <View style={styles.container}>
      {fetchError && (
        <View style={styles.renderError}>
          <Text style={[styles.errorText, themeStyles.error]}>
            {fetchError}
          </Text>
        </View>
      )}
      {isFetchinTable && !isFetchinTable && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator
            size='large'
            color={colorScheme == "light" ? "black" : "white"}
          />
          <Text style={styles.loadingIndicatorText}>
            Kategorien werden geladen. Das kann je nach Internetverbindung, einen kleinen Augenblick dauern!
          </Text>
          <Text style={styles.loadingIndicatorText}>Allahumma salli ala Muhammad wa aali Muhammad</Text>
        </View>
      )}
      {items.length > 0 && (
        <View style={styles.itemsContainer}>
          <FlashList
            data={items}
            extraData={appColor}
            estimatedItemSize={85}
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
                    style={[styles.renderItem, themeStyles.containerContrast]}
                  >
                    <Text style={styles.itemText}>
                      {formatTitle(item.title)}
                    </Text>
                    <Feather
                      name='arrow-right-circle'
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
    marginTop: 5,
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
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  loadingIndicatorText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
  },
});

export default RenderNestedItems;
