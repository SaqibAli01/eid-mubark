import { db } from "@/db/client";

export type ExpenseRow = {
  id: string;
  category: string;
  amount: number;
  note?: string;
  date: number;
};

export function addExpense(e: Partial<ExpenseRow>): Promise<void> {
  const id = e.id || `ex_${Date.now()}`;
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const params: any[] = [
          id,
          e.category || "misc",
          e.amount || 0,
          e.note ?? null,
          e.date || Date.now(),
        ];
        tx.executeSql(
          "INSERT INTO expenses (id, category, amount, note, date) VALUES (?, ?, ?, ?, ?)",
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

export function getExpenses(
  start?: number,
  end?: number,
): Promise<ExpenseRow[]> {
  const s = start || 0;
  const e = end || Date.now();
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM expenses WHERE date BETWEEN ? AND ? ORDER BY date DESC",
          [s, e],
          (_, { rows }) => {
            const items: ExpenseRow[] = [];
            for (let i = 0; i < rows.length; i++) items.push(rows.item(i));
            resolve(items);
          },
        );
      },
      (err) => reject(err),
    );
  });
}
