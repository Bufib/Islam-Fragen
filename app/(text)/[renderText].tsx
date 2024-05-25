import { View, Text } from "components/Themed";
import {
  StyleSheet,
  Pressable,
  Appearance,
  Platform,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useFetchText from "components/useFetchText";
import Colors from "constants/Colors";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useIsChanging } from "components/favStore";
import Markdown from "react-native-markdown-display";
import { FlashList } from "@shopify/flash-list";
import { storeFavorites, getFavorites } from "components/manageFavorites";
import { useMemo } from "react";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import useBookmarks from "components/useBookmarks";
import useFavorites from "components/useFavorites";
import useDownload from "components/useDownload";
import { coustomTheme } from "components/coustomTheme";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { useSetFontSize } from "components/fontSizeStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Network from "expo-network";
import * as Clipboard from "expo-clipboard";

export default function renderText() {
  const { id, table, title } = useLocalSearchParams<{
    id: string;
    table: string;
    title: string;
  }>();

  const { headerTitle, question, answers, fetchError, singleAnswer } =
    useFetchText(id, table);

  const key = `text-${id}-${table}`;
  const appColor = Appearance.getColorScheme();
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const { bookmarks, toggleBookmark } = useBookmarks(key);
  const { fontSize, lineHeight } = useSetFontSize();
  const { toggleFavorite, isInFavorites } = useFavorites();
  const {
    updateDownload,
    isDownloaded,
    downloadedText,
    loadDownloadedText,
    toggleDownload,
  } = useDownload(key, headerTitle, question, answers, singleAnswer);
  const [marja, setMarja] = useState<string[]>([]);
  const [isCopiedMultiple, setIsCopiedMultiple] = useState({
    khamenei: false,
    sistani: false,
  });
  const [isCopiedSingle, setIsCopiedSingle] = useState(false);
  const [copiedText, setCopiedText] = useState<string>("");
  const timeoutRef = useRef(null);

  // clean Timout
  const cleanTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Update exisitng Data in Asynscstorage
  useLayoutEffect(() => {
    async function handleDataLoad() {
      const networkState = await Network.getNetworkStateAsync();
      if (networkState.isConnected && networkState.isInternetReachable) {
        await updateDownload();
      }
    }
    loadDownloadedText();
    handleDataLoad();
  }, [id, table]);

  useEffect(() => {
    return () => {
      // Clear timeout when component unmounts
      cleanTimeout();
    };
  }, []);

  const displayQuestion = downloadedText?.question || question;
  const displaySingleAnswer = downloadedText?.singleAnswer || singleAnswer;
  const displayAnswers = downloadedText?.answers || answers;

  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);

  const images = {
    sistani: require("assets/images/sistani.jpg"),
    khamenei: require("assets/images/khamenei.jpg"),
  };

  const marjaOptions = [
    { label: "Sayid al-Khamenei", value: "khamenei" },
    { label: "Sayid as-Sistani", value: "sistani" },
  ];

  const handleCheckboxChange = (value: string) => {
    setMarja((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Filter Markdown from copied Text
  const regex = /(\*\*|\*|######|#####|####|###|##|#)/g;

  const filteredAnswers =
    marja.length > 0
      ? displayAnswers.filter((answer) => marja.includes(answer.name))
      : [];

  const copyMultipleAnswers = async (marja: string, text: string) => {
    await Clipboard.setStringAsync(text.replace(regex, ""));
    setCopiedText(text.replace(regex, ""));
    setIsCopiedMultiple((prev) => ({ ...prev, [marja]: true }));

    // Clear any existing timeout
    cleanTimeout();

    timeoutRef.current = setTimeout(
      () => setIsCopiedMultiple((prev) => ({ ...prev, [marja]: false })),
      1000
    );
  };

  const copySingleAnswer = async (text: string) => {
    await Clipboard.setStringAsync(text.replace(regex, ""));
    setCopiedText(text.replace(regex, ""));
    setIsCopiedSingle(true);

    // Clear any existing timeout
    cleanTimeout();

    timeoutRef.current = setTimeout(() => setIsCopiedSingle(false), 1000);
  };

  return (
    <View style={styles.container}>
      {/* Change header Title */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.buttonsHeaderContainer}>
              {isDownloaded ? (
                <MaterialCommunityIcons
                  name='file-remove-outline'
                  size={24}
                  color={colorScheme == "dark" ? "white" : "black"}
                  onPress={toggleDownload}
                />
              ) : (
                <Feather
                  name='download'
                  size={24}
                  color={colorScheme == "dark" ? "white" : "black"}
                  onPress={toggleDownload}
                />
              )}

              <AntDesign
                name={isInFavorites(id, table) ? "star" : "staro"}
                size={24}
                color={Colors.light.star}
                onPress={() => toggleFavorite(id, table, title)}
              />
            </View>
          ),
          headerTitle: downloadedText?.headerTitle || headerTitle,
        }}
      />
      {fetchError && !isDownloaded ? (
        <View style={styles.renderError}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      ) : displaySingleAnswer ? (
        <ScrollView style={styles.answerContainer}>
          <View style={[styles.questionContainer, themeStyles.container]}>
            <Text style={styles.questionText}>{displayQuestion}</Text>
          </View>
          <View style={[styles.singleAnswers, themeStyles.container]}>
            <View style={styles.copyContainerSingle}>
              {isCopiedSingle ? (
                <View style={styles.copyDoneContainer}>
                  <MaterialIcons name='done' size={24} color={colorScheme == "dark" ? "white" : "black" } />
                  <Text style={styles.copyDoneText}>Text Kopiert!</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => copySingleAnswer(displaySingleAnswer)}
                >
                  <AntDesign name='copy1' size={24} color={colorScheme == "dark" ? "white" : "black" } />
                </Pressable>
              )}
            </View>
            <Markdown
              style={{
                body: {
                  ...themeStyles.text,
                  fontSize: fontSize,
                  lineHeight: lineHeight,
                  fontFamily: Platform.OS === "ios" ? "Helvetica" : "Roboto",
                },
                heading1: {
                  fontSize: fontSize + 5,
                },
                heading2: {
                  ...themeStyles.text,
                  fontSize: fontSize + 10,
                  textAlign: "center",
                },
                heading3: {
                  ...themeStyles.text,
                  fontSize: fontSize + 10,
                  fontWeight: "bold",
                },
                heading4: {
                  ...themeStyles.text,
                  fontSize: fontSize + 10,
                  textAlign: "center",
                  fontWeight: "bold",
                },
                heading5: {
                  ...themeStyles.text,
                  fontSize: fontSize + 10,
                },
                heading6: {
                  ...themeStyles.text,
                  fontSize: fontSize,
                  textAlign: "center",
                },
              }}
            >
              {displaySingleAnswer}
            </Markdown>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.answerContainer}>
          <View style={[styles.questionContainer, themeStyles.container]}>
            <Text style={styles.questionText}>{displayQuestion}</Text>
          </View>
          <View style={styles.marjaChoiceContainer}>
            {marjaOptions.map((option) => (
              <View key={option.value} style={styles.marjaChoice}>
                <Checkbox
                  style={styles.marjaCheckbox}
                  value={marja.includes(option.value)}
                  onValueChange={() => handleCheckboxChange(option.value)}
                />
                <Text style={styles.marjaLable}>{option.label}</Text>
              </View>
            ))}
          </View>
          {filteredAnswers.map((answer, index) => (
            <View key={index} style={[styles.answers, themeStyles.container]}>
              <View style={styles.copyContainer}>
                {isCopiedMultiple[answer.name] ? (
                  <View style={styles.copyDoneContainer}>
                    <MaterialIcons name='done' size={24} color={colorScheme == "dark" ? "white" : "black" }/>
                    <Text style={styles.copyDoneText}>Text Kopiert!</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      copyMultipleAnswers(answer.name, answer.answer)
                    }
                  >
                    <AntDesign name='copy1' size={24} color={colorScheme == "dark" ? "white" : "black" } />
                  </Pressable>
                )}
              </View>
              <View style={[styles.headerContainer, , themeStyles.container]}>
                <View style={styles.headerImage}>
                  <Image
                    source={images[answer.name]}
                    style={styles.image}
                    contentFit='cover'
                  />
                </View>
                <View style={[styles.headerText, themeStyles.container]}>
                  <Text style={styles.marjaText}>{answer.marja}</Text>
                </View>
              </View>
              <Markdown
                style={{
                  body: {
                    ...themeStyles.text,
                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    fontFamily: Platform.OS === "ios" ? "Helvetica" : "Roboto",
                  },
                  heading1: {
                    fontSize: fontSize + 5,
                  },
                  heading2: {
                    ...themeStyles.text,
                    fontSize: fontSize + 10,
                    textAlign: "center",
                  },
                  heading3: {
                    ...themeStyles.text,
                    fontSize: fontSize + 10,
                    fontWeight: "bold",
                  },
                  heading4: {
                    ...themeStyles.text,
                    fontSize: fontSize + 10,
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                  heading5: {
                    ...themeStyles.text,
                    fontSize: fontSize + 10,
                  },
                  heading6: {
                    ...themeStyles.text,
                    fontSize: fontSize,
                    textAlign: "center",
                  },
                }}
              >
                {answer.answer}
              </Markdown>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsHeaderContainer: {
    flexDirection: "row",
    gap: 15,
    backgroundColor: "transparent",
    marginLeft: 5,
  },
  FlashContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 30,
  },
  answerContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },

  questionContainer: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  questionText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  singleAnswers: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 5,
    borderWidth: 1,
    borderRadius: 10,
  },

  answers: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 15,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  copyContainerSingle: {
    marginTop: 10,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  copyContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  copyDoneSingleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
    marginTop: 10,
  },
  copyDoneContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  copyDoneText: {
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  marjaChoiceContainer: {
    flexDirection: "row",
    margin: 20,
    justifyContent: "space-around",
  },
  marjaChoice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  marjaCheckbox: {},
  marjaLable: {
    marginTop: 5,
    paddingLeft: 5,
  },
  headerImage: {},
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  headerText: {},
  marjaText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  bookmark: {
    paddingTop: 7,
  },
  toTopButton: {
    position: "absolute",
    top: 300,
    right: 10,
    zIndex: 1,
  },
  index: {
    marginTop: 10,
    textAlign: "center",
  },
  renderError: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 12,
    paddingRight: 12,
  },
  errorText: {
    fontSize: 20,
    color: Colors.light.error,
    textAlign: "center",
  },
});
