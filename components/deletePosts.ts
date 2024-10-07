import { supabase } from "@/utils/supabase";
import Toast from "react-native-toast-message";
import { Alert } from "react-native";

export const deletePosts = async (id: number) => {
  Alert.alert("Beitrag wirklich löschen?", "", [
    {
      text: "Abbrechen",
      style: "cancel",
    },
    {
      text: "Ja",
      onPress: async () => {
        const { error } = await supabase.from("News").delete().eq("id", id);

        if (error) {
          Toast.show({
            type: "error",
            text1: "Fehler beim löschen eines Beitrags!",
            text2: "Versuch es später nochmal!",
          });
        } else {
          Toast.show({
            type: "success",
            text1: "Beitrag erfolgreich gelöscht!",
          });
        }
      },
    },
  ]);
};
