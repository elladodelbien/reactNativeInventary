import React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Superior */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: "https://via.placeholder.com/50" }}
                style={styles.profileImage}
              />
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Bienvenida</Text>
                <Text style={styles.nameText}>Lisa Martínez</Text>
              </View>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar..."
              placeholderTextColor="#999"
            />
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
          </View>
        </View>

        {/* Sección de Categorías */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>CATEGORÍAS</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity 
              style={styles.categoryCard}
              onPress={() => router.push("/area-envases")}
            >
              <Ionicons name="cube-outline" size={32} color="#6366f1" />
              <Text style={styles.categoryText}>ENVASES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Ionicons name="disc-outline" size={32} color="#6366f1" />
              <Text style={styles.categoryText}>TAPAS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Ionicons name="flower-outline" size={32} color="#6366f1" />
              <Text style={styles.categoryText}>PITILLO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Ionicons name="grid-outline" size={32} color="#6366f1" />
              <Text style={styles.categoryText}>MALLA</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color="#6366f1"
              />
              <Text style={styles.categoryText}>REPORTES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryCard}>
              <Ionicons name="resize-outline" size={32} color="#6366f1" />
              <Text style={styles.categoryText}>ETALLAS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Avisos de la Empresa */}
        <View style={styles.noticesSection}>
          <Text style={styles.sectionTitle}>Avisos de la Empresa</Text>

          <View style={[styles.noticeCard, styles.yellowNotice]}>
            <Ionicons name="star" size={24} color="#F59E0B" />
            <Text style={styles.noticeText}>
              Encuesta para mejoramiento de calidad - Tu opinión es importante
            </Text>
          </View>

          <View style={[styles.noticeCard, styles.blueNotice]}>
            <Ionicons name="water" size={24} color="#3B82F6" />
            <Text style={styles.noticeText}>
              Cuidar la salud y elementos de protección personal
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    marginBottom: 15,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E7EB",
  },
  welcomeSection: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  nameText: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  searchContainer: {
    position: "relative",
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 45,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchIcon: {
    position: "absolute",
    left: 15,
    top: 12,
  },
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "30%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginTop: 8,
    textAlign: "center",
  },
  noticesSection: {
    padding: 20,
    paddingTop: 0,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  yellowNotice: {
    backgroundColor: "#FEF3C7",
  },
  blueNotice: {
    backgroundColor: "#DBEAFE",
  },
  noticeText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 12,
    flex: 1,
  },
});
