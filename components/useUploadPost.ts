//dasboard-neu:
import { Keyboard } from "react-native";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useIsUpLoading } from "components/uploadingStore";

export function useUploadPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [link, setLink] = useState<string>();
  const [linkName, setLinkName] = useState<string>();

  const { startLoading, finishLoading } = useIsUpLoading();

  const uploadText = async (imageUrls: string[]) => {
    const { error } = await supabase
      .from("News")
      .insert({ title: title, content: content, imagePaths: imageUrls, link: link, linkName: linkName });

    if (error) {
      setContent("");
      console.log(error);
      return false;
    } else {
      setContent("");
      return true;
    }
  };

  const uploadImage = async (uri: string): Promise<string | false> => {
    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const fileExt = uri.split(".").pop();
      const fileName = `images/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("News_bucket")
        .upload(fileName, arrayBuffer, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        return false;
      } else {
        const { data: urlData } = supabase.storage
          .from("News_bucket")
          .getPublicUrl(fileName);

        if (!urlData) {
          return false;
        } else {
          return urlData.publicUrl;
        }
      }
    } catch (error) {
      return false;
    }
  };

  const submitPost = async () => {
    if (images.length === 0 && !content.trim()) {
      Toast.show({
        type: "error",
        text1: "Ein leerer Beitrag kann nicht erstellt werden!",
      });
      return;
    }
    startLoading();
    router.navigate("/news");

    const uploadedImageUrls = await Promise.all(
      images.map((image) => uploadImage(image))
    );

    const validImageUrls = uploadedImageUrls.filter((url) => url != null);

    const textUploaded = await uploadText(validImageUrls as string[]);

    if (uploadedImageUrls && textUploaded) {
      Toast.show({
        type: "success",
        text1: "Beitrag erfolgreich hochgeladen!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Fehler beim erstellen des Beitrags!",
        text2: "Versuchen Sie es später nochmal!",
      });
    }
    finishLoading();
  };

  const pickImage = async () => {
    Keyboard.dismiss();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages(result.assets.map((asset) => asset.uri));
    }
  };

  const deleteImage = (uri: string) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image !== uri)
    );
  };
  return {
    title,
    setTitle,
    content,
    setContent,
    images,
    uploadText,
    uploadImage,
    submitPost,
    pickImage,
    deleteImage,
    link,
    setLink,
    linkName,
    setLinkName
  };
}
