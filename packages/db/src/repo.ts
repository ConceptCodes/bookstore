import { and, desc, eq, gt, inArray, like, lte, not, or, sql } from "drizzle-orm";
import { db, sqlite } from "./client.ts";
import {
  books,
  cartItems,
  faq,
  orderItems,
  orders,
  supportTickets,
  users,
  type Book,
  type Faq,
  type Order,
  type OrderStatus,
  type SupportTicket,
  type TicketStatus,
} from "./schema.ts";
import {
  CUSTOMER_SHIPPING_ADDRESS,
  LOW_STOCK_THRESHOLD,
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "./constants.ts";

export interface CartLine {
  cartItemId: number;
  bookId: number;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  title: string;
  author: string;
  coverUrl: string | null;
  stock: number;
}

export interface Cart {
  lines: CartLine[];
  subtotalCents: number;
  itemCount: number;
}

export interface OrderDetailLine {
  bookId: number;
  title: string;
  author: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface OrderDetail {
  order: Order;
  items: OrderDetailLine[];
}

export interface AccountSummary {
  user: { id: string; name: string; email: string };
  lifetimeOrderCount: number;
  lifetimeSpentCents: number;
  openTickets: number;
  cartItemCount: number;
}

export interface OverviewMetrics {
  revenueCents: number;
  openOrders: number;
  lowStock: number;
  openTickets: number;
  totalBooks: number;
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

function getBookByIdOrNull(id: number): Book | undefined {
  return db.select().from(books).where(eq(books.id, id)).get();
}

function getStockForBook(id: number): number {
  const row = db
    .select({ stock: books.stock })
    .from(books)
    .where(eq(books.id, id))
    .get();
  return row?.stock ?? 0;
}

export function searchBooks(opts: {
  query?: string;
  genre?: string;
  limit?: number;
  offset?: number;
}): Book[] {
  const limit = Math.min(opts.limit ?? 12, 50);
  const offset = Math.max(opts.offset ?? 0, 0);
  const conds = [];
  if (opts.query && opts.query.trim().length > 0) {
    const q = `%${opts.query.trim()}%`;
    conds.push(
      or(
        like(books.title, q),
        like(books.author, q),
        like(books.description, q),
      )!,
    );
  }
  if (opts.genre && opts.genre !== "All") {
    conds.push(eq(books.genre, opts.genre));
  }
  return db
    .select()
    .from(books)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(books.rating), desc(books.createdAt))
    .limit(limit)
    .offset(offset)
    .all();
}

export function getBookById(id: number): Book | undefined {
  return getBookByIdOrNull(id);
}

export function getBooksByIds(ids: number[]): Book[] {
  if (ids.length === 0) return [];
  return db.select().from(books).where(inArray(books.id, ids)).all();
}

export function listGenres(): string[] {
  return db
    .select({ genre: books.genre })
    .from(books)
    .groupBy(books.genre)
    .orderBy(books.genre)
    .all()
    .map((r) => r.genre);
}

export function getFeaturedBooks(limit = 6): Book[] {
  return db
    .select()
    .from(books)
    .where(gt(books.rating, 4.4))
    .orderBy(desc(books.rating))
    .limit(limit)
    .all();
}

export function getRecommendations(userId: string, limit = 5): Book[] {
  const purchasedRows = db
    .select({ bookId: orderItems.bookId })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(eq(orders.userId, userId))
    .all();
  const purchasedIds = purchasedRows.map((r) => r.bookId);

  const genreSet = new Set<string>();
  if (purchasedIds.length > 0) {
    const purchasedBooks = db
      .select()
      .from(books)
      .where(inArray(books.id, purchasedIds))
      .all();
    for (const b of purchasedBooks) genreSet.add(b.genre);
  }

  const candidates = db
    .select()
    .from(books)
    .where(
      purchasedIds.length > 0 ? not(inArray(books.id, purchasedIds)) : undefined,
    )
    .all()
    .map((book) => ({
      book,
      score: (genreSet.has(book.genre) ? 3 : 0) + book.rating / 5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return candidates.map((c) => c.book);
}

export function getCart(userId: string): Cart {
  const rows = db
    .select({
      cartItemId: cartItems.id,
      bookId: cartItems.bookId,
      quantity: cartItems.quantity,
      unitPriceCents: books.priceCents,
      title: books.title,
      author: books.author,
      coverUrl: books.coverUrl,
      stock: books.stock,
    })
    .from(cartItems)
    .innerJoin(books, eq(cartItems.bookId, books.id))
    .where(eq(cartItems.userId, userId))
    .all();

  const lines: CartLine[] = rows.map((r) => ({
    ...r,
    lineTotalCents: r.unitPriceCents * r.quantity,
  }));

  return {
    lines,
    subtotalCents: lines.reduce((sum, l) => sum + l.lineTotalCents, 0),
    itemCount: lines.reduce((sum, l) => sum + l.quantity, 0),
  };
}

export function addToCart(
  userId: string,
  bookId: number,
  quantity = 1,
): Cart {
  const book = getBookByIdOrNull(bookId);
  if (!book) throw new Error(`Book ${bookId} not found`);
  if (book.stock < 1) throw new Error(`"${book.title}" is out of stock`);

  const existing = db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.bookId, bookId)))
    .get();

  const desiredQty = (existing?.quantity ?? 0) + Math.max(1, quantity);
  const newQty = Math.min(desiredQty, book.stock);

  if (existing) {
    db.update(cartItems)
      .set({ quantity: newQty })
      .where(eq(cartItems.id, existing.id))
      .run();
  } else {
    db.insert(cartItems).values({ userId, bookId, quantity: newQty }).run();
  }
  return getCart(userId);
}

export function updateCartItemQty(
  userId: string,
  bookId: number,
  quantity: number,
): Cart {
  if (quantity <= 0) return removeFromCart(userId, bookId);
  const stock = getStockForBook(bookId);
  const clamped = Math.min(quantity, Math.max(stock, 1));
  db.update(cartItems)
    .set({ quantity: clamped })
    .where(and(eq(cartItems.userId, userId), eq(cartItems.bookId, bookId)))
    .run();
  return getCart(userId);
}

export function removeFromCart(userId: string, bookId: number): Cart {
  db.delete(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.bookId, bookId)))
    .run();
  return getCart(userId);
}

export function clearCart(userId: string): Cart {
  db.delete(cartItems).where(eq(cartItems.userId, userId)).run();
  return getCart(userId);
}

export function getAccountSummary(userId: string): AccountSummary {
  const user = db.select().from(users).where(eq(users.id, userId)).get();
  if (!user) throw new Error(`User ${userId} not found`);

  const orderStats = db
    .select({
      count: sql<number>`count(*)`,
      spent: sql<number>`coalesce(sum(${orders.totalCents}), 0)`,
    })
    .from(orders)
    .where(
      and(
        eq(orders.userId, userId),
        inArray(orders.status, ["paid", "shipped"] as OrderStatus[]),
      ),
    )
    .get();

  const openTickets = db
    .select({ count: sql<number>`count(*)` })
    .from(supportTickets)
    .where(
      and(
        eq(supportTickets.userId, userId),
        eq(supportTickets.status, "open" as TicketStatus),
      ),
    )
    .get();

  const cart = getCart(userId);

  return {
    user,
    lifetimeOrderCount: orderStats?.count ?? 0,
    lifetimeSpentCents: orderStats?.spent ?? 0,
    openTickets: openTickets?.count ?? 0,
    cartItemCount: cart.itemCount,
  };
}

export function getOrderHistory(userId: string): Order[] {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.placedAt))
    .all();
}

export function getOrderDetail(
  orderId: number,
  userId?: string,
): OrderDetail | undefined {
  const order = db.select().from(orders).where(eq(orders.id, orderId)).get();
  if (!order) return undefined;
  if (userId && order.userId !== userId) return undefined;

  const rows = db
    .select({
      bookId: orderItems.bookId,
      title: books.title,
      author: books.author,
      quantity: orderItems.quantity,
      unitPriceCents: orderItems.unitPriceCents,
    })
    .from(orderItems)
    .innerJoin(books, eq(orderItems.bookId, books.id))
    .where(eq(orderItems.orderId, orderId))
    .all();

  const items: OrderDetailLine[] = rows.map((r) => ({
    ...r,
    lineTotalCents: r.unitPriceCents * r.quantity,
  }));

  return { order, items };
}

export function listShippingOptions(): ShippingOption[] {
  return [...SHIPPING_OPTIONS];
}

export function getShippingOption(
  id: string,
): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find((s) => s.id === id);
}

export function createOrder(
  userId: string,
  shippingOptionId: string,
): OrderDetail {
  const cart = getCart(userId);
  if (cart.lines.length === 0) throw new Error("Cart is empty");

  for (const line of cart.lines) {
    const stock = getStockForBook(line.bookId);
    if (stock < line.quantity) {
      const b = getBookByIdOrNull(line.bookId);
      throw new Error(
        `Insufficient stock for "${b?.title ?? line.bookId}" (have ${stock}, want ${line.quantity})`,
      );
    }
  }

  const shipping = getShippingOption(shippingOptionId);
  if (!shipping) throw new Error(`Unknown shipping option: ${shippingOptionId}`);

  const totalCents = cart.subtotalCents + shipping.costCents;
  let newOrderId = 0;

  sqlite.transaction(() => {
    const result = db
      .insert(orders)
      .values({
        userId,
        totalCents,
        status: "pending",
        shippingAddress: CUSTOMER_SHIPPING_ADDRESS,
        placedAt: new Date(),
      })
      .run();
    newOrderId = Number(result.lastInsertRowid);

    for (const line of cart.lines) {
      db.insert(orderItems)
        .values({
          orderId: newOrderId,
          bookId: line.bookId,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
        })
        .run();
      db.update(books)
        .set({ stock: sql`${books.stock} - ${line.quantity}` })
        .where(eq(books.id, line.bookId))
        .run();
    }

    db.delete(cartItems).where(eq(cartItems.userId, userId)).run();
  })();

  const detail = getOrderDetail(newOrderId, userId);
  if (!detail) throw new Error(`Order ${newOrderId} not created`);
  return detail;
}

export function searchFaq(opts: {
  query?: string;
  category?: string;
}): Faq[] {
  const conds = [];
  if (opts.query && opts.query.trim().length > 0) {
    const q = `%${opts.query.trim()}%`;
    conds.push(or(like(faq.question, q), like(faq.answer, q))!);
  }
  if (opts.category && opts.category !== "All") {
    conds.push(eq(faq.category, opts.category));
  }
  return db
    .select()
    .from(faq)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(faq.category, faq.id)
    .all();
}

export function listFaqCategories(): string[] {
  return db
    .select({ category: faq.category })
    .from(faq)
    .groupBy(faq.category)
    .orderBy(faq.category)
    .all()
    .map((r) => r.category);
}

export function createSupportTicket(
  userId: string,
  subject: string,
  body: string,
): SupportTicket {
  const result = db
    .insert(supportTickets)
    .values({ userId, subject, body, status: "open" })
    .run();
  const id = Number(result.lastInsertRowid);
  const ticket = db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, id))
    .get();
  if (!ticket) throw new Error(`Ticket ${id} not created`);
  return ticket;
}

export function getSupportTicket(
  ticketId: number,
  userId?: string,
): SupportTicket | undefined {
  const ticket = db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, ticketId))
    .get();
  if (!ticket) return undefined;
  if (userId && ticket.userId !== userId) return undefined;
  return ticket;
}

export function getUserTickets(userId: string): SupportTicket[] {
  return db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.userId, userId))
    .orderBy(desc(supportTickets.createdAt))
    .all();
}

export function getOverviewMetrics(): OverviewMetrics {
  const revenue = db
    .select({ total: sql<number>`coalesce(sum(${orders.totalCents}), 0)` })
    .from(orders)
    .where(inArray(orders.status, ["paid", "shipped"] as OrderStatus[]))
    .get();
  const openOrders = db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pending"))
    .get();
  const lowStock = db
    .select({ count: sql<number>`count(*)` })
    .from(books)
    .where(lte(books.stock, LOW_STOCK_THRESHOLD))
    .get();
  const openTickets = db
    .select({ count: sql<number>`count(*)` })
    .from(supportTickets)
    .where(eq(supportTickets.status, "open"))
    .get();
  const totalBooks = db
    .select({ count: sql<number>`count(*)` })
    .from(books)
    .get();

  return {
    revenueCents: revenue?.total ?? 0,
    openOrders: openOrders?.count ?? 0,
    lowStock: lowStock?.count ?? 0,
    openTickets: openTickets?.count ?? 0,
    totalBooks: totalBooks?.count ?? 0,
  };
}

export function listAllBooks(): Book[] {
  return db.select().from(books).orderBy(books.id).all();
}

export function listAllOrders(): Order[] {
  return db.select().from(orders).orderBy(desc(orders.placedAt)).all();
}

export function listAllTickets(): SupportTicket[] {
  return db
    .select()
    .from(supportTickets)
    .orderBy(desc(supportTickets.createdAt))
    .all();
}

export function listAllFaq() {
  return db.select().from(faq).orderBy(faq.category, faq.id).all();
}

export function createBook(input: Omit<Book, "createdAt">): Book {
  const { id, title, author, genre, priceCents, description, rating, stock, coverUrl, isbn } = input;
  db.insert(books)
    .values({ id, title, author, genre, priceCents, description, rating, stock, coverUrl, isbn })
    .run();
  return getBookByIdOrNull(id)!;
}

export function updateBook(id: number, patch: Partial<Omit<Book, "id" | "createdAt">>): Book | undefined {
  const existing = getBookByIdOrNull(id);
  if (!existing) return undefined;
  db.update(books).set(patch).where(eq(books.id, id)).run();
  return getBookByIdOrNull(id);
}

export function adjustStock(id: number, stock: number): Book | undefined {
  return updateBook(id, { stock: Math.max(0, Math.floor(stock)) });
}

export function deleteBook(id: number): boolean {
  const result = db.delete(books).where(eq(books.id, id)).run();
  return result.changes > 0;
}

export function updateOrderStatus(id: number, status: OrderStatus): Order | undefined {
  const existing = db.select().from(orders).where(eq(orders.id, id)).get();
  if (!existing) return undefined;
  db.update(orders).set({ status }).where(eq(orders.id, id)).run();
  return db.select().from(orders).where(eq(orders.id, id)).get();
}

export function respondToTicket(id: number): SupportTicket | undefined {
  return updateTicketStatus(id, "answered");
}

export function closeTicket(id: number): SupportTicket | undefined {
  return updateTicketStatus(id, "closed");
}

export function updateTicketStatus(
  id: number,
  status: TicketStatus,
): SupportTicket | undefined {
  const existing = db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, id))
    .get();
  if (!existing) return undefined;
  db.update(supportTickets)
    .set({ status })
    .where(eq(supportTickets.id, id))
    .run();
  return db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.id, id))
    .get();
}

export function createFaq(input: {
  id?: number;
  question: string;
  answer: string;
  category: string;
}) {
  const result = db.insert(faq).values(input).run();
  const id = input.id ?? Number(result.lastInsertRowid);
  return db.select().from(faq).where(eq(faq.id, id)).get();
}

export function updateFaq(
  id: number,
  patch: Partial<{ question: string; answer: string; category: string }>,
) {
  const existing = db.select().from(faq).where(eq(faq.id, id)).get();
  if (!existing) return undefined;
  db.update(faq).set(patch).where(eq(faq.id, id)).run();
  return db.select().from(faq).where(eq(faq.id, id)).get();
}

export function deleteFaq(id: number): boolean {
  const result = db.delete(faq).where(eq(faq.id, id)).run();
  return result.changes > 0;
}

export { daysAgo };
