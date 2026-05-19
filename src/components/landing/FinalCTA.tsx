import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FinalCTA() {
  return (
    <section id="contact" className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-80" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-glow opacity-60" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="text-5xl sm:text-6xl font-bold text-gradient leading-[1.05]">
          Ready to print your brand?
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          Get a same-day quote from our team. Custom MOQs available for premium clients.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl({})}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-8 py-4 text-base font-bold shadow-glow hover:brightness-95 transition"
          >
            <MessageCircle className="h-5 w-5" />
            Get Quote on WhatsApp
          </a>
          <a
            href="#visualizer"
            className="inline-flex items-center gap-2 rounded-full glass-strong px-8 py-4 text-base font-semibold text-foreground hover:bg-white/10 transition"
          >
            Design first
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Urgent Advertising. All rights reserved.</p>
        <p>Cairo · Egypt · +20 100 833 3287</p>
      </div>
    </footer>
  );
}
