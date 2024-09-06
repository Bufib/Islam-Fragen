import * as Clipboard from "expo-clipboard";

type CopyMultipleAnswersParams = {
  marja: string;
  text: string | undefined;
  regex: RegExp;
  setCopiedText: (text: string) => void;
  setIsCopiedMultiple: any; 
  cleanTimeout: () => void;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
};

export const copyMultipleAnswers = async ({
  marja,
  text,
  regex,
  setCopiedText,
  setIsCopiedMultiple,
  cleanTimeout,
  timeoutRef,
}: CopyMultipleAnswersParams) => {
  if (typeof text !== "string") return;
  const cleanedText = text.replace(regex, "");
  await Clipboard.setStringAsync(`${marja}: ${cleanedText}`);
  setCopiedText(`${marja}: ${cleanedText}`);
  setIsCopiedMultiple((prev: any) => ({ ...prev, [marja]: true }));

  // Clear any existing timeout
  cleanTimeout();

  timeoutRef.current = setTimeout(
    () => setIsCopiedMultiple((prev: any) => ({ ...prev, [marja]: false })),
    1000
  );
};
