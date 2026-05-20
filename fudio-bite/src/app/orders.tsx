import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import { db } from "@/db/client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 2 : 1;

  function load() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM orders ORDER BY date DESC",
        [],
        (_, { rows }) => {
          const items: any[] = [];
          for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
          setOrders(items);
        },
      );
    });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <ThemedText type="subtitle" style={styles.title}>
            Orders
          </ThemedText>
          <ThemedText style={styles.subtitle}>Recent sales history</ThemedText>
        </View>
      </View>
      <FlatList
        key={`orders-${columns}`}
        data={orders}
        keyExtractor={(i) => i.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { maxWidth: `${100 / columns}%` }]}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderNumber}>{item.orderNumber}</Text>
              <Text style={styles.dateText}>
                {new Date(item.date).toLocaleString()}
              </Text>
            </View>
            <Button
              title="View"
              onPress={() => router.push(`/orderDetail?id=${item.id}`)}
            />
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: AppTheme.background },
  content: { width: "100%", maxWidth: 1000, alignSelf: "center" },
  headerCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  title: { color: AppTheme.text },
  subtitle: { color: AppTheme.muted },
  listContent: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    paddingBottom: 20,
  },
  columnWrapper: { gap: 10 },
  row: {
    flex: 1,
    padding: 14,
    marginBottom: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  orderInfo: { flex: 1, minWidth: 170 },
  orderNumber: { color: AppTheme.text, fontWeight: "900" },
  dateText: { color: AppTheme.muted, marginTop: 2 },
  emptyState: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  emptyText: { color: AppTheme.muted, fontWeight: "800" },
});
