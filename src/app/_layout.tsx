import AuthProvider from "@/providers/AuthProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* <Stack screenOptions={{ headerShown: false }} /> */}
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="sign-in"
            options={{
              title: "Sign In",
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
