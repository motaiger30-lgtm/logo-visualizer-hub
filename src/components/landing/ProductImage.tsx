import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  label: string;
  className?: string;
  ratio?: "square" | "tall" | "wide";
};

/**
 * Renders a real product image from Supabase Storage if it exists,
 * otherwise renders a branded placeholder card. NEVER falls back to AI/stock.
 */
export function ProductImage({ src, label, className, ratio = "square" }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (!src) { setOk(false); return; }
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setOk(true);
    img.onerror = () => !cancelled && setOk(false);
    img.src = src;
    return () => { cancelled = true; };
  }, [src]);

  const ratioCls = ratio === "tall" ? "aspect-[3/4]" : ratio === "wide" ? "aspect-[4/3]" : "aspect-square";

  if (ok && src) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl", ratioCls, className)}>
        <img src={src} alt={label} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl glass flex flex-col items-center justify-center text-center p-4",
        ratioCls,
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      <div className="relative z-10">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-gradient-primary shadow-glow-soft" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Image placeholder</p>
        <p className="mt-1 text-sm font-semibold text-foreground/90">{label}</p>
      </div>
      <div className="absolute bottom-2 left-2 right-2 h-px bg-gradient-accent-line" style={{ background: "var(--gradient-accent-line)" }} />
    </div>
  );
}
