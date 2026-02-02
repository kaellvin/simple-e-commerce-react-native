import { CartStatus } from "@/providers/cart-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { memo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  RefreshControl,
} from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import AppButton from "../components/app-button";
import AppModal from "../components/app-modal";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import Divider from "../components/divider";
import LoadingIndicator from "../components/loading-indicator";
import useAuth from "../hooks/use-auth";
import useCart from "../hooks/use-cart";
import useMaximumQuantityExceededModal from "../hooks/use-maximum-quantity-exceeded-modal";
import {
  CartItem,
  CartItemAndSelection,
  RemoveItemAlertState,
} from "../types/cart/cart";

export default function Cart() {
  const { session } = useAuth();
  const {
    state: cartState,
    animationResetMapRef,
    onCheckboxChange,
    updateQuantity,
    deleteCartItemFromCart,
    onRefresh,
    onCheckout,
  } = useCart();
  const { setMaxQuantityExceededAlertState } =
    useMaximumQuantityExceededModal();
  const [removeItemAlertState, setRemoveItemAlertState] =
    useState<RemoveItemAlertState>({ isOpen: false, productVariantId: "" });

  const { width } = useWindowDimensions();

  const cartTotal =
    cartState.cart?.cartItemAndSelections
      .filter((item) => item.isChecked)
      .reduce(
        (sum, item) =>
          sum +
          Number(item.cartItem.productVariant.price) * item.cartItem.quantity,
        0,
      ) ?? 0;

  const onRemoveIconClicked = (cartItem: CartItem) => {
    let newQuantity = cartItem.quantity - 1;
    if (newQuantity === 0) {
      setRemoveItemAlertState({
        isOpen: true,
        productVariantId: cartItem.productVariantId,
      });
    } else {
      updateQuantity(newQuantity, cartItem.quantity, cartItem.productVariantId);
    }
  };

  const onDisableRemoveItemFromCartAlert = () => {
    setRemoveItemAlertState({
      isOpen: false,
      productVariantId: "",
    });
  };

  const onRemoveItemFromCartConfirm = (productVariandId: string) => {
    setRemoveItemAlertState({
      isOpen: false,
      productVariantId: "",
    });
    deleteCartItemFromCart(productVariandId);
  };

  const onAddIconClicked = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.productVariant.quantity) {
      setMaxQuantityExceededAlertState({
        isOpen: true,
        stock: cartItem.productVariant.quantity,
      });
    } else {
      let newQuantity = cartItem.quantity + 1;
      updateQuantity(newQuantity, cartItem.quantity, cartItem.productVariantId);
    }
  };

  const onCheckoutButtonClicked = () => {
    onCheckout();
  };

  if (!session)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 16,
          padding: 16,
        }}
      >
        <AppText variant="titleMedium" style={{ textAlign: "center" }}>
          Sign in to add products to your cart.
        </AppText>
        <Link href="/sign-in" asChild>
          <AppButton variant="primary">Sign In</AppButton>
        </Link>
      </View>
    );

  if (cartState.status === CartStatus.Loading) return <LoadingIndicator />;

  return cartState.cart === null ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={cartState.status === CartStatus.Refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <CenteredMessage message="Your cart is empty." />
    </ScrollView>
  ) : (
    <SafeAreaView edges={["top"]} style={{ flex: 1, paddingBottom: 16 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item) => item.cartItem.productVariantId}
          contentContainerStyle={{ flexGrow: 1 }}
          data={cartState.cart.cartItemAndSelections}
          renderItem={({ item }) => (
            <RenderCartItem
              animationResetMapRef={animationResetMapRef}
              item={item}
              width={width}
              deleteCartItemFromCart={deleteCartItemFromCart}
              onCheckboxChange={onCheckboxChange}
              onRemoveIconClicked={onRemoveIconClicked}
              onAddIconClicked={onAddIconClicked}
            />
          )}
          ListEmptyComponent={() => (
            <CenteredMessage message="Your cart is empty." />
          )}
          ItemSeparatorComponent={Divider}
          refreshControl={
            <RefreshControl
              refreshing={cartState.status === CartStatus.Refreshing}
              onRefresh={onRefresh}
            />
          }
        />
        <View style={{ marginHorizontal: 16 }}>
          <AppText
            variant="titleLarge"
            style={{ textAlign: "right", padding: 8 }}
          >
            Total:{`RM ${cartTotal.toFixed(2)}`}
          </AppText>
          <AppButton
            variant="primary"
            onPress={onCheckoutButtonClicked}
            disabled={cartTotal <= 0}
          >
            CHECKOUT
          </AppButton>
        </View>
      </View>
      <AppModal
        visible={removeItemAlertState.isOpen}
        title=""
        message="Are you sure you want to remove the product from cart?"
        onClose={onDisableRemoveItemFromCartAlert}
        displayCancelButton
        onConfirm={() =>
          onRemoveItemFromCartConfirm(removeItemAlertState.productVariantId)
        }
        buttonLabel="OK"
      />
    </SafeAreaView>
  );
}

export const RenderCartItem = memo(function RenderCartItem({
  animationResetMapRef,
  item,
  width,
  deleteCartItemFromCart,
  onCheckboxChange,
  onRemoveIconClicked,
  onAddIconClicked,
}: {
  animationResetMapRef: React.RefObject<Map<string, () => void>>;
  item: CartItemAndSelection;
  width: number;
  deleteCartItemFromCart: (productVariantId: string) => void;
  onCheckboxChange: (isChecked: boolean, productVariantId: string) => void;
  onRemoveIconClicked: (cartItem: CartItem) => void;
  onAddIconClicked: (cartItem: CartItem) => void;
}) {
  const cartItem = item.cartItem;
  const isChecked = item.isChecked;

  const SWIPE_THRESHOLD = -width / 2;

  const quantity = cartItem.quantity;
  const productVariant = cartItem.productVariant!;
  const price = Number(productVariant.price).toFixed(2);
  const productName = productVariant.product.name;

  const productOptions = [...productVariant.product.productOptions].sort(
    (a, b) => a.position - b.position,
  );

  const variantOptions = productVariant.variantOptions;

  //get first option to extract option image
  const optionValueImage = productVariant.product.optionValueImages.find(
    (item) =>
      item.optionValue.option.id === productOptions[0].optionId &&
      variantOptions.map((vo) => vo.optionValueId).includes(item.optionValueId),
  )!;

  const orderedVariantOptionList = productOptions.map(
    (pOption) =>
      variantOptions.find(
        (item) => pOption.optionId === item.optionValue.option.id,
      )!,
  );

  const voOptionValues = orderedVariantOptionList
    .map((item) => item.optionValue.name)
    .join(", ");

  const imageUrl = optionValueImage.url;

  //--
  if (!animationResetMapRef.current.has(cartItem.productVariantId)) {
    animationResetMapRef.current.set(cartItem.productVariantId, () => {
      translateX.value = withTiming(0);
    });
  }

  const translateX = useSharedValue(0);
  const rowHeight = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onPanGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .activeOffsetY([-20, 20])
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width, undefined, () => {
          scheduleOnRN(deleteCartItemFromCart, cartItem.productVariantId);
        });
        rowHeight.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
      }
    });

  return (
    <GestureDetector gesture={onPanGesture}>
      <Animated.View layout={LinearTransition} style={[animatedStyle]}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            padding: 16,
          }}
        >
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <Checkbox
              value={isChecked}
              onValueChange={(isChecked) =>
                onCheckboxChange(isChecked, cartItem.productVariantId)
              }
            />
          </View>

          <Image
            source={imageUrl}
            style={{
              width: width * 0.3,
              aspectRatio: 1,
              borderRadius: 16,
            }}
          />

          <View style={{ justifyContent: "space-between", flex: 1 }}>
            <View>
              <AppText variant="titleMedium" numberOfLines={2}>
                {productName}
              </AppText>
              <AppText variant="labelMedium">Selected Options:</AppText>
              <AppText variant="labelMedium">{voOptionValues}</AppText>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <AppText variant="labelMedium">{`RM ${price}`}</AppText>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <Pressable
                  style={({ pressed }) => ({
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "gray",
                    padding: 2,
                    opacity: pressed ? 0.6 : 1,
                  })}
                  onPress={() => onRemoveIconClicked(cartItem)}
                >
                  <MaterialIcons size={24} name="remove" />
                </Pressable>

                <View
                  style={{
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AppText variant="labelMedium">{quantity}</AppText>
                </View>

                <Pressable
                  style={({ pressed }) => ({
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "gray",
                    padding: 2,
                    opacity: pressed ? 0.6 : 1,
                  })}
                  onPress={() => onAddIconClicked(cartItem)}
                >
                  <MaterialIcons size={24} name="add" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
});
