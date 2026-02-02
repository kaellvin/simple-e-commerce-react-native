import { Image } from "expo-image";
import { Link } from "expo-router";
import { RefreshControl, useWindowDimensions, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import Divider from "../components/divider";
import LoadingIndicator from "../components/loading-indicator";
import SearchBar from "../components/search-bar";
import useProducts, { LoadStatus, SearchStatus } from "../hooks/use-products";
import { Product } from "../types/product/product";

export default function Home() {
  const {
    state: productsState,
    onEnterSearchMode,
    onExitSearchMode,
    onRefresh,
    onChangeSearchText,
    onClearSearchText,
    onSearchSubmit,
  } = useProducts();

  if (productsState.error)
    return <CenteredMessage message={productsState.error} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        isSearch={productsState.isSearchMode}
        searchInput={productsState.searchInput}
        onFocus={onEnterSearchMode}
        onChangeSearchText={onChangeSearchText}
        onClearSearchText={onClearSearchText}
        onSearchSubmit={onSearchSubmit}
        onExitSearchMode={onExitSearchMode}
      />

      {productsState.isSearchMode ? (
        <HomeSearchContent
          filteredProducts={productsState.filteredProducts}
          searchStatus={productsState.searchStatus}
          error={productsState.error}
        />
      ) : (
        <HomeProductList
          products={productsState.products}
          status={productsState.status}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
}

const HomeSearchContent = ({
  filteredProducts,
  searchStatus,
  error,
}: {
  filteredProducts: Product[];
  searchStatus: SearchStatus;
  error: string;
}) => {
  const content = () => {
    switch (searchStatus) {
      case "initial":
        return <CenteredMessage message="Search your product here" />;
      case "searching":
        return <LoadingIndicator />;
      case "success":
        return (
          <FlatList
            data={filteredProducts}
            contentContainerStyle={{
              flex: 1,
              marginTop: 8,
              paddingHorizontal: 12,
            }}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/product-detail/[id]",
                  params: { id: item.id },
                }}
                style={{ padding: 8 }}
                asChild
              >
                <AppText variant="titleMedium">{item.name}</AppText>
              </Link>
            )}
            ListEmptyComponent={
              <CenteredMessage message="No matching product found." />
            }
            ItemSeparatorComponent={Divider}
          />
        );
      case "failure":
        return <CenteredMessage message={error} />;
    }
  };

  return <View style={{ flex: 1 }}>{content()}</View>;
};

const HomeProductList = ({
  products,
  status,
  onRefresh,
}: {
  products: Product[];
  status: LoadStatus;
  onRefresh: () => void;
}) => {
  const { width } = useWindowDimensions();
  const numColumns = 2;
  const contentPadding = 8;
  const itemGutter = 8;

  const itemWidth =
    (width - contentPadding * 2 - itemGutter * (numColumns - 1)) / numColumns;

  if (status === "loading") return <LoadingIndicator />;

  return (
    <FlatList
      data={products}
      numColumns={numColumns}
      columnWrapperStyle={{
        justifyContent: "space-between",
        // paddingHorizontal: 8,
      }}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: contentPadding }}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/product-detail/[id]",
            params: { id: item.id },
          }}
        >
          <HomeItem
            product={item}
            itemWidth={itemWidth}
            itemGutter={itemGutter}
          />
        </Link>
      )}
      refreshControl={
        <RefreshControl
          refreshing={status === "refreshing"}
          onRefresh={onRefresh}
        />
      }
    />
  );
};

const HomeItem = ({
  product,
  itemWidth,
  itemGutter,
}: {
  product: Product;
  itemWidth: number;
  itemGutter: number;
}) => {
  return (
    <View
      style={{
        width: itemWidth,
        borderWidth: 1,
        borderRadius: 12,
        overflow: "hidden",
        aspectRatio: 1 / 1.5,
        marginBottom: itemGutter,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
      }}
    >
      <Image
        source={product.imageUrl}
        style={{ aspectRatio: 1 }}
        contentFit="contain"
      />
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <AppText
          style={{ paddingHorizontal: 8, paddingTop: 8 }}
          variant="titleSmall"
          numberOfLines={2}
        >
          {product.name}
        </AppText>
        <AppText style={{ padding: 8 }} variant="labelLarge">
          {`RM  ${Number(product.price).toFixed(2)}`}
        </AppText>
      </View>
    </View>
  );
};
