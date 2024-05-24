import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Text, View } from "./Themed";
import { Link, LinkProps } from "expo-router";
import { Pressable } from "react-native";
import Colors from "constants/Colors";
import { Image } from "expo-image";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";

export default function Categories() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);

  const categoriesLeft = [
    {
      name: "Rechtsfragen",
      image: require("assets/images/Rechtsfragen.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },
    {
      name: "Quran",
      image: require("assets/images/Quran.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },
    {
      name: "Historie",
      image: require("assets/images/Historie.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },
  ];
  const categoriesRight = [
    {
      name: "Glaubensfragen",
      image: require("assets/images/Glaubensfragen.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },
    {
      name: "Ethik",
      image: require("assets/images/Ethik.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },

    {
      name: "Ratschläge",
      image: require("assets/images/Ratschlaege.png"),
      path: "(renderNestedCategories)/[renderNestedCategories]",
    },
  ];

  return (
    <View style={[styles.container]}>
      <View style={styles.leftElements}>
        {categoriesLeft.map((category, index) => (
          <View  key={`${index}-left`} style={[styles.element, themeStyles.categorieBackground, themeStyles.border]}>
            <Link
             
              href={
                {
                  pathname: category.path,
                  params: {
                    category: category.name,
                  },
                } as any
              }
              asChild
            >
              <Pressable>
                <Image
                  style={styles.elementIcon}
                  source={category.image}
                  contentFit='contain'
                />
                <View style={[styles.textContainer, themeStyles.border]}>
                  <Text style={[styles.elementText, themeStyles.categorieText]}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
      <View style={styles.rightElements}>
        {categoriesRight.map((category, index) => (
          <View
            key={`${index}-right`}
            style={[styles.element, themeStyles.categorieBackground, themeStyles.border]}
          >
            <Link
              href={
                {
                  pathname: category.path,
                  params: {
                    category: category.name,
                  },
                } as any
              }
              asChild
            >
              <Pressable>
                <Image
                  style={styles.elementIcon}
                  source={category.image}
                  contentFit='contain'
                />
                <View style={[styles.textContainer, themeStyles.border]}>
                  <Text style={[styles.elementText, themeStyles.categorieText]}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end", // Align children to the bottom
   
  },
  leftElements: {
    height: "100%",
    width: "50%",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  rightElements: {
    height: "100%",
    width: "50%",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  element: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: "33%",
    width: "70%",
    margin: 15,
    textAlign: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#eff8fc",
    justifyContent: "flex-end",
    paddingHorizontal: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  elementIcon: {
    width: "90%",
    height: "60%",
    alignSelf: "center",
  },
  textContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 5,
    width: "80%",
    alignSelf: "center",
  },
  elementText: {
    fontSize: 10,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
    paddingHorizontal: 5,
  },
});
