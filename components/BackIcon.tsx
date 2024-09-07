import Ionicons from "@expo/vector-icons/Ionicons";
import { coustomTheme } from "components/coustomTheme";
import { Link } from "expo-router";
import { Pressable } from "react-native";
import { StyleSheet } from "react-native";

const BackIcon = () => {
  const themeStyles = coustomTheme();
  return (
    <Link href={"/settings"} asChild>
      <Pressable style={styles.backIcon}>
        <Ionicons
          name='chevron-back-outline'
          size={28}
          style={themeStyles.link}
        />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "transparent",
    marginLeft: 5,
  },
});

export default BackIcon;
