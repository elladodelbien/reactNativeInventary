import { Drawer } from "expo-router/drawer";
import { Tabs } from "expo-router/tabs";
// import "../../global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <Drawer>
        {/* Pantalla principal con tabs */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Inicio",
            title: "Mi App",
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
      </Drawer>
    </React.Fragment>
  );
}
