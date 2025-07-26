import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ExploreScreen() {
  const router = useRouter();

  const categories = [
    { id: 1, name: "Tecnología", icon: "laptop", color: "#007AFF" },
    { id: 2, name: "Deportes", icon: "football", color: "#28a745" },
    { id: 3, name: "Música", icon: "musical-notes", color: "#e74c3c" },
    { id: 4, name: "Viajes", icon: "airplane", color: "#f39c12" },
    { id: 5, name: "Comida", icon: "restaurant", color: "#9b59b6" },
    { id: 6, name: "Arte", icon: "brush", color: "#1abc9c" },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explorar</Text>

      <Text style={styles.subtitle}>Categorías populares</Text>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryCard, { borderColor: category.color }]}
            onPress={() => {
              // Navegar a una pantalla de categoría específica
              console.log(`Navegando a ${category.name}`);
            }}
          >
            <Ionicons
              name={category.icon}
              size={32}
              color={category.color}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Acciones rápidas</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push("/profile")}
      >
        <Ionicons name="person-circle" size={24} color="white" />
        <Text style={styles.actionButtonText}>Ver mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, styles.secondaryButton]}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings" size={24} color="#007AFF" />
        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
          Configuración
        </Text>
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#007AFF" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>¡Nueva sección!</Text>
          <Text style={styles.infoText}>
            Esta es la nueva tab &quot;Explorar&quot;. Aquí puedes agregar
            contenido para descubrir nuevas funcionalidades de tu app.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    color: "#666",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
