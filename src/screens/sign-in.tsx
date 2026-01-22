import AppButton from "@/src/components/app-button";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import AppTextInput from "../components/app-text-input";
import LoadingOverlay from "../components/loading-overlay";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";

const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{10,}$/;

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { isLoading, signIn } = useAuth();
  const { showToast } = useToast();

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
      Keyboard.dismiss();

      try {
        await signIn(email, password);
        router.back();
        showToast("Login successfully.");
      } catch (error) {
        if (error instanceof Error) {
          showToast(error.message);
        }
      }
    }
  };

  return (
    <>
      <View style={{ margin: 16, gap: 16 }}>
        <View>
          <View style={styles.textInputContainer}>
            <AppTextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
              contextMenuHidden={true}
              variant="bodyLarge"
            />
          </View>
          {emailError && <Text style={{ color: "red" }}>{emailError}</Text>}
        </View>

        <View>
          <View
            style={[
              styles.textInputContainer,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <AppTextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              style={{ flex: 1 }}
              variant="bodyLarge"
            />
            <Pressable
              onPress={() => {
                setIsPasswordVisible((prev) => !prev);
              }}
            >
              <MaterialIcons
                size={24}
                name={isPasswordVisible ? "visibility-off" : "visibility"}
              />
            </Pressable>
          </View>

          {passwordError && (
            <Text style={{ color: "red" }}>{passwordError}</Text>
          )}
        </View>

        <AppButton variant="primary" onPress={onSignInButtonClicked}>
          Sign In
        </AppButton>
      </View>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
});
