import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Typography, TypographyVariant } from "../constants/typography";

interface AppTextInputProps extends TextInputProps {
  variant: TypographyVariant;
}

function AppTextInput({ variant, style, ...props }: AppTextInputProps) {
  return (
    <TextInput
      {...props}
      style={[Typography[variant], styles.textInput, style]}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    lineHeight: 20, //--
  },
});

export default AppTextInput;
