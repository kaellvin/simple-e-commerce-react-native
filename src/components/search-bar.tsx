import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TargetedEvent,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import AppText from "./app-text";
import AppTextInput from "./app-text-input";

interface SearchBarProps {
  isSearch: boolean;
  searchInput: string;
  onFocus: ((e: NativeSyntheticEvent<TargetedEvent>) => void) | undefined;
  onChangeSearchText: (text: string) => void;
  onClearSearchText: () => void;
  onSearchSubmit: () => void;
  onExitSearchMode: () => void;
}

function SearchBar({
  isSearch,
  searchInput,
  onFocus,
  onChangeSearchText,
  onClearSearchText,
  onSearchSubmit,
  onExitSearchMode,
}: SearchBarProps) {
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(searchInput);
  }, [searchInput]);

  const textInputStyle = useAnimatedStyle(() => ({
    flex: withTiming(isSearch ? 0.95 : 1),
  }));

  const cancelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(isSearch ? 0 : 20) }],
  }));

  const onChangeText = (text: string) => {
    onChangeSearchText(text);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 16,
      }}
    >
      <Animated.View style={[styles.container, textInputStyle]}>
        <MaterialIcons size={24} name="search" />
        <AppTextInput
          onFocus={onFocus}
          onChangeText={onChangeText}
          value={input}
          returnKeyType="search"
          onSubmitEditing={onSearchSubmit}
          placeholder="Search products"
          variant="titleMedium"
          style={styles.textInput}
        />
        {input.length > 0 && (
          <Pressable onPress={onClearSearchText}>
            <MaterialIcons size={24} name="close" />
          </Pressable>
        )}
      </Animated.View>
      {isSearch && (
        <Animated.View style={[cancelStyle]}>
          <Pressable onPress={onExitSearchMode}>
            <AppText variant="labelLarge">CANCEL</AppText>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    lineHeight: 20, //--
  },
});
