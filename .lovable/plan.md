
# Urgent Advertising — Premium Landing Rebuild

A single-page, conversion-focused landing experience. No ecommerce, no checkout, no multi-page nav. All product imagery is sourced from Supabase Storage — we ship with **placeholder slots only** until you upload real assets.

## Scope (this build)

- Single-page landing at `/` (TanStack route).
- Supabase Cloud enabled with schema + storage buckets.
- Logo upload + client-side background removal (no AI cost, instant).
- Pseudo-3D visualizer (CSS transforms, no Three.js/WebGL).
- WhatsApp quote handoff to **+20 100 8333287**.
- Admin panel deferred — manage data via Supabase dashboard for now.

## Page sections (top → bottom)

1. **Sticky nav** — Urgent logo (uploaded white SVG), anchor links, "Contact Sales" CTA.
2. **Hero** — Headline "See Your Brand Printed Before You Order" + sub + two CTAs. Background: floating product cards with purple glow, mouse-parallax pseudo-depth.
3. **Product categories** — 5 glass cards: Pens, Mugs, USB, Notebook, T-shirts. Each links to its anchor section.
4. **Pens showcase** — 7 variant cards (Countertop Secure Desk, Executive Matte Stylus, Medical Syringe, Anatomical Bone, Sleek Minimalist, Ergonomic Tech, Elite Multi-Texture). Image / description / MOQ / "View details".
5. **Visualizer** — Tabs: "Upload logo" / "Try preset designs". Three-layer compositor (product → logo → gloss). Drag, resize, clamp to print area.
6. **Color system** — Pick body color; preserves metal/wood/gloss via masked recolor (CSS blend on uploaded mask image — no recolor without mask).
7. **Pseudo-3D + multi-angle** — Spring-tilt on hover/touch (rotateX ≤8°, rotateY ≤12°, scale 1→1.05, dynamic shadow, gloss sweep). If 4 angle images exist, cross-fade by cursor X; otherwise transform-only.
8. **Configuration + live price** — Category → product → color → quantity → unit price / total in **EGP**, pulled from `prices` table.
9. **Social proof** — Client logos carousel + project highlights (placeholder slots).
10. **Final CTA** — "Ready to print your brand?" → "Get Quote on WhatsApp" deep link with prefilled message (category, product, color, qty, design ref, price).
11. **Footer** — minimal.
12. **Mobile** — sticky bottom CTA, sticky preview, 4-step stepper (Choose / Customize / Preview / Quote).

## Brand system

- Tokens in `src/styles.css` (oklch):
  - `--background` #0D1146, `--primary` #7300E6, `--primary-glow` #6200EE, `--accent` #A1C900, `--foreground` #FFFFFF, `--muted-foreground` #E0E0E0.
  - Gradients: `--gradient-primary` (purple → purple-glow), `--gradient-hero` (navy → purple glow).
  - Shadows: `--shadow-glow` (purple), `--shadow-glass`.
- Fonts: Poppins (primary), Montserrat (secondary) via Google Fonts.
- Style: glassmorphism cards (`backdrop-blur`, translucent white border), geometric, smooth purple glows.

## Supabase

Enable Lovable Cloud, then create:

### Tables
- `categories` — id, slug, name, sort_order
- `products` — id, category_id → categories, slug, name, description, moq, base_image_url, mask_image_url, print_area (jsonb: x,y,w,h)
- `variants` — id, product_id, name, description, moq, image_url (per-pen variant)
- `colors` — id, product_id, name, hex, swatch_url
- `prices` — id, product_id, min_qty, max_qty, unit_price_egp, currency default 'EGP'
- `preset_designs` — id, name, image_url, category
- `leads` — id, created_at, name, phone, category, product_id, color_id, quantity, design_url, total_egp, source

### Storage buckets (public read)
- `products/` with subfolders: `pens/{countertop-secure-desk, executive-matte-stylus, medical-syringe, anatomical-bone, sleek-minimalist, ergonomic-tech, elite-multi-texture}/`, `mugs/`, `usb/`, `notebooks/`, `tshirts/`
- `presets/`, `logos/` (user uploads), `client-logos/`

### RLS
- Public read on catalog tables (categories, products, variants, colors, prices, preset_designs).
- `leads` insert-only from anon (no select).

### Placeholder strategy
Until you upload real photos, every `image_url` points to a Supabase placeholder (uniform branded SVG with product name overlay) hosted in the same buckets. UI never falls back to stock photos or AI-generated images.

## Logo extraction (client-side)

- Accept PNG, JPG, screenshot, business card.
- Canvas pipeline: load → detect dominant edge background color → flood-fill alpha removal with tolerance → trim transparent borders → re-center.
- States: "Extracting logo…" spinner, then preview with **Keep original / Extract logo / Retry extraction** buttons.
- Output: transparent PNG dataURL passed to visualizer layer 2.
- Zero server cost, instant. (Can upgrade to AI later if needed.)

## Visualizer technical

- Three absolutely-positioned layers inside a print-area-clamped container.
- Logo layer: pointer drag + corner resize handle, clamped to `print_area` jsonb from product row.
- Pseudo-3D: framer-motion spring on parent; mouse position → rotateX/Y; child gloss layer translates inverse for parallax.
- Multi-angle: if product has 2–4 angle images, cursor-X maps to a cross-fade index; otherwise pure transform.

## WhatsApp handoff

`https://wa.me/201008333287?text=` + URL-encoded summary built from current selection state. No backend send — opens in new tab. Lead also inserted into `leads` table on click.

## Tech / files

```text
src/
  routes/
    __root.tsx        (fonts, providers, head)
    index.tsx         (the landing — composes sections)
  components/landing/
    Nav.tsx
    Hero.tsx
    Categories.tsx
    PensShowcase.tsx
    Visualizer/
      index.tsx
      LogoUpload.tsx
      Pseudo3D.tsx
      ColorPicker.tsx
      PresetTabs.tsx
    Configurator.tsx
    LivePrice.tsx
    SocialProof.tsx
    FinalCTA.tsx
    MobileSticky.tsx
  lib/
    logo-extract.ts   (canvas bg removal)
    whatsapp.ts       (message builder)
    catalog.functions.ts  (createServerFn reads via supabaseAdmin for public catalog)
  integrations/supabase/...  (auto)
  assets/
    logo-urgent.svg   (your uploaded white logo)
  styles.css          (rebuilt tokens)
```

## Out of scope (this turn)
- Admin panel UI (use Supabase dashboard).
- AI logo extraction.
- Three.js / real 3D.
- Multi-page routing.
- Payment / checkout.

## What you'll need to do after I ship
1. Upload real product photos to the named Supabase Storage paths (UI auto-picks them up — no code changes).
2. Optionally upload color-mask images per product so the color picker can recolor only the body.
3. Insert real prices / MOQs into the `prices` and `products` tables (or wait for admin panel in a follow-up).
