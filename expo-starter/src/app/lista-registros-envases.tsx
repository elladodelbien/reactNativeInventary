import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/components/AuthProvider";
import { canViewAllRecords } from "@/utils/permissions";
import { productionRecordsService } from "@/services/productionRecords";
import { RegistroEnvaseResponse, PaginationInfo } from "@/types/api";

export default function ListaRegistrosEnvases() {
  const { user } = useAuth();
  const router = useRouter();
  const [registros, setRegistros] = useState<RegistroEnvaseResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar permisos al cargar la pantalla
  useEffect(() => {
    if (!canViewAllRecords(user)) {
      Alert.alert(
        "Acceso Denegado",
        "No tiene permisos para ver todos los registros de envases.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
      return;
    }

    loadRegistros();
  }, [user]);

  const loadRegistros = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      
      console.log("Lista - Iniciando carga de registros...");
      const response = await productionRecordsService.getAllRegistrosEnvases({
        page: 1,
        limit: 20,
        sortBy: 'fechaCreacion',
        sortOrder: 'DESC'
      });
      
      console.log("Lista - Registros obtenidos:", response.data.length);
      console.log("Lista - Paginación:", response.pagination);
      
      setRegistros(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error cargando registros:", error);
      const errorMessage = error instanceof Error ? error.message : "No se pudieron cargar los registros";
      setError(errorMessage);
      
      // Mostrar alerta solo si no es un error de permisos (ya se maneja en useEffect)
      if (!errorMessage.includes("permisos")) {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRegistros(false); // No mostrar loading principal durante refresh
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderRegistroCard = (registro: RegistroEnvaseResponse) => (
    <View key={registro.id} style={styles.registroCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.registroId}>#{registro.id}</Text>
        <Text style={styles.fechaText}>
          {formatDate(registro.fechaCreacion)}
        </Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Usuario:</Text>
          <Text style={styles.infoValue}>{registro.usuario.nombre}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="business" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Área:</Text>
          <Text style={styles.infoValue}>{registro.operario.areaDeTrabajo}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="cube" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Producto:</Text>
          <Text style={styles.infoValue}>{registro.producto.nombre} ({registro.producto.capacidad})</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="layers" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Material:</Text>
          <Text style={styles.infoValue}>{registro.material.nombre} - {registro.material.color}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{registro.cantidadDeEnvasesProducidos}</Text>
            <Text style={styles.statLabel}>Envases</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{registro.cantidadDeMaterialUsado}kg</Text>
            <Text style={styles.statLabel}>Material</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{registro.horasTrabajadas}h</Text>
            <Text style={styles.statLabel}>Horas</Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Todos los Registros</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Cargando registros...</Text>
          <Text style={styles.loadingSubText}>Conectando con el servidor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error si hay uno
  if (error && !loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Todos los Registros</Text>
          <TouchableOpacity onPress={() => loadRegistros()} style={styles.refreshButton}>
            <Ionicons name="refresh" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorTitle}>Error al cargar registros</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity onPress={() => loadRegistros()} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Todos los Registros</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{pagination?.total || 0}</Text>
              <Text style={styles.summaryLabel}>Registros Totales</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {registros.reduce((sum, r) => sum + r.cantidadDeEnvasesProducidos, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Envases (Esta Página)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>
                {registros.reduce((sum, r) => sum + r.cantidadDeMaterialUsado, 0)}kg
              </Text>
              <Text style={styles.summaryLabel}>Material (Esta Página)</Text>
            </View>
          </View>
          {pagination && (
            <View style={styles.paginationInfo}>
              <Text style={styles.paginationText}>
                Página {pagination.page} de {pagination.totalPages} • {registros.length} de {pagination.total} registros
              </Text>
            </View>
          )}
        </View>

        <View style={styles.registrosContainer}>
          <Text style={styles.sectionTitle}>Registros de Envases</Text>
          {registros.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No hay registros disponibles</Text>
            </View>
          ) : (
            registros.map(renderRegistroCard)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Para compensar el botón de refresh
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6b7280",
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "white",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6366f1",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 4,
  },
  registrosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 12,
  },
  registroCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  registroId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6366f1",
  },
  fechaText: {
    fontSize: 12,
    color: "#6b7280",
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
    marginRight: 8,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 12,
  },
  
  // Error styles
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Pagination styles
  paginationInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  paginationText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
});