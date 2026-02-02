import React from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import AppText from "./app-text";

function AppModal({
  visible,
  onConfirm,
  onClose,
  displayCancelButton = false,
  title,
  message,
  buttonLabel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
  displayCancelButton?: boolean;
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
          <View style={{ flexDirection: "row", marginLeft: "auto" }}>
            {displayCancelButton && (
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  { padding: 8 },
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <AppText variant="titleMedium">No</AppText>
              </Pressable>
            )}
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
