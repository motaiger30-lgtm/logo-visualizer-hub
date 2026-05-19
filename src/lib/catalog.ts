// Static placeholder catalog — no real product photos until user uploads to Supabase Storage.
// Once products/pens/<slug>/main.png exists in the products bucket, the UI auto-resolves it.

import { supabase } from "@/integrations/supabase/client";

export type Pen = {
  slug: string;
  name: string;
  description: string;
  moq: number;
};

export const PENS: Pen[] = [
  { slug: "countertop-secure-desk", name: "Countertop Secure Desk Pen", description: "Anchored desk pen with secure base for clinics, banks and reception areas.", moq: 50 },
  { slug: "executive-matte-stylus", name: "Executive Matte Stylus Pen", description: "Premium matte body with stylus tip — perfect for executive gifting.", moq: 100 },
  { slug: "medical-syringe", name: "Medical Novelty Syringe Pen", description: "Liquid-filled syringe-style pen for pharma and medical campaigns.", moq: 200 },
  { slug: "anatomical-bone", name: "Anatomical Bone Novelty Pen", description: "Conversation-starter bone-shaped pen for orthopedic clinics.", moq: 100 },
  { slug: "sleek-minimalist", name: "Sleek Minimalist Corporate Pen", description: "Slim, geometric pen with a refined corporate finish.", moq: 100 },
  { slug: "ergonomic-tech", name: "Ergonomic Tech Stylus Pen", description: "Soft-grip ergonomic body with capacitive stylus tip.", moq: 100 },
  { slug: "elite-multi-texture", name: "Elite Multi Texture Gift Pen", description: "Bamboo, metal and matte composite — high-end gift packaging ready.", moq: 50 },
];

export type Category = {
  slug: string;
  name: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  { slug: "pens", name: "Promotional Pens", blurb: "7 premium variants — executive, medical, novelty." },
  { slug: "mugs", name: "Mugs", blurb: "Ceramic, matte and color-changing options." },
  { slug: "usb", name: "USB Flash", blurb: "Custom-shaped USB drives, 8GB–64GB." },
  { slug: "notebooks", name: "Notebooks", blurb: "Hardcover, soft-touch and eco kraft." },
  { slug: "banners", name: "Banners", blurb: "Roll-ups, vinyl and outdoor mesh banners." },
];

/** Resolve a Supabase Storage URL for a product image. Returns null if not uploaded. */
export function productImageUrl(folder: string, slug: string, file = "main.png") {
  return supabase.storage.from("products").getPublicUrl(`${folder}/${slug}/${file}`).data.publicUrl;
}

/** Check if an image actually exists (HEAD request). Used to fall back to branded placeholder. */
export async function imageExists(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: "HEAD" });
    return r.ok;
  } catch {
    return false;
  }
}
