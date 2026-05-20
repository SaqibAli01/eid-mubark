import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import { db } from "@/db/client";
import { formatReceipt, printReceipt } from "@/utils/print";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function OrderDetail() {
  const params = useLocalSearchParams();
  const id = (params.id as string) || null;
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders WHERE id = ?",
        [id],
        (_, { rows }) => {
          setOrder(rows.item(0));
        },
      );
      tx.executeSql(
        "SELECT * FROM order_items WHERE orderId = ?",
        [id],
        (_, { rows }) => {
          const its: any[] = [];
          for (let i = 0; i < rows.length; i++) its.push(rows.item(i));
          setItems(its);
        },
      );
    });
  }, [id]);

  async function handlePrint() {
    if (!order) return;

    const text = formatReceipt({
      orderNumber: order.orderNumber,
      date: order.date,
      cashierName: order.cashierId,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: order.total,
    });

    try {
      await printReceipt(text);
      Alert.alert("Printed", "Receipt sent to Bluetooth printer.");
    } catch (error) {
      Alert.alert("Print failed", String(error));
    }
  }

  if (!order)
    return (
      <ThemedView style={styles.container}>
        <Text style={styles.bodyText}>Loading...</Text>
      </ThemedView>
    );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <ThemedText type="title" style={styles.title}>
          {order.orderNumber}
        </ThemedText>
        <Text style={styles.mutedText}>
          {new Date(order.date).toLocaleString()}
        </Text>
      </View>
      {items.map((i) => (
        <View key={i.id} style={styles.row}>
          <Text style={styles.bodyText}>
            {i.name} x{i.qty}
          </Text>
          <Text style={styles.priceText}>{i.price * i.qty} PKR</Text>
        </View>
      ))}
      <View style={styles.action}>
        <Button title="Reprint" onPress={handlePrint} />
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
    maxWidth: 720,
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
  mutedText: { color: AppTheme.muted, marginTop: 4 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  bodyText: { color: AppTheme.text, fontWeight: "700" },
  priceText: { color: AppTheme.accent, fontWeight: "900" },
  action: { marginTop: 12, alignSelf: "flex-start", minWidth: 120 },
});
