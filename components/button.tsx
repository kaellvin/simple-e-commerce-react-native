import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary";

function Button({ label, variant }: { label: string; variant: ButtonVariant }) {
  const backgroundColor =
    variant === "primary" ? Colors.light.primary : Colors.light.secondary;
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.buttonText}>{label}</Text>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
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
