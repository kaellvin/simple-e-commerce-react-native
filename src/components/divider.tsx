import React from "react";
import { StyleSheet, View } from "react-native";

function Divider() {
  return <View style={styles.divider} />;
}

export default Divider;

const styles = StyleSheet.create({
  divider: { height: 1, backgroundColor: "#E0E0E0" },
});
