/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1D2550",
    background: "#FFC247",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FFF4D6",
    textSecondary: "#6B6F8E",
  },
  dark: {
    text: "#1D2550",
    background: "#FFC247",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FFF4D6",
    textSecondary: "#6B6F8E",
    accent: "#6B6FD6",
    price: "#FF9F1C",
  },
} as const;

export const AppTheme = {
  background: "#FFC247",
  backgroundDeep: "#F9A826",
  card: "#FFFFFF",
  cardSoft: "#FFF4D6",
  text: "#1D2550",
  muted: "#6B6F8E",
  primary: "#6B6FD6",
  primaryDark: "#4A51B8",
  accent: "#FF9F1C",
  danger: "#E95062",
  border: "#ECE5D8",
  shadow: "#000000",
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
