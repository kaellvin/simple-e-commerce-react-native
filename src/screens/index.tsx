import { Image } from "expo-image";
import { Link } from "expo-router";
import {
  FlatList,
  RefreshControl,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/app-text";
import CenteredMessage from "../components/centered-message";
import Divider from "../components/divider";
import LoadingIndicator from "../components/loading-indicator";
import SearchBar from "../components/search-bar";
import useProducts from "../hooks/useProducts";
import { Product } from "../types/product/product";

export default function Home() {
  const {
    refreshing,
    searchInput,
    isSearch,
    isSearchSubmitted,
    onEnterSearchMode,
    onExitSearchMode,
    isLoading,
    error,
    filteredProducts,
    products,
    onRefresh,
    onChangeSearchText,
    onClearSearchText,
    onSearchSubmit,
  } = useProducts();

  const { width } = useWindowDimensions();
  const numColumns = 2;
  const contentPadding = 8;
  const itemGutter = 8;

  const itemWidth =
    (width - contentPadding * 2 - itemGutter * (numColumns - 1)) / numColumns;

  if (isLoading) return <LoadingIndicator />;

  if (error) return <CenteredMessage message={error} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SearchBar
        isSearch={isSearch}
        searchInput={searchInput}
        onFocus={onEnterSearchMode}
        onChangeSearchText={onChangeSearchText}
        onClearSearchText={onClearSearchText}
        onSearchSubmit={onSearchSubmit}
        onExitSearchMode={onExitSearchMode}
      />
      {isSearch ? (
        <View style={{ flex: 1 }}>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              contentContainerStyle={{ marginTop: 8, paddingHorizontal: 12 }}
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
              ItemSeparatorComponent={Divider}
            />
          ) : isSearchSubmitted ? (
            <CenteredMessage message="No matching product found." />
          ) : (
            <CenteredMessage message="Search your product here" />
          )}
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={numColumns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            // paddingHorizontal: 8,
          }}
          // keyExtractor={(_, index) => index.toString()}
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

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
