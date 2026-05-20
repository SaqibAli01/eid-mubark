import { categories, products } from "../data/seed";
import type { SQLResultSetRowList, SQLTransaction } from "../db/client";
import { db } from "../db/client";
import { initializeDatabase } from "../db/schema";
import { hashPassword } from "./crypto";

function runTransaction(actions: (tx: SQLTransaction) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        actions(tx);
      },
      (err) => reject(err),
      () => resolve(),
    );
  });
}

export async function seedDatabase(): Promise<void> {
  await initializeDatabase();

  // Hash default passwords before inserting
  const adminPassHash = await hashPassword("admin123");
  const cashierPassHash = await hashPassword("cashier123");

  // Check if categories exist, if none insert seed
  await runTransaction((tx) => {
    tx.executeSql(
      "SELECT COUNT(*) as c FROM categories",
      [],
      (_, { rows }: { rows: SQLResultSetRowList }) => {
        const count = rows.item(0).c as number;
        if (count === 0) {
          for (const cat of categories) {
            tx.executeSql(
              "INSERT OR REPLACE INTO categories (id, name, description) VALUES (?, ?, ?)",
              [cat.id, cat.name, cat.description || null] as any[],
            );
          }

          for (const p of products) {
            tx.executeSql(
              `INSERT OR REPLACE INTO products (id, name, name_native, categoryId, price, costPrice, stock, available, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                p.id,
                p.name,
                p.name_native || null,
                p.categoryId,
                p.price,
                p.costPrice || null,
                p.stock || 0,
                p.available ? 1 : 0,
                p.image || null,
              ] as any[],
            );
          }

          // create default users
          // create default users with hashed passwords
          tx.executeSql(
            "INSERT OR IGNORE INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)",
            ["u_admin", "admin", adminPassHash, "admin", "Owner"],
          );

          tx.executeSql(
            "INSERT OR IGNORE INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)",
            ["u_cashier", "cashier", cashierPassHash, "cashier", "Cashier"],
          );
        }
      },
    );
  });
}
