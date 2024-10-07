import { Text, View } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import RenderFavorites from "components/RenderFavorites";
import { useIsChanging } from "components/favStore";

export default function favourites() {
  interface Favorite {
    id: string;
    title: string;
    table: string;
    isFavorite: boolean;
  }

  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const { favoriteChange } = useIsChanging();

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("Favorites");

        if (jsonValue) {
          const parsedFavorites = JSON.parse(jsonValue);

          if (Array.isArray(parsedFavorites)) {
            // Filter items with isFavorite: true
            const filteredFavorites = parsedFavorites.filter(
              (item) => item.isFavorite
            );

            setFavorites(filteredFavorites);
          } else {
            // Initialize with empty array
            setFavorites([]);
          }
        } else {
          // Fallback if no data found
          setFavorites([]);
        }
      } catch (e) {
        Toast.show({
          type: "error",
          text1:
            "Fehler beim Laden der Favoriten! Bitte überprüfen Sie Ihre Internetverbindung",
        });
        // Fallback to empty array in case of error
        setFavorites([]);
      }
    };
    getFavorites();
  }, [favoriteChange]);
  return (
    <View style={styles.container}>
      {favorites[0] ? (
        <View style={styles.favoriteContainer}>
          <RenderFavorites items={favorites} />
        </View>
      ) : (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavoritesText}>
            Du hast noch keine Favoriten! {"\n"} {"\n"} Wenn dir etwas gefällt,
            klicke oben auf den Stern.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  favoriteContainer: {
    flex: 1,
  },

  noFavoritesContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 45,
  },
  noFavoritesText: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
});
