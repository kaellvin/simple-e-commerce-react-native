import { AuthContext } from "@/providers/AuthProvider";
import Button from "@/src/components/button";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{10,}$/;

function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { signIn } = useContext(AuthContext);

  const onSignInButtonClicked = async () => {
    let isError = false;

    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required.");
      isError = true;
    }
    if (!password) {
      setPasswordError("Password is required.");
      isError = true;
    } else {
      // if (!passwordRegex.test(password)) {
      //   setPasswordError(
      //     "Password must be at least 10 characters long and include at least one uppercase letter and one symbol."
      //   );
      //   isError = true;
      // }
    }

    if (!isError) {
      const success = await signIn(email, password);
      if (success) {
        router.back();
      }
    }
  };

  return (
    <View style={{ margin: 16, gap: 16 }}>
      <View>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCorrect={false}
          contextMenuHidden={true}
          style={styles.textInput}
        />
        {emailError && <Text style={{ color: "red" }}>{emailError}</Text>}
      </View>

      <View>
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          style={styles.textInput}
        />
        {passwordError && <Text style={{ color: "red" }}>{passwordError}</Text>}
      </View>

      <Button
        label="Sign In"
        variant="primary"
        onPress={onSignInButtonClicked}
      />
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});
