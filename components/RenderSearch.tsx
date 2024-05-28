import { Text, View, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";

interface Item {
  id: number;
  title: string;
  question: string;
  answer?: string;
  answer_sistani?: string;
  answer_khamenei?: string;
}

interface RenderSearchProps {
  item: Item;
}

const RenderSearch: React.FC<RenderSearchProps> = ({ item }) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);

  const encodeTitle = (title: string) => {
    const cleanedTitle = title.trim().replace(/\n/g, "");
    return encodeURIComponent(cleanedTitle)
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  };

  return (
    <View style={styles.container}>
      <Link
        style={styles.FlashListItems}
        href={{
          pathname: `/(text)/${encodeTitle(item.title)}`,
          params: {
            id: item.id,
            title: `${encodeTitle(item.title)}`,
          },
        }}
        asChild
      >
        <Pressable>
          <View style={[styles.renderItem, themeStyles.containerContrast]}>
            <Text style={styles.itemText}>{item.title.trim()}</Text>
            <Feather
              name='arrow-right-circle'
              size={25}
              color={colorScheme == "light" ? "black" : "white"}
            />
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    paddingRight: 20,
    lineHeight: 25,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RenderSearch;
