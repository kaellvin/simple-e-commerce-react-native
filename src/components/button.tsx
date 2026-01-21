import { Colors } from "@/src/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, TextProps } from "react-native";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends TextProps {
  children: React.ReactNode;
  variant: ButtonVariant;
  onPress: () => void;
}

function Button({ children, variant, onPress, ...props }: ButtonProps) {
  const backgroundColor =
    variant === "primary" ? Colors.light.primary : Colors.light.secondary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text {...props} style={styles.buttonText}>
        {children}
      </Text>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
