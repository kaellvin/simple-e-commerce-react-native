import Divider from "@/src/components/divider";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "../../components/app-text";
import Button from "../../components/button";
import CenteredMessage from "../../components/centered-message";
import CircularIcon from "../../components/circular-icon";
import LoadingIndicator from "../../components/loading-indicator";
import useProduct from "../../hooks/useProduct";
import QuantityControl from "./quantity-control";

export default function ProductDetail() {
  const { id: productId } = useLocalSearchParams<{ id: string }>();
  const {
    isLoading,
    error,
    product,
    getProductDetail,
    activeVariant,
    getCurrentPrice,
    mainImageUrl,
    quantity,
    onQuantityDecrease,
    onQuantityIncrease,
  } = useProduct();

  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const router = useRouter();

  //page indicator
  const [pageNum, setPageNum] = useState(0);

  //bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const onAddToCartButtonClicked = () => {
    bottomSheetRef.current?.expand();
  };

  //--
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );

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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          <View style={{ padding: 16, gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Image
                source={mainImageUrl}
                style={{ aspectRatio: 1, width: width * 0.3, borderRadius: 16 }}
                contentFit="contain"
              />
              <View>
                <AppText variant="labelLarge">
                  {`Price: RM ${getCurrentPrice().toFixed(2)}`}
                </AppText>
                <AppText variant="labelLarge">{`Stock: ${activeVariant.quantity}`}</AppText>
              </View>
            </View>

            <Divider />
            <Divider />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <AppText variant="labelLarge">Quantity</AppText>

              <QuantityControl
                onDecrease={onQuantityDecrease}
                onIncrease={onQuantityIncrease}
                quantity={quantity}
                stock={activeVariant.quantity}
              />
            </View>

            <Button variant="primary" onPress={() => {}}>
              Add To Cart
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
