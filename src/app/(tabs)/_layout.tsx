import useCart from "@/src/hooks/use-cart";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

function TabLayout() {
  const { getCartItemCount } = useCart();

  const cartItemCount = getCartItemCount();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "green",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="shopping-cart" color={color} />
          ),
          tabBarBadge: cartItemCount <= 0 ? undefined : cartItemCount,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="account-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
