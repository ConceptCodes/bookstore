import { LoaderIcon } from "lucide-react";
import { CardShell } from "./card-shell";

const TOOL_LABELS: Record<string, string> = {
  search_books: "Searching catalog",
  get_book_details: "Fetching book details",
  get_recommendations: "Finding recommendations",
  get_cart: "Loading cart",
  add_to_cart: "Adding to cart",
  update_cart_item: "Updating cart",
  remove_from_cart: "Removing from cart",
  clear_cart: "Clearing cart",
  get_account: "Loading account",
  get_order_history: "Loading orders",
  get_order_details: "Loading order",
  get_shipping_options: "Loading shipping options",
  checkout: "Preparing checkout",
  get_faq: "Looking up FAQ",
  create_support_ticket: "Opening ticket",
  get_support_ticket: "Loading ticket",
};

export function RunningCard({ toolName }: { toolName?: string }) {
  const label = (toolName && TOOL_LABELS[toolName]) ?? "Working";
  return (
    <CardShell>
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <LoaderIcon className="size-3.5 animate-spin" />
        {label}…
      </span>
    </CardShell>
  );
}
