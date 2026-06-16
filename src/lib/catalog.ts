// Flat catalog. Pens is a category with 7 isolated sub-products (variants);
// the others are standalone. All images are bundled locally, derived from
// uploaded source material (with a couple of clean studio placeholders
// where no source existed).

import notebookImg from "@/assets/products/notebook.jpg";
import flashcardImg from "@/assets/products/flashcard.jpg";
import rollupImg from "@/assets/products/rollup.jpg";
import xbannerImg from "@/assets/products/xbanner.jpg";

import penDesk from "@/assets/products/pens/desk.jpg";
import penExec from "@/assets/products/pens/executive-stylus.jpg";
import penSyringe from "@/assets/products/pens/syringe.jpg";
import penBone from "@/assets/products/pens/bone.jpg";
import penMinimal from "@/assets/products/pens/minimalist.jpg";
import penErgo from "@/assets/products/pens/ergonomic.jpg";
import penGift from "@/assets/products/pens/multi-texture.jpg";

export type PrintArea = {
  /** center offset from preview center, relative 0..1 of frame size */
  x: number;
  y: number;
  /** size, relative 0..1 of frame size */
  w: number;
  h: number;
  /** max logo width in px at scale=1 */
  maxLogoPx: number;
  /** Optional subtle rotation in degrees to match product angle */
  rotate?: number;
  /** Blend mode for realistic printing on the surface */
  blend?: "normal" | "multiply" | "screen" | "overlay";
};

export type ProductSlug =
  | "pens"
  | "notebook"
  | "flashcard"
  | "rollup"
  | "xbanner";

export type ProductVariant = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  printArea: PrintArea;
  placeholder?: boolean;
};

export type Product = {
  slug: ProductSlug;
  name: string;
  blurb: string;
  moq: number;
  image: string;
  aspect: "tall" | "wide";
  supportsColor: boolean;
  placeholder: boolean;
  printArea: PrintArea;
  variants?: ProductVariant[];
};

// Pen variants — each one has its OWN print area calibrated to where the
// logo realistically lands on that specific pen body in the rendered photo.
const PEN_VARIANTS: ProductVariant[] = [
  {
    id: "executive-stylus",
    name: "Executive Matte Stylus Pen",
    blurb: "Silver-finish matte body with soft rubber grip and capacitive stylus tip.",
    image: penExec,
    printArea: { x: 0.12, y: 0.0, w: 0.22, h: 0.04, maxLogoPx: 95, rotate: -2, blend: "multiply" },
  },
  {
    id: "minimalist",
    name: "Sleek Minimalist Corporate Pen",
    blurb: "Crisp white barrel with colored accent clip — perfect for clean brand prints.",
    image: penMinimal,
    printArea: { x: 0.05, y: 0.05, w: 0.22, h: 0.04, maxLogoPx: 95, rotate: -3, blend: "multiply" },
  },
  {
    id: "ergonomic",
    name: "Ergonomic Tech Stylus Pen",
    blurb: "Contoured grip and stylus tip — built for daily writing and touchscreens.",
    image: penErgo,
    printArea: { x: 0.0, y: 0.05, w: 0.22, h: 0.04, maxLogoPx: 95, rotate: -2, blend: "multiply" },
  },
  {
    id: "multi-texture",
    name: "Elite Multi-Texture Gift Pen",
    blurb: "Bamboo barrel + gunmetal cap — a premium executive gift, laser-engraved.",
    image: penGift,
    printArea: { x: 0.0, y: 0.04, w: 0.2, h: 0.05, maxLogoPx: 90, rotate: -2, blend: "multiply" },
  },
  {
    id: "desk",
    name: "Countertop Secure Desk Pen",
    blurb: "Counter-mounted pen with coiled cable — ideal for receptions and clinics.",
    image: penDesk,
    printArea: { x: 0.02, y: 0.32, w: 0.18, h: 0.07, maxLogoPx: 110, blend: "screen" },
  },
  {
    id: "bone",
    name: "Anatomical Bone Novelty Pen",
    blurb: "Femur-shaped novelty pen — a memorable giveaway for medical and ortho brands.",
    image: penBone,
    printArea: { x: 0.18, y: 0.05, w: 0.16, h: 0.05, maxLogoPx: 80, rotate: -2, blend: "multiply" },
  },
  {
    id: "syringe",
    name: "Medical Novelty Syringe Pen",
    blurb: "Syringe-shaped pen — a fun, on-brand giveaway for clinics and pharma reps.",
    image: penSyringe,
    placeholder: true,
    printArea: { x: 0.05, y: 0.02, w: 0.2, h: 0.05, maxLogoPx: 90, blend: "multiply" },
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "pens",
    name: "Promotional Pens",
    blurb: "7 isolated pen styles — pad-print or laser-engrave a single logo on the barrel.",
    moq: 100,
    image: penExec,
    aspect: "wide",
    supportsColor: true,
    placeholder: false,
    printArea: PEN_VARIANTS[0].printArea,
    variants: PEN_VARIANTS,
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
    printArea: { x: 0.0, y: -0.05, w: 0.28, h: 0.22, maxLogoPx: 180, blend: "multiply" },
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
    printArea: { x: 0, y: -0.02, w: 0.22, h: 0.07, maxLogoPx: 110, blend: "multiply" },
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
    printArea: { x: 0, y: -0.1, w: 0.45, h: 0.4, maxLogoPx: 260, blend: "normal" },
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
    printArea: { x: 0, y: -0.05, w: 0.5, h: 0.45, maxLogoPx: 260, blend: "normal" },
  },
];

export function getProduct(slug: ProductSlug): Product {
  return PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];
}
