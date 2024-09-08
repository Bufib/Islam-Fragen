import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { coustomTheme } from "./coustomTheme";

export default function NoConnection({
  message = `Es besteht akutell keine Internetverbindung! Änderungen an dieser Frage
        können nicht angezeigt werden!`,
}) {
  const themeStyles = coustomTheme();

  return (
    <View style={styles.noInternet}>
      <Text style={[styles.noInternetText, themeStyles.error]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noInternet: {
    marginTop: 15,
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 2,
    borderRadius: 20,
  },
  noInternetText: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
});
