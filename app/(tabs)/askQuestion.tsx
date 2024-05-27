//dasboard-neu:
import {
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { View, Text } from "components/Themed";
import Colors from "constants/Colors";
import { TouchableWithoutFeedback } from "react-native";
import { Pressable, Modal } from "react-native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { coustomTheme } from "components/coustomTheme";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import { useSendQuestion } from "components/useSendQuestion";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Platform } from "react-native";
import { useRef } from "react";
import { Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";

interface Email {
  name: string;
  age: number;
  email: string;
  marja: string;
  gender: string;
  question: string;
}
export default function askQuestion() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);

  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [validateEmail, setValidateEmail] = useState<string>("");
  const [marja, setMarja] = useState<string>("");
  const [gender, setgender] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [acceptRules, setAcceptRules] = useState<boolean>(false);
  const [isPickerVisibleMarja, setIsPickerVisibleMarja] = useState(false);
  const { sendEmail } = useSendQuestion();

  const scrollViewRef = useRef(null);

  const genderOptions = [
    { label: "Männlich", value: "Männlich" },
    { label: "Weiblich ", value: "Weiblich" },
  ];

  const marjaOptions = [
    { label: "Sayid al-Khamenei", value: "Sayid al-Khamenei" },
    { label: "Sayid as-Sistani", value: "Sayid as-Sistani" },
    { label: "Keine Rechtsfrage", value: "Keine Rechtsfrage" },
  ];

  const handleCheckboxChangeGender = (value: string) => {
    setgender(value);
  };

  const validateForm = () => {
    if (
      !age ||
      !email ||
      !validateEmail ||
      !question ||
      question.trim() === ""
    ) {
      Alert.alert("Fehler", "Bitte fülle alle Pflichtfelder aus!");
      return false;
    }

    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber <= 0) {
      Alert.alert("Fehler", "Bitte gebe ein gültiges Alter ein!");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Fehler", "Bitte gebe eine gültige E-Mail-Adresse ein!");
      return false;
    }

    if (email !== validateEmail) {
      Alert.alert("Fehler", "Die E-Mail-Adressen stimmen nicht überein!");
      return false;
    }

    if (marja == null) {
      Alert.alert("Fehler", "Bitte wähle einen Marja aus!");
      return false;
    }

    if (!acceptRules) {
      Alert.alert(
        "Fehler",
        "Bitte lies die Richtlinen und akzeptiere sie um die E-Mail versenden zu können!"
      );
      return false;
    }

    return true;
  };

  const send = async () => {
    if (validateForm()) {
      const success = await sendEmail(
        name,
        age,
        email,
        marja,
        gender,
        question
      );
      if (success) {
        Toast.show({
          type: "success",
          text1: "Frage erfolgreich gesendet!",
          text2: "Du erhälst die Antwort in wenigen Tagen als Email",
        });
        router.navigate("(elements)");
      } else {
        Toast.show({
          type: "error",
          text1: "Fehler",
          text2: "Versuch es später erneut",
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Submit button */}
          <Stack.Screen
            options={{
              headerTitle: "Eine Frage stellen",
              headerRight: () => (
                <View style={styles.headerButton}>
                  <Pressable onPress={() => send()}>
                    <Text style={styles.submitButtonText}>Senden</Text>
                  </Pressable>
                </View>
              ),
            }}
          />
          <ScrollView
            contentContainerStyle={styles.contactContainer}
            ref={scrollViewRef}
            // Makes Question input jump up when keyboard visible
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <TextInput
              style={[
                styles.input,
                styles.inputName,
                themeStyles.inverseTextInput,
              ]}
              onChangeText={setName}
              value={name}
              placeholder='Name (optional)'
              keyboardType='default'
            />
            <TextInput
              style={[
                styles.input,
                styles.inputAge,
                themeStyles.inverseTextInput,
              ]}
              onChangeText={setAge}
              value={age}
              placeholder='Alter (Pflicht)'
              keyboardType='numeric'
            />
            <TextInput
              style={[
                styles.input,
                styles.inputEmail,
                themeStyles.inverseTextInput,
              ]}
              onChangeText={setEmail}
              value={email}
              placeholder='E-Mail (Pflicht)'
              keyboardType='email-address'
            />
            <TextInput
              style={[
                styles.input,
                styles.inputEmail,
                themeStyles.inverseTextInput,
              ]}
              onChangeText={setValidateEmail}
              value={validateEmail}
              placeholder='E-Mail wiederholen (Pflicht)'
              keyboardType='email-address'
            />
            <View style={styles.checkboxContainerGender}>
              {genderOptions.map((option) => (
                <View key={option.value} style={styles.checkboxView}>
                  <Checkbox
                    style={styles.checkboxElementGender}
                    value={gender === option.value}
                    onValueChange={() => setgender(option.value)}
                  />
                  <Text style={styles.genderLable}>{option.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.ContainerModalMarja}>
              <TextInput
                onPress={() => setIsPickerVisibleMarja(true)}
                style={styles.modalTextInput}
                value={marja}
                editable={false}
                placeholder="-- Wähle deinen Marja aus --"
              />
            </View>
            <Modal
              visible={isPickerVisibleMarja}
              transparent={true}
              animationType='slide'
              onRequestClose={() => setIsPickerVisibleMarja(false)}
            >
              <View style={[styles.modalContainer, themeStyles.modalQuestionBlurredBackground]}>
                <View
                  style={[styles.pickerContainer, themeStyles.modalQuestion]}
                >
                  <Picker
                    selectedValue={marja}
                    onValueChange={(itemValue) => {
                      setMarja(itemValue);

                      // Dismiss Picker
                      setIsPickerVisibleMarja(false);
                    }}
                  >
                    {marjaOptions.map((option) => (
                      <Picker.Item
                        key={option.label}
                        label={option.label}
                        value={option.label}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>

            <View style={styles.rules}>
              <Checkbox
                style={styles.rulesCheckbox}
                value={acceptRules}
                onValueChange={() => setAcceptRules(!acceptRules)}
              />

              <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Ich habe die</Text>
                <Link
                  href='rulesModal/modal'
                  style={[styles.link, themeStyles.link]}
                >
                  Richtlinien
                </Link>
                <Text style={styles.linkText}>gelesen und akzeptiert.</Text>
              </View>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.inputQuestion,
                themeStyles.inverseTextInput,
              ]}
              onChangeText={setQuestion}
              value={question}
              placeholder='Frage (Pflicht)'
              multiline={true}
              keyboardType='default'
            />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerButton: {
    backgroundColor: "transparent",
    marginRight: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: Colors.light.link,
  },
  contactContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
  },
  input: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
  },
  inputName: {},
  inputAge: {},
  inputEmail: {},
  checkboxContainerGender: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginRight: 10,
    marginTop: 30,
    marginBottom: 30,
  },
  checkboxView: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 20,
  },
  ContainerModalMarja: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 30,
  },
  modalTextInput: {
    textAlign: "center",
    fontSize: 16,
   
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
  checkboxElementGender: {
    borderRadius: 30,
    marginRight: 7,
  },

  genderLable: {},
  marjaLable: {},
  rules: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 30,
  },
  rulesCheckbox: {
    marginRight: 7,
  },
  linkContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  linkText: {
    marginLeft: 2,
    marginRight: 2,
    fontSize: 14,
  },
  link: {
    marginLeft: 2,
    marginRight: 2,
    fontWeight: "bold",
    fontSize: 14,
  },

  inputQuestion: {
    flex: 1,
    marginBottom: 50,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 20,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    lineHeight: 30,
  },
});
