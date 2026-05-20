import type { SQLResultSet } from "./client";
import { db } from "./client";

export function execSql(
  sql: string,
  params: any[] = [],
): Promise<SQLResultSet[]> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          sql,
          params,
          (_, result) => {
            resolve([result]);
          },
          (_, error) => {
            reject(error);
            return false;
          },
        );
      },
      (err) => reject(err),
    );
  });
}

export function batchExecSql(
  statements: { sql: string; params?: any[] }[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        for (const s of statements) {
          tx.executeSql(s.sql, s.params || []);
        }
      },
      (err) => reject(err),
      () => resolve(),
    );
  });
}
