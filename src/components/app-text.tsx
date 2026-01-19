import React from "react";
import { Text, TextProps } from "react-native";
import { Typography, TypographyVariant } from "../constants/typography";

interface AppTextProps extends TextProps {
  variant: TypographyVariant;
}

function AppText({ variant, style, ...props }: AppTextProps) {
  return <Text {...props} style={[Typography[variant], style]} />;
}

export default AppText;
