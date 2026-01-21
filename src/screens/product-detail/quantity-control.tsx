import AppText from "@/src/components/app-text";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface QuantityControlProps {
  onIncrease: () => void;
  onDecrease: () => void;
  quantity: number;
  stock: number;
}

function QuantityControl({
  onIncrease,
  onDecrease,
  quantity,
  stock,
}: QuantityControlProps) {
  const width = 48;
  return (
    <View
      style={[
        styles.container,
        {
          height: width,
          borderRadius: width / 2,
        },
      ]}
    >
      <Pressable
        onPress={quantity > 1 ? onDecrease : null}
        style={({ pressed }) => [
          styles.item,
          {
            width: width,
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <MaterialIcons size={24} name="remove" />
      </Pressable>
      <View
        style={[
          styles.item,
          {
            width: width,
            borderLeftWidth: 1,
            borderRightWidth: 1,
          },
        ]}
      >
        <AppText variant="bodyLarge">{quantity}</AppText>
      </View>

      <Pressable
        onPress={quantity < stock ? onIncrease : null}
        style={({ pressed }) => [
          styles.item,
          {
            width: width,
            opacity: pressed ? 0.6 : 1,
          },
        ]}
      >
        <MaterialIcons size={24} name="add" />
      </Pressable>
    </View>
  );
}

export default QuantityControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    overflow: "hidden",
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
  },
});
