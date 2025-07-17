import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Redirect } from "expo-router";

export default function IndexScreen() {
  // Redirigir automáticamente a la pantalla principal con tabs
  return <Redirect href="/(tabs)" />;
}
