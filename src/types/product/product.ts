import { APIResponse } from "../base";

export type ProductResponse = APIResponse<ProductDto[]>;

export interface ProductDto {
  readonly id: string;
  readonly name: string;
  readonly defaultVariant: {
    readonly price: string;
  };
  readonly productImages: ProductImage[];
}

export interface ProductImage {
  readonly url: string;
}

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly imageUrl: string;
}
