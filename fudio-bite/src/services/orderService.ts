import { db } from "@/db/client";

export async function saveOrder(order: {
  id?: string;
  orderNumber: string;
  date: number;
  cashierId: string;
  total: number;
  discount?: number;
  tax?: number;
  paymentMethod: string;
  orderType: string;
  customerName?: string;
  customerPhone?: string;
  items: {
    productId: string;
    name: string;
    qty: number;
    price: number;
    discount?: number;
  }[];
}): Promise<void> {
  const id = order.id || `o_${Date.now()}`;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO orders (id, orderNumber, date, cashierId, total, discount, tax, paymentMethod, orderType, customerName, customerPhone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            order.orderNumber,
            order.date,
            order.cashierId,
            order.total,
            order.discount || 0,
            order.tax || 0,
            order.paymentMethod,
            order.orderType,
            order.customerName ?? null,
            order.customerPhone ?? null,
          ] as any[],
        );

        for (const it of order.items) {
          const oi = `oi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          tx.executeSql(
            "INSERT INTO order_items (id, orderId, productId, name, qty, price, discount) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [oi, id, it.productId, it.name, it.qty, it.price, it.discount || 0],
          );
          // reduce stock
          tx.executeSql(
            "UPDATE products SET stock = (stock - ?) WHERE id = ?",
            [it.qty, it.productId],
          );
          // add stock change history
          const sc = `sc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
          tx.executeSql(
            "INSERT INTO stock_changes (id, productId, delta, reason, date) VALUES (?, ?, ?, ?, ?)",
            [sc, it.productId, -it.qty, "sale", Date.now()],
          );
        }
      },
      (err) => reject(err),
      () => resolve(),
    );
  });
}

export function getSalesTotal(start: number, end: number): Promise<number> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT SUM(total) as s FROM orders WHERE date BETWEEN ? AND ?",
          [start, end],
          (_, { rows }) => {
            const v = rows.item(0).s as number | null;
            resolve(v || 0);
          },
        );
      },
      (err) => reject(err),
    );
  });
}
