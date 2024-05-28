import Colors from "constants/Colors";
import { Text, View } from "components/Themed";
import { StyleSheet } from "react-native";
import React from "react";
import RenderSearch from "./RenderSearch";
import { FlashList } from "@shopify/flash-list";
import { Appearance } from "react-native";
import useSearchItems from "components/useSearchItems";

const appColor = Appearance.getColorScheme();

interface ItemSearchProps {
  search: string;
}

const ItemSearch: React.FC<ItemSearchProps> = ({ search }) => {
  const { searchResults, isLoading } = useSearchItems(search);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Suche...</Text>
        </View>
      ) : search === "" ? null : searchResults.length > 0 ? (
        <View style={styles.searchContainer}>
          <FlashList
            data={searchResults}
            estimatedItemSize={63}
            extraData={appColor}
            keyExtractor={(item, index) => `${item.id}-${index}`} // Ensure unique keys
            renderItem={({ item }) => <RenderSearch item={item} />}
          />
        </View>
      ) : (
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>
            Leider konnten wir nichts finden!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flex: 1,
    marginTop: 10,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  notFoundText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 12,
    paddingRight: 12,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ItemSearch;
