import { APIResponse } from "../base";

export type ProductResponse = APIResponse<ProductDto[]>;

export interface ProductDto {
  readonly id: string;
  readonly name: string;
  readonly defaultVariant: {
    readonly price: string;
  };
  readonly productImages: PublicProductImageDto[];
}

export interface PublicProductImageDto {
  readonly url: string;
}

//-- UI Model
export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly imageUrl: string;
}

// product detail
export type ProductDetailResponse = APIResponse<ProductDetailDto | null>;

export interface ProductDetailDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly defaultVariant: {
    readonly id: string;
  };
  readonly productVariants: ProductVariantDto[];
  readonly productImages: ProductDetailImageDto[];
  readonly productOptions: ProductOptionDto[];
  readonly optionValueImages: OptionValueImageDto[];
}

export interface ProductVariantDto {
  readonly id: string;
  readonly quantity: number;
  readonly price: string;
  readonly variantImages: VariantImageDto[];
  readonly variantOptions: VariantOptionDto[];
}

export interface VariantImageDto {
  readonly url: string;
  readonly position: number;
  readonly isPrimary: boolean;
}

export interface VariantOptionDto {
  readonly productVariantId: string;
  readonly optionValueId: string;
  readonly optionValue: OptionValueDto;
}

export interface OptionValueDto {
  readonly id: string;
  readonly name: string;
  readonly position: number;
  readonly option: OptionDto;
}

export interface OptionDto {
  readonly id: string;
  readonly name: string;
  readonly publicLabel: string;
}

export interface ProductDetailImageDto {
  readonly url: string;
  readonly position: number;
  readonly isPrimary: boolean;
}

export interface ProductOptionDto {
  optionId: string;
  position: number;
}

export interface OptionValueImageDto {
  productId: string;
  url: string;
  optionValueId: string;
}

//-- UI Model
export interface ProductDetail {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly defaultVariantId: string;
  readonly productVariants: ProductVariant[];
  readonly productImageUrls: string[];
  readonly productOptions: ProductOption[];
  readonly optionValueImages: OptionValueImage[];
}

export interface ProductVariant {
  id: string;
  quantity: number;
  price: string;
  variantImages: ProductDetailImage[];
  variantOptions: VariantOption[];
}

export const EMPTY_PRODUCT_VARIANT: ProductVariant = {
  id: "",
  quantity: -1,
  price: "",
  variantImages: [],
  variantOptions: [],
};

export interface ProductDetailImage {
  url: string;
  position: number;
  isPrimary: boolean;
}

export interface VariantOption {
  productVariantId: string;
  optionValueId: string;
  optionValue: OptionValue;
}
export interface OptionValue {
  id: string;
  name: string;
  position: number;
  option: Option;
}

export interface Option {
  id: string;
  name: string;
  publicLabel: string;
}

export interface ProductOption {
  optionId: string;
  position: number;
}

export interface OptionValueImage {
  productId: string;
  url: string;
  optionValueId: string;
}
