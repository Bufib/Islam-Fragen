import AsyncStorage from "@react-native-async-storage/async-storage";

interface Item {
  id: number;
  title: string;
  text: string;
}

const createStorageKey = (table: string) => `supabaseData-${table}`;

export const useFetchText = async (table: string, title: string): Promise<Item | null> => {
  try {
    const storedData = await AsyncStorage.getItem(createStorageKey(table));
    if (storedData) {
      const items: Item[] = JSON.parse(storedData);
      return items.find(item => item.title === title) || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching item by title: ${error}`);
    return null;
  }
};
