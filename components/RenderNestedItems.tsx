import Colors from "constants/Colors";
import { Text, View } from "components/Themed";
import { FlatList, Pressable, StyleSheet } from "react-native";
import React from "react";
import { EvilIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function RenderNestedItems({ items, fetchError, table }) {
  const encodeTitle = (title: string) => {
    // Clean the title by trimming and removing new lines
    // Encode all characters with encodeURIComponent and manually encode parentheses since the cause trouble in the url
    const cleanedTitle = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanedTitle)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };
  return (
    <View style={styles.container}>
      {items && (
        <View style={styles.itemsContainer}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.FlatListItems}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "(renderCategory)/[renderCategory]",
                  params: {
                    category: item.title,
                  },
                }}
                asChild
              >
                <Pressable>
                  <View style={styles.renderItem}>
                    <Text style={styles.itemText}>{item.title.trim()}</Text>
                    <EvilIcons name='arrow-right' size={30} color='black' />
                  </View>
                </Pressable>
              </Link>
            )}
          />
        </View>
      )}
      {fetchError && (
        <View style={styles.renderError}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },

  itemsContainer: {},

  FlatListItems: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: 15,
  },
  renderItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderWidth: 0.2,
  },

  itemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  renderError: {
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 20,
    color: Colors.light.error,
    textAlign: "center",
  },
});
