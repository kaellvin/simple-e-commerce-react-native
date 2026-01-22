import { Colors } from "@/src/constants/theme";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextProps,
} from "react-native";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant: ButtonVariant;
  onPress?: () => void;
  textProps?: TextProps;
}

function AppButton({
  children,
  variant,
  onPress,
  textProps,
  ...props
}: ButtonProps) {
  const backgroundColor = props.disabled
    ? "gray"
    : variant === "primary"
      ? Colors.light.primary
      : Colors.light.secondary;
  return (
    <Pressable
      {...props}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor },
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Text style={styles.buttonText} numberOfLines={1} {...textProps}>
        {children}
      </Text>
    </Pressable>
  );
}

export default AppButton;

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
