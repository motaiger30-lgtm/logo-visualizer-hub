import clientsStrip from "@/assets/clients-strip.png";

export function SocialProof() {
  return (
    <section className="relative py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Trusted by leading brands
        </p>
        <div className="mt-8 rounded-2xl overflow-hidden bg-[#0D1146] p-4 sm:p-6">
          <img
            src={clientsStrip}
            alt="Trusted brands: M&P, Gypto Pharma, Pharco, realme, Puravie, Huawei, Oriental Weavers, Unifert Misr"
            loading="lazy"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
}
