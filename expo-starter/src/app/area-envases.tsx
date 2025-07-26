import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AreaEnvases() {
  const [selectedIndex, setSelectedIndex] = useState(1); // Empezar en el centro
  const [selectedProduct, setSelectedProduct] = useState("BIDÓN DE 20 LITROS");
  const carouselRef = useRef(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Datos del carousel (usando la misma imagen por ahora)
  const products = [
    {
      id: 0,
      name: "BIDÓN DE 10 LITROS",
      image: require("../../assets/images/image-removebg-preview 1.png"),
    },
    {
      id: 1,
      name: "BIDÓN DE 20 LITROS",
      image: require("../../assets/images/image-removebg-preview 1.png"),
    },
    {
      id: 2,
      name: "BIDÓN DE 25 LITROS",
      image: require("../../assets/images/image-removebg-preview 1.png"),
    },
  ];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width * 0.6)); // 60% del ancho
    if (index !== selectedIndex && index >= 0 && index < products.length) {
      setSelectedIndex(index);
      setSelectedProduct(products[index].name);
    }
  };

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollToIndex({ index, animated: true });
      setSelectedIndex(index);
      setSelectedProduct(products[index].name);
    }
  };

  const renderCarouselItem = ({ item, index }) => {
    const isCenter = index === selectedIndex;
    return (
      <TouchableOpacity
        style={[styles.carouselItem, isCenter && styles.centerItem]}
        onPress={() => scrollToIndex(index)}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.productImageContainer,
            isCenter && styles.centerImageContainer,
          ]}
        >
          <Image
            source={item.image}
            style={[styles.productImage, isCenter && styles.centerImage]}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Sección de Navegación de Categoría */}
        <View style={styles.navigationSection}>
          <Text style={styles.breadcrumb}>ENVASES</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedProduct}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Área de Producto Central - Carousel */}
        <View style={styles.productArea}>
          <FlatList
            ref={carouselRef}
            data={products}
            renderItem={renderCarouselItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width * 0.6}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContainer}
            initialScrollIndex={1}
            getItemLayout={(data, index) => ({
              length: width * 0.6,
              offset: width * 0.6 * index,
              index,
            })}
          />
        </View>

        {/* Sección de Botones de Acción */}
        <View style={styles.actionButtonsSection}>
          <TouchableOpacity
            style={[styles.actionButton, styles.greenButton]}
            onPress={() => {
              console.log("Producto seleccionado:", selectedProduct);
              const url = `/crear-registro-envases?producto=${encodeURIComponent(selectedProduct)}`;
              console.log("URL de navegación:", url);
              router.push(url);
            }}
          >
            <Text style={styles.buttonText}>CREAR REGISTRO DE ENVASES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.blueButton]}>
            <Text style={styles.buttonText}>VER MIS REGISTROS DE ENVASES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.orangeButton]}>
            <Text style={styles.buttonText}>
              SOLICITAR ACTUALIZACIÓN EN REPORTE
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.redButton]}>
            <Text style={styles.buttonText}>
              INFORMAR FALLA DE LA MÁQUINA EN TURNO
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#6366f1" />
          <Text style={[styles.navText, styles.activeNavText]}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="checkmark-done-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Lista</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },

  // Navigation section
  navigationSection: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 25,
  },
  breadcrumb: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6b7280",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
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
  dropdownText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },

  // Product area
  productArea: {
    flex: 1,
    minHeight: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
  },

  // Carousel styles
  carouselContainer: {
    paddingHorizontal: width * 0.2, // Para centrar el primer elemento
    alignItems: "center",
  },
  carouselItem: {
    width: width * 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  centerItem: {
    transform: [{ scale: 1.1 }],
  },

  productImageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  centerImageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  productImage: {
    width: 100,
    height: 125,
  },
  centerImage: {
    width: 110,
    height: 135,
  },

  // Action buttons section
  actionButtonsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
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
  greenButton: {
    backgroundColor: "#1e40af",
  },
  blueButton: {
    backgroundColor: "#3b82f6",
  },
  orangeButton: {
    backgroundColor: "#60a5fa",
  },
  redButton: {
    backgroundColor: "#93c5fd",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Bottom navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  activeNavText: {
    color: "#6366f1",
  },
});
