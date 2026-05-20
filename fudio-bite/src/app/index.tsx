import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";

const actions = [
  {
    title: "Open POS",
    subtitle: "Fast billing counter",
    cta: "Start Sale",
    icon: "POS",
    route: "/pos",
    tone: AppTheme.primary,
    soft: "#EEF0FF",
  },
  {
    title: "Products",
    subtitle: "Menu and stock setup",
    cta: "Manage",
    icon: "PRD",
    route: "/products",
    tone: AppTheme.accent,
    soft: "#FFF4D6",
  },
  {
    title: "Orders",
    subtitle: "Sales history",
    cta: "View Orders",
    icon: "ORD",
    route: "/orders",
    tone: AppTheme.primaryDark,
    soft: "#ECEEFF",
  },
  {
    title: "Reports",
    subtitle: "Daily performance",
    cta: "Open Report",
    icon: "RPT",
    route: "/reports",
    tone: AppTheme.danger,
    soft: "#FFECEF",
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 560;
  const isWide = width >= 860;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={[styles.hero, isWide && styles.heroWide]}>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>POS</ThemedText>
              </View>
              <View style={styles.heroText}>
                <ThemedText type="subtitle" style={styles.brand}>
                  Fudio Bite
                </ThemedText>
                <ThemedText style={styles.copy}>
                  Professional counter dashboard for orders, products, and
                  reports.
                </ThemedText>
              </View>
            </View>

            <View style={styles.grid}>
              {actions.map((action) => (
                <Pressable
                  key={action.route}
                  style={({ pressed }) => [
                    styles.card,
                    isCompact && styles.cardCompact,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => router.push(action.route)}
                >
                  <View style={styles.cardTop}>
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: action.soft },
                      ]}
                    >
                      <Text style={[styles.iconText, { color: action.tone }]}>
                        {action.icon}
                      </Text>
                    </View>
                    <Text style={styles.arrowText}>›</Text>
                  </View>

                  <View>
                    <ThemedText style={styles.cardTitle}>
                      {action.title}
                    </ThemedText>
                    <ThemedText style={styles.cardCopy}>
                      {action.subtitle}
                    </ThemedText>
                  </View>

                  <View
                    style={[
                      styles.ctaButton,
                      { backgroundColor: action.tone },
                    ]}
                  >
                    <Text style={styles.ctaText}>{action.cta}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  content: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    gap: 18,
  },
  hero: {
    backgroundColor: AppTheme.card,
    borderRadius: 26,
    padding: 22,
    alignItems: "center",
    gap: 14,
    boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.16)",
    elevation: 8,
  },
  heroWide: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  badge: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: AppTheme.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 20 },
  heroText: {
    flex: 1,
    maxWidth: 560,
  },
  brand: {
    color: AppTheme.text,
    textAlign: "center",
  },
  copy: {
    color: AppTheme.muted,
    textAlign: "center",
    marginTop: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flexGrow: 1,
    flexBasis: "47%",
    backgroundColor: AppTheme.card,
    borderRadius: 20,
    padding: 16,
    minHeight: 188,
    justifyContent: "space-between",
    boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.12)",
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  cardCompact: {
    flexBasis: "100%",
    minHeight: 168,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 16,
    fontWeight: "900",
  },
  arrowText: {
    color: AppTheme.muted,
    fontSize: 30,
    fontWeight: "300",
  },
  cardTitle: { color: AppTheme.text, fontWeight: "900", fontSize: 19 },
  cardCopy: { color: AppTheme.muted, fontSize: 13, marginTop: 4 },
  ctaButton: {
    minHeight: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  ctaText: {
    color: "#fff",
    fontWeight: "900",
  },
});
