import { Drawer } from "expo-router/drawer";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { useRouter } from "expo-router";
// Usar View simple para evitar problemas de dependencias

// Componente personalizado del drawer
function CustomDrawerContent(props: any) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("Drawer - Iniciando logout...");
      await logout();
      console.log("Drawer - Logout completado, redirigiendo...");
      // Usar router.push en lugar de replace para asegurar navegación
      router.push("/");
    } catch (error) {
      console.error("Drawer - Error en logout:", error);
      // Incluso si hay error, redirigir al index que manejará la redirección
      router.push("/");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Sección de Perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <Text style={styles.initials}>
              {user ? getInitials(user.nombre) : "??"}
            </Text>
          </View>
        </View>
        <Text style={styles.profileName}>{user?.nombre || "Usuario"}</Text>
        <Text style={styles.profileRole}>{user?.cargo || "Sin cargo"}</Text>
      </View>

      {/* Lista de elementos del drawer */}
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>

      {/* Botón de logout */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}


// Layout principal que maneja la navegación según autenticación
function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Verificando autenticación...</Text>
      </View>
    );
  }

  // Si no está autenticado, permitir que index.tsx maneje la redirección
  if (!isAuthenticated) {
    return (
      <React.Fragment>
        <StatusBar style="auto" />
        {/* Renderizar un drawer mínimo solo con las pantallas necesarias */}
        <Drawer screenOptions={{ headerShown: false, drawerType: 'front' }}>
          <Drawer.Screen
            name="index"
            options={{ drawerItemStyle: { display: "none" } }}
          />
          <Drawer.Screen
            name="login"
            options={{ drawerItemStyle: { display: "none" } }}
          />
        </Drawer>
      </React.Fragment>
    );
  }

  // Si está autenticado, mostrar el drawer completo
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
        {/* Ocultar pantallas que no deben aparecer en el drawer */}
        <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

        <Drawer.Screen
          name="login"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

        <Drawer.Screen
          name="crear-registro-envases"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

        <Drawer.Screen
          name="lista-registros-envases"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

        {/* Pantalla principal con tabs */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Inicio",
            title: "Mi App Corplastik ",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />

        {/* Pantallas adicionales del drawer */}
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Perfil",
            title: "Perfil",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Configuración",
            title: "Configuración",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="area-envases"
          options={{
            drawerLabel: "Área de Envases",
            title: "Área de Envases",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cube" color={color} size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="area-mallas"
          options={{
            drawerLabel: "Área de Mallas",
            title: "Área de Mallas",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid" color={color} size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="area-pitillos"
          options={{
            drawerLabel: "Área de Pitillos",
            title: "Área de Pitillos",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="flower" color={color} size={size} />
            ),
          }}
        />

        <Drawer.Screen
          name="reportes"
          options={{
            drawerLabel: "Reportes",
            title: "Reportes",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </React.Fragment>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#6366f1",
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  placeholderImage: {
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666666",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  drawerItems: {
    flex: 1,
    paddingTop: 10,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
    marginLeft: 12,
    fontWeight: "500",
  },
  
  // Loading styles para verificación de autenticación
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});
