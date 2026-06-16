## Goal

Stop fetching product images from the external Supabase `products` bucket. Use the 7 uploaded promo images as the source of truth, AI-clean them into mockup-ready product shots, and bundle them as local assets imported by the visualizer.

## What the uploads actually contain

After inspecting all 7 attachments:
- **Pens** — covered heavily: classic plastic pen on stand (1.jpg), white capped pens (2.jpg), bone/anatomy novelty pens (3.jpg), mixed executive/wood/metal pen tray (4.jpg), colored medical pens (5.jpg, 7.jpg).
- **Notebook** — covered: PU notebook with elastic strap on desk (1.jpg, 686191406…jpg — the "YOUR LOGO" mockup is the cleanest reference).
- **Flash drive, Roll-up banner, X-Banner** — NOT present in any upload → fallback placeholder.

Every promo image has heavy Arabic text overlays, the Urgent logo, and phone-number badges that must be removed before the image can be used as a product shot.

## Plan

### 1. Generate clean product assets from uploads (via `imagegen--edit_image`)

For each needed product, run an AI edit on the best source upload to:
- remove all text overlays, badges, logos, arrows
- isolate the product centered on a soft neutral desk/studio background
- keep the product photographic and mockup-ready (logo will be overlaid later)

Outputs (saved as local files, imported directly — no CDN, no Supabase):
- `src/assets/products/pens.jpg` ← edited from `user-uploads://4.jpg` (richest pen variety)
- `src/assets/products/notebook.jpg` ← edited from `user-uploads://686191406_…jpg` (cleanest notebook mockup, with the "YOUR LOGO" graphic removed)

### 2. Generate placeholders for missing categories

No uploads cover these — generate neutral mockup shots with `imagegen--generate_image`:
- `src/assets/products/flashcard.jpg` — metal USB flash drive on desk
- `src/assets/products/rollup.jpg` — blank retractable roll-up banner, studio
- `src/assets/products/xbanner.jpg` — blank X-stand banner, studio

These are clearly flagged in `catalog.ts` as `placeholder: true` so they can be swapped later when the user uploads real shots.

### 3. Rewire the catalog to local imports

`src/lib/catalog.ts`:
- Delete `EXTERNAL_PRODUCTS_URL` and `productImageUrl()`.
- Replace each product's `file: string` with `image: <imported asset URL>` using ES imports of the 5 files above.
- Keep all other fields (slug, name, blurb, moq, aspect, supportsColor, printArea) unchanged so the visualizer keeps its per-product logo placement logic.

### 4. Update the visualizer to use the local image

`src/components/landing/UniversalVisualizer.tsx`:
- Drop the `productImageUrl(product.file)` call.
- Pass `product.image` straight into `<ProductImage src={product.image} … />`.
- No other UI changes — chips, color picker gating, print-area dashed box, logo drag, quantity 1–10000, tiered pricing, WhatsApp CTA all stay identical.

### 5. Categories grid

`src/components/landing/Categories.tsx`: same change — read `product.image` instead of `productImageUrl(...)`.

### 6. Cleanup

- Remove now-unused `productImageUrl` export.
- Keep `ProductImage.tsx` as-is (it already accepts any `src`).
- No Supabase client changes — the `supabase` import in the visualizer is still used to log leads.

## Result

Site renders product cards and the visualizer preview entirely from local bundled images. Pens and Notebook are derived from the user's real uploads (text removed, isolated). Flash drive / Roll-up / X-Banner show neutral placeholders until the user uploads real source images, at which point we re-run step 1 for those slugs.
