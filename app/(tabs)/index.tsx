import { View, Text, SafeAreaView } from "components/Themed";
import Colors from "constants/Colors";
import fetchNews from "components/fetchNews";
import { useAuthStore } from "components/authStore";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState, useRef, useMemo } from "react";
import { useIsUpLoading } from "components/uploadingStore";
import { FlashList } from "@shopify/flash-list";
import { Feather } from "@expo/vector-icons";
import { RenderItemsFlashList } from "components/renderItemsFlashListIndex";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  RefreshControl,
  Appearance,
  useColorScheme,
} from "react-native";


export default function index() {
  const [refreshing, setRefreshing] = useState(false);
  const { posts, fetchError, refetch, updateAvailable, applyUpdates } =
    fetchNews();
  const { isLoading } = useIsUpLoading();
  const { isLoggedIn } = useAuthStore();
  const scrollRef = useRef<any>();
  const colorScheme = useColorScheme();
  const appColor = Appearance.getColorScheme();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD_NEW_UPDATE = 5;
  const CONTENT_OFFSET_THRESHOLD_UP = 300;

  // Darkmode style change
  const themeErrorStyle = useMemo(
    () =>
      colorScheme === "light" ? styles.lightThemeError : styles.darkThemeError,
    [colorScheme]
  );

  const themeContainerStyle = useMemo(
    () =>
      colorScheme === "light" ? styles.lightContainer : styles.darkContainer,
    [colorScheme]
  );

  const themeButtonStyle = useMemo(
    () => (colorScheme === "light" ? styles.lightButton : styles.darkButton),
    [colorScheme]
  );

  // Update News on either reloading or pressing "Aktualisieren" button
  const updateNews = useCallback(() => {
    setRefreshing(true);

    if (contentVerticalOffset > CONTENT_OFFSET_THRESHOLD_NEW_UPDATE) {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: false });
    }
    refetch()
      .then(() => applyUpdates())
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [applyUpdates]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Neuigkeiten</Text>
        {isLoggedIn ? (
          <Link href='/adminDashboard' asChild>
            <Pressable>
              <MaterialIcons
                name='add-circle-outline'
                size={34}
                style={themeButtonStyle}
              />
            </Pressable>
          </Link>
        ) : null}
      </View>
      <View style={styles.mainContainer}>
        {isLoading ? (
          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>
              Neuer Beitrag wird hochgeladen!
            </Text>
            <ActivityIndicator size='large' color='#009432' />
          </View>
        ) : null}
        {updateAvailable && (
          <View style={styles.updateContainer}>
            <Pressable style={styles.updateButton} onPress={() => updateNews()}>
              <Text style={styles.updateButtonText}>Aktualisieren</Text>
            </Pressable>
          </View>
        )}
        {posts.length == 0 && !fetchError ? (
          <ScrollView
            style={styles.renderError}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={updateNews} />
            }
          >
            <Text style={styles.emptyText}>
              Es gibt derzeit noch keine {"\n"} Neugikeiten!
            </Text>
          </ScrollView>
        ) : null}

        {fetchError ? (
          <View style={styles.renderError}>
            <Text style={[styles.errorText, themeErrorStyle]}>
              {fetchError}
            </Text>
          </View>
        ) : (
          <View style={styles.FlashContainer}>
            {contentVerticalOffset > CONTENT_OFFSET_THRESHOLD_UP && (
              <Pressable
                style={styles.toTopButton}
                onPress={() => {
                  scrollRef.current.scrollToOffset(true, 0);
                }}
              >
                <Feather
                  name='arrow-up-circle'
                  size={35}
                  color={colorScheme == "dark" ? "#45CE30" : "#009432"}
                />
              </Pressable>
            )}
            <FlashList
              ref={scrollRef}
              data={posts}
              extraData={[appColor, isLoggedIn]}
              renderItem={({ item }) => (
                <RenderItemsFlashList
                  item={item}
                  isLoggedIn={isLoggedIn}
                  themeContainerStyle={themeContainerStyle}
                  colorScheme={colorScheme}
                />
              )}
              estimatedItemSize={118}
              keyExtractor={(item) => item.id.toString()}
              onRefresh={updateNews}
              refreshing={refreshing}
              onScroll={(event) => {
                setContentVerticalOffset(event.nativeEvent.contentOffset.y);
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
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
  newsImageSingel: {
    width: screenWidth - 50,
    height: "auto",
    aspectRatio: 0.8,
  },
  renderError: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  FlashContainer: {
    flex: 1,
  },
  emptyText: {
    fontSize: 25,
    lineHeight: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  updateContainer: {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  updateButton: {
    backgroundColor: "#2ecc71",
    borderWidth: 1,
    borderRadius: 30,
  },
  updateButtonText: {
    fontSize: 16,
    padding: 6,
    fontWeight: "bold",
    color: Colors.light.black,
  },
  lightThemeError: {
    color: Colors.light.error,
  },
  darkThemeError: {
    color: Colors.light.error,
  },
  lightContainer: {
    backgroundColor: Colors.light.white,
  },
  darkContainer: {
    backgroundColor: Colors.dark.contrast,
  },
  lightButton: {
    color: Colors.light.adButton,
  },
  darkButton: {
    color: Colors.dark.adButton,
  },
});
