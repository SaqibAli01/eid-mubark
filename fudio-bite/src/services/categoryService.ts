import { db } from "@/db/client";

export type CategoryRow = { id: string; name: string; description?: string };

export function getCategories(): Promise<CategoryRow[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM categories ORDER BY name",
          [],
          (_, { rows }) => {
            const items: CategoryRow[] = [];
            for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
            resolve(items);
          },
        );
      },
      (err) => reject(err),
    );
  });
}

export function addCategory(c: Partial<CategoryRow>): Promise<void> {
  const id = c.id || `cat_${Date.now()}`;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const params: any[] = [id, c.name ?? "", c.description ?? null];
        tx.executeSql(
          "INSERT INTO categories (id, name, description) VALUES (?, ?, ?)",
          params,
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

export function updateCategory(c: CategoryRow): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const params: any[] = [c.name, c.description ?? null, c.id];
        tx.executeSql(
          "UPDATE categories SET name=?, description=? WHERE id=?",
          params,
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

export function deleteCategory(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM categories WHERE id = ?",
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
