export interface Item {
  answer_khamenei?: string;
  answer_sistani?: string;
  [key: string]: any;
}

export const getMarjaData = (item?: Item) => {
  const displayAnswers = [
    { marja: "Sayid al-Khamenei", answer: item?.answer_khamenei || "" },
    { marja: "Sayid as-Sistani", answer: item?.answer_sistani || "" },
  ];

  const images = {
    "Sayid as-Sistani": require("assets/images/sistani.png"),
    "Sayid al-Khamenei": require("assets/images/khamenei.png"),
  };

  const marjaOptions = [
    { label: "Sayid al-Khamenei", value: "Sayid al-Khamenei" },
    { label: "Sayid as-Sistani", value: "Sayid as-Sistani" },
  ];

  return { displayAnswers, images, marjaOptions };
};
