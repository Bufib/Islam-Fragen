import { View, Text } from "components/Themed";
import { StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useFetchText } from "components/useFetchText";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { useRef } from "react";
import useFavorites from "components/useFavorites";
import { coustomTheme } from "components/coustomTheme";
import { useSetFontSize } from "components/fontSizeStore";
import { formatTitle } from "components/formatTitle";
import FontSizePickerModal from "components/FontSizePickerModal";
import SingleAnswer from "components/SingleAnswerRenderText";
import HeaderRight from "components/HeaderRightRenderText";
import MultipleAnswers from "components/MultipleAnswersRenderText";
import { copySingleAnswer } from "components/copySingleAnswer";
import { copyMultipleAnswers } from "components/copyMultipleAnswers";
import { getMarjaData } from "components/getMarjaData";

import Toast from "react-native-toast-message";
import useNetworkStore from "components/useNetworkStore";

export default function RenderText() {
  // Get local params for each text
  const { id, table, title } = useLocalSearchParams<{
    id: string;
    table: string;
    title: string;
  }>();

  // Fetch the text primary from Asyncstorage -> If not available - > fetch
  const { item, fetchError, isFetching } = useFetchText(
    table || "",
    title || ""
  );
  const {
    fontSize,
    lineHeight,
    pickerValue,
    setFontSize,
    setLineHeight,
    setPickerValue,
    initializeSettings,
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
  const themeStyles = coustomTheme();

  const [isCopiedMultiple, setIsCopiedMultiple] = useState({
    "Sayid al-Khamenei": false,
    "Sayid as-Sistani": false,
  });

  // Get the fiting data
  const { displayAnswers, images, marjaOptions } = getMarjaData(
    item || undefined
  );

  const handleCheckboxChange = (value: string) => {
    setMarja((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Clean Timeout
  const cleanTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  //  Network status tracking
  const isConnected = useNetworkStore((state) => state.isConnected);

  useEffect(() => {
    return () => {
      // Clear timeout when component unmounts
      cleanTimeout();
    };
  }, []);

  // Check for internet conncetion
  useEffect(() => {
    if (isConnected === null) {
      // Waiting for network state to be determined, so do nothing for now
      return;
    }

    if (isConnected === false) {
      Toast.show({
        type: "error",
        text1: "Keine Internetverbindung!",
      });
    }
  }, [isConnected]);

  // Initialize Fontsettings
  useLayoutEffect(() => {
    initializeSettings();
  }, []);

  return (
    <View style={styles.container}>
      {/* Change header Title */}
      <FontSizePickerModal
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        pickerValue={pickerValue}
        setPickerValue={setPickerValue}
        setFontSize={setFontSize}
        setLineHeight={setLineHeight}
      />
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderRight
              isInFavorites={isInFavorites}
              id={id}
              table={table}
              title={title}
              toggleFavorite={toggleFavorite}
              setIsPickerVisible={setIsPickerVisible}
            />
          ),
          headerTitle: item ? formatTitle(item.title) : "",
        }}
      />

      {fetchError ? (
        <View style={styles.renderError}>
          <Text style={[styles.errorText, themeStyles.error]}>
            {fetchError}
          </Text>
        </View>
      ) : displaySingleAnswer ? (
        <SingleAnswer
          themeStyles={themeStyles}
          displayQuestion={displayQuestion}
          lineHeight={lineHeight}
          fontSize={fontSize}
          displaySingleAnswer={displaySingleAnswer}
          isCopiedSingle={isCopiedSingle}
          copySingleAnswer={copySingleAnswer}
          setCopiedText={setCopiedText}
          setIsCopiedSingle={setIsCopiedSingle}
          cleanTimeout={cleanTimeout}
          timeoutRef={timeoutRef}
          colorScheme={colorScheme}
          isConnected={isConnected}
        />
      ) : (
        <MultipleAnswers
          themeStyles={themeStyles}
          displayQuestion={displayQuestion}
          lineHeight={lineHeight}
          fontSize={fontSize}
          marjaOptions={marjaOptions}
          marja={marja}
          displayAnswers={displayAnswers}
          handleCheckboxChange={handleCheckboxChange}
          isCopiedMultiple={isCopiedMultiple}
          copyMultipleAnswers={copyMultipleAnswers}
          setCopiedText={setCopiedText}
          setIsCopiedMultiple={setIsCopiedMultiple}
          cleanTimeout={cleanTimeout}
          timeoutRef={timeoutRef}
          colorScheme={colorScheme}
          images={images}
          isConnected={isConnected}
        />
      )}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});
