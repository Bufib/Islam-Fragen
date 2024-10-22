import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet, View } from "react-native";


const DatenschutzScreen = () => {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{
          uri: "/Users/hadielali/islamFragen/islamische-Fragen/components/datenschutz.html",
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DatenschutzScreen;
