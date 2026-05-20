import { ThemedText } from "@/components/themed-text";
import { AppTheme } from "@/constants/theme";
import { db } from "@/db/client";
import {
  clearBluetoothPrinter,
  connectBluetoothPrinter,
  disconnectBluetoothPrinter,
  formatReceipt,
  printReceipt,
  saveBluetoothPrinter,
  scanBluetoothPrinters,
} from "@/utils/print";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type PrinterDevice = {
  device_name: string;
  inner_mac_address: string;
};

export default function SettingsScreen() {
  const [shopName, setShopName] = useState("Fudio Bite");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [printerName, setPrinterName] = useState("");
  const [printerAddress, setPrinterAddress] = useState("");
  const [printerStatus, setPrinterStatus] = useState("Not connected");
  const [availablePrinters, setAvailablePrinters] = useState<PrinterDevice[]>(
    [],
  );
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        ["shopName"],
        (_, { rows }) => {
          if (rows.length) setShopName(rows.item(0).value);
        },
      );
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        ["address"],
        (_, { rows }) => {
          if (rows.length) setAddress(rows.item(0).value);
        },
      );
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        ["phone"],
        (_, { rows }) => {
          if (rows.length) setPhone(rows.item(0).value);
        },
      );
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        ["printerName"],
        (_, { rows }) => {
          if (rows.length) setPrinterName(rows.item(0).value);
        },
      );
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        ["printerAddress"],
        (_, { rows }) => {
          if (rows.length) {
            const value = rows.item(0).value;
            setPrinterAddress(value);
            if (value) setPrinterStatus("Saved printer connected");
          }
        },
      );
    });
  }, []);

  function save() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
          ["shopName", shopName],
        );
        tx.executeSql(
          "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
          ["address", address],
        );
        tx.executeSql(
          "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
          ["phone", phone],
        );
      },
      (err) => Alert.alert("Error", String(err)),
      () => Alert.alert("Saved"),
    );
  }

  async function handleScanPrinters() {
    setIsScanning(true);
    try {
      const devices = await scanBluetoothPrinters();
      setAvailablePrinters(devices);
      if (devices.length === 0) {
        Alert.alert(
          "No printers found",
          "Please ensure your thermal printer is powered on and in Bluetooth range.",
        );
      }
    } catch (error) {
      Alert.alert("Scan failed", String(error));
    } finally {
      setIsScanning(false);
    }
  }

  async function handleConnectPrinter(printer: PrinterDevice) {
    try {
      await connectBluetoothPrinter(printer.inner_mac_address);
      await saveBluetoothPrinter(
        printer.device_name,
        printer.inner_mac_address,
      );
      setPrinterName(printer.device_name);
      setPrinterAddress(printer.inner_mac_address);
      setPrinterStatus("Connected");
      Alert.alert("Printer connected", printer.device_name);
    } catch (error) {
      Alert.alert("Connection failed", String(error));
    }
  }

  async function handleDisconnectPrinter() {
    try {
      await disconnectBluetoothPrinter();
      await clearBluetoothPrinter();
      setPrinterName("");
      setPrinterAddress("");
      setPrinterStatus("Disconnected");
      Alert.alert("Printer disconnected");
    } catch (error) {
      Alert.alert("Disconnect failed", String(error));
    }
  }

  async function handleTestPrint() {
    try {
      const text = formatReceipt({
        orderNumber: "TEST-000",
        date: Date.now(),
        cashierName: "Test User",
        items: [{ name: "Sample Item", qty: 1, price: 100 }],
        total: 100,
      });
      await printReceipt(text);
      Alert.alert(
        "Test print sent",
        "The test receipt has been sent to your printer.",
      );
    } catch (error) {
      Alert.alert("Test print failed", String(error));
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <ThemedText type="subtitle" style={styles.title}>
          Settings
        </ThemedText>
        <ThemedText style={styles.subtitle}>Shop and printer setup</ThemedText>
      </View>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={shopName}
          onChangeText={setShopName}
          placeholder="Shop name"
          placeholderTextColor={AppTheme.muted}
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          placeholderTextColor={AppTheme.muted}
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          placeholderTextColor={AppTheme.muted}
        />
        <View style={styles.buttonWrap}>
          <Button title="Save" onPress={save} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Bluetooth Printer</ThemedText>
        <Text style={styles.status}>Status: {printerStatus}</Text>
        {printerName ? (
          <Text style={styles.printerInfo}>{printerName}</Text>
        ) : (
          <Text style={styles.printerInfo}>No printer selected</Text>
        )}
        <Button
          title={isScanning ? "Scanning..." : "Scan BLE Printers"}
          onPress={handleScanPrinters}
          disabled={isScanning}
        />

        {availablePrinters.map((printer) => (
          <View key={printer.inner_mac_address} style={styles.printerRow}>
            <Text style={styles.printerText}>{printer.device_name}</Text>
            <Button
              title="Connect"
              onPress={() => handleConnectPrinter(printer)}
            />
          </View>
        ))}

        {printerAddress ? (
          <View style={styles.actionRow}>
            <Button
              title="Disconnect Printer"
              onPress={handleDisconnectPrinter}
            />
            <Button title="Print Test Receipt" onPress={handleTestPrint} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppTheme.background },
  content: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    padding: 14,
  },
  headerCard: {
    backgroundColor: AppTheme.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  card: {
    backgroundColor: AppTheme.card,
    borderRadius: 18,
    padding: 14,
  },
  buttonWrap: { alignSelf: "flex-start", minWidth: 110 },
  title: { color: AppTheme.text },
  subtitle: { color: AppTheme.muted },
  input: {
    backgroundColor: "#F8F8FC",
    color: AppTheme.text,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: AppTheme.border,
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
    padding: 14,
    backgroundColor: AppTheme.card,
    borderRadius: 18,
  },
  status: {
    color: AppTheme.muted,
    marginTop: 8,
    marginBottom: 4,
  },
  printerInfo: {
    color: AppTheme.text,
    marginBottom: 12,
  },
  printerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  printerText: {
    color: AppTheme.text,
    flex: 1,
    marginRight: 8,
  },
  actionRow: {
    marginTop: 16,
    gap: 8,
    maxWidth: 360,
  },
});
