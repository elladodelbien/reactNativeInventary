import React from "react";
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";

export const ButtonGrid = () => {
  const buttons = [
    { id: "1", title: "Botón 1" },
    { id: "2", title: "Botón 2" },
    { id: "3", title: "Botón 3" },
    { id: "4", title: "Botón 4" },
    { id: "5", title: "Botón 5" },
    { id: "6", title: "Botón 6" },
  ];

  const renderButton = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => console.log(item.title)}
    >
      <Text style={styles.buttonText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={buttons}
      renderItem={renderButton}
      numColumns={2} // Cambia este número para más columnas
      keyExtractor={(item) => item.id}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 20,
    margin: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    justifyContent: "space-around",
  },
});
