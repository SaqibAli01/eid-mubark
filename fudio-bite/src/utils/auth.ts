import { db } from "../db/client";
import { hashPassword, verifyPassword } from "./crypto";

export type User = {
  id: string;
  username: string;
  role: string;
  name?: string;
};

export async function login(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        [username],
        async (_, { rows }) => {
          if (rows.length === 0) {
            reject(new Error("User not found"));
            return;
          }

          const item = rows.item(0);
          const storedHash = item.password as string;
          const ok = await verifyPassword(password, storedHash);
          if (!ok) {
            reject(new Error("Invalid credentials"));
            return;
          }

          resolve({
            id: item.id,
            username: item.username,
            role: item.role,
            name: item.name,
          });
        },
      );
    });
  });
}

export async function signup(
  username: string,
  password: string,
  role = "cashier",
  name?: string,
): Promise<User> {
  const id = `u_${Date.now()}`;
  const hash = await hashPassword(password);

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const params: any[] = [id, username, hash, role, name ?? null];
      tx.executeSql(
        "INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)",
        params,
        () => {
          resolve({ id, username, role, name });
        },
        (_, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
}
