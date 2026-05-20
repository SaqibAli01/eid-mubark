import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import {
  deleteProduct,
  getProducts,
  ProductRow,
} from "@/services/productService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function ProductsScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const columns = width >= 1000 ? 3 : width >= 620 ? 2 : 1;

  async function load() {
    setLoading(true);
    try {
      const rows = await getProducts();
      setProducts(rows);
    } catch {
      Alert.alert("Error", "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.headerText}>
            <ThemedText type="subtitle" style={styles.title}>
              Products
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Menu items and pricing
            </ThemedText>
          </View>
          <View style={styles.headerAction}>
            <Button
              title="Add Product"
              onPress={() => router.push("/productEdit")}
            />
          </View>
        </View>
      </View>
      <FlatList
        key={`products-${columns}`}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { maxWidth: `${100 / columns}%` }]}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price} PKR</Text>
            </View>
            <View style={styles.actionRow}>
              <Button
                title="Edit"
                onPress={() => router.push(`/productEdit?id=${item.id}`)}
              />
              <View style={{ width: 8 }} />
              <Button
                title="Delete"
                onPress={async () => {
                  await deleteProduct(item.id);
                  load();
                }}
              />
            </View>
          </View>
        )}
        refreshing={loading}
        onRefresh={load}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: AppTheme.background },
  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
  },
  headerCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    boxShadow: "0px 8px 18px rgba(0, 0, 0, 0.14)",
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  headerText: { flex: 1, minWidth: 180 },
  headerAction: { minWidth: 132 },
  title: { color: AppTheme.text },
  subtitle: { color: AppTheme.muted },
  listContent: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingBottom: 20,
  },
  columnWrapper: { gap: 10 },
  row: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    marginTop: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 3,
  },
  productInfo: { flex: 1, minWidth: 130 },
  productName: { color: AppTheme.text, fontWeight: "800", fontSize: 16 },
  productPrice: { color: AppTheme.accent, fontWeight: "700", marginTop: 2 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  emptyState: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  emptyText: { color: AppTheme.muted, fontWeight: "800" },
});
