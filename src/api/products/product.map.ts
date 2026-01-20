import { Product, ProductDto } from "@/src/types/product/product";

export const toProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  price: dto.defaultVariant.price,
  imageUrl: dto.productImages[0]?.url || "",
});
