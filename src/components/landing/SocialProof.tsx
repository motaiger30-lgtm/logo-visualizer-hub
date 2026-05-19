export function SocialProof() {
  const clients = ["Nestlé", "Vodafone", "AUC", "Orascom", "Pfizer", "Carrefour", "Talaat Moustafa", "Banque Misr"];
  return (
    <section className="relative py-20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Trusted by leading brands</p>
        <div className="mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {clients.map((c) => (
              <span key={c} className="text-lg sm:text-xl font-bold text-foreground/80 tracking-wide">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
