import { Tabs } from "expo-router";
import React from "react";

import { AppTheme } from "@/constants/theme";

export default function AppTabs() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerStyle: { backgroundColor: AppTheme.background },
        headerTintColor: AppTheme.text,
        headerTitleStyle: { fontWeight: "800" },
        tabBarActiveTintColor: AppTheme.primary,
        tabBarInactiveTintColor: AppTheme.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          backgroundColor: AppTheme.card,
          borderTopColor: AppTheme.border,
          height: 62,
          paddingTop: 6,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="pos" options={{ title: "POS" }} />
      <Tabs.Screen name="products" options={{ title: "Products" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen name="categories" options={{ href: null }} />
      <Tabs.Screen name="expenses" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="productEdit" options={{ href: null }} />
      <Tabs.Screen name="orderDetail" options={{ href: null }} />
    </Tabs>
  );
}
