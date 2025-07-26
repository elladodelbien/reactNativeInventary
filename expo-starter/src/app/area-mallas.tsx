import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AreaMallas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Área de Mallas</Text>
      <Text style={styles.subtitle}>Gestión de mallas y redes</Text>
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
