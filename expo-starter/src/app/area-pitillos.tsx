import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AreaPitillos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área de Pitillos</Text>
      <Text style={styles.subtitle}>Gestión de pitillos y popotes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
