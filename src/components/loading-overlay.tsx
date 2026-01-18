import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    </Modal>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
