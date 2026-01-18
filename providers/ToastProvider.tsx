import React, { createContext, useState } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  const translateY = useSharedValue(100);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const insets = useSafeAreaInsets();

  const showToast = (message: string) => {
    setMessage(message);
    translateY.value = withTiming(0, { duration: 300 });

    setTimeout(() => {
      translateY.value = withTiming(100, { duration: 300 }, () => {
        scheduleOnRN(setMessage, "");
      });
    }, 2000);
  };

  return (
    <ToastContext value={{ showToast }}>
      {children}
      {message && (
        <Animated.View
          style={[
            styles.toastContainer,
            animatedStyle,
            { bottom: 0 + insets.bottom },
          ]}
        >
          <Text style={[styles.toastText]}>{message}</Text>
        </Animated.View>
      )}
    </ToastContext>
  );
}

interface IToastContext {
  showToast: (message: string) => void;
}

export const ToastContext = createContext<IToastContext>({
  showToast: () => console.warn("showToast must be used within provider"),
});

export default ToastProvider;

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "white",
    margin: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  toastText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
