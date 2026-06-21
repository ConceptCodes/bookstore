"use server";

import { revalidatePath } from "next/cache";
import {
  CUSTOMER_USER_ID,
  addToCart,
  clearCart,
  createSupportTicket,
  removeFromCart,
  updateCartItemQty,
} from "@bookstore/db";

function revalidate() {
  revalidatePath("/", "layout");
}

export async function addBookToCartAction(bookId: number, quantity = 1) {
  addToCart(CUSTOMER_USER_ID, bookId, quantity);
  revalidate();
}

export async function updateCartItemQtyAction(bookId: number, quantity: number) {
  updateCartItemQty(CUSTOMER_USER_ID, bookId, quantity);
  revalidate();
}

export async function removeFromCartAction(bookId: number) {
  removeFromCart(CUSTOMER_USER_ID, bookId);
  revalidate();
}

export async function clearCartAction() {
  clearCart(CUSTOMER_USER_ID);
  revalidate();
}

export async function createSupportTicketAction(
  subject: string,
  body: string,
) {
  const ticket = createSupportTicket(CUSTOMER_USER_ID, subject, body);
  revalidate();
  return ticket;
}
