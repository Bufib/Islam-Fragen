import React from "react";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { Text, View } from "./Themed";
import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import CustomMarkdown from "components/MarkdownRenderText";
import { Image } from "expo-image";
import Checkbox from "expo-checkbox";
import { regex } from "./regexPatternRenderText";
import NoConnection from "components/NoConnection";

interface MultipleAnswersProps {
  themeStyles: any;
  displayQuestion: string | undefined;
  lineHeight: number;
  fontSize: number;
  marjaOptions: { label: string; value: string }[];
  marja: string[];
  handleCheckboxChange: (value: string) => void;
  isCopiedMultiple: { [key: string]: boolean };
  copyMultipleAnswers: (params: any) => void;
  setCopiedText: React.Dispatch<React.SetStateAction<string>>;
  setIsCopiedMultiple: any;
  cleanTimeout: () => void;
  timeoutRef: React.MutableRefObject<any>;
  colorScheme: string | undefined | null;
  images: { [key: string]: any };
  displayAnswers: { marja: string; answer: string | undefined }[];
  isConnected: boolean | undefined | null;
}

const MultipleAnswers: React.FC<MultipleAnswersProps> = ({
  themeStyles,
  displayQuestion,
  lineHeight,
  fontSize,
  marjaOptions,
  marja,
  handleCheckboxChange,
  displayAnswers,
  isCopiedMultiple,
  copyMultipleAnswers,
  setCopiedText,
  setIsCopiedMultiple,
  cleanTimeout,
  timeoutRef,
  colorScheme,
  images,
  isConnected,
}) => {
  const filteredAnswers =
    marja.length > 0
      ? displayAnswers.filter(
          (answer: any) =>
            marja.includes(answer.marja) && typeof answer.answer === "string"
        )
      : [];

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
        {!isConnected && <NoConnection />}
        <View style={styles.marjaChoiceContainer}>
          {marjaOptions.map((option) => (
            <Pressable key={option.value} style={styles.marjaChoice} onPress={() => handleCheckboxChange(option.value)}>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  style={styles.marjaCheckbox}
                  value={marja.includes(option.value)}
                  onValueChange={() => handleCheckboxChange(option.value)}
                />
              </View>
              <Text style={styles.marjaLable}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.answersContainer}>
          {filteredAnswers.map((answer, index) => (
            <View
              key={index}
              style={[styles.answers, themeStyles.containerContrast]}
            >
              <View style={styles.copyContainer}>
                {isCopiedMultiple[answer.marja] ? (
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
                      copyMultipleAnswers({
                        marja: answer.marja,
                        text: answer.answer,
                        regex,
                        setCopiedText,
                        setIsCopiedMultiple,
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
              <CustomMarkdown content={answer.answer} />
            </View>
          ))}
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
  checkboxContainer: {
    
  },
  marjaCheckbox: {
    width: 28,
    height: 28,
  },
  marjaLable: {
    fontSize: 14,
    marginTop: 5,
    paddingLeft: 5,
    fontWeight: "bold",
  },
  noConnectionContainer: {
    marginBottom: 20,
  },
  answersContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  answers: {
    width: "100%",
    height: "auto",
    marginBottom: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  copyContainer: {
    backgroundColor: "transparent",
    height: 30,
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

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  headerImage: {
    backgroundColor: "transparent",
  },
  image: {
    width: 100,
    height: 100,
    marginLeft: 10,
    borderRadius: 10,
  },
  headerText: {},
  marjaText: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 20,
  },
});

export default MultipleAnswers;
