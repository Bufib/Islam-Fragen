import React, { useEffect } from "react";
import { Modal, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "constants/Colors";
import { useColorScheme } from "react-native";
import { coustomTheme } from "./coustomTheme";

interface FontSizePickerModalProps {
  visible: boolean;
  onClose: () => void;
  pickerValue: string;
  setPickerValue: (value: string) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
}

const fontSizeOptions = [
  { label: "Klein", fontSize: 16, lineHeight: 30 },
  { label: "Mittel", fontSize: 20, lineHeight: 40 },
  { label: "Groß", fontSize: 25, lineHeight: 40 },
];

const FontSizePickerModal: React.FC<FontSizePickerModalProps> = ({
  visible,
  onClose,
  pickerValue,
  setPickerValue,
  setFontSize,
  setLineHeight,
}) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  useEffect(() => {
    const loadSavedFontSize = async () => {
      const savedFontSize = await AsyncStorage.getItem("fontSize");
      if (savedFontSize) {
        const parsedFontSize = parseInt(savedFontSize, 10);
        const selectedOption = fontSizeOptions.find(
          (option) => option.fontSize === parsedFontSize
        );
        if (selectedOption) {
          setPickerValue(selectedOption.label);
        }
      }
    };

    if (visible) {
      loadSavedFontSize();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable
        style={[
          styles.modalContainer,
          themeStyles.modalQuestionBlurredBackground,
        ]}
        onPress={onClose}
      >
        <Pressable style={[styles.pickerContainer, themeStyles.modalQuestion]} onPress={() => {}}>
          <Picker
            selectedValue={pickerValue}
            onValueChange={(itemValue) => {
              setPickerValue(itemValue);

              const selectedOption = fontSizeOptions.find(
                (option) => option.label === itemValue
              );
              if (selectedOption) {
                setFontSize(selectedOption.fontSize);
                setLineHeight(selectedOption.lineHeight);
              }
              // Dismiss Picker
              onClose();
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
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  closeButton: {
    position: "absolute",
    left: 285,
    top: -23,
  },
});

export default FontSizePickerModal;
