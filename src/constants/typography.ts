import { StyleSheet } from "react-native";

export const Typography = StyleSheet.create({
  titleMedium: {
    fontSize: 16,
    fontWeight: "500",
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400",
  },
});

export type TypographyVariant = keyof typeof Typography;
