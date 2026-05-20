import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import LoginScreen from "@/screens/LoginScreen";
import { useAuthStore } from "@/store/authStore";
import { seedDatabase } from "@/utils/seedLoader";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    // initialize DB and seed data once on app start
    (async () => {
      try {
        await seedDatabase();
      } catch (e) {
        // ignore for now; dev may inspect logs
        console.warn("Seed DB failed", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
      </ThemeProvider>
    );
  }

  // show login when no authenticated user
  if (!user) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <LoginScreen />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AppTabs />
    </ThemeProvider>
  );
}
