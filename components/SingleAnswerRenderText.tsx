import React from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, View } from "./Themed";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import CustomMarkdown from "components/MarkdownRenderText";
import { regex } from "components/regexPatternRenderText";

interface AnswersScrollViewProps {
  themeStyles: any;
  displayQuestion: string | undefined;
  lineHeight: number;
  fontSize: number;
  displaySingleAnswer: string;
  isCopiedSingle: boolean;
  copySingleAnswer: (params: any) => void;
  setCopiedText: React.Dispatch<React.SetStateAction<string>>;
  setIsCopiedSingle: React.Dispatch<React.SetStateAction<boolean>>;
  cleanTimeout: () => void;
  timeoutRef: React.MutableRefObject<any>;
  colorScheme: string | undefined | null;
}
const SingleAnswer: React.FC<AnswersScrollViewProps> = ({
  themeStyles,
  displayQuestion,
  lineHeight,
  fontSize,
  displaySingleAnswer,
  isCopiedSingle,
  copySingleAnswer,
  setCopiedText,
  setIsCopiedSingle,
  cleanTimeout,
  timeoutRef,
  colorScheme,

}) => {
  return (
    <ScrollView
      style={styles.answersScrollViewStyles}
      contentContainerStyle={styles.answersScrollViewContent}
    >
      <View style={styles.innerContainerScrollView}>
        <View style={[styles.questionContainer, themeStyles.containerContrast]}>
          <Text
            style={[
              styles.questionText,
              { lineHeight: lineHeight, fontSize: fontSize },
            ]}
          >
            {displayQuestion}
          </Text>
        </View>
        <View style={styles.answersContainer}>
          <View style={[styles.singleAnswers, themeStyles.containerContrast]}>
            <View style={styles.copyContainerSingle}>
              {isCopiedSingle ? (
                <View style={styles.copyDoneContainer}>
                  <Feather
                    name='check'
                    size={24}
                    color={colorScheme == "dark" ? "white" : "black"}
                  />
                  <Text style={styles.copyDoneText}>Text Kopiert!</Text>
                </View>
              ) : (
                <Pressable
                  onPress={() =>
                    copySingleAnswer({
                      text: displaySingleAnswer,
                      regex,
                      setCopiedText,
                      setIsCopiedSingle,
                      cleanTimeout,
                      timeoutRef,
                    })
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
            <CustomMarkdown content={displaySingleAnswer} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  answersScrollViewStyles: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  answersScrollViewContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  innerContainerScrollView: {
    flexDirection: "column",
    width: "95%",
    maxWidth: 700,
    backgroundColor: "transparent",
  },
  questionContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  singleAnswers: {
    height: "auto",
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  answersContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  copyContainerSingle: {
    marginTop: 10,
    height: 30,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
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
});

export default SingleAnswer;
