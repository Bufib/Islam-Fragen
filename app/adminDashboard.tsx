//dasboard-neu:
import { Keyboard, StyleSheet } from "react-native";
import { View, Text } from "components/Themed";
import Colors from "constants/Colors";
import { TextInput, Pressable, TouchableWithoutFeedback } from "react-native";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { ScrollView } from "react-native";
import { useUploadImages } from "components/useUploadImages";
import { coustomTheme } from "components/coustomTheme";
export default function adminDashboard() {
  const colorScheme = useColorScheme();
  const themeStyles = coustomTheme(colorScheme);

  const {
    title,
    setTitle,
    content,
    setContent,
    images,
    submitPost,
    pickImage,
    deleteImage,
  } = useUploadImages();

  return (
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Submit button */}
        <Stack.Screen
          options={{
            headerRight: () => (
              <View style={styles.headerButtons}>
                <Pressable onPress={pickImage}>
                  <FontAwesome name='image' size={24} color='green' />
                </Pressable>

                <Pressable onPress={submitPost}>
                  <Text style={styles.submitButtonText}>Erstellen</Text>
                </Pressable>
              </View>
            ),
          }}
        />
        <View style={styles.inputFieldsContainer}>
          <TextInput
            style={[styles.headerInput]}
            onChangeText={setTitle}
            value={title}
            placeholder='Title (optional)'
           
            editable
            onSubmitEditing={Keyboard.dismiss}
          />

          <TextInput
            style={[styles.ContentInput, themeStyles.inverseTextInput]}
            onChangeText={setContent}
            value={content}
            placeholder='Beitrag'
          
            multiline
            editable
            autoCapitalize='none'
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <View style={styles.imagesContainer}>
          <ScrollView
            contentContainerStyle={styles.imagesScrollViewContent}
            horizontal
          >
            {images.map((img, index) => (
              <View
                key={index.toString()}
                style={styles.images}
                onStartShouldSetResponder={() => true}
              >
                <Pressable
                  style={styles.deleteImage}
                  onPress={() => deleteImage(img)}
                >
                  <FontAwesome name='remove' size={21} color='red' />
                </Pressable>

                <Image
                  style={styles.image}
                  source={{ uri: img }}
                  contentFit='cover'
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "transparent",
    marginRight: -5,
  },
  submitButtonText: {
    fontSize: 20,
    color: Colors.light.link,
  },
  inputFieldsContainer: {
    flex: 0.82,
  },
  headerInput: {
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
  },
  ContentInput: {
    flex: 1,
    maxHeight: "90%",
    marginHorizontal: 10,
    paddingHorizontal: 12,
    marginTop: 20,
    paddingTop: 8,
    paddingBottom: 15,
    borderWidth: 1,
    borderRadius: 20,
    fontSize: 16,
    textAlignVertical: "top",
    lineHeight: 30,
  },
  imagesContainer: {
    flex: 0.18,
    marginBottom: 20,
    marginTop: 15,
  },

  imagesScrollViewContent: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  images: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  deleteImage: {
    marginLeft: 100,
  },
});
