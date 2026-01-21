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
              name="product-detail/[id]"
              options={{
                title: "Product-detail",
                headerShown: false,
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
