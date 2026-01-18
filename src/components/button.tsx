import { Colors } from "@/src/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type ButtonVariant = "primary" | "secondary";

function Button({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: ButtonVariant;
  onPress: () => void;
}) {
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
      <Text style={styles.buttonText}>{label}</Text>
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
