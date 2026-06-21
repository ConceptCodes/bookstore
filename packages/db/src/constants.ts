export const CUSTOMER_USER_ID = "user_1";

export const CUSTOMER_SHIPPING_ADDRESS =
  "123 Binary St, Brooklyn, NY 11201";

export interface ShippingOption {
  id: string;
  label: string;
  costCents: number;
  etaBusinessDays: string;
}

export const SHIPPING_OPTIONS: readonly ShippingOption[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    costCents: 499,
    etaBusinessDays: "3-5",
  },
  {
    id: "express",
    label: "Express Shipping",
    costCents: 1299,
    etaBusinessDays: "1-2",
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    costCents: 2499,
    etaBusinessDays: "1",
  },
] as const;

export const LOW_STOCK_THRESHOLD = 3;
