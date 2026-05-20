import * as SQLite from "expo-sqlite";
import type { SQLiteBindValue, SQLiteDatabase } from "expo-sqlite";

export type SQLResultSetRowList = {
  length: number;
  item: (index: number) => any;
  _array: Record<string, any>[];
};

export type SQLResultSet = {
  insertId?: number;
  rowsAffected: number;
  rows: SQLResultSetRowList;
};

export type SQLTransaction = {
  executeSql: (
    sql: string,
    params?: SQLiteBindValue[],
    success?: (tx: SQLTransaction, result: SQLResultSet) => void,
    error?: (tx: SQLTransaction, error: Error) => boolean | void,
  ) => void;
};

type TransactionErrorCallback = (error: Error) => void;
type TransactionSuccessCallback = () => void;

const nativeDb = SQLite.openDatabaseSync("fudiobite.db", {
  useNewConnection: true,
});

function createRows(items: Record<string, any>[]): SQLResultSetRowList {
  return {
    length: items.length,
    item: (index: number) => items[index],
    _array: items,
  };
}

function returnsRows(sql: string): boolean {
  return /^(select|pragma|with)\b/i.test(sql.trim());
}

function createTransaction(database: SQLiteDatabase): SQLTransaction {
  const tx: SQLTransaction = {
    executeSql(sql, params = [], success, error) {
      try {
        let result: SQLResultSet;

        if (returnsRows(sql)) {
          const rows = database.getAllSync<Record<string, any>>(sql, params);
          result = {
            rowsAffected: 0,
            rows: createRows(rows),
          };
        } else {
          const runResult = database.runSync(sql, params);
          result = {
            insertId: runResult.lastInsertRowId,
            rowsAffected: runResult.changes,
            rows: createRows([]),
          };
        }

        success?.(tx, result);
      } catch (err) {
        const normalizedError =
          err instanceof Error ? err : new Error(String(err));
        const handled = error?.(tx, normalizedError);
        if (handled !== true) {
          throw normalizedError;
        }
      }
    },
  };

  return tx;
}

// Compatibility wrapper for the app's existing WebSQL-style database calls.
export const db = {
  transaction(
    action: (tx: SQLTransaction) => void,
    error?: TransactionErrorCallback,
    success?: TransactionSuccessCallback,
  ): void {
    try {
      nativeDb.withTransactionSync(() => {
        action(createTransaction(nativeDb));
      });
      success?.();
    } catch (err) {
      const normalizedError =
        err instanceof Error ? err : new Error(String(err));
      error?.(normalizedError);
    }
  },
  native: nativeDb,
};

export default db;
