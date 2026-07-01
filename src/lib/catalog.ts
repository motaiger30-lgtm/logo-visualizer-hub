// Static product catalog with local images bundled with the app.
// No backend / no Supabase calls.

import pensImg from "@/assets/product-pens.jpg";
import usbImg from "@/assets/product-usb.jpg";
import notebooksImg from "@/assets/product-notebooks.jpg";
import xBannerImg from "@/assets/product-x-banner.jpg";
import rollupBannerImg from "@/assets/product-rollup-banner.jpg";

// Per-pen product images (CDN-hosted via lovable-assets).
import penCountertop from "@/assets/images/pens/countertop-secure-desk.png.asset.json";
import penExecutive from "@/assets/images/pens/executive-matte-stylus.png.asset.json";
import penSyringe from "@/assets/images/pens/medical-syringe.png.asset.json";
import penBone from "@/assets/images/pens/bone.png.asset.json";
import penMinimalist from "@/assets/images/pens/minimalist.png.asset.json";
import penTechStylus from "@/assets/images/pens/tech-stylus.png.asset.json";
import penEliteGift from "@/assets/images/pens/elite-gift.jpg.asset.json";

// Pen slug → dedicated image URL. Add new pens here.
export const PEN_IMAGES: Record<string, string> = {
  "countertop-secure-desk": penCountertop.url,
  "executive-matte-stylus": penExecutive.url,
  "medical-syringe": penSyringe.url,
  "bone": penBone.url,
  "minimalist": penMinimalist.url,
  "tech-stylus": penTechStylus.url,
  "elite-gift": penEliteGift.url,
};

export type Product = {
  slug: string;
  name: string;
  moq: number;
  image: string;
};

export type CategorySlug = "pens" | "usb" | "notebooks" | "xbanner" | "rollup";

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
      { slug: "countertop-secure-desk", name: "Countertop Secure Desk Pen", moq: 50, image: PEN_IMAGES["countertop-secure-desk"] },
      { slug: "executive-matte-stylus", name: "Executive Matte Stylus", moq: 100, image: PEN_IMAGES["executive-matte-stylus"] },
      { slug: "medical-syringe", name: "Medical Syringe", moq: 200, image: PEN_IMAGES["medical-syringe"] },
      { slug: "bone", name: "Bone Pen", moq: 100, image: PEN_IMAGES["bone"] },
      { slug: "minimalist", name: "Minimalist", moq: 100, image: PEN_IMAGES["minimalist"] },
      { slug: "tech-stylus", name: "Tech Stylus", moq: 100, image: PEN_IMAGES["tech-stylus"] },
      { slug: "elite-gift", name: "Elite Gift", moq: 50, image: PEN_IMAGES["elite-gift"] },
    ],
  },
  {
    slug: "usb",
    name: "USB Flash",
    blurb: "Metal, card and wood USB drives.",
    image: usbImg,
    products: [
      { slug: "metal", name: "Metal USB", moq: 50, image: usbImg },
      { slug: "card", name: "Card USB", moq: 100, image: usbImg },
      { slug: "wood", name: "Wood USB", moq: 50, image: usbImg },
    ],
  },
  {
    slug: "notebooks",
    name: "Notebooks",
    blurb: "PU, spiral and executive notebooks.",
    image: notebooksImg,
    products: [
      { slug: "pu", name: "PU Notebook", moq: 50, image: notebooksImg },
      { slug: "spiral", name: "Spiral Notebook", moq: 50, image: notebooksImg },
      { slug: "executive", name: "Executive Notebook", moq: 50, image: notebooksImg },
    ],
  },
  {
    slug: "xbanner",
    name: "X-Banner",
    blurb: "Foldable X-frame banners for events and storefronts.",
    image: xBannerImg,
    products: [
      { slug: "x-banner", name: "X-Banner", moq: 1, image: xBannerImg },
    ],
  },
  {
    slug: "rollup",
    name: "Roll-Up Banner",
    blurb: "Retractable roll-up stands for trade shows and pop-ups.",
    image: rollupBannerImg,
    products: [
      { slug: "rollup-banner", name: "Roll-Up Banner", moq: 1, image: rollupBannerImg },
    ],
  },
];

export function getCategory(slug: CategorySlug): Category {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

// Back-compat for any lingering imports
export const PENS = CATEGORIES[0].products;
export type Pen = Product;

/**
 * Resolve a product image. Prefers the matched product's own `image`;
 * falls back to the category's bundled image.
 */
export function productImageUrl(category: CategorySlug, slug?: string): string {
  const cat = getCategory(category);
  if (!slug) return cat.image;
  return cat.products.find((p) => p.slug === slug)?.image ?? cat.image;
}
