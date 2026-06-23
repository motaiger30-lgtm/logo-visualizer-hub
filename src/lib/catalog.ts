// Static product catalog with local images bundled with the app.
// No backend / no Supabase calls.

import pensImg from "@/assets/product-pens.jpg";
import mugsImg from "@/assets/product-mugs.jpg";
import usbImg from "@/assets/product-usb.jpg";
import notebooksImg from "@/assets/product-notebooks.jpg";
import tshirtsImg from "@/assets/product-tshirts.jpg";

export type Product = {
  slug: string;
  name: string;
  moq: number;
};

export type CategorySlug = "pens" | "mugs" | "usb" | "notebooks" | "tshirts";

export type Category = {
  slug: CategorySlug;
  name: string;
  blurb: string;
  image: string;
  products: Product[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "pens",
    name: "Promotional Pens",
    blurb: "7 premium variants — executive, medical, novelty.",
    image: pensImg,
    products: [
      { slug: "countertop-secure-desk", name: "Countertop Secure Desk Pen", moq: 50 },
      { slug: "executive-matte-stylus", name: "Executive Matte Stylus", moq: 100 },
      { slug: "medical-syringe", name: "Medical Syringe", moq: 200 },
      { slug: "bone", name: "Bone Pen", moq: 100 },
      { slug: "minimalist", name: "Minimalist", moq: 100 },
      { slug: "tech-stylus", name: "Tech Stylus", moq: 100 },
      { slug: "elite-gift", name: "Elite Gift", moq: 50 },
    ],
  },
  {
    slug: "mugs",
    name: "Mugs",
    blurb: "Ceramic, magic and travel mugs.",
    image: mugsImg,
    products: [
      { slug: "ceramic", name: "Ceramic Mug", moq: 50 },
      { slug: "magic", name: "Magic Mug", moq: 50 },
      { slug: "travel", name: "Travel Mug", moq: 50 },
    ],
  },
  {
    slug: "usb",
    name: "USB Flash",
    blurb: "Metal, card and wood USB drives.",
    image: usbImg,
    products: [
      { slug: "metal", name: "Metal USB", moq: 50 },
      { slug: "card", name: "Card USB", moq: 100 },
      { slug: "wood", name: "Wood USB", moq: 50 },
    ],
  },
  {
    slug: "notebooks",
    name: "Notebooks",
    blurb: "PU, spiral and executive notebooks.",
    image: notebooksImg,
    products: [
      { slug: "pu", name: "PU Notebook", moq: 50 },
      { slug: "spiral", name: "Spiral Notebook", moq: 50 },
      { slug: "executive", name: "Executive Notebook", moq: 50 },
    ],
  },
  {
    slug: "tshirts",
    name: "T-Shirts",
    blurb: "Cotton, polo and premium tees.",
    image: tshirtsImg,
    products: [
      { slug: "cotton", name: "Cotton", moq: 30 },
      { slug: "polo", name: "Polo", moq: 30 },
      { slug: "premium", name: "Premium", moq: 30 },
    ],
  },
];

export function getCategory(slug: CategorySlug): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

// Back-compat for any lingering imports
export const PENS = CATEGORIES[0].products;
export type Pen = Product;

/** Resolve a local product image. Always returns the category's bundled image. */
export function productImageUrl(category: CategorySlug, _slug?: string): string {
  return getCategory(category).image;
}
