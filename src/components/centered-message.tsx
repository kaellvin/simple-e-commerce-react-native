import React from "react";
import { View } from "react-native";
import AppText from "./app-text";

function CenteredMessage({ message }: { message: string }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <AppText variant="titleMedium">{message}</AppText>
    </View>
  );
}

export default CenteredMessage;
