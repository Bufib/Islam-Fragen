import React from "react";
import { View, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import { coustomTheme } from "components/coustomTheme";

interface HeaderRightProps {
  isInFavorites: (id: string, table: string) => boolean;
  id: string;
  table: string;
  title: string;
  toggleFavorite: (id: string, table: string, title: string) => void;
  setIsPickerVisible: (visible: boolean) => void;
}

const HeaderRight: React.FC<HeaderRightProps> = ({
  isInFavorites,
  id,
  table,
  title,
  toggleFavorite,
  setIsPickerVisible,
}) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();

  return (
    <View style={styles.buttonsHeaderContainer}>
      <Ionicons
        name='text'
        size={25}
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
  );
};

const styles = StyleSheet.create({
  buttonsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "transparent",
   
  },
});

export default HeaderRight;
