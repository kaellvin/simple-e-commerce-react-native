import Button from "@/components/button";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

function SignInScreen() {
  return (
    <View style={{ margin: 16, gap: 16 }}>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        style={styles.textInput}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        style={styles.textInput}
      />
      <Button label="Sign In" variant="primary" />
    </View>
  );
}

export default SignInScreen;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});
