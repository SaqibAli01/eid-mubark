import { batchExecSql } from "./helpers";

export async function initializeDatabase(): Promise<void> {
  const stmts = [
    // users table
    {
      sql: `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        name TEXT
      );`,
    },

    // categories
    {
      sql: `CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT
      );`,
    },

    // products
    {
      sql: `CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT,
        name_native TEXT,
        categoryId TEXT,
        price REAL,
        costPrice REAL,
        stock INTEGER,
        available INTEGER,
        image TEXT
      );`,
    },

    // orders
    {
      sql: `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        orderNumber TEXT,
        date INTEGER,
        cashierId TEXT,
        total REAL,
        discount REAL,
        tax REAL,
        paymentMethod TEXT,
        orderType TEXT,
        customerName TEXT,
        customerPhone TEXT
      );`,
    },

    // order_items
    {
      sql: `CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT,
        productId TEXT,
        name TEXT,
        qty INTEGER,
        price REAL,
        discount REAL
      );`,
    },

    // expenses
    {
      sql: `CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        category TEXT,
        amount REAL,
        note TEXT,
        date INTEGER
      );`,
    },

    // payments
    {
      sql: `CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        orderId TEXT,
        method TEXT,
        amount REAL
      );`,
    },
    // stock changes (history)
    {
      sql: `CREATE TABLE IF NOT EXISTS stock_changes (
        id TEXT PRIMARY KEY,
        productId TEXT,
        delta INTEGER,
        reason TEXT,
        date INTEGER
      );`,
    },

    // settings
    {
      sql: `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );`,
    },
  ];

  await batchExecSql(stmts);
}
