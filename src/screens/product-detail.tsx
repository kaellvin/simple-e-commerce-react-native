import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import LoadingIndicator from "../components/loading-indicator";
import useProduct from "../hooks/useProduct";

export default function ProductDetail() {
  const { id: productId } = useLocalSearchParams<{ id: string }>();
  const { isLoading, error, product, getProductDetail } = useProduct();

  useEffect(() => {
    getProductDetail(productId);
  }, [getProductDetail, productId]);

  if (isLoading) return <LoadingIndicator />;

  if (error) return <CenteredMessage message={error} />;

  return product == null ? (
    <CenteredMessage message="No matching product found." />
  ) : (
    <View>
      <AppText variant="titleLarge">{product.name}</AppText>
      <AppText variant="bodyLarge">{product.description}</AppText>
    </View>
  );
}
