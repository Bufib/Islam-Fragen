import { View, Text } from "components/Themed";
import React from "react";
import Colors from "constants/Colors";
import RenderItems from "components/RenderItems";
import { StyleSheet } from "react-native";
import fetchTable from "components/fetchTable";

export default function munajat() {
  const { items, fetchError, table } = fetchTable("Munajat");
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.informationText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur
          adipisci ipsum modi facere dolorem dignissimos quam assumenda
          explicabo, unde earum perferendis voluptatum beatae iure? Praesentium
          perspiciatis ea quod animi iste.
        </Text>
      </View>
      <View style={styles.itemContainer}>
        <RenderItems
          categoryItems={items}
          fetchError={fetchError}
          table={table}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 0.2,
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.light.white,
  },
  itemContainer: {
    flex: 0.8,
  },
  informationText: {},
});
