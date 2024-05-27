import { create } from "zustand";

interface IsChangingState {
  fontSize: number;
  lineHeight: number;
  pickerValue: string;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setPickerValue: (value: string) => void;
}

export const useSetFontSize = create<IsChangingState>((set) => ({
  fontSize: 20,
  lineHeight: 40,
  pickerValue: "Mittel",  
  setFontSize: (size: number) => set((state) => ({ fontSize: size })),
  setLineHeight: (height: number) => set((state) => ({ lineHeight: height })),
  setPickerValue: (value: string) => set((state) => ({ pickerValue: value })),  
}));
