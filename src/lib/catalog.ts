// Flat catalog of 5 products. Images are bundled locally — derived from
// uploaded source material (or generated placeholders for categories the
// user hasn't supplied source images for yet).

import pensImg from "@/assets/products/pens.jpg";
import notebookImg from "@/assets/products/notebook.jpg";
import flashcardImg from "@/assets/products/flashcard.jpg";
import rollupImg from "@/assets/products/rollup.jpg";
import xbannerImg from "@/assets/products/xbanner.jpg";

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
  /** Bundled image URL (Vite import) */
  image: string;
  aspect: "tall" | "wide";
  /** if false, hide color picker (banners etc.) */
  supportsColor: boolean;
  /** true = generic stock/AI shot, false = derived from user-uploaded source */
  placeholder: boolean;
  printArea: PrintArea;
};

export const PRODUCTS: Product[] = [
  {
    slug: "pens",
    name: "Promotional Pens",
    blurb: "Executive, metal, wood and stylus pens — pad-printed or laser-engraved barrel.",
    moq: 100,
    image: pensImg,
    aspect: "wide",
    supportsColor: true,
    placeholder: false,
    printArea: { x: 0.05, y: 0.05, w: 0.25, h: 0.06, maxLogoPx: 90 },
  },
  {
    slug: "notebook",
    name: "Notebooks",
    blurb: "PU, spiral and executive notebooks — debossed or printed cover.",
    moq: 50,
    image: notebookImg,
    aspect: "wide",
    supportsColor: true,
    placeholder: false,
    printArea: { x: -0.02, y: -0.05, w: 0.28, h: 0.22, maxLogoPx: 160 },
  },
  {
    slug: "flashcard",
    name: "Flash Drives",
    blurb: "Metal, card and wood USB flash drives — laser engraved.",
    moq: 50,
    image: flashcardImg,
    aspect: "wide",
    supportsColor: true,
    placeholder: true,
    printArea: { x: 0, y: -0.02, w: 0.22, h: 0.07, maxLogoPx: 110 },
  },
  {
    slug: "rollup",
    name: "Roll-up Banner",
    blurb: "85×200cm retractable banner with aluminum base.",
    moq: 1,
    image: rollupImg,
    aspect: "tall",
    supportsColor: false,
    placeholder: true,
    printArea: { x: 0, y: -0.1, w: 0.45, h: 0.4, maxLogoPx: 240 },
  },
  {
    slug: "xbanner",
    name: "X-Banner",
    blurb: "60×160cm portable X-stand banner — event ready.",
    moq: 1,
    image: xbannerImg,
    aspect: "tall",
    supportsColor: false,
    placeholder: true,
    printArea: { x: 0, y: -0.05, w: 0.5, h: 0.45, maxLogoPx: 240 },
  },
];

export function getProduct(slug: ProductSlug): Product {
  return PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];
}
