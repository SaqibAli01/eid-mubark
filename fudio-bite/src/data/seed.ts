// Seed data for Fudio Bite POS
// Generated from the supplied menu image — categories, products and prices (PKR).
export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Product = {
  id: string;
  name: string;
  name_native?: string;
  categoryId: string;
  price: number; // sale price in PKR
  costPrice?: number; // optional cost price in PKR (used for profit calc)
  stock?: number;
  available?: boolean;
  image?: string | null;
  variants?: { id: string; name: string; priceDelta: number }[];
};

export const categories: Category[] = [
  { id: "cat_burgers", name: "Burgers" },
  { id: "cat_shawarma", name: "Shawarma / Rolls" },
  { id: "cat_fries", name: "Fries" },
  { id: "cat_nuggets", name: "Nuggets / Wings" },
  { id: "cat_rice", name: "Rice / Platter" },
  { id: "cat_drinks", name: "Drinks / Shakes" },
  { id: "cat_deals", name: "Deals" },
  { id: "cat_extras", name: "Extras" },
];

// Products approximated from the menu image. Prices in PKR.
export const products: Product[] = [
  // Burgers
  {
    id: "p1",
    name: "Chicken Burger",
    name_native: "چکن برگر",
    categoryId: "cat_burgers",
    price: 200,
    costPrice: 120,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p2",
    name: "Beef Burger",
    name_native: "بیف برگر",
    categoryId: "cat_burgers",
    price: 200,
    costPrice: 120,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p3",
    name: "Zinger / Special Burger",
    name_native: "زنگر برگر",
    categoryId: "cat_burgers",
    price: 230,
    costPrice: 140,
    stock: 120,
    available: true,
    image: null,
  },

  // Shawarma / Rolls
  {
    id: "p4",
    name: "Chicken Shawarma Roll",
    name_native: "چکن شا ورما",
    categoryId: "cat_shawarma",
    price: 120,
    costPrice: 70,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p5",
    name: "Beef Shawarma Roll",
    name_native: "بیف شا ورما",
    categoryId: "cat_shawarma",
    price: 140,
    costPrice: 80,
    stock: 150,
    available: true,
    image: null,
  },
  {
    id: "p6",
    name: "Kebab Roll",
    name_native: "کباب رول",
    categoryId: "cat_shawarma",
    price: 200,
    costPrice: 120,
    stock: 120,
    available: true,
    image: null,
  },

  // Fries
  {
    id: "p7",
    name: "Regular Fries",
    name_native: "فرائز ریگولر",
    categoryId: "cat_fries",
    price: 100,
    costPrice: 40,
    stock: 300,
    available: true,
    image: null,
  },
  {
    id: "p8",
    name: "Special Loaded Fries",
    name_native: "سپیشل فرائز",
    categoryId: "cat_fries",
    price: 120,
    costPrice: 60,
    stock: 150,
    available: true,
    image: null,
  },

  // Nuggets / Wings
  {
    id: "p9",
    name: "10pc Nuggets",
    name_native: "10 پیس نگٹس",
    categoryId: "cat_nuggets",
    price: 400,
    costPrice: 220,
    stock: 80,
    available: true,
    image: null,
  },
  {
    id: "p10",
    name: "5pc Nuggets",
    name_native: "5 پیس نگٹس",
    categoryId: "cat_nuggets",
    price: 250,
    costPrice: 140,
    stock: 150,
    available: true,
    image: null,
  },

  // Rice / Platters
  {
    id: "p11",
    name: "Chicken Platter",
    name_native: "چکن پلاٹر",
    categoryId: "cat_rice",
    price: 280,
    costPrice: 160,
    stock: 60,
    available: true,
    image: null,
  },
  {
    id: "p12",
    name: "Rice Bowl / Biryani-style",
    name_native: "چاول پليٹر",
    categoryId: "cat_rice",
    price: 220,
    costPrice: 130,
    stock: 80,
    available: true,
    image: null,
  },

  // Drinks / Shakes
  {
    id: "p13",
    name: "Mango Shake",
    name_native: "مینگو شیک",
    categoryId: "cat_drinks",
    price: 120,
    costPrice: 50,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p14",
    name: "Strawberry Shake",
    name_native: "اسٹرابیری شیک",
    categoryId: "cat_drinks",
    price: 120,
    costPrice: 50,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p15",
    name: "Vanilla Milkshake",
    name_native: "وینیلا شیک",
    categoryId: "cat_drinks",
    price: 120,
    costPrice: 50,
    stock: 200,
    available: true,
    image: null,
  },
  {
    id: "p16",
    name: "Lassi / Falooda",
    name_native: "لاسّی/فالودہ",
    categoryId: "cat_drinks",
    price: 120,
    costPrice: 60,
    stock: 120,
    available: true,
    image: null,
  },

  // Deals
  {
    id: "p17",
    name: "Family Deal (Burger + Fries)",
    name_native: "ڈیل فیملی",
    categoryId: "cat_deals",
    price: 500,
    costPrice: 300,
    stock: 50,
    available: true,
    image: null,
  },

  // Extras
  {
    id: "p18",
    name: "Extra Cheese",
    name_native: "اضافی چیز",
    categoryId: "cat_extras",
    price: 50,
    costPrice: 20,
    stock: 500,
    available: true,
    image: null,
  },
  {
    id: "p19",
    name: "Extra Sauce",
    name_native: "اضافی سوس",
    categoryId: "cat_extras",
    price: 20,
    costPrice: 5,
    stock: 500,
    available: true,
    image: null,
  },
];

export default { categories, products };
