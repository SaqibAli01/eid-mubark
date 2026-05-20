import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import { saveOrder } from "@/services/orderService";
import { getProducts, ProductRow } from "@/services/productService";
import { useAuthStore } from "@/store/authStore";
import { formatReceipt, printReceipt } from "@/utils/print";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type CartItem = { product: ProductRow; qty: number };
type ReceiptPreview = {
  orderNumber: string;
  date: number;
  total: number;
  saved: boolean;
  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
  }[];
};

export default function POSScreen() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<ReceiptPreview | null>(
    null,
  );
  const [printing, setPrinting] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const isCompact = width < 420;
  const productColumns = isWide ? (width >= 1120 ? 3 : 2) : 2;
  const total = useMemo(
    () => cart.reduce((s, c) => s + (c.product.price || 0) * c.qty, 0),
    [cart],
  );

  async function load() {
    try {
      const rows = await getProducts();
      setProducts(rows.filter((r) => r.available));
    } catch {
      Alert.alert("Error", "Failed to load products");
    }
  }

  useEffect(() => {
    load();
  }, []);

  function addToCart(p: ProductRow) {
    setCart((prev) => {
      const found = prev.find((x) => x.product.id === p.id);
      if (found)
        return prev.map((x) =>
          x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x,
        );
      return [...prev, { product: p, qty: 1 }];
    });
  }

  function changeQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((x) =>
          x.product.id === id ? { ...x, qty: Math.max(0, x.qty + delta) } : x,
        )
        .filter((x) => x.qty > 0),
    );
  }

  function checkout() {
    if (!user) return Alert.alert("Not authenticated");
    if (cart.length === 0) return Alert.alert("Cart empty");

    setReceiptPreview({
      orderNumber: `ORD${Date.now()}`,
      date: Date.now(),
      total,
      saved: false,
      items: cart.map((c) => ({
          productId: c.product.id,
          name: c.product.name,
          qty: c.qty,
          price: c.product.price || 0,
      })),
    });
  }

  function closeReceiptPreview() {
    if (receiptPreview?.saved) {
      setCart([]);
      load();
    }
    setReceiptPreview(null);
  }

  async function handlePrintReceipt() {
    if (!user || !receiptPreview) return;

    setPrinting(true);
    try {
      if (!receiptPreview.saved) {
        await saveOrder({
          orderNumber: receiptPreview.orderNumber,
          date: receiptPreview.date,
          cashierId: user.id,
          total: receiptPreview.total,
          paymentMethod: "Cash",
          orderType: "Takeaway",
          items: receiptPreview.items,
        });
        setReceiptPreview((current) =>
          current ? { ...current, saved: true } : current,
        );
      }

      await printReceipt(
        formatReceipt({
          orderNumber: receiptPreview.orderNumber,
          date: receiptPreview.date,
          cashierName: user.name || user.username,
          total: receiptPreview.total,
          items: receiptPreview.items.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
        }),
      );

      Alert.alert("Printed", "Bill sent to printer.");
      setReceiptPreview(null);
      setCart([]);
      load();
    } catch (error) {
      Alert.alert("Print failed", String(error));
    } finally {
      setPrinting(false);
    }
  }

  return (
    <ThemedView
      style={[
        styles.container,
        isWide ? styles.containerWide : styles.containerCompact,
      ]}
    >
      <View style={[styles.productsPane, isWide && styles.productsPaneWide]}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.heading}>Products</Text>
            <Text style={styles.subheading}>{products.length} available</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{cart.length}</Text>
          </View>
        </View>
        <FlatList
          key={`products-${productColumns}`}
          data={products}
          keyExtractor={(i) => i.id}
          numColumns={productColumns}
          columnWrapperStyle={styles.productColumn}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.product,
                isCompact && styles.productCompact,
                { maxWidth: `${100 / productColumns}%` },
              ]}
              onPress={() => addToCart(item)}
              activeOpacity={0.82}
            >
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.productFooter}>
                <Text style={styles.productPrice}>{item.price} PKR</Text>
                <Text style={styles.addHint}>Add</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={[styles.cartPane, isWide && styles.cartPaneWide]}>
        <View style={styles.panelHeader}>
          <View>
            <Text style={styles.heading}>Cart</Text>
            <Text style={styles.subheading}>Cash checkout</Text>
          </View>
          <Text style={styles.cartCount}>{cart.length} items</Text>
        </View>
        <FlatList
          data={cart}
          keyExtractor={(i) => i.product.id}
          contentContainerStyle={styles.cartList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyCart}>
              <Text style={styles.emptyText}>Cart empty</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cartRow}>
              <View style={styles.cartInfo}>
                <Text style={styles.cartText} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.cartPrice}>
                  {(item.product.price || 0) * item.qty} PKR
                </Text>
              </View>
              <View style={styles.qtyControl}>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() => changeQty(item.product.id, -1)}
                >
                  <Text style={styles.qtyButtonText}>-</Text>
                </Pressable>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <Pressable
                  style={styles.qtyButton}
                  onPress={() => changeQty(item.product.id, 1)}
                >
                  <Text style={styles.qtyButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalText}>{total} PKR</Text>
          </View>
          <Pressable
            style={[
              styles.checkoutButton,
              cart.length === 0 && styles.checkoutButtonDisabled,
            ]}
            onPress={checkout}
            disabled={cart.length === 0}
          >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={receiptPreview !== null}
        transparent
        animationType="fade"
        onRequestClose={closeReceiptPreview}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.receiptModal}>
            <View style={styles.receiptHeader}>
              <View>
                <Text style={styles.receiptTitle}>Bill Preview</Text>
                <Text style={styles.receiptMeta}>
                  {receiptPreview?.orderNumber}
                </Text>
              </View>
              <Pressable
                style={styles.closeButton}
                onPress={closeReceiptPreview}
                disabled={printing}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.receiptSlip}>
              <Text style={styles.receiptBrand}>FUDIO BITE</Text>
              <Text style={styles.receiptCenter}>
                {receiptPreview
                  ? new Date(receiptPreview.date).toLocaleString()
                  : ""}
              </Text>
              <Text style={styles.receiptDivider}>--------------------------</Text>
              {receiptPreview?.items.map((item) => (
                <View key={item.productId} style={styles.receiptLine}>
                  <View style={styles.receiptItemInfo}>
                    <Text style={styles.receiptItemName}>{item.name}</Text>
                    <Text style={styles.receiptItemQty}>x{item.qty}</Text>
                  </View>
                  <Text style={styles.receiptItemPrice}>
                    {item.price * item.qty} PKR
                  </Text>
                </View>
              ))}
              <Text style={styles.receiptDivider}>--------------------------</Text>
              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total</Text>
                <Text style={styles.receiptTotalValue}>
                  {receiptPreview?.total ?? 0} PKR
                </Text>
              </View>
            </ScrollView>

            <View style={styles.receiptActions}>
              <Pressable
                style={[styles.secondaryButton, printing && styles.disabledAction]}
                onPress={closeReceiptPreview}
                disabled={printing}
              >
                <Text style={styles.secondaryButtonText}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.printButton, printing && styles.disabledAction]}
                onPress={handlePrintReceipt}
                disabled={printing}
              >
                <Text style={styles.printButtonText}>
                  {printing ? "Printing..." : "Print Bill"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
    gap: 12,
    padding: 12,
  },
  containerWide: {
    flexDirection: "row",
  },
  containerCompact: {
    flexDirection: "column",
  },
  productsPane: {
    flex: 1,
    minHeight: 0,
  },
  productsPaneWide: {
    flex: 2,
  },
  cartPane: {
    backgroundColor: AppTheme.card,
    borderRadius: 18,
    padding: 12,
    minHeight: 220,
    maxHeight: "48%",
  },
  cartPaneWide: {
    flex: 1,
    maxHeight: "100%",
  },
  panelHeader: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heading: {
    color: AppTheme.text,
    fontSize: 20,
    fontWeight: "900",
  },
  subheading: { color: AppTheme.muted, fontSize: 12, marginTop: 2 },
  countBadge: {
    minWidth: 38,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: AppTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { color: "#fff", fontWeight: "900" },
  cartCount: { color: AppTheme.muted, fontWeight: "800" },
  productsList: {
    paddingBottom: 8,
  },
  productColumn: {
    gap: 10,
  },
  product: {
    flex: 1,
    minHeight: 112,
    padding: 14,
    marginBottom: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 3,
    justifyContent: "space-between",
  },
  productCompact: {
    minHeight: 102,
    padding: 12,
  },
  productName: { color: AppTheme.text, fontWeight: "900", fontSize: 15 },
  productFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  productPrice: { color: AppTheme.accent, fontWeight: "800", marginTop: 4 },
  addHint: {
    color: AppTheme.primary,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  cartList: { paddingBottom: 8 },
  cartRow: {
    minHeight: 64,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  cartInfo: { flex: 1, minWidth: 0 },
  cartText: { color: AppTheme.text, fontWeight: "800" },
  cartPrice: { color: AppTheme.accent, fontWeight: "800", marginTop: 4 },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppTheme.cardSoft,
    borderRadius: 18,
    padding: 3,
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AppTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonText: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "900",
  },
  qtyText: {
    minWidth: 28,
    textAlign: "center",
    color: AppTheme.text,
    fontWeight: "900",
  },
  checkoutBar: {
    borderTopWidth: 1,
    borderTopColor: AppTheme.border,
    paddingTop: 12,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  totalLabel: { color: AppTheme.muted, fontSize: 12, fontWeight: "800" },
  totalText: { color: AppTheme.text, fontSize: 20, fontWeight: "900" },
  checkoutButton: {
    minHeight: 44,
    minWidth: 118,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: AppTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonDisabled: {
    backgroundColor: AppTheme.muted,
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
  emptyState: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  emptyCart: {
    minHeight: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: AppTheme.muted,
    fontWeight: "800",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  receiptModal: {
    width: "100%",
    maxWidth: 430,
    maxHeight: "92%",
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 16,
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  receiptTitle: {
    color: AppTheme.text,
    fontSize: 20,
    fontWeight: "900",
  },
  receiptMeta: { color: AppTheme.muted, marginTop: 2, fontWeight: "700" },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppTheme.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: { color: AppTheme.text, fontWeight: "900" },
  receiptSlip: {
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: AppTheme.border,
    borderRadius: 14,
    padding: 14,
    maxHeight: 420,
  },
  receiptBrand: {
    color: AppTheme.text,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
  },
  receiptCenter: {
    color: AppTheme.muted,
    textAlign: "center",
    marginTop: 4,
    fontSize: 12,
  },
  receiptDivider: {
    color: AppTheme.muted,
    textAlign: "center",
    marginVertical: 10,
    fontFamily: "monospace",
  },
  receiptLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 6,
  },
  receiptItemInfo: { flex: 1, minWidth: 0 },
  receiptItemName: { color: AppTheme.text, fontWeight: "800" },
  receiptItemQty: { color: AppTheme.muted, marginTop: 2 },
  receiptItemPrice: { color: AppTheme.text, fontWeight: "900" },
  receiptTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
  },
  receiptTotalLabel: {
    color: AppTheme.text,
    fontSize: 17,
    fontWeight: "900",
  },
  receiptTotalValue: {
    color: AppTheme.accent,
    fontSize: 17,
    fontWeight: "900",
  },
  receiptActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: { color: AppTheme.text, fontWeight: "900" },
  printButton: {
    flex: 1.4,
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: AppTheme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  printButtonText: { color: "#fff", fontWeight: "900" },
  disabledAction: { opacity: 0.65 },
});
