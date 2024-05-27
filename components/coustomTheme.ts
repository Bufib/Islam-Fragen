import Colors from "constants/Colors";

export const lightTheme = {
  containerContrast: {
    backgroundColor: Colors.light.contrast,
  },
  error: {
    color: Colors.light.error,
  },
  addNewsButton: {
    color: Colors.light.addNewsButton,
  },
  inverseTextInput: {
    color: Colors.light.black,
    backgroundColor: Colors.light.contrast,
  },
  categorieText: {
    color: Colors.light.categorieText,
  },
  categorieBackground: {
    backgroundColor: Colors.light.categorieBackground,
  },
  indexBorderDash: {
    borderColor: Colors.light.indexBorderDash,
    color: Colors.light.indexBorderDash,
  },
  indexCategoryTextBorder: {
    borderColor: Colors.light.indexCategoryTextBorder,
  },
  backgroundIndex: {
    backgroundColor: Colors.light.backgroundIndexHeader,
  },
  link: {
    color: Colors.light.link,
  },
  shadow: {
    shadowColor: Colors.light.shadowColor,
  },
  updateButtonNews: {
    backgroundColor: Colors.light.updateButtonNews,
  },
  trashIcon: {
    color: Colors.light.trashIcon,
  },
  characterCountNewsImage: {
    color: Colors.light.characterCountNewsImage,
  },
  activityIndicator: {
    color: Colors.light.activityIndicator,
  },
  arrowUp: {
    color: Colors.light.arrowUp,
  },
  searchBorderDash: {
    color: Colors.light.searchBorderDash,
  },
  deleteIcon: {
    color: Colors.light.deleteIcon,
  },
  downloadIcon: {
    color: Colors.light.deleteIcon,
  },
  favoriteIcon: {
    color: Colors.light.favoriteIcon,
  },
  markdownText: {
    color: Colors.light.text,
  },
  fontSizeIcon: {
    color: Colors.light.fontSizeIcon,
  },
  modalQuestion:{
    backgroundColor: Colors.light.modalQuestion,
  },
  modalQuestionBlurredBackground: {
    backgroundColor: Colors.light.modalQuestionBlurredBackground,
  }
};

export const darkTheme = {
  containerContrast: {
    backgroundColor: Colors.dark.contrast,
  },
  text: {
    color: Colors.dark.text,
  },
  error: {
    color: Colors.dark.error,
  },
  addNewsButton: {
    color: Colors.dark.addNewsButton,
  },
  background: {
    backgroundColor: Colors.dark.background,
  },
  inverseTextInput: {
    color: Colors.dark.white,
    backgroundColor: Colors.dark.contrast,
  },
  categorieText: {
    color: Colors.dark.categorieText,
  },
  categorieBackground: {
    backgroundColor: Colors.dark.categorieBackground,
  },
  indexCategoryTextBorder: {
    borderColor: Colors.dark.indexCategoryTextBorder,
  },
  indexBorderDash: {
    borderColor: Colors.dark.indexBorderDash,
    color: Colors.dark.indexBorderDash,
  },
  backgroundIndex: {
    backgroundColor: Colors.dark.backgroundIndexHeader,
  },
  shadow: {
    shadowColor: Colors.dark.shadowColor,
  },
  link: {
    color: Colors.dark.link,
  },
  updateButtonNews: {
    backgroundColor: Colors.dark.updateButtonNews,
  },
  trashIcon: {
    color: Colors.dark.trashIcon,
  },
  characterCountNewsImage: {
    color: Colors.dark.characterCountNewsImage,
  },
  activityIndicator: {
    color: Colors.dark.activityIndicator,
  },
  arrowUp: {
    color: Colors.dark.arrowUp,
  },
  searchBorderDash: {
    color: Colors.dark.searchBorderDash,
  },
  deleteIcon: {
    color: Colors.dark.deleteIcon,
  },
  downloadIcon: {
    color: Colors.dark.deleteIcon,
  },
  favoriteIcon: {
    color: Colors.dark.favoriteIcon,
  },
  markdownText: {
    color: Colors.dark.text,
  },
  fontSizeIcon: {
    color: Colors.dark.fontSizeIcon,
  },
  modalQuestion:{
    backgroundColor: Colors.dark.modalQuestion,
  },
  modalQuestionBlurredBackground: {
    backgroundColor: Colors.dark.modalQuestionBlurredBackground,
  }
};

type ColorScheme = "light" | "dark" | undefined | null;

export const coustomTheme = (colorScheme: ColorScheme) => {
  return colorScheme === "light" ? lightTheme : darkTheme;
};
