import { Drawer } from "expo-router/drawer";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";
// Usar View simple para evitar problemas de dependencias

// Data de prueba temporal (será reemplazada por API)
const userData = {
  name: "Lisa Martínez",
  role: "Operario de Planta",
  profileImage: null,
  userId: 123
};

// Componente personalizado del drawer
function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      {/* Sección de Perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {userData.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.placeholderImage]}>
              <Text style={styles.initials}>LM</Text>
            </View>
          )}
        </View>
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileRole}>{userData.role}</Text>
      </View>

      {/* Lista de elementos del drawer */}
      <View style={styles.drawerItems}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* Ocultar pantallas que no deben aparecer en el drawer */}
        <Drawer.Screen
          name="index"
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

const styles = StyleSheet.create({
  profileHeader: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#6366f1',
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  placeholderImage: {
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666666',
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  drawerItems: {
    flex: 1,
    paddingTop: 10,
  },
});
