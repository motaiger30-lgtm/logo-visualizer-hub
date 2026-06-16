import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Loader2, ImageIcon, MessageCircle, RotateCcw, Wand2, Sparkles } from "lucide-react";
import { PRODUCTS, Product, ProductSlug, ProductVariant, PrintArea, getProduct } from "@/lib/catalog";
import { extractLogo, fileToDataURL } from "@/lib/logo-extract";
import urgentLogo1 from "@/assets/urgent-logo-1.png";
import urgentLogo2 from "@/assets/urgent-logo-2.png";
import urgentLogo3 from "@/assets/urgent-logo-3.png";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

const URGENT_PRESETS = [
  { name: "Heritage", src: urgentLogo1, bg: "bg-white" },
  { name: "Navy", src: urgentLogo2, bg: "bg-white" },
  { name: "White", src: urgentLogo3, bg: "bg-[#0D1146]" },
];

const COLORS = [
  { name: "Midnight", hex: "#0D1146" },
  { name: "Purple", hex: "#7300E6" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#0a0a0a" },
  { name: "Lime", hex: "#A1C900" },
];

const TIERS = [
  { min: 1, max: 99, unit: 22 },
  { min: 100, max: 249, unit: 18 },
  { min: 250, max: 499, unit: 15 },
  { min: 500, max: 999, unit: 12 },
  { min: 1000, max: 99999, unit: 9.5 },
];

export function UniversalVisualizer() {
  const [productSlug, setProductSlug] = useState<ProductSlug>("pens");
  const product = getProduct(productSlug);
  const [variantId, setVariantId] = useState<string>(product.variants?.[0]?.id ?? "");
  const variant = product.variants?.find((v) => v.id === variantId) ?? product.variants?.[0];
  const activeImage = variant?.image ?? product.image;
  const activeArea: PrintArea = variant?.printArea ?? product.printArea;

  const [color, setColor] = useState(COLORS[1]);
  const [qty, setQty] = useState(100);

  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [, setOriginalSrc] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractStage, setExtractStage] = useState<string>("Extracting logo…");
  const [logoScale, setLogoScale] = useState(1);
  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset variant when product changes
  useEffect(() => {
    setVariantId(product.variants?.[0]?.id ?? "");
  }, [productSlug, product.variants]);

  // Reset logo placement when product OR variant changes
  useEffect(() => {
    setLogoX(0); setLogoY(0); setLogoScale(1);
  }, [productSlug, variantId]);

  // Listen for external product selection from Categories section
  useEffect(() => {
    const onPick = (e: Event) => {
      const detail = (e as CustomEvent<{ product: ProductSlug }>).detail;
      if (detail?.product) {
        setProductSlug(detail.product);
        document.getElementById("designer")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("urgent:set-product", onPick);
    return () => window.removeEventListener("urgent:set-product", onPick);
  }, []);

  const tier = useMemo(() => TIERS.find((t) => qty >= t.min && qty <= t.max) ?? TIERS[TIERS.length - 1], [qty]);
  const total = tier.unit * qty;

  const runExtract = async (file: File | Blob) => {
    setExtracting(true);
    setExtractStage("Extracting logo…");
    setLogoX(0); setLogoY(0); setLogoScale(1);
    try {
      const orig = await fileToDataURL(file);
      setOriginalSrc(orig);
      const extracted = await extractLogo(file, (s) => setExtractStage(s));
      setLogoSrc(extracted);
    } catch {
      const fallback = await fileToDataURL(file);
      setLogoSrc(fallback);
    } finally {
      setExtracting(false);
    }
  };

  const retry = async () => {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    await runExtract(f);
  };

  const useUrgentPreset = async (src: string) => {
    setExtracting(true);
    setExtractStage("Optimizing preview…");
    setLogoX(0); setLogoY(0); setLogoScale(1);
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const extracted = await extractLogo(blob, (s) => setExtractStage(s));
      setOriginalSrc(src);
      setLogoSrc(extracted);
    } catch {
      setLogoSrc(src);
    } finally {
      setExtracting(false);
    }
  };

  const handleQuote = () => {
    const productName = variant ? `${product.name} — ${variant.name}` : product.name;
    const url = buildWhatsAppUrl({
      category: product.name,
      product: productName,
      color: product.supportsColor ? color.name : "—",
      quantity: qty,
      unitPriceEgp: tier.unit,
      totalEgp: total,
    });
    supabase.from("leads").insert({
      category: product.name,
      quantity: qty,
      total_egp: total,
      source: "whatsapp",
    }).then(() => {});
    window.open(url, "_blank");
  };

  return (
    <section id="designer" className="relative py-24 sm:py-32 border-t border-border">
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Universal Visualizer</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">
            Pick. Customize. Quote.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a product, pick a style, drop your logo — and watch it land on the real surface in real time.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6">
          <Preview
            image={activeImage}
            label={variant?.name ?? product.name}
            ratio={product.aspect}
            colorHex={product.supportsColor ? color.hex : "#0D1146"}
            logoSrc={logoSrc}
            logoScale={logoScale}
            logoX={logoX} logoY={logoY}
            setLogoX={setLogoX} setLogoY={setLogoY}
            area={activeArea}
          />

          <div className="glass-strong rounded-3xl p-5 space-y-6">
            <Step n={1} label="Category">
              <div className="flex flex-wrap gap-1.5">
                {PRODUCTS.map((p) => (
                  <Chip key={p.slug} active={productSlug === p.slug} onClick={() => setProductSlug(p.slug)}>
                    {p.name}
                  </Chip>
                ))}
              </div>
            </Step>

            {product.variants && product.variants.length > 0 && (
              <Step n={2} label={`Pen type (${product.variants.length})`}>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(v.id)}
                      className={cn(
                        "group relative flex items-center gap-2 rounded-xl border p-2 text-left transition-all",
                        variantId === v.id
                          ? "border-accent bg-white/10 shadow-glow-soft"
                          : "border-white/10 hover:border-white/25 hover:bg-white/5",
                      )}
                    >
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                        <img src={v.image} alt={v.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-semibold text-foreground leading-tight">
                          {v.name}
                        </p>
                        {v.placeholder && (
                          <p className="text-[9px] uppercase tracking-wider text-muted-foreground">studio mock</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Step>
            )}

            {product.supportsColor ? (
              <Step n={product.variants ? 3 : 2} label="Color">
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColor(c)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        color.hex === c.hex
                          ? "border-accent bg-white/5 text-foreground"
                          : "border-white/10 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span className="h-4 w-4 rounded-full border border-white/20" style={{ background: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </Step>
            ) : (
              <Step n={2} label="Print">
                <p className="text-[11px] text-muted-foreground">
                  Banners are full-color printed from your artwork — no base color selection needed.
                </p>
              </Step>
            )}

            <Step n={product.variants ? 4 : 3} label="Quantity (min 1)">
              <div className="flex items-center gap-3">
                <input
                  type="range" min={1} max={10000} step={1}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="flex-1 accent-[color:var(--primary)]"
                />
                <input
                  type="number"
                  value={qty}
                  min={1}
                  max={10000}
                  onChange={(e) => setQty(Math.min(10000, Math.max(1, Number(e.target.value))))}
                  className="w-20 rounded-lg glass px-2.5 py-2 text-sm text-foreground"
                />
              </div>
            </Step>

            <Step n={product.variants ? 5 : 4} label="Logo">
              <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 px-4 py-5 text-center hover:border-primary hover:bg-primary/5 transition-all">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && runExtract(e.target.files[0])}
                />
                {extracting ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-xs">{extractStage}</span>
                  </div>
                ) : logoSrc ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={logoSrc} alt="logo" className="max-h-12 max-w-[120px]" />
                    <span className="text-xs text-muted-foreground">Tap to replace</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Upload your logo</span>
                    <span className="text-[11px]">PNG, JPG, screenshot — background auto-removed</span>
                  </div>
                )}
              </label>
              {logoSrc && (
                <div className="mt-3 space-y-2">
                  <input
                    type="range" min={0.3} max={2} step={0.05}
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full accent-[color:var(--primary)]"
                  />
                  <button
                    onClick={retry}
                    className="w-full flex items-center justify-center gap-1 rounded-full glass px-3 py-1.5 text-[11px] font-semibold hover:bg-white/10 transition"
                  >
                    <RotateCcw className="h-3 w-3" /> Re-extract background
                  </button>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                    No logo? Try with Urgent
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {URGENT_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => useUrgentPreset(p.src)}
                      className={cn(
                        "group rounded-xl p-2 aspect-square flex items-center justify-center transition shadow-sm hover:shadow-glow-soft",
                        p.bg,
                      )}
                      title={`Urgent ${p.name}`}
                    >
                      <img src={p.src} alt={`Urgent ${p.name}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            </Step>

            <div className="rounded-2xl glass p-4 space-y-3">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold text-gradient">
                    {total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    <span className="text-base text-muted-foreground ml-1">EGP</span>
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground">{tier.unit.toFixed(2)} EGP / unit</p>
              </div>
              <button
                onClick={handleQuote}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-5 py-3 text-sm font-bold shadow-glow hover:brightness-95 transition"
              >
                <MessageCircle className="h-4 w-4" />
                Get Quote on WhatsApp
              </button>
            </div>

            <div className="rounded-xl glass p-3 flex items-start gap-2 text-[11px] text-muted-foreground">
              <Wand2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
              <p>Production matches your preview exactly. Volume discounts auto-apply.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Preview({
  image, label, ratio, colorHex,
  logoSrc, logoScale, logoX, logoY, setLogoX, setLogoY, area,
}: {
  image: string;
  label: string;
  ratio: "tall" | "wide";
  colorHex: string;
  logoSrc: string | null;
  logoScale: number;
  logoX: number; logoY: number;
  setLogoX: (v: number) => void; setLogoY: (v: number) => void;
  area: PrintArea;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 18 });
  const sy = useSpring(my, { stiffness: 100, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotX = useTransform(sy, [-1, 1], [5, -5]);
  const glossX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const gloss = useTransform(glossX, (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) ${v}, transparent 70%)`);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ px: number; py: number; lx: number; ly: number } | null>(null);
  const onLogoDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStart.current = { px: e.clientX, py: e.clientY, lx: logoX, ly: logoY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onLogoMove = (e: React.PointerEvent) => {
    if (!dragging || !dragStart.current || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - dragStart.current.px) / r.width;
    const dy = (e.clientY - dragStart.current.py) / r.height;
    setLogoX(Math.max(-0.45, Math.min(0.45, dragStart.current.lx + dx)));
    setLogoY(Math.max(-0.45, Math.min(0.45, dragStart.current.ly + dy)));
  };
  const onLogoUp = () => setDragging(false);

  const blend = area.blend ?? "normal";
  const rotate = area.rotate ?? 0;

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
        className="relative aspect-[4/5] sm:aspect-[5/4] rounded-3xl glass-strong overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-20 transition-colors duration-500"
          style={{ background: `radial-gradient(circle at 50% 40%, ${colorHex}, transparent 60%)` }}
        />
        <div className="absolute inset-4 sm:inset-6 flex items-center justify-center">
          <ProductImage
            src={image}
            label={label}
            ratio={ratio}
            className="w-full max-w-xl"
          />
        </div>

        {logoSrc && (
          <div
            onPointerDown={onLogoDown}
            onPointerMove={onLogoMove}
            onPointerUp={onLogoUp}
            onPointerCancel={onLogoUp}
            className={cn(
              "absolute left-1/2 top-1/2 z-10 cursor-grab select-none touch-none",
              dragging && "cursor-grabbing",
            )}
            style={{
              transform: `translate(calc(-50% + ${(area.x + logoX) * 100}%), calc(-50% + ${(area.y + logoY) * 100}%)) scale(${logoScale}) rotate(${rotate}deg)`,
              mixBlendMode: blend,
            }}
          >
            <img
              src={logoSrc}
              alt="Your logo"
              draggable={false}
              style={{
                maxWidth: area.maxLogoPx,
                maxHeight: area.maxLogoPx * 0.7,
                filter: blend === "multiply" ? "contrast(1.05) saturate(1.1)" : undefined,
              }}
              className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
            />
          </div>
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
          style={{ background: gloss }}
        />

        {/* Per-product print-area guide */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[5] rounded-md border border-dashed border-accent/40"
          style={{
            width: `${area.w * 100}%`,
            height: `${area.h * 100}%`,
            transform: `translate(calc(-50% + ${area.x * 100}%), calc(-50% + ${area.y * 100}%)) rotate(${rotate}deg)`,
          }}
        />
      </motion.div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Hover for 3D · drag the logo to position · dashed box = printable area
      </p>
    </div>
  );
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground shadow-glow-soft">{n}</span>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{label}</h4>
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all",
        active
          ? "bg-gradient-primary text-primary-foreground shadow-glow-soft"
          : "glass text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
