import { CATEGORIES, CategorySlug, productImageUrl } from "@/lib/catalog";
import { ProductImage } from "./ProductImage";
import { ArrowUpRight } from "lucide-react";

export function Categories() {
  const pick = (slug: CategorySlug) => {
    window.dispatchEvent(new CustomEvent("urgent:set-category", { detail: { category: slug } }));
  };

  return (
    <section id="products" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Categories</p>
            <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">
              Branded for every <span className="text-gradient">surface</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Tap a category to load it into the designer below. Live pricing in EGP.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => pick(c.slug)}
              className="group relative text-left overflow-hidden rounded-3xl glass p-6 hover:shadow-glow transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-glow opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative">
                <ProductImage
                  src={productImageUrl(c.slug, "cover")}
                  label={c.name}
                  ratio="wide"
                  className="mb-5 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{c.blurb}</p>
                  </div>
                  <span className="mt-1 rounded-full glass-strong p-2 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
