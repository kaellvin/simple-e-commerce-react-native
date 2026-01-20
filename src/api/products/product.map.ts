import {
  Option,
  OptionDto,
  OptionValue,
  OptionValueDto,
  OptionValueImage,
  OptionValueImageDto,
  Product,
  ProductDetail,
  ProductDetailDto,
  ProductDetailImage,
  ProductDetailImageDto,
  ProductDto,
  ProductOption,
  ProductOptionDto,
  ProductVariant,
  ProductVariantDto,
  VariantOption,
  VariantOptionDto,
} from "@/src/types/product/product";

export const toProduct = (dto: ProductDto): Product => ({
  id: dto.id,
  name: dto.name,
  price: dto.defaultVariant.price,
  imageUrl: dto.productImages[0]?.url || "",
});

//product detail

export const toProductDetail = (dto: ProductDetailDto): ProductDetail => {
  const primaryImages = dto.productImages.filter((item) => item.isPrimary);
  const nonPrimaryImages = dto.productImages.filter((item) => !item.isPrimary);
  const productImages = [...primaryImages, ...nonPrimaryImages].sort(
    (a, b) => a.position - b.position,
  );

  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    defaultVariantId: dto.defaultVariant.id,
    productVariants: dto.productVariants.map(toProductVariant),
    productImageUrls: productImages.map((item) => item.url),
    productOptions: dto.productOptions.map(toProductOption),
    optionValueImages: dto.optionValueImages.map(toOptionValueImage),
  };
};

const toProductVariant = (dto: ProductVariantDto): ProductVariant => ({
  id: dto.id,
  quantity: dto.quantity,
  price: dto.price,
  variantImages: dto.variantImages.map(toProductDetailImage),
  variantOptions: dto.variantOptions.map(toVariantOption),
});

const toProductDetailImage = (
  dto: ProductDetailImageDto,
): ProductDetailImage => ({
  url: dto.url,
  position: dto.position,
  isPrimary: dto.isPrimary,
});

const toVariantOption = (dto: VariantOptionDto): VariantOption => ({
  productVariantId: dto.productVariantId,
  optionValueId: dto.optionValueId,
  optionValue: toOptionValue(dto.optionValue),
});

const toOptionValue = (dto: OptionValueDto): OptionValue => ({
  id: dto.id,
  name: dto.name,
  position: dto.position,
  option: toOption(dto.option),
});

const toOption = (dto: OptionDto): Option => ({
  id: dto.id,
  name: dto.name,
  publicLabel: dto.publicLabel,
});

const toProductOption = (dto: ProductOptionDto): ProductOption => ({
  optionId: dto.optionId,
  position: dto.position,
});

const toOptionValueImage = (dto: OptionValueImageDto): OptionValueImage => ({
  productId: dto.productId,
  url: dto.url,
  optionValueId: dto.optionValueId,
});
