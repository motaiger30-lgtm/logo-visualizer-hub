import { useMemo, useState } from "react";
import { CATEGORIES, PENS } from "@/lib/catalog";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = [
  { name: "Midnight", hex: "#0D1146" },
  { name: "Purple", hex: "#7300E6" },
  { name: "Silver", hex: "#c0c0c0" },
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#0a0a0a" },
  { name: "Lime", hex: "#A1C900" },
];

// Sample tiered pricing in EGP — will be replaced with DB values once user enters real prices.
const TIERS = [
  { min: 50, max: 99, unit: 22 },
  { min: 100, max: 249, unit: 18 },
  { min: 250, max: 499, unit: 15 },
  { min: 500, max: 999, unit: 12 },
  { min: 1000, max: 99999, unit: 9.5 },
];

export function Configurator() {
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [productSlug, setProductSlug] = useState(PENS[1].slug);
  const [color, setColor] = useState(COLORS[1]);
  const [qty, setQty] = useState(100);

  const product = useMemo(() => PENS.find((p) => p.slug === productSlug) ?? PENS[0], [productSlug]);
  const tier = useMemo(() => TIERS.find((t) => qty >= t.min && qty <= t.max) ?? TIERS[TIERS.length - 1], [qty]);
  const total = tier.unit * qty;
  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name ?? "";

  const handleQuote = async () => {
    const url = buildWhatsAppUrl({
      category: categoryName,
      product: product.name,
      color: color.name,
      quantity: qty,
      unitPriceEgp: tier.unit,
      totalEgp: total,
    });
    // Best-effort lead capture (don't block the user)
    supabase.from("leads").insert({
      category: categoryName,
      quantity: qty,
      total_egp: total,
      source: "whatsapp",
    }).then(() => {});
    window.open(url, "_blank");
  };

  return (
    <section id="pricing" className="relative py-24 sm:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Live Quote</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">
            Configure. See price. Order.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real-time pricing in EGP. Volume discounts auto-apply.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="glass-strong rounded-3xl p-6 space-y-7">
            <Step n={1} label="Category">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                    {c.name}
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={2} label="Product">
              <div className="flex flex-wrap gap-2">
                {(category === "pens" ? PENS : PENS.slice(0, 3)).map((p) => (
                  <Chip key={p.slug} active={productSlug === p.slug} onClick={() => setProductSlug(p.slug)}>
                    {p.name.replace(" Pen", "")}
                  </Chip>
                ))}
              </div>
            </Step>

            <Step n={3} label="Color">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c)}
                    className={cn(
                      "group flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
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
                  className="w-24 rounded-lg glass px-3 py-2 text-sm text-foreground"
                />
              </div>
            </Step>
          </div>

          {/* Live price */}
          <div className="glass-strong rounded-3xl p-6 space-y-5 sticky top-24 h-fit">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Live price</p>
            <div className="space-y-3 border-b border-white/10 pb-5">
              <Row label="Product" value={product.name} />
              <Row label="Color" value={color.name} />
              <Row label="Quantity" value={qty.toLocaleString()} />
              <Row label="Unit price" value={`${tier.unit.toFixed(2)} EGP`} />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total</p>
              <p className="text-4xl font-bold text-gradient">
                {total.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-2xl text-muted-foreground">EGP</span>
              </p>
            </div>
            <button
              onClick={handleQuote}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-5 py-3.5 text-sm font-bold shadow-glow hover:brightness-95 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Get Quote on WhatsApp
            </button>
            <p className="text-[10px] text-center text-muted-foreground">
              Sent directly to our team · reply within 1 business hour
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-primary text-[11px] font-bold text-primary-foreground shadow-glow-soft">{n}</span>
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
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
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
        active ? "bg-gradient-primary text-primary-foreground shadow-glow-soft" : "glass text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
