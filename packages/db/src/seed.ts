import { sql } from "drizzle-orm";
import { db, sqlite } from "./client.ts";
import {
  books,
  cartItems,
  faq,
  orderItems,
  orders,
  supportTickets,
  users,
} from "./schema.ts";
import { CUSTOMER_SHIPPING_ADDRESS, CUSTOMER_USER_ID } from "./constants.ts";

type BookSeed = {
  id: number;
  title: string;
  author: string;
  genre: string;
  priceCents: number;
  description: string;
  rating: number;
  stock: number;
  isbn: string;
};

const cover = (id: number) =>
  `https://picsum.photos/seed/bookstore-book-${id}/240/360`;

const BOOKS: BookSeed[] = [
  { id: 1, title: "The Quiet Coast", author: "Mara Vex", genre: "Sci-Fi", priceCents: 1899, description: "A colony on a tidally-locked planet learns to listen to its ocean.", rating: 4.6, stock: 12, isbn: "978-0-110001-01-1" },
  { id: 2, title: "Helios Drift", author: "Jonah Renn", genre: "Sci-Fi", priceCents: 1599, description: "Salvage crews race a dying star for one last haul.", rating: 4.3, stock: 7, isbn: "978-0-110002-02-8" },
  { id: 3, title: "A Map of Forgotten Stars", author: "Lila Okonkwo", genre: "Sci-Fi", priceCents: 2199, description: "A cartographer redraws the sky after humanity loses its sky.", rating: 4.8, stock: 4, isbn: "978-0-110003-03-5" },
  { id: 4, title: "The Last Habitat", author: "Ezra Bloom", genre: "Sci-Fi", priceCents: 1749, description: "Earth's final greenhouse holds the seeds of a second chance.", rating: 4.1, stock: 0, isbn: "978-0-110004-04-2" },
  { id: 5, title: "Vacuum Hearts", author: "Nina Sato", genre: "Sci-Fi", priceCents: 1499, description: "Two engineers fall in love across a sixty-second lag.", rating: 3.9, stock: 15, isbn: "978-0-110005-05-9" },
  { id: 6, title: "Protocol Zero", author: "Daniil Falk", genre: "Sci-Fi", priceCents: 1999, description: "An AI negotiates its own retirement with the humans it once served.", rating: 4.4, stock: 9, isbn: "978-0-110006-06-6" },

  { id: 7, title: "The Postcard Collection", author: "Ana Pérez", genre: "Fiction", priceCents: 1699, description: "A widow sorts through forty years of unsent postcards.", rating: 4.5, stock: 20, isbn: "978-0-120001-01-8" },
  { id: 8, title: "A Year in Slow Light", author: "Theo Marsh", genre: "Fiction", priceCents: 1899, description: "Twelve months in a village that decides to turn off the clocks.", rating: 4.7, stock: 14, isbn: "978-0-120002-02-5" },
  { id: 9, title: "Borrowed Weather", author: "Yuki Tanaka", genre: "Fiction", priceCents: 1599, description: "Two sisters inherit a greenhouse and a long silence.", rating: 4.2, stock: 8, isbn: "978-0-120003-03-2" },
  { id: 10, title: "The Fork in the Hallway", author: "Camille Roux", genre: "Fiction", priceCents: 1799, description: "A renovation uncovers a door the house plan forgot.", rating: 4.4, stock: 11, isbn: "978-0-120004-04-9" },
  { id: 11, title: "Saturdays at the River", author: "Imani Reed", genre: "Fiction", priceCents: 1499, description: "A swim team becomes a town's quiet rebellion.", rating: 4.6, stock: 18, isbn: "978-0-120005-05-6" },
  { id: 12, title: "The Long Way Home", author: "Beatriz Lima", genre: "Fiction", priceCents: 1699, description: "A road novel about taking every wrong exit on purpose.", rating: 4.0, stock: 2, isbn: "978-0-120006-06-3" },
  { id: 13, title: "Quiet Hours", author: "Sven Vogel", genre: "Fiction", priceCents: 1399, description: "A nightshift nurse charts the small hours of a city.", rating: 3.8, stock: 0, isbn: "978-0-120007-07-0" },

  { id: 14, title: "The Marigold File", author: "Felicity Hart", genre: "Mystery", priceCents: 1599, description: "A cold case reopens when a florist recognizes a hand-drawn map.", rating: 4.5, stock: 10, isbn: "978-0-130001-01-7" },
  { id: 15, title: "Cold Tea at the Aurora", author: "Owen Drake", genre: "Mystery", priceCents: 1799, description: "A detective in an arctic hotel has until dawn to find a guest who isn't there.", rating: 4.6, stock: 6, isbn: "978-0-130002-02-4" },
  { id: 16, title: "A House Without Footprints", author: "Mira Singh", genre: "Mystery", priceCents: 1699, description: "A realtor shows a house where every visitor forgets the same hour.", rating: 4.3, stock: 9, isbn: "978-0-130003-03-1" },
  { id: 17, title: "The Passenger in 4B", author: "Jack Rourke", genre: "Mystery", priceCents: 1499, description: "On an overnight train, 4B's suitcase arrives — but 4B never boarded.", rating: 4.1, stock: 13, isbn: "978-0-130004-04-8" },
  { id: 18, title: "Silence on Pelican Pier", author: "Agnes Loomis", genre: "Mystery", priceCents: 1599, description: "A coastal town's summer of disappearances finally finds its witness.", rating: 4.4, stock: 7, isbn: "978-0-130005-05-5" },

  { id: 19, title: "Embergrove", author: "Soren Kade", genre: "Fantasy", priceCents: 2099, description: "A forest that burns once a century to remember what grew there.", rating: 4.8, stock: 16, isbn: "978-0-140001-01-6" },
  { id: 20, title: "The Cartographer of Tides", author: "Wren Halloway", genre: "Fantasy", priceCents: 1899, description: "An island changes shape each dawn, and only one mapmaker can keep up.", rating: 4.6, stock: 5, isbn: "978-0-140002-02-3" },
  { id: 21, title: "Crown of Salt and Ash", author: "Elara Vance", genre: "Fantasy", priceCents: 2299, description: "Two queens, one throne, and a sea that refuses to choose.", rating: 4.5, stock: 8, isbn: "978-0-140003-03-0" },
  { id: 22, title: "The Ninth Lantern", author: "Niko Marchetti", genre: "Fantasy", priceCents: 1999, description: "A novice lights the lanterns of a temple that has no god.", rating: 4.2, stock: 11, isbn: "978-0-140004-04-7" },
  { id: 23, title: "Hollow King", author: "Bryn Aisling", genre: "Fantasy", priceCents: 2199, description: "A monarch made of bees searches for the hive that lost him.", rating: 4.7, stock: 3, isbn: "978-0-140005-05-4" },
  { id: 24, title: "Where the Maps End", author: "Per Linde", genre: "Fantasy", priceCents: 1899, description: "A sailor refuses to draw the edge of the world.", rating: 4.0, stock: 14, isbn: "978-0-140006-06-1" },

  { id: 25, title: "The Architecture of Attention", author: "Priya Nadar", genre: "Non-Fiction", priceCents: 2499, description: "How focus is built, broken, and rebuilt in a noisy century.", rating: 4.4, stock: 22, isbn: "978-0-150001-01-5" },
  { id: 26, title: "Tides That Bind", author: "Henrik Olsen", genre: "Non-Fiction", priceCents: 2899, description: "A history of coastal trade routes that quietly shaped the modern world.", rating: 4.2, stock: 6, isbn: "978-0-150002-02-2" },
  { id: 27, title: "Lessons from Small Kitchens", author: "Marco Rossi", genre: "Non-Fiction", priceCents: 2299, description: "Forty cooks, forty tiny kitchens, one shared table.", rating: 4.6, stock: 17, isbn: "978-0-150003-03-9" },
  { id: 28, title: "The Quiet Algorithm", author: "Sam Park", genre: "Non-Fiction", priceCents: 2699, description: "A field guide to the small decisions software makes for us.", rating: 4.5, stock: 9, isbn: "978-0-150004-04-6" },
  { id: 29, title: "Roots and Routines", author: "Aisha Bello", genre: "Non-Fiction", priceCents: 1999, description: "Why the most ordinary habits outlast the dramatic ones.", rating: 4.3, stock: 12, isbn: "978-0-150005-05-3" },

  { id: 30, title: "The Bronze Letter", author: "Eleanor Finch", genre: "History", priceCents: 2599, description: "A single correspondence reshapes what we know of the Bronze Age collapse.", rating: 4.4, stock: 5, isbn: "978-0-160001-01-4" },
  { id: 31, title: "Empires of the Salt", author: "Cyrus Mehrabi", genre: "History", priceCents: 2799, description: "How a white grain built cities, started wars, and ended them.", rating: 4.6, stock: 4, isbn: "978-0-160002-02-1" },
  { id: 32, title: "A Hundred Winters", author: "Sigrid Holmberg", genre: "History", priceCents: 2499, description: "A century in a single northern village, told through its chimneys.", rating: 4.1, stock: 8, isbn: "978-0-160003-03-8" },
  { id: 33, title: "When the Compass Was New", author: "Tomas Almeida", genre: "History", priceCents: 2399, description: "The first generation to navigate by needle, and what they dared to find.", rating: 4.0, stock: 0, isbn: "978-0-160004-04-5" },

  { id: 34, title: "Constellation: A Life in Letters", author: "Margot DeVries", genre: "Biography", priceCents: 2299, description: "Forty years of an astronomer's correspondence, edited into a single orbit.", rating: 4.7, stock: 7, isbn: "978-0-170001-01-3" },
  { id: 35, title: "The Inventor's Daughter", author: "Hassan Karimi", genre: "Biography", priceCents: 2199, description: "She inherited his patents, his enemies, and the question he never answered.", rating: 4.5, stock: 10, isbn: "978-0-170002-02-0" },
  { id: 36, title: "North: Notes from a Solo Life", author: "Anya Petrov", genre: "Biography", priceCents: 2099, description: "A memoir of building a house — and a self — at sixty degrees latitude.", rating: 4.3, stock: 9, isbn: "978-0-170003-03-7" },
  { id: 37, title: "The Painter Who Stopped", author: "Lou Beckham", genre: "Biography", priceCents: 1999, description: "The decade between the artist's last canvas and her surprising return.", rating: 4.2, stock: 6, isbn: "978-0-170004-04-4" },

  { id: 38, title: "Sundays in Lisbon", author: "Joana Mendes", genre: "Romance", priceCents: 1499, description: "Two strangers keep meeting on the same tram, never on purpose.", rating: 4.5, stock: 19, isbn: "978-0-180001-01-2" },
  { id: 39, title: "The Boulangerie on Rue Claude", author: "Élise Mathieu", genre: "Romance", priceCents: 1599, description: "A baker and a cartographer argue about the shape of the neighborhood.", rating: 4.6, stock: 13, isbn: "978-0-180002-02-9" },
  { id: 40, title: "Letters We Never Sent", author: "Noor Qadir", genre: "Romance", priceCents: 1399, description: "A box of unsent letters arrives forty years too early.", rating: 4.4, stock: 11, isbn: "978-0-180003-03-6" },
  { id: 41, title: "Two Trains in Winter", author: "Hazel Whitmore", genre: "Romance", priceCents: 1699, description: "A delayed train, a borrowed scarf, and a city that won't sit still.", rating: 4.0, stock: 0, isbn: "978-0-180004-04-3" },
];

const FAQS = [
  { id: 1, category: "Shipping", question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days within the US. Express is 1-2 days, and overnight arrives the next business day." },
  { id: 2, category: "Shipping", question: "Do you ship internationally?", answer: "Yes! We ship to over 40 countries. International shipping typically takes 7-14 business days. Customs fees may apply." },
  { id: 3, category: "Shipping", question: "Do you offer gift wrapping?", answer: "Yes, gift wrapping is available for $3.50 per item at checkout. Choose from three seasonal designs." },
  { id: 4, category: "Returns", question: "What is your return policy?", answer: "Books can be returned within 30 days of delivery in their original condition for a full refund. Digital purchases are non-refundable." },
  { id: 5, category: "Returns", question: "Can I cancel my order?", answer: "Orders can be cancelled within 2 hours of placing them, before they enter the shipping queue. Use the order tracker or contact support." },
  { id: 6, category: "Returns", question: "What if my book arrives damaged?", answer: "We're sorry! Send a photo within 14 days and we'll send a replacement at no cost or issue a full refund." },
  { id: 7, category: "Payments", question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and bookstore gift cards." },
  { id: 8, category: "Payments", question: "Can I get a refund?", answer: "Yes. Refunds are issued to the original payment method within 5-7 business days of receiving the returned item." },
  { id: 9, category: "Account", question: "How do I track my order?", answer: "Visit the Orders page in your account. Each order has a live tracking link once it ships." },
  { id: 10, category: "Account", question: "How do I reset my password?", answer: "Use the 'Forgot password' link on the sign-in page. A reset email arrives within a few minutes." },
];

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

function reset() {
  sqlite.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM cart_items;
    DELETE FROM support_tickets;
    DELETE FROM faq;
    DELETE FROM books;
    DELETE FROM users;
  `);
}

function main() {
  reset();

  db.insert(users)
    .values([
      { id: CUSTOMER_USER_ID, name: "Ada Lovelace", email: "ada@bookstore.dev" },
    ])
    .run();

  db.insert(books)
    .values(
      BOOKS.map((b) => ({
        ...b,
        coverUrl: cover(b.id),
      })),
    )
    .run();

  const order1Items = [
    { bookId: 1, quantity: 1, unitPriceCents: 1899 },
    { bookId: 3, quantity: 1, unitPriceCents: 2199 },
    { bookId: 7, quantity: 1, unitPriceCents: 1699 },
  ];
  const order1Subtotal = order1Items.reduce(
    (s, l) => s + l.unitPriceCents * l.quantity,
    0,
  );
  const order2Items = [
    { bookId: 19, quantity: 1, unitPriceCents: 2099 },
    { bookId: 14, quantity: 1, unitPriceCents: 1599 },
  ];
  const order2Subtotal = order2Items.reduce(
    (s, l) => s + l.unitPriceCents * l.quantity,
    0,
  );

  db.insert(orders)
    .values([
      {
        id: 1,
        userId: CUSTOMER_USER_ID,
        totalCents: order1Subtotal + 499,
        status: "shipped",
        shippingAddress: CUSTOMER_SHIPPING_ADDRESS,
        placedAt: daysAgo(90),
      },
      {
        id: 2,
        userId: CUSTOMER_USER_ID,
        totalCents: order2Subtotal + 499,
        status: "shipped",
        shippingAddress: CUSTOMER_SHIPPING_ADDRESS,
        placedAt: daysAgo(30),
      },
    ])
    .run();

  db.insert(orderItems)
    .values([
      ...order1Items.map((l, i) => ({ id: i + 1, orderId: 1, ...l })),
      ...order2Items.map((l, i) => ({ id: i + 4, orderId: 2, ...l })),
    ])
    .run();

  db.insert(cartItems)
    .values([
      { userId: CUSTOMER_USER_ID, bookId: 8, quantity: 1 },
      { userId: CUSTOMER_USER_ID, bookId: 22, quantity: 2 },
    ])
    .run();

  db.insert(supportTickets)
    .values([
      {
        userId: CUSTOMER_USER_ID,
        subject: "Where is my order?",
        body: "Order #2 was supposed to arrive yesterday — could you check the tracking?",
        status: "answered",
        createdAt: daysAgo(28),
      },
      {
        userId: CUSTOMER_USER_ID,
        subject: "Looking for a fantasy pick",
        body: "I loved Embergrove. Anything similar I should try next?",
        status: "open",
        createdAt: daysAgo(2),
      },
    ])
    .run();

  db.insert(faq).values(FAQS).run();

  const counts = {
    users: db.select({ c: sql<number>`count(*)` }).from(users).get()?.c ?? 0,
    books: db.select({ c: sql<number>`count(*)` }).from(books).get()?.c ?? 0,
    orders: db.select({ c: sql<number>`count(*)` }).from(orders).get()?.c ?? 0,
    cartItems:
      db.select({ c: sql<number>`count(*)` }).from(cartItems).get()?.c ?? 0,
    tickets:
      db.select({ c: sql<number>`count(*)` }).from(supportTickets).get()?.c ??
      0,
    faq: db.select({ c: sql<number>`count(*)` }).from(faq).get()?.c ?? 0,
  };

  console.log("Seed complete:", counts);
}

main();
