// Flat catalog of 5 products. Images are served from an external Supabase
// project's public `products` bucket. Drop these 5 files into that bucket
// and they auto-appear in the UI:
//   products/pens.png
//   products/notebook.png
//   products/flashcard.png
//   products/rollup.png
//   products/xbanner.png

const EXTERNAL_PRODUCTS_URL =
  "https://mvveblnncwjjenwvsebs.supabase.co/storage/v1/object/public/products";

export type PrintArea = {
  /** center offset from preview center, relative 0..1 of frame size */
  x: number;
  y: number;
  /** size, relative 0..1 of frame size */
  w: number;
  h: number;
  /** logo max width in px on screen at scale=1 */
  maxLogoPx: number;
};

export type ProductSlug =
  | "pens"
  | "notebook"
  | "flashcard"
  | "rollup"
  | "xbanner";

export type Product = {
  slug: ProductSlug;
  name: string;
  blurb: string;
  moq: number;
  /** filename inside the external `products` bucket */
  file: string;
  aspect: "tall" | "wide";
  /** if false, hide color picker (banners etc.) */
  supportsColor: boolean;
  printArea: PrintArea;
};

export const PRODUCTS: Product[] = [
  {
    slug: "pens",
    name: "Promotional Pens",
    blurb: "Executive, medical and stylus pens — pad-printed barrel.",
    moq: 100,
    file: "pens.png",
    aspect: "tall",
    supportsColor: true,
    printArea: { x: 0, y: 0.02, w: 0.35, h: 0.06, maxLogoPx: 110 },
  },
  {
    slug: "notebook",
    name: "Notebooks",
    blurb: "PU, spiral and executive notebooks — debossed or printed cover.",
    moq: 50,
    file: "notebook.png",
    aspect: "wide",
    supportsColor: true,
    printArea: { x: 0, y: 0, w: 0.45, h: 0.3, maxLogoPx: 180 },
  },
  {
    slug: "flashcard",
    name: "Flash Drives",
    blurb: "Metal, card and wood USB flash drives — laser engraved.",
    moq: 50,
    file: "flashcard.png",
    aspect: "wide",
    supportsColor: true,
    printArea: { x: 0, y: -0.05, w: 0.3, h: 0.1, maxLogoPx: 110 },
  },
  {
    slug: "rollup",
    name: "Roll-up Banner",
    blurb: "85×200cm retractable banner with aluminum base.",
    moq: 1,
    file: "rollup.png",
    aspect: "tall",
    supportsColor: false,
    printArea: { x: 0, y: -0.22, w: 0.55, h: 0.3, maxLogoPx: 280 },
  },
  {
    slug: "xbanner",
    name: "X-Banner",
    blurb: "60×160cm portable X-stand banner — event ready.",
    moq: 1,
    file: "xbanner.png",
    aspect: "tall",
    supportsColor: false,
    printArea: { x: 0, y: -0.22, w: 0.55, h: 0.3, maxLogoPx: 280 },
  },
];

export function getProduct(slug: ProductSlug): Product {
  return PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];
}

/** Public URL for a product image in the external `products` bucket. */
export function productImageUrl(file: string): string {
  return `${EXTERNAL_PRODUCTS_URL}/${file}`;
}
