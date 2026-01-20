import { StyleSheet } from "react-native";

export const Typography = StyleSheet.create({
  titleLarge: {
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  labelLarge: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export type TypographyVariant = keyof typeof Typography;
