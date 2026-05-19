import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function MobileSticky() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden p-3">
      <div className="glass-strong rounded-full flex items-center justify-between gap-2 px-2 py-2">
        <a href="#visualizer" className="flex-1 text-center text-xs font-semibold text-foreground py-2">
          Design
        </a>
        <a href="#pricing" className="flex-1 text-center text-xs font-semibold text-foreground py-2">
          Price
        </a>
        <a
          href={buildWhatsAppUrl({})}
          target="_blank" rel="noopener"
          className="flex items-center gap-1.5 rounded-full bg-[color:var(--accent)] text-[color:var(--accent-foreground)] px-4 py-2.5 text-xs font-bold shadow-glow"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Quote
        </a>
      </div>
    </div>
  );
}
