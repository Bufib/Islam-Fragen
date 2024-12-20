import { Text, View } from "components/Themed";
import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Appearance } from "react-native";
import { coustomTheme } from "./coustomTheme";
import { ActivityIndicator } from "react-native";
import { formatTitle } from "components/formatTitle";
import Colors from "constants/Colors";
interface Item {
  id: number;
  title: string;
}

interface RenderCategoriesProps {
  items: Item[];
  fetchError?: string;
  table: string;
  isFetching: boolean;
}

export default function RenderCategories({
  items,
  fetchError,
  table,
  isFetching,
}: RenderCategoriesProps) {
  const encodeTitle = (title: string) => {
    const cleanedTitle = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanedTitle)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const appColor = Appearance.getColorScheme();

  return (
    <View style={styles.container}>
      <>
        {fetchError && (
          <View style={styles.renderError}>
            <Text style={[styles.errorText, themeStyles.error]}>
              {fetchError.toString()}
            </Text>
          </View>
        )}
        {isFetching && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator
              size='large'
              color={
                colorScheme == "light"
                  ? Colors.light.activityIndicator
                  : Colors.dark.activityIndicator
              }
            />
          </View>
        )}
        {items.length > 0 && !isFetching && (
          <View style={styles.itemsContainer}>
            <FlashList
              data={items}
              extraData={appColor}
              estimatedItemSize={82}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Link
                  style={styles.FlashListItems}
                  href={{
                    pathname: `(text)/${encodeTitle(item.title)}`,
                    params: {
                      id: item.id,
                      table: table,
                      title: `${encodeTitle(item.title)}`,
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
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
  },
  itemsContainer: {
    flex: 1,
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
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  FlashListItems: {
    paddingTop: 15,
  },
  renderItem: {
    flex: 1,
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
    lineHeight: 25,
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
