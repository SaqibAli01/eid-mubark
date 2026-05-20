import { getCategories } from "@/services/categoryService";
import {
  addProduct,
  getProducts,
  ProductRow,
  updateProduct,
} from "@/services/productService";
import { AppTheme } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProductEdit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const editingId = (params.id as string) || null;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [available, setAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setCategories(await getCategories());
      if (editingId) {
        const all = await getProducts();
        const p = all.find((x) => x.id === editingId);
        if (p) {
          setName(p.name || "");
          setPrice(String(p.price || ""));
          setCostPrice(String(p.costPrice || ""));
          setStock(String(p.stock || 0));
          setAvailable(Boolean(p.available));
          setCategoryId(p.categoryId || null);
        }
      }
    })();
  }, [editingId]);

  async function save() {
    if (!name.trim()) return Alert.alert("Name required");
    const payload: Partial<ProductRow> = {
      name: name.trim(),
      price: Number(price || 0),
      costPrice: Number(costPrice || 0),
      stock: Number(stock || 0),
      available: available ? 1 : 0,
      categoryId: categoryId || undefined,
    };
    try {
      if (editingId) {
        await updateProduct({ ...(payload as ProductRow), id: editingId });
      } else {
        await addProduct(payload);
      }
      router.back();
    } catch {
      Alert.alert("Error", "Save failed");
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {editingId ? "Edit Product" : "Add Product"}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Cost Price"
          keyboardType="numeric"
          value={costPrice}
          onChangeText={setCostPrice}
        />
        <TextInput
          style={styles.input}
          placeholder="Stock"
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Available</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>

        <View style={styles.categoryBlock}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryList}>
          {categories.map((c) => (
              <View key={c.id} style={styles.categoryButton}>
                <Button
                  title={c.name}
                  onPress={() => setCategoryId(c.id)}
                  color={categoryId === c.id ? AppTheme.primary : undefined}
                />
              </View>
          ))}
          </View>
        </View>

        <View style={styles.saveButton}>
          <Button title="Save" onPress={save} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.background },
  scrollContent: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    padding: 14,
  },
  card: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 16,
  },
  input: {
    backgroundColor: "#F8F8FC",
    color: AppTheme.text,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.border,
    marginBottom: 8,
  },
  title: {
    color: AppTheme.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
  },
  label: { color: AppTheme.text, fontWeight: "800" },
  categoryBlock: { marginVertical: 8, gap: 4 },
  categoryList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryButton: { minWidth: 110 },
  saveButton: { alignSelf: "flex-start", minWidth: 120, marginTop: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
});
