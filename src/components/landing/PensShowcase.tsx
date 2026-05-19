import { PENS, productImageUrl } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { motion } from "framer-motion";

export function PensShowcase() {
  return (
    <section id="pens" className="relative py-24 sm:py-32 border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-accent-line" style={{ background: "var(--gradient-accent-line)" }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Promotional Pens</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">
            Seven signature pen styles
          </h2>
          <p className="mt-4 text-muted-foreground">
            From executive matte to medical novelty — each style ships with bulk pricing,
            in-house printing and full color matching to your brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PENS.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl glass p-5 hover:shadow-glow transition-all"
            >
              <ProductImage
                src={productImageUrl("pens", p.slug)}
                label={p.name}
                ratio="square"
                className="mb-4 group-hover:scale-[1.03] transition-transform duration-500"
              />
              <h3 className="text-base font-bold text-foreground leading-tight">{p.name}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                {p.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  MOQ <span className="text-accent font-semibold">{p.moq}</span>
                </span>
                <a
                  href="#visualizer"
                  className="text-xs font-semibold text-foreground hover:text-accent transition-colors"
                >
                  View details →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
