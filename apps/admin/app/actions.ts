"use server";

import { revalidatePath } from "next/cache";
import {
  type Book,
  type OrderStatus,
  type TicketStatus,
  adjustStock,
  closeTicket,
  createBook,
  createFaq,
  deleteBook,
  deleteFaq,
  respondToTicket,
  updateBook,
  updateFaq,
  updateOrderStatus,
} from "@bookstore/db";

function revalidate() {
  revalidatePath("/", "layout");
}

export type BookInput = {
  id: number;
  title: string;
  author: string;
  genre: string;
  priceCents: number;
  description: string;
  rating: number;
  stock: number;
  coverUrl?: string | null;
  isbn?: string | null;
};

export async function createBookAction(input: Omit<BookInput, "id">) {
  const existing = await import("@bookstore/db").then((m) => m.listAllBooks());
  const nextId = existing.reduce((max, b) => Math.max(max, b.id), 0) + 1;
  const book = createBook({
    ...input,
    id: nextId,
    coverUrl: input.coverUrl ?? null,
    isbn: input.isbn ?? null,
  });
  revalidate();
  return book;
}

export async function updateBookAction(id: number, patch: Partial<BookInput>) {
  const book = updateBook(id, patch);
  revalidate();
  return book;
}

export async function adjustStockAction(id: number, stock: number) {
  const book = adjustStock(id, stock);
  revalidate();
  return book;
}

export async function deleteBookAction(id: number) {
  const ok = deleteBook(id);
  revalidate();
  return ok;
}

export async function updateOrderStatusAction(
  orderId: number,
  status: OrderStatus,
) {
  const order = updateOrderStatus(orderId, status);
  revalidate();
  return order;
}

export async function respondToTicketAction(ticketId: number) {
  const ticket = respondToTicket(ticketId);
  revalidate();
  return ticket;
}

export async function closeTicketAction(ticketId: number) {
  const ticket = closeTicket(ticketId);
  revalidate();
  return ticket;
}

export async function updateTicketStatusAction(
  ticketId: number,
  status: TicketStatus,
) {
  const { updateTicketStatus } = await import("@bookstore/db");
  const ticket = updateTicketStatus(ticketId, status);
  revalidate();
  return ticket;
}

export async function createFaqAction(input: {
  question: string;
  answer: string;
  category: string;
}) {
  const faq = createFaq(input);
  revalidate();
  return faq;
}

export async function updateFaqAction(
  id: number,
  patch: { question?: string; answer?: string; category?: string },
) {
  const faq = updateFaq(id, patch);
  revalidate();
  return faq;
}

export async function deleteFaqAction(id: number) {
  const ok = deleteFaq(id);
  revalidate();
  return ok;
}
