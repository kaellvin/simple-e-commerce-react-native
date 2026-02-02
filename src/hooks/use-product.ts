import { useCallback, useState } from "react";
import { getProduct } from "../api/product/product.api";
import {
  EMPTY_PRODUCT_VARIANT,
  ProductDetail,
  ProductVariant,
  PVOption,
} from "../types/product/product";

function useProduct() {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeVariant, setActiveVariant] = useState<ProductVariant>(
    EMPTY_PRODUCT_VARIANT,
  );
  const [pvOptionList, setPVOptionList] = useState<PVOption[]>([]);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);

  const getProductDetail = useCallback(async (id: string) => {
    try {
      setIsLoading(true);

      const product = await getProduct(id);
      if (product !== null) {
        const defaultVariant = product.productVariants.find(
          (item) => item.id === product.defaultVariantId,
        )!;
        const pvOptionList = initPvOptionList(product, defaultVariant);
        const optionValueImage = getMatchedOptionValueImage(
          product,
          defaultVariant,
        );
        setActiveVariant(defaultVariant);
        setPVOptionList(pvOptionList);
        setMainImageUrl(optionValueImage.url);
      }

      setProduct(product);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  //-- init section
  const initPvOptionList = (
    product: ProductDetail,
    defaultVariant: ProductVariant,
  ) => {
    let pvOptionInitList: PVOption[] = [];

    product.productVariants.forEach((pv) => {
      pv.variantOptions.forEach((item) => {
        const { id, name, position, option } = item.optionValue;

        const matchedIdx = pvOptionInitList.findIndex(
          (item) => item.name === option.name,
        );
        if (matchedIdx === -1) {
          pvOptionInitList.push({
            id: option.id,
            name: option.name,
            publicLabel: option.publicLabel,
            values: [
              {
                imageUrl: "",
                optionValue: {
                  id,
                  name,
                  position,
                },
                isSelected: false,
                isWithinSelection: false,
              },
            ],
          });
        } else {
          const selectablePVOptionValues = pvOptionInitList[matchedIdx].values;

          const matchedSelectablePVOptionValueIdx =
            selectablePVOptionValues.findIndex(
              (item) => item.optionValue.name === name,
            );

          if (matchedSelectablePVOptionValueIdx === -1) {
            selectablePVOptionValues.push({
              imageUrl: "",
              optionValue: {
                id,
                name,
                position,
              },
              isSelected: false,
              isWithinSelection: false,
            });
          }

          pvOptionInitList[matchedIdx].values = selectablePVOptionValues;
        }
      });
    });

    //sort option based on configured order
    const poMap = new Map<string, number>();
    for (const item of product.productOptions) {
      poMap.set(item.optionId, item.position);
    }

    const sortedList: PVOption[] = new Array(pvOptionInitList.length);
    for (const item of pvOptionInitList) {
      const position = poMap.get(item.id)!;

      sortedList[position] = {
        ...item,
        values: [
          ...item.values.sort(
            (a, b) => a.optionValue.position - b.optionValue.position,
          ),
        ],
      };
    }

    pvOptionInitList = sortedList;

    //highlight default option & load option image
    for (const vo of defaultVariant.variantOptions) {
      pvOptionInitList = pvOptionInitList.map((op, opIdx) => ({
        ...op,
        values: op.values.map((item, idx) => {
          let imageUrl = "";

          if (opIdx === 0) {
            const matchedOpValImg = product.optionValueImages.find(
              (item) =>
                item.optionValueId === op.values[idx].optionValue.id &&
                item.productId === product.id,
            )!;
            imageUrl = matchedOpValImg.url;
          }

          return {
            ...item,
            imageUrl: imageUrl,
            isSelected:
              item.optionValue.id === vo.optionValueId ? true : item.isSelected,
          };
        }),
      }));
    }

    //using default variant option highlighted in first row to determine the selectability of options underneath
    const topSelectablePVOptionValue = pvOptionInitList[0].values.find(
      (item) => item.isSelected,
    )!;

    const productVariantIds = product.productVariants
      .flatMap((item) => item.variantOptions)
      .filter(
        (item) =>
          topSelectablePVOptionValue.optionValue.id === item.optionValueId,
      )
      .map((item) => item.productVariantId);

    const optionValueIds = product.productVariants
      .flatMap((item) => item.variantOptions)
      .filter((item) => productVariantIds.includes(item.productVariantId))
      .map((item) => item.optionValueId);

    pvOptionInitList = pvOptionInitList.map((op, idx) => ({
      ...op,
      values: op.values.map((item) => ({
        ...item,
        isWithinSelection:
          optionValueIds.includes(item.optionValue.id) || idx === 0,
      })),
    }));

    return pvOptionInitList;
  };

  const getMatchedOptionValueImage = (
    product: ProductDetail,
    pv: ProductVariant,
  ) => {
    const cachedProductOptions = product.productOptions.sort(
      (a, b) => a.position - b.position,
    );
    const optionValueIdList = pv.variantOptions
      .filter(
        (item) =>
          item.optionValue.option.id === cachedProductOptions[0].optionId,
      )
      .map((item) => item.optionValueId);

    return product.optionValueImages.find((item) =>
      optionValueIdList.includes(item.optionValueId),
    )!;
  };
  //--
  const getCurrentPrice = () => Number(activeVariant.price) * quantity;

  return {
    isLoading,
    error,
    product,
    getProductDetail,
    mainImageUrl,
    activeVariant,
    getCurrentPrice,
    pvOptionList,
    setActiveVariant,
    setPVOptionList,
    quantity,
    setQuantity,
  };
}

export default useProduct;
