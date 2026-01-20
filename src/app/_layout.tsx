import AuthProvider from "@/providers/AuthProvider";
import ToastProvider from "@/providers/ToastProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
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
            <Stack.Screen
              name="sign-up"
              options={{
                title: "Sign Up",
              }}
            />
            <Stack.Screen
              name="product-detail"
              options={{
                title: "Product-detail",
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
