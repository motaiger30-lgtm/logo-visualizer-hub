
## Goal

Cut the catalog to exactly **5 products**, load each product image from the external Supabase project `mvveblnncwjjenwvsebs` (public `products` bucket), and make the logo visualizer respect a **product-specific print area** (so the logo on a pen barrel is small/centered, while on an X-banner it sits in the upper third with a large area).

---

## File naming you'll upload to the `products` bucket

Upload exactly these 5 files (PNG, transparent or white bg). Once uploaded they auto-appear — no code change needed:

```
products/pens.png
products/notebook.png
products/flashcard.png
products/rollup.png
products/xbanner.png
```

Public URL pattern used by the app:
`https://mvveblnncwjjenwvsebs.supabase.co/storage/v1/object/public/products/<file>.png`

(If you later want multiple pen variants, we can switch pens to `products/pens/<variant>.png` — for now: one image per product.)

---

## Changes

### 1. `src/lib/catalog.ts` — rewrite to 5 products
Replace all categories with a flat list of 5 products. Each entry carries its own `printArea` (relative coords inside the preview frame):

```text
Product       | Image file       | Aspect | Print area (x, y, w, h, max logo)
--------------|------------------|--------|----------------------------------
Pens          | pens.png         | tall   | centered narrow strip on barrel
Notebook      | notebook.png     | wide   | center of cover, medium
Flash Card    | flashcard.png    | wide   | upper-center, small
Roll-up       | rollup.png       | tall   | upper third, large
X-Banner      | xbanner.png      | tall   | upper third, large
```

Also add a `productImageUrl(slug)` helper that builds the external Supabase URL above (no longer uses the current project's `supabase.storage`).

### 2. `src/components/landing/UniversalVisualizer.tsx`
- Drop the **Category → Product** two-step flow. Replace with a single **Product** chip row (5 items).
- Replace the color list to keep current 6 colors but hide it for `rollup` / `xbanner` (banners use the printed artwork, not a base color) — show a subtle note instead.
- Read `product.printArea` and pass it to `<Preview>` so:
  - Dashed guide rectangle is positioned/sized per product.
  - Logo initial scale + max bounds derive from `printArea` (pen ≈ 90px wide, banner ≈ 320px wide).
- Keep: logo upload + auto bg-removal, Urgent preset logos, drag-to-position, WhatsApp CTA, quantity 100–10000, tiered pricing.

### 3. `src/components/landing/Categories.tsx`
Simplify to show the 5 products as cards (no category grouping). Clicking a card scrolls to the visualizer and selects that product (reuse the existing `urgent:set-category` event, renamed to `urgent:set-product`).

### 4. `src/routes/index.tsx`
No structural change — same section order (Hero → Products → Visualizer → Pricing → Social proof → CTA). Just confirms the new Categories/Visualizer wiring.

### 5. Hero copy
Tighten the headline subline to mention the 5 products explicitly ("Pens, Notebooks, Flash Drives, Roll-ups, X-Banners").

---

## Technical notes

- No second `createClient` needed — external images are loaded as plain `<img src>` from the public bucket URL, which is allowed by Supabase storage CORS for public buckets.
- `print_area` lives in code (not DB) for now: `{ x, y, w, h, maxLogoPx }` in relative units (0–1) inside the preview frame.
- If any of the 5 files are missing in your bucket the `<ProductImage>` fallback already shows a labeled placeholder, so nothing breaks before you upload.
- The existing `products` Supabase bucket on **this** project becomes unused for product images (kept for future use, no deletion).

---

## Out of scope (ask if you want them)
- Multiple pen variants/colors on real photos.
- 3D-baked mockups per product.
- Admin UI to edit print areas.

Reply **Approve** to implement, or tell me what to adjust (e.g. different print-area sizes, keep category flow, add pen variants).
