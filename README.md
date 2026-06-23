# Bookstore

A mock bookstore monorepo with a customer storefront, an admin dashboard, and **Paige** — an Eve agent concierge customers chat with to discover books, manage their cart, check out, and get support.

Built with [**Eve**](https://vercel.com/eve) (Vercel's filesystem-first agent framework), [**Next.js 16**](https://nextjs.org) (App Router, Turbopack), [**Drizzle ORM**](https://orm.drizzle.team) on [**SQLite**](https://www.sqlite.org) ([`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)), [**shadcn/ui**](https://ui.shadcn.com) + [**AI Elements**](https://github.com/vercel/ai-elements), and [**Bun**](https://bun.sh) workspaces.

---

## Quick start

```bash
bun install                          # install all workspace deps
bun run db:setup                     # push schema + seed 41 real books
```

Then drop a model API key into `.env` at the repo root:

```bash
AI_GATEWAY_API_KEY=vercel_ai_gateway_key_here
# or:
# ANTHROPIC_API_KEY=sk-ant-...
```

Boot the storefront + chat:

```bash
bun run dev                          # http://localhost:3000
```

Boot the admin dashboard (separate terminal):

```bash
bun run dev:admin                    # http://localhost:3001
```

`apps/web` boots Next.js **and** the Eve dev server side-by-side via `withEve`. The Eve HTTP API is same-origin at `/eve/v1/*`.

---

## Workspace layout

```
book-store/
├── apps/
│   ├── web/              @bookstore/web    — storefront + chat sheet
│   └── admin/            @bookstore/admin  — CRUD dashboard (port 3001)
└── packages/
    ├── eve/              @bookstore/eve    — Paige the agent (Eve project root)
    ├── db/               @bookstore/db     — Drizzle schema + repo + seed
    ├── ui/               @bookstore/ui     — shadcn primitives + AI Elements + molecules
    └── config/           @bookstore/config — Zod-validated env singleton
```

All cross-package deps use `"workspace:*"`. Each package exports TypeScript source directly; both Next.js apps list workspace deps in `transpilePackages`.

---

## Scripts

| Script | What it does |
|---|---|
| `bun run dev` | Boot storefront (`apps/web`) on port 3000, with Eve alongside |
| `bun run dev:admin` | Boot admin dashboard on port 3001 |
| `bun run dev:eve` | Boot just the Eve agent dev server (TUI) |
| `bun run build` | Build every workspace |
| `bun run typecheck` | Typecheck every workspace |
| `bun run db:setup` | Push schema to SQLite + seed mock data |
| `bun run db:push` | Just push schema (no seed) |
| `bun run db:seed` | Just seed (assumes schema exists) |
| `bun run db:generate` | Generate a Drizzle migration file |
| `bun run db:migrate` | Apply Drizzle migrations |

---

## Environment variables

Validated by `@bookstore/config` via Zod on first import. Missing/invalid values fail loudly with field-level errors.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `AI_GATEWAY_API_KEY` | one of these three | — | Vercel AI Gateway (default model `anthropic/claude-sonnet-4.6` routes here) |
| `ANTHROPIC_API_KEY` | (or) | — | Direct Anthropic provider fallback |
| `VERCEL_OIDC_TOKEN` | (or) | — | Pull via `vercel link` instead |
| `NODE_ENV` | no | `development` | `development` / `test` / `production` |
| `BOOKSTORE_DB_PATH` | no | `<root>/.data/bookstore.db` | SQLite file location (absolute) |
| `EVE_NEXT_PRODUCTION_PORT` | no | — | `withEve` prod build port override |
| `EVE_NEXT_PRODUCTION_ORIGIN` | no | — | Cross-origin Eve service URL for non-Vercel hosts |
| `PORT` | no | — | Generic serve port |

`env.hasModelCredentials()`, `env.isDev`, `env.isProd`, `env.isTest`, and `requireEnv(key)` helpers are also exported from `@bookstore/config`.

---

## The agent: Paige

`packages/eve/agent/` is the Eve project root.

- **Persona** in `instructions.md` — Paige the bookseller (warm, concise, uses tools, treats Ada as the implicit customer, prices in cents internally / dollars to user).
- **Model** in `agent.ts` — `anthropic/claude-sonnet-4.6` via AI Gateway. `@bookstore/db` and `better-sqlite3` are externalized from Eve's bundle (native addon + workspace package).
- **Channel** in `channels/eve.ts` — `auth: [none()]` for the public mock demo. Swap for `localDev()` + a real auth chain before production.
- **16 tools** in `tools/` (filename = model-facing name):
  - Catalog: `search_books`, `get_book_details`, `get_recommendations`
  - Cart: `get_cart`, `add_to_cart`, `update_cart_item`, `remove_from_cart`, `clear_cart`
  - Account: `get_account`, `get_order_history`, `get_order_details`
  - Checkout: `get_shipping_options`, `checkout` (gated with `needsApproval: always()` for HITL)
  - Support: `get_faq`, `create_support_ticket`, `get_support_ticket`
- **7 disabled defaults** via `disableTool()` sentinels: `bash`, `read_file`, `write_file`, `glob`, `grep`, `web_fetch`, `web_search`. Kept: `ask_question`, `todo`, `load_skill`, `agent`.

Each tool wraps a `@bookstore/db` repo function with a model-facing description that explains when to call it. Tools throw with helpful messages on not-found / out-of-stock; Eve surfaces those errors back to the model.

### HTTP API (same on every Eve app)

```
POST   /eve/v1/session                    # start a session, get continuationToken + x-eve-session-id
GET    /eve/v1/session/:id/stream         # NDJSON event stream (lifecycle + tool + message events)
POST   /eve/v1/session/:id                # follow-up with continuationToken + message
GET    /eve/v1/info                       # agent inspection (tools, model, instructions, channels)
GET    /eve/v1/health                     # { ok, status, workflowId }
```

---

## Data layer

SQLite via `better-sqlite3` + Drizzle ORM. DB lives at `<root>/.data/bookstore.db` by default (gitignored).

**7 tables**: `users`, `books`, `cart_items`, `orders`, `order_items`, `support_tickets`, `faq`.

- **Books**: 41 real published titles (Dune, LOTR, Sapiens, Pride and Prejudice, …) across 8 genres with verified ISBNs. Cover URLs point at OpenLibrary's covers-by-ISBN endpoint — `https://covers.openlibrary.org/b/isbn/<isbn>-M.jpg` — which returns real cover JPEGs.
- **One customer**: `user_1` / Ada Lovelace / `ada@bookstore.dev`. Every tool scopes to her.
- **2 seeded past orders** with line items so recommendations + order history have signal.
- **10 FAQ entries** across Shipping / Returns / Payments / Account.
- **2 seeded support tickets** (one answered, one open).

Repo functions in `packages/db/src/repo.ts` cover catalog/cart/account/checkout/support + admin CRUD + overview metrics. Notable: `getRecommendations` (genre-overlap scoring), `createOrder` (transactional with stock decrement).

The seed script (`packages/db/src/seed.ts`) runs via **Node 26** (native TS strip) because Bun cannot load `better-sqlite3`'s native addon. The CLI/runtime in both Next.js apps and Eve's runtime is Node, where `better-sqlite3` loads fine.

---

## UI system

`@bookstore/ui` follows **atomic design**:

- **Atoms** (`components/ui/`): 26 shadcn primitives — Button, Card, Dialog, Sheet, Table, Select, Tooltip, AlertDialog, Collapsible, ScrollArea, Sonner, etc.
- **Atoms** (`components/ai-elements/`): 9 AI Elements — Conversation, Message, PromptInput, Tool, Reasoning, Suggestion, Confirmation, Shimmer, CodeBlock.
- **Molecules** (`components/molecules/`): BookCover, PriceTag, RatingStars, GenreBadge, StatusBadge, Stat, EmptyState, BookCard, QuantityInput.
- **Organisms** (`components/organisms/`): BookGrid (responsive grid with `cardFooter`/`getHref`/`emptyState` slots).
- **Format utils** (`lib/format.ts`): `formatCurrency`, `formatDate`, `formatDateTime`, `formatRelativeTime`.

Tailwind v4 tokens (neutral palette, dark-mode aware) are inlined per-app at `apps/*/app/globals.css`. The canonical source lives at `packages/ui/src/styles/globals.css` with a sync note — cross-package CSS `@import` fails under Bun's symlinked node_modules because Tailwind v4's PostCSS plugin can't resolve `tailwindcss` from that location.

`packages/ui` declares `next` as a peerDep so molecules can use `next/link`.

---

## Storefront (`apps/web`)

Atomic-design templates and pages.

- **Layout** (`app/layout.tsx`): server, fetches cart count from `@bookstore/db`, wraps in `<StorefrontShell>`.
- **Shell** (`components/storefront-shell.tsx`): client `ChatContext` provider holding sheet-open state + `pendingMessage` for CTAs that pre-seed the chat (e.g. "Ask Paige about this book").
- **Header** (`components/site-header.tsx`): logo, nav (Books/Orders/Support), **Ask Paige** trigger, cart count badge.
- **Paiges**:
  - `/` — hero (welcome + search), recommendations (genre-overlap), featured (top-rated), browse-all with genre chips
  - `/book/[id]` — 2-col layout (large cover + info), stock hints, prose description, details card, **Add to cart** + **Ask Paige about this book** CTAs, "More in \<genre\>" related grid; `notFound()` on unknown id
  - `/cart` — 2-col (items + sticky checkout); per-line qty stepper + remove via `useTransition`; shipping radio cards; totals breakdown; **Place order** → `checkoutAction` → redirect to `/orders/[id]`; "or ask Paige to help" alt path
  - `/orders` — card list with status badge, total, placed date, hover affordance
  - `/orders/[id]` — 2-col (items + sidebar); shipped banner with ETA; status/address/totals cards; `notFound()` on unknown/owned
  - `/support` — FAQ grouped by category with `Collapsible`; ticket history with status + relative time; sidebar with **TicketForm** + "Prefer to chat?" CTA
- **Server actions** (`app/actions.ts`) wrap `@bookstore/db` repo functions and revalidate the layout on mutation: `addBookToCartAction`, `updateCartItemQtyAction`, `removeFromCartAction`, `clearCartAction`, `createSupportTicketAction`, `checkoutAction` (same `createOrder` path the agent uses).

### Chat sheet (right-side)

Sheet → lazy `ChatPanel` (mounted only when open) → `useEveAgent` from `eve/react`.

- Session cursor persisted in `localStorage` (`bookstore.eve.session`).
- `MessageList` renders parts:
  - **text** → `<Streamdown>` with compact prose classes (markdown streams)
  - **reasoning** → hidden
  - **tool-\*** → dispatched to `tool-cards/` registry
- Composer: `<Textarea>` + Enter-to-send + Stop button while streaming; suggestion chips when conversation is empty.
- `pendingMessage` from `StorefrontShell.openWithMessage(msg)` is consumed once when the agent goes `ready`.

### Tool cards (16 + 4 state cards)

`components/chat/tool-cards/` registry maps each tool name → a renderer:

| Card | Renders |
|---|---|
| `RunningCard` | Per-tool "Searching…" / "Loading cart…" labels |
| `ErrorCard` | tone=danger, surfaces `output-error` / `output-denied` |
| `ApprovalCard` | **HITL approve/deny** for `checkout` — reads `toolMetadata.eve.inputRequest`, calls `onRespond` → `agent.send({ inputResponses })`, local state prevents double-submit |
| `SearchBooksCard` | Compact rows (cover + title + author + rating + price + Add btn) for `search_books` + `get_recommendations` |
| `BookDetailsCard` | Large cover + full info + stock + ISBN |
| `CartCard` | Shared across all 5 cart tools, per-tool title + line items + subtotal + "View cart" |
| `AccountCard` | 2×2 stat grid (orders / spent / tickets / cart items) |
| `OrderHistoryCard` | Last 5 orders + status badge + total |
| `OrderDetailsCard` | Full detail with line items + total |
| `ShippingOptionsCard` | Cost + ETA list |
| `CheckoutCard` | tone=success, order id link, line items, total |
| `FaqCard` | Collapsible Q/A via shadcn `Collapsible` |
| `SupportTicketCard` | Status badge + relative time + "View in support" |

`CardShell` (the wrapper) composes shadcn `Card` + `CardHeader` + `CardTitle` + `CardAction` + `CardContent` with tone variants (success/warning/danger) and tightened `p-3` spacing for the narrow chat sheet.

---

## Admin dashboard (`apps/admin`)

Port 3001. Pure CRUD (no agent in v1). Reads/writes through `@bookstore/db`'s admin repo functions.

- **Layout**: 60-unit sidebar (`Overview` / `Books` / `Orders` / `Tickets` / `FAQ`) + main content; "View storefront" external link.
- **Paiges**:
  - `/` — 4 Stat cards (revenue, open orders, low stock, open tickets) + Recent orders + Low stock lists
  - `/books` — table with cover/title/genre/rating/price/stock; URL search + genre chips; **Add book** Dialog (all fields, price in dollars → cents); per-row Edit Dialog, Stock Dialog (+/- stepper), Delete AlertDialog
  - `/orders` — table with status filter chips; per-row `OrderStatusSelect` for inline updates
  - `/orders/[id]` — line items, totals breakdown, shipping address, shipped banner
  - `/tickets` — table with status filter (open/answered/closed)
  - `/tickets/[id]` — subject, full message, Mark answered / Close ticket actions, other-tickets-from-same-user sidebar
  - `/faq` — table + Add/Edit Dialog + Delete AlertDialog; storefront link
- **Server actions** in `app/actions.ts` wrap admin repo fns and revalidate.

Reuses shared molecules from `@bookstore/ui` — **zero new atoms needed for admin**.

---

## Known limitations / next steps

- **No real auth.** The Eve channel uses `auth: [none()]` for the public mock. Swap for `localDev()` + a real session (Auth.js, etc.) before production.
- **Single hardcoded customer.** Every customer-facing tool scopes to `user_1` (Ada Lovelace). Multi-user would need per-session identity via `ctx.session.auth`.
- **Cart count in header doesn't auto-update from chat-side mutations.** Chat runs in Eve's process; the storefront's header count refreshes on next navigation. Server-action-driven mutations (`AddToCartButton`, cart page) do refresh immediately via `revalidatePath`.
- **HITL approve UI is wired but unverified end-to-end** — needs `AI_GATEWAY_API_KEY` to actually trigger an agent checkout flow.
- **Admin agent is future work** — would need a separate tool set (`list_all_orders`, `update_book`, `reply_to_ticket`, `restock_alerts`).
- **Deploy**: `withEve` deploys the agent as part of the web app on Vercel. Admin would be a separate project.

---

## Built with

This project was built entirely with **Z.ai GLM-5.2**, with some help from **Claude Sonnet 4.6** on the UI design.

---

## License

Mock demo project. Book metadata and cover images are pulled from [OpenLibrary](https://openlibrary.org) under their public API.
