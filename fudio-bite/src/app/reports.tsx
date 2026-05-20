import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import { getSalesTotal } from "@/services/orderService";
import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ReportsScreen() {
  const [todaySales, setTodaySales] = useState<number | null>(null);
  const [weekSales, setWeekSales] = useState<number | null>(null);

  async function load() {
    const now = Date.now();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const start = startOfDay.getTime();
    const end = now;
    const ts = await getSalesTotal(start, end);
    setTodaySales(ts);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    const ws = await getSalesTotal(weekStart.getTime(), end);
    setWeekSales(ws);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <ThemedText type="subtitle" style={styles.title}>
            Reports
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sales performance overview
          </ThemedText>
        </View>
        <View style={styles.grid}>
          <View style={styles.row}>
            <Text style={styles.label}>Today&apos;s Sales</Text>
            <Text style={styles.value}>{todaySales ?? "—"} PKR</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Last 7 Days Sales</Text>
            <Text style={styles.value}>{weekSales ?? "—"} PKR</Text>
          </View>
        </View>
        <View style={styles.action}>
          <Button title="Refresh" onPress={load} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.background },
  content: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    padding: 14,
  },
  headerCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  title: { color: AppTheme.text },
  subtitle: { color: AppTheme.muted },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  row: {
    flexGrow: 1,
    flexBasis: 280,
    justifyContent: "space-between",
    gap: 12,
    padding: 18,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  label: { color: AppTheme.text, fontWeight: "800" },
  value: { color: AppTheme.accent, fontWeight: "900" },
  action: { marginTop: 12, alignSelf: "flex-start", minWidth: 130 },
});
