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

const cover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;

const BOOKS: BookSeed[] = [
  { id: 1, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi", priceCents: 1899, description: "A young nobleman rises to lead a desert planet's people against a galactic empire.", rating: 4.6, stock: 12, isbn: "9780441013593" },
  { id: 2, title: "Ender's Game", author: "Orson Scott Card", genre: "Sci-Fi", priceCents: 1799, description: "A child prodigy is trained at a brutal battle school to command Earth's fleet.", rating: 4.5, stock: 9, isbn: "9780812550702" },
  { id: 3, title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi", priceCents: 1699, description: "A mathematician predicts the fall of an empire and seeds a colony to preserve knowledge.", rating: 4.4, stock: 7, isbn: "9780553293357" },
  { id: 4, title: "The Handmaid's Tale", author: "Margaret Atwood", genre: "Sci-Fi", priceCents: 1799, description: "In a theocratic near-future, one woman is forced into servitude and silent resistance.", rating: 4.5, stock: 14, isbn: "9780385490818" },
  { id: 5, title: "Neuromancer", author: "William Gibson", genre: "Sci-Fi", priceCents: 1699, description: "A washed-up hacker is offered one last job across a tangled digital frontier.", rating: 4.3, stock: 6, isbn: "9780441569595" },
  { id: 6, title: "The Martian", author: "Andy Weir", genre: "Sci-Fi", priceCents: 1599, description: "Stranded alone on Mars, an astronaut science-and-puns his way toward survival.", rating: 4.7, stock: 18, isbn: "9780553418026" },

  { id: 7, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", priceCents: 1499, description: "A mysterious millionaire's obsession unravels across one Long Island summer.", rating: 4.2, stock: 22, isbn: "9780743273565" },
  { id: 8, title: "Beloved", author: "Toni Morrison", genre: "Fiction", priceCents: 1699, description: "A formerly enslaved woman is haunted, literally and otherwise, by what she survived.", rating: 4.4, stock: 10, isbn: "9781400033416" },
  { id: 9, title: "The Road", author: "Cormac McCarthy", genre: "Fiction", priceCents: 1599, description: "A father and son walk through a ruined America toward an unnamed coast.", rating: 4.3, stock: 13, isbn: "9780307387899" },
  { id: 10, title: "Norwegian Wood", author: "Haruki Murakami", genre: "Fiction", priceCents: 1799, description: "A quiet Tokyo student reckons with love, loss, and a single song on repeat.", rating: 4.4, stock: 11, isbn: "9780375704024" },
  { id: 11, title: "A Visit from the Goon Squad", author: "Jennifer Egan", genre: "Fiction", priceCents: 1699, description: "Linked lives in the music industry fold across decades, time, and one infamous PowerPoint.", rating: 4.1, stock: 5, isbn: "9780307592835" },
  { id: 12, title: "The Remains of the Day", author: "Kazuo Ishiguro", genre: "Fiction", priceCents: 1699, description: "An aging English butler takes a rare motor trip and reviews a life of restraint.", rating: 4.5, stock: 8, isbn: "9780679731726" },
  { id: 13, title: "Stoner", author: "John Williams", genre: "Fiction", priceCents: 1699, description: "An uncelebrated academic's quiet life becomes, somehow, devastating.", rating: 4.6, stock: 4, isbn: "9781590171998" },

  { id: 14, title: "The Big Sleep", author: "Raymond Chandler", genre: "Mystery", priceCents: 1599, description: "Private eye Philip Marlowe works a case that keeps getting stranger and more lethal.", rating: 4.5, stock: 9, isbn: "9780394758282" },
  { id: 15, title: "Gone Girl", author: "Gillian Flynn", genre: "Mystery", priceCents: 1699, description: "A wife vanishes; the husband looks guilty; nothing you're told can be trusted.", rating: 4.4, stock: 16, isbn: "9780307588371" },
  { id: 16, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", genre: "Mystery", priceCents: 1799, description: "A disgraced journalist and a brilliant hacker dig into a wealthy family's buried crimes.", rating: 4.6, stock: 12, isbn: "9780307454546" },
  { id: 17, title: "In the Woods", author: "Tana French", genre: "Mystery", priceCents: 1699, description: "A Dublin detective's new case stirs a trauma he's spent twenty years forgetting.", rating: 4.3, stock: 7, isbn: "9780143113492" },
  { id: 18, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", genre: "Mystery", priceCents: 899, description: "Sherlock Holmes untangles a legendary curse, a glowing moor, and one very real murder.", rating: 4.7, stock: 20, isbn: "9780743488204" },

  { id: 19, title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", priceCents: 2499, description: "A small hobbit carries a great burden across a world on the edge of war.", rating: 4.9, stock: 15, isbn: "9780544003415" },
  { id: 20, title: "A Game of Thrones", author: "George R.R. Martin", genre: "Fantasy", priceCents: 1999, description: "Noble houses scheme for a throne while an ancient threat stirs beyond the wall.", rating: 4.7, stock: 18, isbn: "9780553593716" },
  { id: 21, title: "The Name of the Wind", author: "Patrick Rothfuss", genre: "Fantasy", priceCents: 1899, description: "A legendary musician and mage tells the story of his own becoming, over three nights.", rating: 4.6, stock: 11, isbn: "9780756404741" },
  { id: 22, title: "The Fifth Season", author: "N.K. Jemisin", genre: "Fantasy", priceCents: 1799, description: "On a continent-killing planet, three women hold the world's fracture lines in their hands.", rating: 4.5, stock: 9, isbn: "9780316229296" },
  { id: 23, title: "Mistborn: The Final Empire", author: "Brandon Sanderson", genre: "Fantasy", priceCents: 1899, description: "A thief crew attempts the longest shot in heist history: killing a god-emperor.", rating: 4.7, stock: 13, isbn: "9780765350381" },
  { id: 24, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", priceCents: 1499, description: "A reluctant hobbit, thirteen dwarves, and a dragon's hoard turn into an adventure.", rating: 4.8, stock: 21, isbn: "9780007477159" },

  { id: 25, title: "Sapiens", author: "Yuval Noah Harari", genre: "Non-Fiction", priceCents: 1999, description: "A brisk, opinionated tour of how Homo sapiens went from one ape among many to in charge.", rating: 4.5, stock: 24, isbn: "9780062316097" },
  { id: 26, title: "The Power of Habit", author: "Charles Duhigg", genre: "Non-Fiction", priceCents: 1799, description: "Why habits form, how they steer us, and what it takes to rewrite the loops that run our days.", rating: 4.3, stock: 14, isbn: "9780812981605" },
  { id: 27, title: "Educated", author: "Tara Westover", genre: "Non-Fiction", priceCents: 1999, description: "A memoir of leaving a survivalist family for an education one dangerous degree at a time.", rating: 4.7, stock: 17, isbn: "9780399590504" },
  { id: 28, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", genre: "Non-Fiction", priceCents: 2199, description: "A Nobel laureate unpacks the two systems that drive how we decide, judge, and fool ourselves.", rating: 4.4, stock: 10, isbn: "9780374533557" },
  { id: 29, title: "Atomic Habits", author: "James Clear", genre: "Non-Fiction", priceCents: 1999, description: "A field manual for getting 1% better, repeated until the gains compound into something else.", rating: 4.6, stock: 19, isbn: "9780735211292" },

  { id: 30, title: "Guns, Germs, and Steel", author: "Jared Diamond", genre: "History", priceCents: 1999, description: "Why some societies ended up with the crops, germs, and weapons that shaped 13,000 years.", rating: 4.3, stock: 8, isbn: "9780393317558" },
  { id: 31, title: "The Warmth of Other Suns", author: "Isabel Wilkerson", genre: "History", priceCents: 1999, description: "The great migration told through three lives that quietly remade the American century.", rating: 4.8, stock: 6, isbn: "9780679763888" },
  { id: 32, title: "1491", author: "Charles C. Mann", genre: "History", priceCents: 1899, description: "What the Americas were really like before Columbus arrived and rewrote the records.", rating: 4.5, stock: 7, isbn: "9781400032051" },
  { id: 33, title: "SPQR", author: "Mary Beard", genre: "History", priceCents: 2199, description: "A fresh, skeptical history of Rome from a small village to a thousand-year empire.", rating: 4.4, stock: 5, isbn: "9781631492228" },

  { id: 34, title: "Steve Jobs", author: "Walter Isaacson", genre: "Biography", priceCents: 2299, description: "An authorized, unsparing portrait of the Apple co-founder's genius and abrasion.", rating: 4.5, stock: 12, isbn: "9781451648539" },
  { id: 35, title: "The Diary of a Young Girl", author: "Anne Frank", genre: "Biography", priceCents: 1299, description: "Two years in a hidden Amsterdam annex, written by a girl whose voice outlived the war.", rating: 4.7, stock: 16, isbn: "9780553296983" },
  { id: 36, title: "Born a Crime", author: "Trevor Noah", genre: "Biography", priceCents: 1899, description: "A comedian's coming-of-age under apartheid, equal parts brutal and very funny.", rating: 4.8, stock: 14, isbn: "9780399588198" },
  { id: 37, title: "Just Kids", author: "Patti Smith", genre: "Biography", priceCents: 1899, description: "Patti Smith and Robert Mapplethorpe make art, scrape by, and grow up in late New York.", rating: 4.5, stock: 6, isbn: "9780060936228" },

  { id: 38, title: "Outlander", author: "Diana Gabaldon", genre: "Romance", priceCents: 1999, description: "A post-war combat nurse touches a standing stone and lands two centuries back in the Highlands.", rating: 4.6, stock: 13, isbn: "9780440212560" },
  { id: 39, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", priceCents: 999, description: "Five sisters, one insufferable gentleman, and the slow art of changing one's mind.", rating: 4.8, stock: 25, isbn: "9780141439518" },
  { id: 40, title: "Jane Eyre", author: "Charlotte Brontë", genre: "Romance", priceCents: 1199, description: "An orphan turned governess holds her own against a brooding employer and a house with secrets.", rating: 4.7, stock: 18, isbn: "9780141441146" },
  { id: 41, title: "The Time Traveler's Wife", author: "Audrey Niffenegger", genre: "Romance", priceCents: 1799, description: "A librarian who slips through time and the artist who waits for him try to build a life together.", rating: 4.4, stock: 9, isbn: "9780156029438" },
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
    DELETE FROM sqlite_sequence;
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
        coverUrl: cover(b.isbn),
      })),
    )
    .run();

  const order1Items = [
    { bookId: 1, quantity: 1, unitPriceCents: 1899 },
    { bookId: 3, quantity: 1, unitPriceCents: 1699 },
    { bookId: 7, quantity: 1, unitPriceCents: 1499 },
  ];
  const order1Subtotal = order1Items.reduce(
    (s, l) => s + l.unitPriceCents * l.quantity,
    0,
  );
  const order2Items = [
    { bookId: 19, quantity: 1, unitPriceCents: 2499 },
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
