import {
    Cart,
    CartDto,
    CartItemAndSelection,
    CartItemDto,
    CartOption,
    CartOptionDto,
    CartOptionValue,
    CartOptionValueDto,
    CartOptionValueImage,
    CartOptionValueImageDto,
    CartOptionValueWithName,
    CartOptionValueWithNameDto,
    CartProduct,
    CartProductDto,
    CartProductVariant,
    CartProductVariantDto,
    CartVariantOption,
    CartVariantOptionDto,
} from "@/src/types/cart/cart";
import { toProductOption } from "../products/product.map";

export const toCart = (dto: CartDto): Cart => ({
  id: dto.id,
  cartItemAndSelections: dto.cartItems.map(toCartItemAndSelection),
});

export const toCartItemAndSelection = (
  dto: CartItemDto,
): CartItemAndSelection => ({
  cartItem: {
    cartId: dto.cartId,
    quantity: dto.quantity,
    productVariantId: dto.productVariantId,
    productVariant: toProductVariant(dto.productVariant),
  },
  isChecked: false,
});

export const toProductVariant = (
  dto: CartProductVariantDto,
): CartProductVariant => ({
  quantity: dto.quantity,
  price: dto.price,
  product: toCartProduct(dto.product),
  variantOptions: dto.variantOptions.map(toCartVariantOption),
});

export const toCartProduct = (dto: CartProductDto): CartProduct => ({
  id: dto.id,
  name: dto.name,
  productOptions: dto.productOptions.map(toProductOption),
  optionValueImages: dto.optionValueImages.map(toCartOptionValueImage),
});

export const toCartOptionValueImage = (
  dto: CartOptionValueImageDto,
): CartOptionValueImage => ({
  url: dto.url,
  optionValueId: dto.optionValueId,
  optionValue: toCartOptionValue(dto.optionValue),
});

export const toCartOptionValue = (
  dto: CartOptionValueDto,
): CartOptionValue => ({
  option: toCartOption(dto.option),
});

export const toCartVariantOption = (
  dto: CartVariantOptionDto,
): CartVariantOption => ({
  optionValueId: dto.optionValueId,
  optionValue: toCartOptionValueWithName(dto.optionValue),
});

export const toCartOptionValueWithName = (
  dto: CartOptionValueWithNameDto,
): CartOptionValueWithName => ({
  name: dto.name,
  option: toCartOption(dto.option),
});

export const toCartOption = (dto: CartOptionDto): CartOption => ({
  id: dto.id,
});
