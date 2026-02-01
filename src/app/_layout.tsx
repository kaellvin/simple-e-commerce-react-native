import AuthProvider from "@/providers/auth-provider";
import CartProvider from "@/providers/cart-provider";
import MaximumQuantityExceededProvider from "@/providers/maximum-quantity-exceeded-modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <MaximumQuantityExceededProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <SafeAreaProvider>
                {/* <Stack screenOptions={{ headerShown: false }} /> */}
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
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
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </MaximumQuantityExceededProvider>
    </GestureHandlerRootView>
  );
}
