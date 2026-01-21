import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../components/app-text";
import Button from "../components/button";
import CenteredMessage from "../components/centered-message";
import CircularIcon from "../components/circular-icon";
import LoadingIndicator from "../components/loading-indicator";
import useProduct from "../hooks/useProduct";

export default function ProductDetail() {
  const { id: productId } = useLocalSearchParams<{ id: string }>();
  const { isLoading, error, product, getProductDetail } = useProduct();

  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const router = useRouter();

  const [pageNum, setPageNum] = useState(0);

  useEffect(() => {
    getProductDetail(productId);
  }, [getProductDetail, productId]);

  const onChevronLeftIconClicked = () => {
    router.back();
  };

  const onShoppingCartIconClicked = () => {
    //TODO:
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageNum = Math.round(contentOffset.x / layoutMeasurement.width);
    setPageNum(pageNum);
  };

  const onAddToCartButtonClicked = () => {};

  if (isLoading) return <LoadingIndicator />;

  if (error) return <CenteredMessage message={error} />;
  return product == null ? (
    <CenteredMessage message="No matching product found." />
  ) : (
    <View style={{ flex: 1 }}>
      <View>
        <FlatList
          data={product.productImageUrls}
          horizontal
          pagingEnabled
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Image
                source={item}
                style={{
                  width: "100%",
                  aspectRatio: 16 / 9,
                }}
                contentFit="cover"
              />
            </View>
          )}
        />

        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            justifyContent: "space-between",
            width: width,
            paddingHorizontal: 16,
            top: inset.top,
          }}
        >
          <CircularIcon
            iconName="chevron-left"
            onPress={onChevronLeftIconClicked}
          />
          <CircularIcon
            iconName="shopping-cart"
            onPress={onShoppingCartIconClicked}
          />
        </View>

        <AppText
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            color: "white",
          }}
          variant="labelLarge"
        >
          {pageNum + 1}/{product.productImageUrls.length}
        </AppText>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
            gap: 16,
            paddingBottom: inset.bottom,
          }}
        >
          <View style={{ flex: 1 }}>
            <AppText variant="titleLarge">{product.name}</AppText>
            <AppText variant="bodyLarge">{product.description}</AppText>
          </View>

          <Button variant="primary" onPress={onAddToCartButtonClicked}>
            Add To Cart
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
