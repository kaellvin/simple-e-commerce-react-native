import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View, ViewProps } from "react-native";

interface CirculerIconProps extends ViewProps {
  iconName: React.ComponentProps<typeof MaterialIcons>["name"];
  onPress: () => void;
}

function CircularIcon({
  onPress,
  iconName,
  style,
  ...props
}: CirculerIconProps) {
  return (
    <Pressable onPress={onPress}>
      <View {...props} style={[styles.container, style]}>
        <MaterialIcons size={24} name={iconName} />
      </View>
    </Pressable>
  );
}

export default CircularIcon;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
