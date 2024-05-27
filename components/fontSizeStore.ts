import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IsChangingState {
  fontSize: number;
  lineHeight: number;
  pickerValue: string;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setPickerValue: (value: string) => void;
  initializeSettings: () => void;
}

export const useSetFontSize = create<IsChangingState>((set) => ({
  fontSize: 20,
  lineHeight: 40,
  pickerValue: "Mittel",
  
  setFontSize: async (size: number) => {
    await AsyncStorage.setItem('fontSize', size.toString());
    set({ fontSize: size });
  },

  setLineHeight: async (height: number) => {
    await AsyncStorage.setItem('lineHeight', height.toString());
    set({ lineHeight: height });
  },

  setPickerValue: (value: string) => set({ pickerValue: value }),

  initializeSettings: async () => {
    const fontSize = await AsyncStorage.getItem('fontSize');
    const lineHeight = await AsyncStorage.getItem('lineHeight');
    
    set({ 
      fontSize: fontSize ? parseInt(fontSize, 10) : 20, 
      lineHeight: lineHeight ? parseInt(lineHeight, 10) : 40 
    });
  },
}));
