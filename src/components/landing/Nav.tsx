import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import logoUrgent from "@/assets/logo-urgent.png";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#products", label: "Products" },
  { href: "#designer", label: "Designer" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav className={cn(
          "flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all",
          scrolled ? "glass-strong" : "bg-transparent",
        )}>
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrgent} alt="Urgent Advertising" className="h-8 w-auto" />
          </Link>
          <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-foreground transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:brightness-110 transition-all"
          >
            Contact Sales
          </a>
        </nav>
      </div>
    </header>
  );
}
