import { Stack } from "expo-router";

export default function ProfileStack() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="sidebar" options={{ title: "Dashbaord" }} />
      <Stack.Screen name="sendMail" options={{ title: "Reset Mail" }} />
    </Stack>
  );
}
