import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import {
  addCategory,
  CategoryRow,
  deleteCategory,
  getCategories,
} from "@/services/categoryService";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 2 : 1;

  async function load() {
    setLoading(true);
    try {
      const rows = await getCategories();
      setCategories(rows);
    } catch {
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (!name.trim()) return Alert.alert("Enter name");
    try {
      await addCategory({ name: name.trim() });
      setName("");
      load();
    } catch {
      Alert.alert("Error", "Failed to add");
    }
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <ThemedText type="subtitle" style={styles.title}>
            Categories
          </ThemedText>
          <ThemedText style={styles.subtitle}>Organize your products</ThemedText>
        </View>

        <View style={styles.formRow}>
          <TextInput
            placeholder="New category"
            placeholderTextColor={AppTheme.muted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <View style={styles.formButton}>
            <Button title="Add" onPress={handleAdd} />
          </View>
        </View>
      </View>

      <FlatList
        key={`categories-${columns}`}
        data={categories}
        keyExtractor={(i) => i.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { maxWidth: `${100 / columns}%` }]}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Button
              title="Delete"
              onPress={async () => {
                await deleteCategory(item.id);
                load();
              }}
            />
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
  content: { width: "100%", maxWidth: 900, alignSelf: "center" },
  headerCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  title: { color: AppTheme.text },
  subtitle: { color: AppTheme.muted },
  formRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 12,
  },
  input: {
    flex: 1,
    minWidth: 220,
    backgroundColor: AppTheme.card,
    color: AppTheme.text,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.border,
  },
  formButton: { minWidth: 96 },
  listContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingBottom: 20,
  },
  columnWrapper: { gap: 10 },
  row: {
    flex: 1,
    padding: 12,
    marginBottom: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryName: { color: AppTheme.text, fontWeight: "800" },
  emptyState: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  emptyText: { color: AppTheme.muted, fontWeight: "800" },
});
