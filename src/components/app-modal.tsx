import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import AppText from "./app-text";

function AppModal({
  visible,
  onConfirm,
  onClose,
  title,
  message,
  buttonLabel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonLabel: string;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            gap: 24,
          }}
        >
          {title && <AppText variant="titleLarge">{title}</AppText>}
          {message && <AppText variant="bodyLarge">{message}</AppText>}
          <View style={{ marginLeft: "auto" }}>
            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                { padding: 8 },
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <AppText variant="titleMedium">{buttonLabel}</AppText>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default AppModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
