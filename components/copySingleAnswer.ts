// copySingleAnswer.ts
import * as Clipboard from 'expo-clipboard';

type CopySingleAnswerParams = {
  text: string;
  regex: RegExp;
  setCopiedText: (text: string) => void;
  setIsCopiedSingle: (value: boolean) => void;
  cleanTimeout: () => void;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
};

export const copySingleAnswer = async ({
  text,
  regex,
  setCopiedText,
  setIsCopiedSingle,
  cleanTimeout,
  timeoutRef
}: CopySingleAnswerParams) => {
  if (typeof text !== 'string') return;
  const cleanedText = text.replace(regex, '');
  await Clipboard.setStringAsync(cleanedText);
  setCopiedText(cleanedText);
  setIsCopiedSingle(true);

  // Clear any existing timeout
  cleanTimeout();

  timeoutRef.current = setTimeout(() => setIsCopiedSingle(false), 1000);
};
