import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { Typography, TypographyVariant } from "../constants/typography";

interface AppTextInputProps extends TextInputProps {
  variant: TypographyVariant;
}

function AppTextInput({ variant, style, ...props }: AppTextInputProps) {
  return <TextInput {...props} style={[Typography[variant], style]} />;
}

export default AppTextInput;
