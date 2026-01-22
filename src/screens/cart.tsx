import { MaterialIcons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, Pressable, useWindowDimensions, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { SharedValue } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../components/app-button";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import LoadingIndicator from "../components/loading-indicator";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import { CartItemAndSelection } from "../types/cart/cart";

export default function Cart() {
  const { session } = useAuth();
  const { isLoading, cart, setCart } = useCart();

  const { width } = useWindowDimensions();

  const cartTotal =
    cart?.cartItemAndSelections
      .filter((item) => item.isChecked)
      .reduce(
        (sum, item) =>
          sum +
          Number(item.cartItem.productVariant.price) * item.cartItem.quantity,
        0,
      ) ?? 0;

  const onCheckboxChange = (isChecked: boolean, productVariantId: string) => {
    setCart((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        cartItemAndSelections: prev.cartItemAndSelections.map((item) => ({
          ...item,
          isChecked:
            item.cartItem.productVariantId === productVariantId
              ? isChecked
              : item.isChecked,
        })),
      };
    });
  };
  const onRemoveIconClicked = () => {};
  const onAddIconClicked = () => {};

  const onCheckoutButtonClicked = () => {
    //TODO:
  };

  const renderItem = ({ item }: { item: CartItemAndSelection }) => {
    const cartItem = item.cartItem;
    const isChecked = item.isChecked;

    // const quantity = cartItem.quantity;
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
                  onPress={onRemoveIconClicked}
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
                  <AppText variant="labelMedium">1</AppText>
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
                  onPress={onAddIconClicked}
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

  if (isLoading) return <LoadingIndicator />;

  return cart === null ? (
    <CenteredMessage message="Your cart is empty" />
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={cart.cartItemAndSelections}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <CenteredMessage message="Your cart is empty" />
          )}
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
    </SafeAreaView>
  );
}
