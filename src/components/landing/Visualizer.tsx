import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Upload, Loader2, RotateCcw, Wand2, ImageIcon, Tag } from "lucide-react";
import { extractLogo, fileToDataURL } from "@/lib/logo-extract";
import { PENS, productImageUrl } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/utils";

const PRESETS = [
  { name: "Minimal Mono", bg: "linear-gradient(135deg,#fff,#e8e8e8)", text: "BRAND" },
  { name: "Bold Gold", bg: "linear-gradient(135deg,#fcd34d,#f59e0b)", text: "STUDIO" },
  { name: "Electric", bg: "linear-gradient(135deg,#7300E6,#A1C900)", text: "EVENT" },
  { name: "Mono Dark", bg: "linear-gradient(135deg,#0D1146,#1a1f6a)", text: "CORP" },
];

type Tab = "upload" | "presets";

export function Visualizer() {
  const [tab, setTab] = useState<Tab>("upload");
  const [selectedPen, setSelectedPen] = useState(PENS[1]);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [logoScale, setLogoScale] = useState(1);
  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setExtracting(true);
    setLogoX(0); setLogoY(0); setLogoScale(1);
    try {
      const orig = await fileToDataURL(file);
      setOriginalSrc(orig);
      const extracted = await extractLogo(file);
      setLogoSrc(extracted);
    } catch (e) {
      console.error(e);
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

  return (
    <section id="visualizer" className="relative py-24 sm:py-32 border-t border-border">
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Live Visualizer</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">
            Drop your logo. See it printed.
          </h2>
          <p className="mt-4 text-muted-foreground">
            We auto-detect and extract your logo, then place it on the real product surface.
            Drag, resize and lock to the print area — no design skills needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Preview canvas */}
          <Pseudo3DPreview
            pen={selectedPen}
            logoSrc={logoSrc}
            logoScale={logoScale}
            setLogoScale={setLogoScale}
            logoX={logoX} logoY={logoY}
            setLogoX={setLogoX} setLogoY={setLogoY}
          />

          {/* Controls */}
          <div className="glass-strong rounded-3xl p-5 space-y-5">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-full glass p-1">
              <button
                onClick={() => setTab("upload")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold transition-all",
                  tab === "upload" ? "bg-gradient-primary text-primary-foreground shadow-glow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Upload className="h-3.5 w-3.5" /> Upload logo
              </button>
              <button
                onClick={() => setTab("presets")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-full py-2 text-xs font-semibold transition-all",
                  tab === "presets" ? "bg-gradient-primary text-primary-foreground shadow-glow-soft" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Tag className="h-3.5 w-3.5" /> Presets
              </button>
            </div>

            {tab === "upload" ? (
              <div className="space-y-4">
                <label
                  className={cn(
                    "block cursor-pointer rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center transition-all",
                    "hover:border-primary hover:bg-primary/5",
                  )}
                >
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
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-6 w-6 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Drop your logo</span>
                      <span className="text-xs">PNG, JPG, screenshot or business card</span>
                    </div>
                  )}
                </label>

                {logoSrc && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => originalSrc && setLogoSrc(originalSrc)}
                        className="flex-1 rounded-full glass px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      >
                        Keep original
                      </button>
                      <button
                        onClick={retry}
                        className="flex items-center justify-center gap-1 rounded-full glass px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      >
                        <RotateCcw className="h-3 w-3" /> Retry
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Logo size
                      </label>
                      <input
                        type="range" min={0.3} max={2} step={0.05}
                        value={logoScale}
                        onChange={(e) => setLogoScale(Number(e.target.value))}
                        className="w-full accent-[color:var(--primary)]"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => {
                      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="url(#g)"/><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${encodeColor(p.bg, 0)}"/><stop offset="1" stop-color="${encodeColor(p.bg, 1)}"/></linearGradient></defs><text x="50%" y="55%" text-anchor="middle" font-family="Poppins,sans-serif" font-weight="800" font-size="64" fill="#0D1146">${p.text}</text></svg>`;
                      setLogoSrc(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
                    }}
                    className="aspect-[2/1] rounded-xl overflow-hidden border border-white/10 hover:border-primary transition"
                    style={{ background: p.bg }}
                  >
                    <div className="flex h-full items-center justify-center text-[#0D1146] font-extrabold text-lg tracking-wider">
                      {p.text}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Pen picker */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Pen style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PENS.map((p) => (
                  <button
                    key={p.slug}
                    onClick={() => setSelectedPen(p)}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-[11px] text-left font-medium transition",
                      selectedPen.slug === p.slug
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-soft"
                        : "glass text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.name.replace(" Pen", "")}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl glass p-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Wand2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
              <p>Logo stays inside the print area. Real production matches your preview exactly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function encodeColor(bg: string, idx: number) {
  const m = bg.match(/#[0-9a-fA-F]{6}/g);
  return m?.[idx] ?? "#ffffff";
}

function Pseudo3DPreview({
  pen, logoSrc, logoScale, setLogoScale, logoX, logoY, setLogoX, setLogoY,
}: {
  pen: typeof PENS[number];
  logoSrc: string | null;
  logoScale: number;
  setLogoScale: (v: number) => void;
  logoX: number; logoY: number;
  setLogoX: (v: number) => void; setLogoY: (v: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 18 });
  const sy = useSpring(my, { stiffness: 100, damping: 18 });
  const rotY = useTransform(sx, [-1, 1], [-12, 12]);
  const rotX = useTransform(sy, [-1, 1], [8, -8]);
  const glossX = useTransform(sx, [-1, 1], ["20%", "80%"]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  // logo drag
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
    // clamp to print area (approx middle 60% × 30%)
    const max = 0.25;
    setLogoX(Math.max(-max, Math.min(max, dragStart.current.lx + dx)));
    setLogoY(Math.max(-0.1, Math.min(0.1, dragStart.current.ly + dy)));
  };
  const onLogoUp = () => setDragging(false);

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
        className="relative aspect-[4/5] sm:aspect-[5/4] rounded-3xl glass-strong overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-glow opacity-40" />
        {/* Layer 1: product */}
        <div className="absolute inset-8 flex items-center justify-center">
          <ProductImage
            src={productImageUrl("pens", pen.slug)}
            label={pen.name}
            ratio="tall"
            className="w-full max-w-md"
          />
        </div>

        {/* Layer 2: logo (draggable) */}
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

        {/* Layer 3: gloss */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
          style={{
            background: useTransform(glossX, (v) => `linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) ${v}, transparent 70%)`),
          }}
        />

        {/* Print area guide */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[25%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-md border border-dashed border-accent/50" />
      </motion.div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Move your mouse over the preview · drag the logo to position
      </p>
    </div>
  );
}
