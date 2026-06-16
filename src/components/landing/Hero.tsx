import { motion, useMotionValue, useTransform, useSpring, MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { PRODUCTS, Product } from "@/lib/catalog";

type Float = { product: Product; x: string; y: string; depth: number; rot: number; size: number };

function FloatingProduct({ f, sx, sy }: { f: Float; sx: MotionValue<number>; sy: MotionValue<number> }) {
  const tx = useTransform(sx, (v) => v * f.depth);
  const ty = useTransform(sy, (v) => v * f.depth);
  return (
    <motion.div
      style={{ left: f.x, top: f.y, width: f.size, x: tx, y: ty, rotate: f.rot }}
      className="absolute animate-float opacity-80"
    >
      <ProductImage
        src={f.product.image}
        label={f.product.name}
        ratio={f.product.aspect}
        className="shadow-glow"
      />
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const floats: Float[] = [
    { product: PRODUCTS[0], x: "-8%", y: "10%", depth: 40, rot: -12, size: 220 },
    { product: PRODUCTS[3], x: "78%", y: "6%", depth: 60, rot: 8, size: 240 },
    { product: PRODUCTS[1], x: "5%", y: "62%", depth: 30, rot: 6, size: 240 },
    { product: PRODUCTS[4], x: "75%", y: "60%", depth: 50, rot: -6, size: 240 },
  ];

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 bg-gradient-hero"
    >
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-glow opacity-60" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-glow opacity-40" />

      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {floats.map((f, i) => (
          <FloatingProduct key={i} f={f} sx={sx} sy={sy} />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          Print preview before you order
        </div>

        <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-gradient">
          See Your Brand Printed<br />Before You Order
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg text-muted-foreground">
          Upload your logo and instantly preview Pens, Notebooks, Flash Drives, Roll-ups and X-Banners
          before printing. Real-time visualization, premium quality, fast delivery.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#designer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110 transition-all"
          >
            Start Designing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-white/10 transition-all"
          >
            Contact Sales
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span>500+ brands</span>
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span>10M+ printed</span>
          <span className="h-1 w-1 rounded-full bg-accent" />
          <span>48h delivery</span>
        </div>
      </div>
    </section>
  );
}
