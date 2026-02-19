import { Stack } from "expo-router";

export default function ProductStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Accessories" }} />
      {/* <Stack.Screen name="contact" options={{ title: "Contact" }} /> */}
      {/* <Stack.Screen name="register" options={{ title: "Register" }} /> */}
    </Stack>
  );
}
