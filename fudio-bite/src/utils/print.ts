import { db } from "@/db/client";
import { BLEPrinter } from "react-native-thermal-receipt-printer";

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export interface ReceiptOrder {
  orderNumber: string;
  date: number;
  cashierName?: string;
  items: ReceiptItem[];
  discount?: number;
  total: number;
  cashReceived?: number;
  change?: number;
}

const querySetting = (key: string): Promise<string | null> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT value FROM settings WHERE key = ?",
        [key],
        (_, { rows }) => {
          resolve(rows.length ? rows.item(0).value : null);
        },
        (_, error) => {
          reject(error);
          return false;
        },
      );
    }, reject);
  });

const saveSetting = (key: string, value: string): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
          [key, value],
        );
      },
      reject,
      resolve,
    );
  });

export async function initBluetoothPrinter() {
  await BLEPrinter.init();
}

export async function scanBluetoothPrinters(): Promise<
  { device_name: string; inner_mac_address: string }[]
> {
  await initBluetoothPrinter();
  return BLEPrinter.getDeviceList();
}

export async function connectBluetoothPrinter(innerMacAddress: string) {
  await initBluetoothPrinter();
  return BLEPrinter.connectPrinter(innerMacAddress);
}

export async function disconnectBluetoothPrinter() {
  await BLEPrinter.closeConn();
}

export async function saveBluetoothPrinter(name: string, address: string) {
  await saveSetting("printerName", name);
  await saveSetting("printerAddress", address);
}

export async function clearBluetoothPrinter() {
  await saveSetting("printerName", "");
  await saveSetting("printerAddress", "");
}

export function formatReceipt(order: ReceiptOrder) {
  const lines: string[] = [];
  lines.push("<CB>FUDIO BITE</CB>");
  lines.push("<C>--------------------------</C>");
  lines.push(`<C>ORDER ${order.orderNumber}</C>`);
  lines.push(`<C>${new Date(order.date).toLocaleString()}</C>`);
  if (order.cashierName) lines.push(`<C>${order.cashierName}</C>`);
  lines.push("<C>--------------------------</C>");
  for (const item of order.items) {
    lines.push(`${item.name} x${item.qty}  ${item.price * item.qty} PKR`);
  }
  lines.push("<C>--------------------------</C>");
  if (order.discount) lines.push(`<C>Discount: ${order.discount} PKR</C>`);
  lines.push(`<CB>Total: ${order.total} PKR</CB>`);
  if (order.cashReceived) lines.push(`<C>Cash: ${order.cashReceived} PKR</C>`);
  if (order.change) lines.push(`<C>Change: ${order.change} PKR</C>`);
  lines.push("<C>Thank you for your order!</C>");
  lines.push("\n\n");
  return lines.join("\n");
}

export async function printReceipt(text: string, printerAddress?: string) {
  const address = printerAddress ?? (await querySetting("printerAddress"));

  if (!address) {
    throw new Error(
      "No Bluetooth printer configured. Please connect a printer in Settings.",
    );
  }

  await initBluetoothPrinter();
  await BLEPrinter.connectPrinter(address);
  BLEPrinter.printBill(text);
  return true;
}
