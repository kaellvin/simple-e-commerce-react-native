import AppModal from "@/src/components/app-modal";
import Divider from "@/src/components/divider";
import useAuth from "@/src/hooks/use-auth";
import useCart from "@/src/hooks/use-cart";
import { PVOptionValue } from "@/src/types/product/product";
import { MaterialIcons } from "@expo/vector-icons";
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
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppButton from "../../components/app-button";
import AppText from "../../components/app-text";
import CenteredMessage from "../../components/centered-message";
import CircularIcon from "../../components/circular-icon";
import LoadingIndicator from "../../components/loading-indicator";
import useProduct from "../../hooks/use-product";
import QuantityControl from "./quantity-control";

export default function ProductDetail() {
  const { id: productId } = useLocalSearchParams<{ id: string }>();

  const { session } = useAuth();
  const { validateBeforeAddingCartItem } = useCart();
  const {
    isLoading,
    error,
    product,
    getProductDetail,
    activeVariant,
    getCurrentPrice,
    mainImageUrl,
    pvOptionList,
    setActiveVariant,
    setPVOptionList,
    quantity,
    setQuantity,
  } = useProduct();

  const { width } = useWindowDimensions();
  const inset = useSafeAreaInsets();
  const router = useRouter();

  //page indicator
  const [pageNum, setPageNum] = useState(0);

  //bottom sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    getProductDetail(productId);
  }, [getProductDetail, productId]);

  const onChevronLeftIconClicked = () => {
    router.back();
  };

  const onShoppingCartIconClicked = () => {
    router.dismissAll();
    router.replace("/cart");
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageNum = Math.round(contentOffset.x / layoutMeasurement.width);
    setPageNum(pageNum);
  };

  const onAddToCartButtonClicked = () => {
    bottomSheetRef.current?.expand();
  };

  const onOptionItemClicked = (
    idx: number,
    optionId: string,
    opValue: PVOptionValue,
  ) => {
    if (product !== null) {
      if (idx === 0) {
        //find all option combinations that contain selected option
        const productVariantIds = product.productVariants
          .flatMap((item) => item.variantOptions)
          .filter((item) => opValue.id === item.optionValueId)
          .map((item) => item.productVariantId);
        const optionValueIds = product.productVariants
          .flatMap((item) => item.variantOptions)
          .filter((item) => productVariantIds.includes(item.productVariantId))
          .map((item) => item.optionValueId);

        //find first product variant that contain selected option
        const matchedProductVariant = product.productVariants.find((item) =>
          item.variantOptions.some((item) => item.optionValueId === opValue.id),
        )!;
        const pvOptionValueIds = matchedProductVariant.variantOptions.map(
          (item) => item.optionValueId,
        );

        const newPvOptionList = pvOptionList.map((op) => ({
          ...op,
          values: op.values.map((item) => ({
            ...item,
            isSelected: pvOptionValueIds.includes(item.optionValue.id),
            isWithinSelection:
              optionValueIds.includes(item.optionValue.id) ||
              op.id === optionId,
          })),
        }));

        setActiveVariant(matchedProductVariant);
        setPVOptionList(newPvOptionList);
      } else {
        //update only option value within same type
        const newPvOptionList = pvOptionList.map((op) => ({
          ...op,
          values: op.values.map((item) => ({
            ...item,
            isSelected:
              op.id === optionId
                ? item.optionValue.name === opValue.name
                : item.isSelected,
          })),
        }));

        //extract product variant that matches all selected options
        const selectedOptionValueIds = newPvOptionList.flatMap((item) =>
          item.values
            .filter((item) => item.isSelected)
            .flatMap((item) => item.optionValue.id),
        );

        const newSelectedProductVariant = product.productVariants.find((item) =>
          item.variantOptions.every((vo) =>
            selectedOptionValueIds.includes(vo.optionValueId),
          ),
        )!;

        setActiveVariant(newSelectedProductVariant);
        setPVOptionList(newPvOptionList);
      }

      //reset quantity
      setQuantity(1);
    }
  };

  const onQuantityDecrease = () => {
    setQuantity((prev) => prev - 1);
  };

  const onQuantityIncrease = () => {
    setQuantity((prev) => (prev < activeVariant.quantity ? prev + 1 : prev));
  };

  const onBottomSheetAddToCartButtonClicked = (
    quantity: number,
    stock: number,
    productVariantId: string,
  ) => {
    if (session === null) {
      setShowLoginAlert(true);
    } else {
      validateBeforeAddingCartItem(quantity, stock, productVariantId);
    }
  };

  const onDisableLoginAlert = () => {
    setShowLoginAlert(false);
  };

  const onLoginAlertConfirm = () => {
    router.push("/sign-in");
    setShowLoginAlert(false);
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
    <>
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

            <AppButton variant="primary" onPress={onAddToCartButtonClicked}>
              Add To Cart
            </AppButton>
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
                  style={{
                    width: width * 0.3,
                    aspectRatio: 1,
                    borderRadius: 16,
                  }}
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
              {pvOptionList.map((pvOption, pvOptionIdx) => (
                <View key={pvOption.id} style={{ gap: 8 }}>
                  <AppText variant="labelLarge">{pvOption.publicLabel}</AppText>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                  >
                    {pvOption.values.map((item, idx) => (
                      <Pressable
                        key={idx}
                        onPress={
                          item.isWithinSelection
                            ? () =>
                                onOptionItemClicked(
                                  pvOptionIdx,
                                  pvOption.id,
                                  item.optionValue,
                                )
                            : null
                        }
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            borderWidth: 1,
                            borderColor: item.isWithinSelection
                              ? item.isSelected
                                ? "red"
                                : "black"
                              : "gray",
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          {item.isSelected && (
                            <MaterialIcons
                              size={16}
                              name="check"
                              color={item.isSelected ? "red" : "black"}
                            />
                          )}

                          <AppText
                            variant="labelLarge"
                            style={{
                              color: item.isWithinSelection ? "black" : "gray",
                            }}
                          >
                            {item.optionValue.name}
                          </AppText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ))}

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

              <AppButton
                variant="primary"
                onPress={() =>
                  onBottomSheetAddToCartButtonClicked(
                    quantity,
                    activeVariant.quantity,
                    activeVariant.id,
                  )
                }
              >
                Add To Cart
              </AppButton>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>

      <AppModal
        visible={showLoginAlert}
        title="Login Required"
        message="You need to be logged in to add items to your cart. Please login to continue."
        onClose={onDisableLoginAlert}
        onConfirm={onLoginAlertConfirm}
        buttonLabel="Sign In"
      />
    </>
  );
}
