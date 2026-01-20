import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppTextInput from "./app-text-input";

function SearchBar() {
  return (
    <View style={styles.container}>
      <MaterialIcons size={24} name="search" />
      <AppTextInput placeholder="Search products" variant="titleMedium" />
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
});
