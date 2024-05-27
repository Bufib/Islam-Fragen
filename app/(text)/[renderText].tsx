import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useFetchText } from "components/useFetchText";

const RenderText = () => {
  const { item, fetchError, isFetching } = useFetchText(
    "Quranwissenschaften",
    "Welche Sure wurde als erste offenbart"
  );

  if (isFetching) {
    return <ActivityIndicator />;
  }

  if (fetchError) {
    return <Text>Error: {fetchError}</Text>;
  }

  if (!item) {
    return <Text>No item found</Text>;
  }

  return (
    <View>
      <Text>Title: {item.title}</Text>
      <Text>Question: {item.question}</Text>
      <Text>Answer (Sistani): {item.answer_sistani}</Text>
      <Text>Answer (Khamenei): {item.answer_khamenei}</Text>
    </View>
  );
};

export default RenderText;
