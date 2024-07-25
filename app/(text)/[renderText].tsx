import { View, Text } from "components/Themed";
import { StyleSheet, Pressable, Platform, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useFetchText } from "components/useFetchText";
import Colors from "constants/Colors";
import { Stack } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Markdown from "react-native-markdown-display";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import useBookmarks from "components/useBookmarks";
import useFavorites from "components/useFavorites";
import { coustomTheme } from "components/coustomTheme";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { useSetFontSize } from "components/fontSizeStore";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import { formatTitle } from "components/formatTitle";

export default function RenderText() {
  const { id, table, title } = useLocalSearchParams<{
    id: string;
    table: string;
    title: string;
  }>();

  const { item, fetchError, isFetching } = useFetchText(
    table || "",
    title || ""
  );

  const key = `text-${id}-${table}`;
  const [contentVerticalOffset, setContentVerticalOffset] = useState(0);
  const CONTENT_OFFSET_THRESHOLD = 300;
  const {
    fontSize,
    lineHeight,
    pickerValue,
    setFontSize,
    setLineHeight,
    setPickerValue,
  } = useSetFontSize();
  const { toggleFavorite, isInFavorites } = useFavorites();
  const [marja, setMarja] = useState<string[]>([]);
  const [isCopiedSingle, setIsCopiedSingle] = useState(false);
  const [copiedText, setCopiedText] = useState<string>("");
  const timeoutRef = useRef(null);
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const displayQuestion = item?.question;
  const displaySingleAnswer = item?.answer;
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);
  const [isCopiedMultiple, setIsCopiedMultiple] = useState({
    "Sayid al-Khamenei": false,
    "Sayid as-Sistani": false,
  });
  const displayAnswers = [
    { marja: "Sayid al-Khamenei", answer: item?.answer_khamenei },
    { marja: "Sayid as-Sistani", answer: item?.answer_sistani },
  ];

  const images = {
    "Sayid as-Sistani": require("assets/images/sistani.png"),
    "Sayid al-Khamenei": require("assets/images/khamenei.png"),
  };

  const marjaOptions = [
    { label: "Sayid al-Khamenei", value: "Sayid al-Khamenei" },
    { label: "Sayid as-Sistani", value: "Sayid as-Sistani" },
  ];

  const fontSizeOptions = [
    { label: "Klein", fontSize: 16, lineHeight: 30 },
    { label: "Mittel", fontSize: 20, lineHeight: 40 },
    { label: "Groß", fontSize: 25, lineHeight: 40 },
  ];

  // Clean Timeout
  const cleanTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useLayoutEffect(() => {
    return () => {
      // Clear timeout when component unmounts
      cleanTimeout();
    };
  }, []);

  const handleCheckboxChange = (value: string) => {
    setMarja((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Filter Markdown from copied Text
  const regex = /(\*\*|\*|######|#####|####|###|##|#)/g;

  const filteredAnswers =
    marja.length > 0
      ? displayAnswers.filter(
          (answer) =>
            marja.includes(answer.marja) && typeof answer.answer === "string"
        )
      : [];

  const copyMultipleAnswers = async (marja: string, text: string) => {
    if (typeof text !== "string") return;
    const cleanedText = text.replace(regex, "");
    await Clipboard.setStringAsync(`${marja}: ${cleanedText}`);
    setCopiedText(`${marja}: ${cleanedText}`);
    setIsCopiedMultiple((prev) => ({ ...prev, [marja]: true }));

    // Clear any existing timeout
    cleanTimeout();

    timeoutRef.current = setTimeout(
      () => setIsCopiedMultiple((prev) => ({ ...prev, [marja]: false })),
      1000
    );
  };

  const copySingleAnswer = async (text: string) => {
    if (typeof text !== "string") return;
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
      <Modal
        visible={isPickerVisible}
        transparent={true}
        animationType='slide'
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View
          style={[
            styles.modalContainer,
            themeStyles.modalQuestionBlurredBackground,
          ]}
        >
          <View style={[styles.pickerContainer, themeStyles.modalQuestion]}>
            <Picker
              selectedValue={pickerValue}
              onValueChange={(itemValue) => {
                setPickerValue(itemValue);

                // Zustand Store
                const selectedOption = fontSizeOptions.find(
                  (option) => option.label === itemValue
                );
                if (selectedOption) {
                  setFontSize(selectedOption.fontSize);
                  setLineHeight(selectedOption.lineHeight);
                }

                // Dismiss Picker
                setIsPickerVisible(false);
              }}
            >
              {fontSizeOptions.map((option) => (
                <Picker.Item
                  key={option.label}
                  label={option.label}
                  value={option.label}
                  color={
                    colorScheme == "light"
                      ? Colors.light.modalQuestionText
                      : Colors.dark.modalQuestionText
                  }
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.buttonsHeaderContainer}>
              <MaterialCommunityIcons
                name='format-letter-case'
                size={26}
                style={themeStyles.fontSizeIcon}
                onPress={() => setIsPickerVisible(true)}
              />
              <AntDesign
                name={isInFavorites(id, table) ? "star" : "staro"}
                size={24}
                style={themeStyles.favoriteIcon}
                onPress={() => toggleFavorite(id, table, title)}
              />
            </View>
          ),
          headerTitle: item ? formatTitle(item.title) : "",
        }}
      />
      {fetchError ? (
        <View style={styles.renderError}>
          <Text style={styles.errorText}>{fetchError}</Text>
        </View>
      ) : displaySingleAnswer ? (
        <ScrollView style={styles.answerContainer}>
          <View
            style={[styles.questionContainer, themeStyles.containerContrast]}
          >
            <Text
              style={[
                styles.questionText,
                { lineHeight: lineHeight, fontSize: fontSize },
              ]}
            >
              {displayQuestion}
            </Text>
          </View>
          <View style={[styles.singleAnswers, themeStyles.containerContrast]}>
            <View style={styles.copyContainerSingle}>
              {isCopiedSingle ? (
                <View style={styles.copyDoneContainer}>
                  <MaterialIcons
                    name='done'
                    size={24}
                    color={colorScheme == "dark" ? "white" : "black"}
                  />
                  <Text style={styles.copyDoneText}>Text Kopiert!</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => copySingleAnswer(displaySingleAnswer)}
                >
                  <AntDesign
                    name='copy1'
                    size={24}
                    color={colorScheme == "dark" ? "white" : "black"}
                  />
                </Pressable>
              )}
            </View>
            <Markdown
              style={{
                body: {
                  ...themeStyles.markdownText,
                  fontSize: fontSize,
                  lineHeight: lineHeight,
                  fontFamily: Platform.OS === "ios" ? "Helvetica" : "Roboto",
                },
                heading1: {
                  fontSize: fontSize + 5,
                },
                heading2: {
                  ...themeStyles.markdownText,
                  fontSize: fontSize + 10,
                  textAlign: "center",
                },
                heading3: {
                  ...themeStyles.markdownText,
                  fontSize: fontSize + 10,
                  fontWeight: "bold",
                },
                heading4: {
                  ...themeStyles.markdownText,
                  fontSize: fontSize + 10,
                  textAlign: "center",
                  fontWeight: "bold",
                },
                heading5: {
                  ...themeStyles.markdownText,
                  fontSize: fontSize + 10,
                },
                heading6: {
                  ...themeStyles.markdownText,
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
          <View
            style={[styles.questionContainer, themeStyles.containerContrast]}
          >
            <Text
              style={[
                styles.questionText,
                { lineHeight: lineHeight, fontSize: fontSize },
              ]}
            >
              {displayQuestion}
            </Text>
          </View>
          <View style={styles.marjaChoiceContainer}>
            {marjaOptions.map((option) => (
              <View key={option.value} style={styles.marjaChoice}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    style={styles.marjaCheckbox}
                    value={marja.includes(option.value)}
                    onValueChange={() => handleCheckboxChange(option.value)}
                  />
                </View>
                <Text style={styles.marjaLable}>{option.label}</Text>
              </View>
            ))}
          </View>
          {filteredAnswers.map((answer, index) => (
            <View
              key={index}
              style={[styles.answers, themeStyles.containerContrast]}
            >
              <View style={styles.copyContainer}>
                {isCopiedMultiple[answer.marja] ? (
                  <View style={styles.copyDoneContainer}>
                    <MaterialIcons
                      name='done'
                      size={24}
                      color={colorScheme == "dark" ? "white" : "black"}
                    />
                    <Text style={styles.copyDoneText}>Text Kopiert!</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() =>
                      copyMultipleAnswers(answer.marja, answer.answer)
                    }
                  >
                    <AntDesign
                      name='copy1'
                      size={24}
                      color={colorScheme == "dark" ? "white" : "black"}
                    />
                  </Pressable>
                )}
              </View>
              <View
                style={[styles.headerContainer, themeStyles.containerContrast]}
              >
                <View style={styles.headerImage}>
                  <Image
                    source={images[answer.marja]}
                    style={styles.image}
                    contentFit='cover'
                  />
                </View>
                <View
                  style={[styles.headerText, themeStyles.containerContrast]}
                >
                  <Text style={styles.marjaText}>
                    {
                      marjaOptions.find(
                        (option) => option.value === answer.marja
                      )?.label
                    }
                  </Text>
                </View>
              </View>
              <Markdown
                style={{
                  body: {
                    ...themeStyles.markdownText,

                    fontSize: fontSize,
                    lineHeight: lineHeight,
                    fontFamily: Platform.OS === "ios" ? "Helvetica" : "Roboto",
                  },
                  heading1: {
                    fontSize: fontSize + 5,
                  },
                  heading2: {
                    ...themeStyles.markdownText,
                    fontSize: fontSize + 10,
                    textAlign: "center",
                  },
                  heading3: {
                    ...themeStyles.markdownText,
                    fontSize: fontSize + 10,
                    fontWeight: "bold",
                  },
                  heading4: {
                    ...themeStyles.markdownText,
                    fontSize: fontSize + 10,
                    textAlign: "center",
                    fontWeight: "bold",
                  },
                  heading5: {
                    ...themeStyles.markdownText,
                    fontSize: fontSize + 10,
                  },
                  heading6: {
                    ...themeStyles.markdownText,
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
    justifyContent: "center",
    gap: 15,
    backgroundColor: "transparent",
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
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
    borderRadius: 10,
    padding: 10,
  },

  questionText: {
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
    justifyContent: "space-between",
  },
  marjaChoice: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxContainer: {},
  marjaCheckbox: {
    width: 28,
    height: 28,
  },
  marjaLable: {
    fontSize: 15,
    marginTop: 5,
    paddingLeft: 5,
    fontWeight: "bold",
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
