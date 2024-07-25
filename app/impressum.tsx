import { ScrollView } from "react-native";
import { Text, View } from "components/Themed";
import React from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";
import { useColorScheme } from "react-native";
import Colors from "constants/Colors";
import { coustomTheme } from "components/coustomTheme";
import { useTheme } from "@react-navigation/native";

export default function impressum() {
  const impressum = `
 # **Impressum** 
 
 **Angaben gemäß § 5 TMG:**

 Bund für islamische Bildung e. V.

 Füssener Str. 15
 12309 Berlin
 
 Kontakt:
 E-Mail: info@bufib.de
 
 Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
 Bund für islamische Bildung e.V.
  `;

  const colorScheme = useColorScheme();

  const themeStyles = coustomTheme(colorScheme);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.textContainer}>
        <Markdown
          style={{
            body: {
              ...themeStyles.markdownText,
              textAlign: "justify",
              fontSize: 18,
              lineHeight: 40,
            },
            heading1: {
              fontSize: 27,
              lineHeight: 40,
            },
          }}
        >
          {impressum}
        </Markdown>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginTop: 15,
    marginBottom: 25,
    marginHorizontal: 25,
    backgroundColor: "transparent",
  },
  darkScrollView: {
    backgroundColor: Colors.dark.background,
  },
  lightScrollVire: {
    backgroundColor: Colors.light.background,
  },
  darkText: {
    color: Colors.dark.text,
  },
  lightText: {
    color: Colors.light.text,
  },
});
