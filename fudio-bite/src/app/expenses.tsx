import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppTheme } from "@/constants/theme";
import { addExpense, getExpenses } from "@/services/expenseService";
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

export default function ExpensesScreen() {
  const [category, setCategory] = useState("misc");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 2 : 1;

  async function load() {
    try {
      const rows = await getExpenses();
      setItems(rows);
    } catch {
      Alert.alert("Error", "Failed to load");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!amount) return Alert.alert("Enter amount");
    await addExpense({ category, amount: Number(amount), note });
    setAmount("");
    setNote("");
    load();
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerCard}>
          <ThemedText type="subtitle" style={styles.title}>
            Expenses
          </ThemedText>
          <ThemedText style={styles.subtitle}>Track daily costs</ThemedText>
        </View>
        <View style={styles.formCard}>
          <TextInput
            placeholder="Category"
            placeholderTextColor={AppTheme.muted}
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Amount"
            placeholderTextColor={AppTheme.muted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <TextInput
            placeholder="Note"
            placeholderTextColor={AppTheme.muted}
            value={note}
            onChangeText={setNote}
            style={styles.input}
          />
          <Button title="Add Expense" onPress={save} />
        </View>
      </View>

      <FlatList
        key={`expenses-${columns}`}
        data={items}
        keyExtractor={(i) => i.id}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.row, { maxWidth: `${100 / columns}%` }]}>
            <Text style={styles.amountText}>
              {item.category} - {item.amount} PKR
            </Text>
            <Text style={styles.dateText}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
        )}
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
  formCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  input: {
    backgroundColor: AppTheme.card,
    color: AppTheme.text,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.border,
    marginBottom: 8,
  },
  listContent: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    paddingBottom: 20,
  },
  columnWrapper: { gap: 10 },
  row: {
    flex: 1,
    padding: 14,
    marginTop: 10,
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  amountText: { color: AppTheme.text, fontWeight: "800" },
  dateText: { color: AppTheme.muted, marginTop: 2 },
  emptyState: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.card,
    borderRadius: 16,
  },
  emptyText: { color: AppTheme.muted, fontWeight: "800" },
});
