import type { FC } from "react";
import { ErrorCard } from "./error";
import { RunningCard } from "./running";
import { ApprovalCard } from "./approval";
import { SearchBooksCard } from "./search-books";
import { BookDetailsCard } from "./book-details";
import { CartCard } from "./cart";
import { AccountCard } from "./account";
import { OrderHistoryCard } from "./order-history";
import { OrderDetailsCard } from "./order-details";
import { ShippingOptionsCard } from "./shipping-options";
import { CheckoutCard } from "./checkout";
import { FaqCard } from "./faq";
import { SupportTicketCard } from "./support-ticket";
import { ToolPartBadge } from "../tool-part-badge";
import type { ToolPartLike } from "./types";

type CardProps = {
  input: unknown;
  output: unknown;
  toolCallId?: string;
  toolName?: string;
};

type Renderer = FC<CardProps>;

const REGISTRY: Record<string, Renderer> = {
  search_books: SearchBooksCard as Renderer,
  get_recommendations: SearchBooksCard as Renderer,
  get_book_details: BookDetailsCard as Renderer,
  get_cart: CartCard as Renderer,
  add_to_cart: CartCard as Renderer,
  update_cart_item: CartCard as Renderer,
  remove_from_cart: CartCard as Renderer,
  clear_cart: CartCard as Renderer,
  get_account: AccountCard as Renderer,
  get_order_history: OrderHistoryCard as Renderer,
  get_order_details: OrderDetailsCard as Renderer,
  get_shipping_options: ShippingOptionsCard as Renderer,
  checkout: CheckoutCard as Renderer,
  get_faq: FaqCard as Renderer,
  create_support_ticket: SupportTicketCard as Renderer,
  get_support_ticket: SupportTicketCard as Renderer,
};

export function ToolCard({
  part,
  onRespond,
}: {
  part: ToolPartLike;
  onRespond?: (requestId: string, optionId: string) => void;
}) {
  if (part.toolMetadata?.eve?.inputRequest) {
    return <ApprovalCard part={part} onRespond={onRespond} />;
  }

  const state = part.state ?? "";
  if (
    state === "input-streaming" ||
    state === "input-available" ||
    state === "approval-requested"
  ) {
    return <RunningCard toolName={part.toolName} />;
  }

  if (state === "output-error") {
    const message =
      typeof part.output === "object" && part.output !== null
        ? String(
            (part.output as { errorText?: string; message?: string }).errorText ??
              (part.output as { message?: string }).message ??
              "",
          )
        : undefined;
    return <ErrorCard toolName={part.toolName} message={message} />;
  }

  if (state === "output-denied") {
    return <ErrorCard toolName={part.toolName} message="Tool call was denied." />;
  }

  if (state === "output-available") {
    const Renderer = part.toolName ? REGISTRY[part.toolName] : undefined;
    if (!Renderer) {
      return <ToolPartBadge part={part} />;
    }
    return (
      <Renderer
        input={part.input}
        output={part.output}
        toolCallId={part.toolCallId}
        toolName={part.toolName}
      />
    );
  }

  return <ToolPartBadge part={part} />;
}
