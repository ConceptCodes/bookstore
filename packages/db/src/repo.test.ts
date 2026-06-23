import assert from "node:assert/strict";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { after, beforeEach, describe, test } from "node:test";
import { fileURLToPath } from "node:url";

const testDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..", ".tmp");
const testDatabase = resolve(testDirectory, "repo.test.db");

mkdirSync(testDirectory, { recursive: true });
rmSync(testDatabase, { force: true });

process.env.NODE_ENV = "test";
process.env.BOOKSTORE_DB_PATH = testDatabase;

const { sqlite } = await import("./client.ts");
const { addToCart, createOrder, getBookById, getCart, updateCartItemQty } =
  await import("./repo.ts");

sqlite.exec(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  );

  CREATE TABLE books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    description TEXT NOT NULL,
    rating REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    cover_url TEXT,
    isbn TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_cents INTEGER NOT NULL,
    status TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    placed_at INTEGER NOT NULL
  );

  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL
  );
`);

beforeEach(() => {
  sqlite.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart_items;
    DELETE FROM books;
    DELETE FROM users;

    INSERT INTO users (id, name, email)
    VALUES ('user_test', 'Test Reader', 'reader@example.com');

    INSERT INTO books (
      id,
      title,
      author,
      genre,
      price_cents,
      description,
      rating,
      stock
    )
    VALUES (
      1,
      'Test Book',
      'Test Author',
      'Fiction',
      1500,
      'A fixture book.',
      4.5,
      3
    );
  `);
});

after(() => {
  sqlite.close();
  rmSync(testDirectory, { force: true, recursive: true });
});

describe("cart and checkout", () => {
  test("clamps cart quantity to available stock", () => {
    addToCart("user_test", 1, 10);

    assert.deepStrictEqual(
      {
        itemCount: getCart("user_test").itemCount,
        subtotalCents: getCart("user_test").subtotalCents,
      },
      {
        itemCount: 3,
        subtotalCents: 4500,
      },
    );

    updateCartItemQty("user_test", 1, 2);
    assert.equal(getCart("user_test").itemCount, 2);
  });

  test("creates an order atomically, decrements stock, and clears the cart", () => {
    addToCart("user_test", 1, 2);

    const order = createOrder("user_test", "standard");

    assert.equal(order.order.userId, "user_test");
    assert.equal(order.order.status, "pending");
    assert.equal(order.order.totalCents, 3499);
    assert.equal(order.items.length, 1);
    assert.deepStrictEqual(order.items[0], {
      bookId: 1,
      title: "Test Book",
      author: "Test Author",
      quantity: 2,
      unitPriceCents: 1500,
      lineTotalCents: 3000,
    });
    assert.equal(getBookById(1)?.stock, 1);
    assert.equal(getCart("user_test").lines.length, 0);
  });
});
