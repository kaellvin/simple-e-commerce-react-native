export interface CartResponse<T = CartDto> {
  data: T;
}

export type GETCartResponse = CartResponse<CartDto | null>;

export interface CartDto {
  readonly id: string;
  readonly cartItems: CartItemDto[];
}

export interface CartItemDto {
  readonly quantity: number;
  readonly cartId: string;
  readonly productVariantId: string;
  readonly productVariant: CartProductVariantDto;
}

export interface CartProductVariantDto {
  readonly quantity: number;
  readonly price: string;
  readonly product: CartProductDto;
  readonly variantOptions: CartVariantOptionDto[];
}

export interface CartProductDto {
  readonly id: string;
  readonly name: string;
  readonly productOptions: ProductOptionDto[];
  readonly optionValueImages: CartOptionValueImageDto[];
}

export interface ProductOptionDto {
  readonly optionId: string;
  readonly position: number;
}

export interface CartOptionValueImageDto {
  readonly url: string;
  readonly optionValueId: string;
  readonly optionValue: CartOptionValueDto;
}

export interface CartOptionValueDto {
  readonly option: CartOptionDto;
}

export interface CartOptionDto {
  readonly id: string;
}

export interface CartVariantOptionDto {
  readonly optionValueId: string;
  readonly optionValue: CartOptionValueWithNameDto;
}

export interface CartOptionValueWithNameDto {
  readonly name: string;
  readonly option: CartOptionDto;
}

//-- UI Model
export interface Cart {
  readonly id: string;
  readonly cartItemAndSelections: CartItemAndSelection[];
}

export interface CartItemAndSelection {
  readonly cartItem: CartItem;
  readonly isChecked: boolean;
}

export interface CartItem {
  readonly cartId: string;
  readonly quantity: number;
  readonly productVariantId: string;
  readonly productVariant: CartProductVariant;
}

export interface CartProductVariant {
  readonly quantity: number;
  readonly price: string;
  readonly product: CartProduct;
  readonly variantOptions: CartVariantOption[];
}

export interface CartProduct {
  readonly id: string;
  readonly name: string;
  readonly productOptions: ProductOption[];
  readonly optionValueImages: CartOptionValueImage[];
}

export interface ProductOption {
  readonly optionId: string;
  readonly position: number;
}

export interface CartVariantOption {
  readonly optionValueId: string;
  readonly optionValue: CartOptionValueWithName;
}

export interface CartOptionValueWithName {
  readonly name: string;
  readonly option: CartOption;
}

export interface CartOptionValueImage {
  readonly url: string;
  readonly optionValueId: string;
  readonly optionValue: CartOptionValue;
}

export interface CartOptionValue {
  readonly option: CartOption;
}

export interface CartOption {
  readonly id: string;
}

//-- FOR POST/PATCH ACTION
export interface CartItemAdd {
  readonly quantity: number;
  readonly productVariantId: string;
}

export interface CartItemAddRequest {
  readonly quantity: number;
  readonly productVariantId: string;
}

export interface CartItemQuantityUpdate {
  readonly quantity: number;
  readonly cartId: string;
}

export interface CartItemQuantityUpdateRequest {
  readonly quantity: number;
  readonly cartId: string;
}

export interface CartItemUpdate {
  readonly newQuantity: number;
  readonly quantity: number;
  readonly productVariantId: string;
  readonly cartId: string;
}

export interface CartItemUpdateRequest {
  readonly quantity: number;
  readonly productVariantId: string;
  readonly cartId: string;
}

//-- DELETE ACTION
export interface RemoveItemAlertState {
  isOpen: boolean;
  productVariantId: string;
}

export interface DELETECartItemResponse extends CartResponse<CartDto | null> {
  message: string;
}

export interface MaxQuantityExceededAlertState {
  isOpen: boolean;
  stock: number;
}
