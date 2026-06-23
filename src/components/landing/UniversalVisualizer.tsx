import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Upload, Loader2, ImageIcon, MessageCircle, RotateCcw, Wand2, Sparkles } from "lucide-react";
import { CATEGORIES, CategorySlug, getCategory, productImageUrl } from "@/lib/catalog";
import { extractLogo, fileToDataURL } from "@/lib/logo-extract";
import urgentLogo1 from "@/assets/urgent-logo-1.png";
import urgentLogo2 from "@/assets/urgent-logo-2.png";
import urgentLogo3 from "@/assets/urgent-logo-3.png";

const URGENT_PRESETS = [
  { name: "Heritage", src: urgentLogo1, bg: "bg-white" },
  { name: "Navy", src: urgentLogo2, bg: "bg-white" },
  { name: "White", src: urgentLogo3, bg: "bg-[#0D1146]" },
];
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Midnight", hex: "#0D1146" },
  { name: "Purple", hex: "#7300E6" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#0a0a0a" },
  { name: "Lime", hex: "#A1C900" },
];

const TIERS = [
  { min: 50, max: 99, unit: 22 },
  { min: 100, max: 249, unit: 18 },
  { min: 250, max: 499, unit: 15 },
  { min: 500, max: 999, unit: 12 },
  { min: 1000, max: 99999, unit: 9.5 },
];

export function UniversalVisualizer() {
  const [categorySlug, setCategorySlug] = useState<CategorySlug>("pens");
  const category = getCategory(categorySlug);
  const [productSlug, setProductSlug] = useState(category.products[0].slug);
  const product = category.products.find((p) => p.slug === productSlug) ?? category.products[0];
  const [color, setColor] = useState(COLORS[1]);
  const [qty, setQty] = useState(Math.max(100, product.moq));

  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Reset product when category changes & listen for external category events
  useEffect(() => {
    setProductSlug(category.products[0].slug);
    setQty((q) => Math.max(q, category.products[0].moq));
  }, [categorySlug]);

  useEffect(() => {
    const onPick = (e: Event) => {
      const detail = (e as CustomEvent<{ category: CategorySlug }>).detail;
      if (detail?.category) {
        setCategorySlug(detail.category);
        document.getElementById("designer")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("urgent:set-category", onPick);
    return () => window.removeEventListener("urgent:set-category", onPick);
  }, []);

  const tier = useMemo(() => TIERS.find((t) => qty >= t.min && qty <= t.max) ?? TIERS[TIERS.length - 1], [qty]);
  const total = tier.unit * qty;

  const handleFile = async (file: File) => {
    setExtracting(true);
    setLogoX(0); setLogoY(0); setLogoScale(1);
    try {
      const orig = await fileToDataURL(file);
      setOriginalSrc(orig);
      const extracted = await extractLogo(file);
      setLogoSrc(extracted);
    } catch {
      const fallback = await fileToDataURL(file);
      setLogoSrc(fallback);
    } finally {
      setExtracting(false);
    }
  };

  const retry = async () => {
    if (!fileRef.current?.files?.[0]) return;
    setExtracting(true);
    try {
      const extracted = await extractLogo(fileRef.current.files[0], 50);
      setLogoSrc(extracted);
    } finally {
      setExtracting(false);
    }
  };

  const handleQuote = () => {
    const url = buildWhatsAppUrl({
      category: category.name,
      product: product.name,
      color: color.name,
      quantity: qty,
      unitPriceEgp: tier.unit,
      totalEgp: total,
    });
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
            One designer for every product. Choose a category, pick a style, upload your logo and get a live EGP price.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-6">
          {/* Preview */}
          <Preview
            category={categorySlug}
            productSlug={product.slug}
            productLabel={product.name}
            colorHex={color.hex}
            logoSrc={logoSrc}
            logoScale={logoScale}
            logoX={logoX} logoY={logoY}
            setLogoX={setLogoX} setLogoY={setLogoY}
          />

          {/* Controls */}
          <div className="glass-strong rounded-3xl p-5 space-y-6">
            <Step n={1} label="Category">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <Chip key={c.slug} active={categorySlug === c.slug} onClick={() => setCategorySlug(c.slug)}>
                    {c.name}
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={2} label="Product">
              <div className="flex flex-wrap gap-1.5">
                {category.products.map((p) => (
                  <Chip key={p.slug} active={productSlug === p.slug} onClick={() => setProductSlug(p.slug)}>
                    {p.name}
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={3} label="Color">
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

            <Step n={4} label={`Quantity (MOQ ${product.moq})`}>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={product.moq} max={2000} step={10}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="flex-1 accent-[color:var(--primary)]"
                />
                <input
                  type="number"
                  value={qty}
                  min={product.moq}
                  onChange={(e) => setQty(Math.max(product.moq, Number(e.target.value)))}
                  className="w-20 rounded-lg glass px-2.5 py-2 text-sm text-foreground"
                />
              </div>
            </Step>

            <Step n={5} label="Logo">
              <label className="block cursor-pointer rounded-2xl border border-dashed border-white/15 px-4 py-5 text-center hover:border-primary hover:bg-primary/5 transition-all">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {extracting ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-xs">Extracting logo…</span>
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
                    <span className="text-[11px]">PNG, JPG — background auto-removed</span>
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

              {/* Try with Urgent logo */}
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
                      onClick={() => {
                        setOriginalSrc(p.src);
                        setLogoSrc(p.src);
                        setLogoX(0); setLogoY(0); setLogoScale(1);
                      }}
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

            {/* Price + CTA */}
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
  category, productSlug, productLabel, colorHex,
  logoSrc, logoScale, logoX, logoY, setLogoX, setLogoY,
}: {
  category: CategorySlug;
  productSlug: string;
  productLabel: string;
  colorHex: string;
  logoSrc: string | null;
  logoScale: number;
  logoX: number; logoY: number;
  setLogoX: (v: number) => void; setLogoY: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 18 });
  const sy = useSpring(my, { stiffness: 100, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotX = useTransform(sy, [-1, 1], [6, -6]);
  const glossX = useTransform(sx, [-1, 1], ["20%", "80%"]);
  const gloss = useTransform(glossX, (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) ${v}, transparent 70%)`);

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
    setLogoX(Math.max(-0.25, Math.min(0.25, dragStart.current.lx + dx)));
    setLogoY(Math.max(-0.15, Math.min(0.15, dragStart.current.ly + dy)));
  };
  const onLogoUp = () => setDragging(false);

  const ratio = category === "pens" || category === "usb" ? "tall" : "wide" as const;

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
          className="absolute inset-0 opacity-25 transition-colors duration-500"
          style={{ background: `radial-gradient(circle at 50% 40%, ${colorHex}, transparent 60%)` }}
        />
        <div className="absolute inset-8 flex items-center justify-center">
          <ProductImage
            src={productImageUrl(category, productSlug)}
            label={productLabel}
            ratio={ratio}
            className="w-full max-w-md"
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
              transform: `translate(calc(-50% + ${logoX * 100}%), calc(-50% + ${logoY * 100}%)) scale(${logoScale})`,
            }}
          >
            <img
              src={logoSrc}
              alt="Your logo"
              draggable={false}
              className="max-w-[180px] max-h-[80px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
            />
          </div>
        )}

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
          style={{ background: gloss }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[25%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-dashed border-accent/50" />
      </motion.div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Hover for 3D · drag the logo to position
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
        active ? "bg-gradient-primary text-primary-foreground shadow-glow-soft" : "glass text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
