// useInitializeSettings.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const useInitializeSettings = (setFontSize: any, setLineHeight: any) => {
  // Get saved fontsettings (Size and Lineheight)
  const getFontSetting = async () => {
    const storedFontSize = await AsyncStorage.getItem("fontSize");
    const storedLineHeight = await AsyncStorage.getItem("lineHeight");
    if (storedFontSize) {
      setFontSize(Number(storedFontSize));
    }

    if (storedLineHeight) {
      setLineHeight(Number(storedLineHeight));
    }
  };

  const initializeSettings = async () => {
    await getFontSetting();
  };

  return {
    initializeSettings,
  };
};

export default useInitializeSettings;
