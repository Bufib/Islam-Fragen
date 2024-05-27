import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useFetchText } from 'components/useFetchText';

const RenderText = () => {
  const title = "Handel";
  const table = "Haare verkaufen";
  const { item, fetchError, isFetching } = useFetchText(table, title);

  React.useEffect(() => {
    console.log("Fetched item:", item);
    console.log("Fetch error:", fetchError);
    console.log("Is fetching:", isFetching);
  }, [item, fetchError, isFetching]);

  return (
    <View style={styles.container}>
      {isFetching && <Text>Loading...</Text>}
      {fetchError && <Text>Error: {fetchError}</Text>}
      {item && <Text>{item.text}</Text>}
    </View>
  );
};

export default RenderText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
