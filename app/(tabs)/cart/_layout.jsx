import { Stack } from "expo-router";

export default function ProductStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Carts" }} />
      <Stack.Screen name="pay" options={{ title: "Payments" }} />
    </Stack>
  );
}
