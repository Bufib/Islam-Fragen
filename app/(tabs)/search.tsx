import {
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { View, Text, SafeAreaView } from "components/Themed";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import ItemSearch from "components/ItemSearch";
import { Feather } from "@expo/vector-icons";
import { coustomTheme } from "components/coustomTheme";
import { useRef, useEffect } from "react";

export default function TabOneScreen() {
  const [search, setSearch] = useState("");

  const themeStyles = coustomTheme();
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <SafeAreaView style={styles.container} edges={["top", "right", "left"]}>
        <View style={[styles.searchContainer, themeStyles.inverseTextInput]}>
          <AntDesign
            name='search1'
            size={20}
            color='grey'
            style={styles.searchIcon}
          />
          <Text style={[styles.border, themeStyles.searchBorderDash]}>|</Text>
          <TextInput
            style={[styles.searchField, themeStyles.inverseTextInput]}
            placeholder='Suche'
            keyboardType='default'
            editable
            value={search}
            ref={searchInputRef}
            onChangeText={setSearch}
          />
          {search && (
            <Pressable
              style={styles.deleteIconContainer}
              onPress={() => setSearch("")}
            >
              <Feather
                name='x-circle'
                size={20}
                style={[styles.deleteIcon, themeStyles.deleteIcon]}
              />
            </Pressable>
          )}
        </View>
        <View style={styles.renderSearchContainer}>
          <ItemSearch search={search} />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 15,
    borderWidth: 2,
    borderRadius: 30,
  },
  searchIcon: {
    paddingLeft: 12,
  },
  deleteIconContainer: {
    backgroundColor: "transparent",
  },
  deleteIcon: {
    paddingRight: 11,
    paddingVertical: 10,
  },
  border: {
    fontSize: 25,
    paddingLeft: 3,
    paddingBottom: 5,
    fontWeight: "100",
    alignSelf: "center",
  },
  searchField: {
    width: "80%",
    paddingRight: 10,
    paddingLeft: 5,
    paddingVertical: 12,
  },

  renderSearchContainer: {
    flex: 1,
    marginBottom: 10
  },
});
