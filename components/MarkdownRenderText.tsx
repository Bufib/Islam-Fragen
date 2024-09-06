import React from "react";
import { Platform } from "react-native";
import Markdown from "react-native-markdown-display";
import { coustomTheme } from "components/coustomTheme";
import { useColorScheme } from "react-native";
import { useSetFontSize } from "components/fontSizeStore";

interface CustomMarkdownProps {
  content: string | undefined;
}

const CustomMarkdown: React.FC<CustomMarkdownProps> = ({ content }) => {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme();
  const { fontSize, lineHeight } = useSetFontSize();

  return (
    <Markdown
      style={{
        body: {
          ...themeStyles.markdownText,
          fontSize: fontSize,
          lineHeight: lineHeight,
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
      {content}
    </Markdown>
  );
};

export default CustomMarkdown;
