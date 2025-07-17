import { View } from "react-native";
import { AppText } from "@/components/AppText";
import { Link, useRouter } from "expo-router";
import { Button } from "@/components/Button";
import { ButtonGrid } from "@/components/ButtonGrid";

export default function ThirdScreen() {
  const router = useRouter();
  return (
    <View className="justify-center flex-1 p-4">
      <ButtonGrid></ButtonGrid>
      <Button
        title="Ir al Primer Screen "
        onPress={() => {
          router.push("/");
        }}
      />
    </View>
  );
}
