import { AuthContext } from "@/providers/AuthProvider";
import { ToastContext } from "@/providers/ToastProvider";
import Button from "@/src/components/button";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LoadingOverlay from "../components/loading-overlay";

const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{10,}$/;

function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { isLoading, signIn } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

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
            <TextInput
              onChangeText={setEmail}
              value={email}
              placeholder="Email"
              keyboardType="email-address"
              autoCorrect={false}
              contextMenuHidden={true}
              style={styles.textInput}
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
            <TextInput
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry={!isPasswordVisible}
              style={[styles.textInput, { flex: 1 }]}
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

        <Button
          label="Sign In"
          variant="primary"
          onPress={onSignInButtonClicked}
        />
      </View>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  textInputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  textInput: {
    fontWeight: "semibold",
  },
});
