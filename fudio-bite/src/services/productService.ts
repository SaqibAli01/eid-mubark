import { db } from "@/db/client";

export type ProductRow = {
  id: string;
  name: string;
  name_native?: string;
  categoryId?: string;
  price?: number;
  costPrice?: number;
  stock?: number;
  available?: number;
  image?: string | null;
};

export function getProducts(): Promise<ProductRow[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM products ORDER BY name",
          [],
          (_, { rows }) => {
            const items: ProductRow[] = [];
            for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
            resolve(items);
          },
        );
      },
      (err) => reject(err),
    );
  });
}

export function addProduct(p: Partial<ProductRow>): Promise<void> {
  const id = p.id || `p_${Date.now()}`;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO products (id, name, name_native, categoryId, price, costPrice, stock, available, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            id,
            p.name ?? "",
            p.name_native ?? null,
            p.categoryId ?? null,
            p.price || 0,
            p.costPrice ?? null,
            p.stock || 0,
            p.available ? 1 : 0,
            p.image ?? null,
          ] as any[],
          () => resolve(),
          (_, err) => {
            reject(err);
            return false;
          },
        );
      },
      (err) => reject(err),
    );
  });
}

export function updateProduct(p: ProductRow): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE products SET name=?, name_native=?, categoryId=?, price=?, costPrice=?, stock=?, available=?, image=? WHERE id=?",
          [
            p.name,
            p.name_native ?? null,
            p.categoryId ?? null,
            p.price || 0,
            p.costPrice ?? null,
            p.stock || 0,
            p.available || 0,
            p.image ?? null,
            p.id,
          ] as any[],
          () => resolve(),
          (_, err) => {
            reject(err);
            return false;
          },
        );
      },
      (err) => reject(err),
    );
  });
}

export function deleteProduct(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM products WHERE id = ?",
          [id],
          () => resolve(),
          (_, err) => {
            reject(err);
            return false;
          },
        );
      },
      (err) => reject(err),
    );
  });
}
