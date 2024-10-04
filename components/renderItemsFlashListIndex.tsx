import React from "react";
import { FlatList, useColorScheme } from "react-native";
import { View, Text } from "./Themed";
import { Image } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import { deletePosts } from "components/deletePosts";
import { Dimensions } from "react-native";
import Colors from "constants/Colors";
import { StyleSheet } from "react-native";
import ImageCount from "./ImageCount";
import { useState } from "react";
import { coustomTheme } from "./coustomTheme";
interface RenderItemsFlashListProps {
  item: any;
  isLoggedIn: boolean;
}

export const RenderItemsFlashList = ({
  item,
  isLoggedIn,
}: RenderItemsFlashListProps) => {
  const screenWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);

  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  // Get the current index of image for setting the icon
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (screenWidth - 40));
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.newsContainer, themeStyles.containerContrast]}>
      <View style={styles.newsHeader}>
        <Image
          style={styles.newsImageMaher}
          source={require("assets/images/ask.png")}
          contentFit='contain'
        />
        <Text style={styles.newsHeaderText}>Islam-Fragen</Text>
        {isLoggedIn ? (
          <FontAwesome
            name='trash-o'
            size={24}
            style={themeStyles.trashIcon}
            onPress={() => deletePosts(item.id)}
          />
        ) : null}
      </View>
      <View style={styles.newsContentTextContainer}>
        {item.title && <Text style={styles.newsTitleText}>{item.title}</Text>}
        {item.content && (
          <Text style={styles.newsContentText}>{item.content}</Text>
        )}
        {item.imagePaths && item.imagePaths.length == 1 ? (
          <View style={styles.ImageContainer}>
            <Image
              contentFit='cover'
              style={styles.newsImageSingle}
              source={{ uri: item.imagePaths[0] }}
              recyclingKey={`${item.imagePaths[0]}`}
            />
          </View>
        ) : item.imagePaths && item.imagePaths.length > 1 ? (
          (() => {
            const repeatCount = item.imagePaths ? item.imagePaths.length : 0;

            const characterCurrent = (
              <FontAwesome
                name='circle'
                size={10}
                style={themeStyles. characterCountNewsImage} />
            );
            const characterNext = (
              <FontAwesome
                name='circle-o'
                size={10}
                style={themeStyles. characterCountNewsImage}
              />
            );

            // Set Array with the icons based on index
            let displayImageCounter = new Array(repeatCount).fill(
              characterNext
            );
            displayImageCounter[currentIndex] = characterCurrent;

            return (
              <View style={styles.FlatListContainer}>
                <FlatList
                  horizontal
                  style={styles.FlatListImageStyle}
                  pagingEnabled
                  disableIntervalMomentum
                  showsHorizontalScrollIndicator={false}
                  decelerationRate='fast'
                  keyExtractor={(item, index) => `${item}-${index}`}
                  snapToInterval={screenWidth - 40}
                  snapToAlignment={"start"}
                  data={item.imagePaths}
                  renderItem={({ item, index }) => (
                    <View style={styles.ImageContainer}>
                      <Image
                        contentFit='cover'
                        style={styles.newsImageSeveral}
                        source={{ uri: item }}
                        recyclingKey={`${item}-${index}`}
                      />
                    </View>
                  )}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
                />
                {repeatCount > 1 && (
                  <ImageCount displayImageCounter={displayImageCounter} />
                )}
              </View>
            );
          })()
        ) : null}
      </View>
    </View>
  );
};
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    flex: 0.1,
    marginTop: 20,
    marginHorizontal: 14,
  },
  headerTitle: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  activityContainer: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  activityText: {
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 0.9,
  },
  newsContainer: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  newsHeader: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  newsImageMaher: {
    height: 30,
    width: 30,
  },
  newsHeaderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  newsContentTextContainer: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  newsTitleText: {
    fontSize: 25,
    fontWeight: "bold",
    textDecorationLine: "underline",
    paddingBottom: 15,
  },
  newsContentText: {
    backgroundColor: "transparent",
    fontSize: 18,
    lineHeight: 28,
  },
  toTopButton: {
    position: "absolute",
    backgroundColor: "transparent",
    top: 200,
    right: 10,
    zIndex: 1,
  },
  FlatListImageStyle: {
    flex: 1,
    backgroundColor: "transparent",
    paddingLeft: 3.5,
  },
  ImageContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  ImageContainerFooter: {
    marginTop: 15,
    padding: 5,
    flexDirection: "row",
    borderRadius: 30,
  },
  ImageContainerFooterIcons: {
    padding: 5,
  },
  newsImageSeveral: {
    width: screenWidth - 50,
    height: "auto",
    marginRight: 10,
    aspectRatio: 0.8,
  },
  newsImageSingle: {
    width: screenWidth - 50,
    height: "auto",
    aspectRatio: 0.8,
  },

  FlatListContainer: {
    flex: 1,
    alignItems: "center",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
});
