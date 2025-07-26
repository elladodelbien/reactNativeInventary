import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Image,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  productionRecordsService,
  validateRegistroEnvase,
} from "../services/productionRecords";
import { CreateRegistroEnvaseRequest, ValidationErrors } from "../types/api";

export default function CrearRegistroEnvases() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { producto: productoParam } = useLocalSearchParams();

  // Estados del formulario
  const [cantidadMaterial, setCantidadMaterial] = useState("");
  const [cantidadEnvases, setCantidadEnvases] = useState("");
  const [horasTrabajadas, setHorasTrabajadas] = useState("");
  const [producto, setProducto] = useState(
    productoParam ? String(productoParam) : "",
  );
  const [material, setMaterial] = useState("");

  // Estados para reporte de falla
  const [tieneReporteFalla, setTieneReporteFalla] = useState(false);
  const [descripcionFalla, setDescripcionFalla] = useState("");

  // Estados para mostrar errores de validación
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  // Estados para selectores
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);

  const productos = [
    "Bidon blanco tradicional de 20 litros",
    "Bidon blanco tradicional de 18 litros",
    "Bidon blanco modelo nuevo de 10 litros",
  ];
  const materiales = [
    "Polietileno de alta densidad",
    "Polietileno de baja densidad",
    "Polipropileno",
    "PET",
    "PVC",
    "Polietileno",
    "ABS",
  ];
  const MAX_CARACTERES_FALLA = 250;

  // Efecto para sincronizar el producto cuando llega el parámetro
  useEffect(() => {
    if (productoParam) {
      const productoDecodificado = decodeURIComponent(String(productoParam));
      setProducto(productoDecodificado);
      console.log("Producto recibido:", productoDecodificado);
    }
  }, [productoParam]);

  const handleDescripcionFallaChange = (text: string) => {
    if (text.length <= MAX_CARACTERES_FALLA) {
      setDescripcionFalla(text);
    }
  };

  const handleSwitchFalla = (value: boolean) => {
    setTieneReporteFalla(value);
    if (!value) {
      setDescripcionFalla(""); // Limpiar descripción si se desactiva
    }
  };

  const resetForm = () => {
    setCantidadMaterial("");
    setCantidadEnvases("");
    setHorasTrabajadas("");
    setMaterial("");
    setTieneReporteFalla(false);
    setDescripcionFalla("");
    setErrors({});
    setValidationMessages([]);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setValidationMessages([]);

    try {
      // Validación básica de campos requeridos
      const newErrors: ValidationErrors = {};
      if (!cantidadMaterial.trim()) newErrors.cantidadMaterial = true;
      if (!cantidadEnvases.trim()) newErrors.cantidadEnvases = true;
      if (!horasTrabajadas.trim()) newErrors.horasTrabajadas = true;
      if (tieneReporteFalla && !descripcionFalla.trim())
        newErrors.descripcionFalla = true;

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        setIsLoading(false);
        Alert.alert(
          "Error de validación",
          "Por favor complete todos los campos requeridos",
        );
        return;
      }

      // Preparar datos para enviar
      const requestData: CreateRegistroEnvaseRequest = {
        cantidadDeMaterialUsado: parseInt(cantidadMaterial),
        cantidadDeEnvasesProducidos: parseInt(cantidadEnvases),
        horasTrabajadas: parseInt(horasTrabajadas),
        idUser: 99, // TODO: Obtener del contexto de usuario autenticado
        ...(producto && { idProducto: getProductoId(producto) }),
        ...(material && { idMaterial: getMaterialId(material) }),
        // Operario ID se puede obtener del usuario logueado
        idOperario: 6, // TODO: Obtener del contexto del operario
      };

      // Validar datos con el servicio
      const validation = validateRegistroEnvase(requestData);
      if (!validation.isValid) {
        setValidationMessages(validation.errors);
        setIsLoading(false);
        Alert.alert("Error de validación", validation.errors.join("\n"));
        return;
      }

      // Enviar petición al backend
      const response =
        await productionRecordsService.createRegistroEnvase(requestData);

      setIsLoading(false);

      // Mostrar mensaje de éxito
      Alert.alert(
        "¡Éxito!",
        `Registro creado correctamente.\nID: ${response.id}\nFecha: ${new Date(response.fechaCreacion).toLocaleDateString()}`,
        [
          {
            text: "Crear otro",
            onPress: resetForm,
          },
          {
            text: "Volver",
            onPress: () => router.back(),
            style: "default",
          },
        ],
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating registro:", error);

      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "Error desconocido al crear el registro",
        [
          { text: "Reintentar", onPress: handleSave },
          { text: "Cancelar", style: "cancel" },
        ],
      );
    }
  };

  // Helper functions para mapear strings a IDs reales de la BD
  const getProductoId = (productoName: string): number => {
    const productoMap: { [key: string]: number } = {
      "Bidon blanco tradicional de 20 litros": 6,
      "Bidon blanco tradicional de 18 litros": 7,
      "Bidon blanco modelo nuevo de 10 litros": 8,
    };
    return productoMap[productoName] || 6;
  };

  const getMaterialId = (materialName: string): number => {
    const materialMap: { [key: string]: number } = {
      "Polietileno de alta densidad": 8,
      "Polietileno de baja densidad": 9,
      Polipropileno: 10,
      PET: 11,
      PVC: 12,
      Polietileno: 13,
      ABS: 14,
    };
    return materialMap[materialName] || 8;
  };

  const renderSelector = (
    value: string,
    placeholder: string,
    options: string[],
    onSelect: (value: string) => void,
    showPicker: boolean,
    setShowPicker: (show: boolean) => void,
  ) => (
    <View>
      <TouchableOpacity
        style={styles.selectorContainer}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={[styles.selectorText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={showPicker ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666"
        />
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.optionsContainer}>
          {options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => {
                onSelect(option);
                setShowPicker(false);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header Superior */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.profileSection}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Registro de Producción</Text>
              <Text style={styles.nameText}>
                {productoParam
                  ? `Producto: ${producto}`
                  : "Captura de datos de envases"}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Título del Formulario */}
          <View style={styles.titleContainer}>
            <Text style={styles.formTitle}>CREAR REGISTRO DE ENVASES</Text>
            {productoParam && (
              <Text style={styles.productSubtitle}>{producto}</Text>
            )}
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Cantidad de Material Usado */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Cantidad de Material Usado{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.cantidadMaterial && styles.inputError,
                ]}
                placeholder="Ingrese cantidad en kg"
                value={cantidadMaterial}
                onChangeText={setCantidadMaterial}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Cantidad de Envases Producidos */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Cantidad de Envases Producidos{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.cantidadEnvases && styles.inputError,
                ]}
                placeholder="Número de envases"
                value={cantidadEnvases}
                onChangeText={setCantidadEnvases}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Horas Trabajadas */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                Horas Trabajadas <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.horasTrabajadas && styles.inputError,
                ]}
                placeholder="Horas (número entero: 8)"
                value={horasTrabajadas}
                onChangeText={setHorasTrabajadas}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            {/* Operario (Campo autocompletado) */}
            <View style={styles.fieldContainer}>
              <View style={styles.labelWithInfo}>
                <Text style={styles.label}>Operario</Text>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#666"
                />
              </View>
              <TextInput
                style={styles.disabledInput}
                value="Lisa Martínez"
                editable={false}
                pointerEvents="none"
              />
              <Text style={styles.infoText}>
                Se asigna automáticamente según el usuario logueado
              </Text>
            </View>

            {/* Producto */}
            <View style={styles.fieldContainer}>
              <View style={styles.labelWithInfo}>
                <Text style={styles.label}>Producto</Text>
                {productoParam && (
                  <View style={styles.autoSelectedBadge}>
                    <Text style={styles.autoSelectedText}>
                      Auto-seleccionado
                    </Text>
                  </View>
                )}
              </View>
              {renderSelector(
                producto,
                "Seleccionar producto",
                productos,
                setProducto,
                showProductPicker,
                setShowProductPicker,
              )}
            </View>

            {/* Material */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Material</Text>
              {renderSelector(
                material,
                "Seleccionar material",
                materiales,
                setMaterial,
                showMaterialPicker,
                setShowMaterialPicker,
              )}
            </View>

            {/* Reporte de Falla */}
            <View style={styles.fieldContainer}>
              <View style={styles.switchContainer}>
                <Text style={styles.label}>¿Desea reportar alguna falla?</Text>
                <Switch
                  value={tieneReporteFalla}
                  onValueChange={handleSwitchFalla}
                  trackColor={{ false: "#E0E0E0", true: "#6366f1" }}
                  thumbColor={tieneReporteFalla ? "#ffffff" : "#f4f3f4"}
                />
              </View>

              {tieneReporteFalla && (
                <View style={styles.textAreaContainer}>
                  <Text style={[styles.label, styles.labelRequired]}>
                    Descripción de la falla{" "}
                    <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      errors.descripcionFalla && styles.inputError,
                    ]}
                    placeholder="Describa brevemente la falla presentada..."
                    value={descripcionFalla}
                    onChangeText={handleDescripcionFallaChange}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    maxLength={MAX_CARACTERES_FALLA}
                    placeholderTextColor="#999"
                  />
                  <View style={styles.characterCount}>
                    <Text style={styles.characterCountText}>
                      {descripcionFalla.length}/{MAX_CARACTERES_FALLA}{" "}
                      caracteres
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Mensajes de validación */}
            {validationMessages.length > 0 && (
              <View style={styles.validationContainer}>
                <Text style={styles.validationTitle}>
                  Errores de validación:
                </Text>
                {validationMessages.map((message, index) => (
                  <Text key={index} style={styles.validationMessage}>
                    • {message}
                  </Text>
                ))}
              </View>
            )}

            {/* Botones de Acción */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.disabledButton]}
                onPress={handleSave}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                      GUARDANDO...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>GUARDAR REGISTRO</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={() => router.back()}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardContainer: {
    flex: 1,
  },

  // Header styles
  header: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 120,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#E5E7EB",
  },
  welcomeSection: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  nameText: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
  },

  scrollView: {
    flex: 1,
  },

  // Title styles
  titleContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
    textAlign: "center",
  },
  productSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366f1",
    textAlign: "center",
    marginTop: 4,
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
  },

  // Form styles
  formContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 6,
  },
  required: {
    color: "#F44336",
  },
  labelWithInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  labelRequired: {
    fontWeight: "bold",
  },
  autoSelectedBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  autoSelectedText: {
    fontSize: 10,
    color: "#4CAF50",
    fontWeight: "600",
  },

  // Input styles
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
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
  inputError: {
    borderColor: "#F44336",
    borderWidth: 2,
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#666666",
  },
  infoText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },

  // Selector styles
  selectorContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  selectorText: {
    fontSize: 16,
    color: "#424242",
  },
  placeholderText: {
    color: "#999",
  },
  optionsContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  optionText: {
    fontSize: 16,
    color: "#424242",
  },

  // Styles for falla report section
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  textAreaContainer: {
    marginTop: 10,
  },
  textArea: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
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
  characterCount: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  characterCountText: {
    fontSize: 12,
    color: "#666",
  },

  // Button styles
  buttonsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
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
  cancelButton: {
    backgroundColor: "#757575",
    paddingVertical: 16,
    borderRadius: 8,
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
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Bottom navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },

  // Loading and validation styles
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  validationContainer: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#F44336",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  validationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F44336",
    marginBottom: 4,
  },
  validationMessage: {
    fontSize: 12,
    color: "#C62828",
    marginVertical: 1,
  },
});
