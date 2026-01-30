import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/app-button";
import AppModal from "../components/app-modal";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import LoadingIndicator from "../components/loading-indicator";
import LoadingOverlay from "../components/loading-overlay";
import useAuth from "../hooks/useAuth";
import useCart, { CartStatus } from "../hooks/useCart";
import {
  CartItem,
  CartItemAndSelection,
  RemoveItemAlertState,
} from "../types/cart/cart";

export default function Cart() {
  const { session } = useAuth();
  const {
    state: cartState,
    onCheckboxChange,
    updateQuantity,
    deleteCartItemFromCart,
    onRefresh,
  } = useCart();
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
      //TODO:
    } else {
      let newQuantity = cartItem.quantity + 1;
      updateQuantity(newQuantity, cartItem.quantity, cartItem.productVariantId);
    }
  };

  const onCheckoutButtonClicked = () => {
    //TODO:
  };

  const renderItem = ({ item }: { item: CartItemAndSelection }) => {
    const cartItem = item.cartItem;
    const isChecked = item.isChecked;

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
        variantOptions
          .map((vo) => vo.optionValueId)
          .includes(item.optionValueId),
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
    return (
      <ReanimatedSwipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={() => {
          console.log("TRY DELETE");
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            padding: 16,
          }}
        >
          <View style={{ justifyContent: "center" }}>
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
          <View style={{ justifyContent: "space-between", flexShrink: 1 }}>
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
      </ReanimatedSwipeable>
    );
  };

  const renderRightActions = (
    progress: SharedValue<number>,
    translation: SharedValue<number>,
    swipeableMethods: SwipeableMethods,
  ) => (
    <View style={{ backgroundColor: "red", justifyContent: "center" }}>
      <AppText variant="titleMedium">DELETE</AppText>
    </View>
  );

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={cartState.cart.cartItemAndSelections}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <CenteredMessage message="Your cart is empty." />
          )}
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
      <LoadingOverlay visible={cartState.status === CartStatus.Updating} />
    </SafeAreaView>
  );
}
