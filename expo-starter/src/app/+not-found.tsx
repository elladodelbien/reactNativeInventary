import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";

export default function NotFoundScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (isAuthenticated) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={80} color="#6B7280" />
      <Text style={styles.title}>Página no encontrada</Text>
      <Text style={styles.subtitle}>
        Lo sentimos, la página que buscas no existe o no tienes permisos para acceder a ella.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>
          {isAuthenticated ? "Ir al Inicio" : "Ir al Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});