import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  label: string;
  tint: string;
  material?: "plastic" | "metal";
  className?: string;
};

/**
 * Loads a pen image (white background), converts white → transparent via canvas,
 * then renders it as a stack: base image + color-blend tint + gloss highlight.
 * Falls back to plain <img> if the canvas step fails (CORS or decode error).
 */
export function TintablePen({ src, label, tint, material = "plastic", className }: Props) {
  const [alphaSrc, setAlphaSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAlphaSrc(null);
    setFailed(false);
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const px = d.data;
        for (let i = 0; i < px.length; i += 4) {
          const r = px[i], g = px[i + 1], b = px[i + 2];
          const bright = (r + g + b) / 3;
          if (bright > 240) px[i + 3] = 0;
          else if (bright > 205) px[i + 3] = Math.round(255 * (240 - bright) / 35);
        }
        ctx.putImageData(d, 0, 0);
        setAlphaSrc(c.toDataURL("image/png"));
      } catch {
        setFailed(true);
      }
    };
    img.onerror = () => !cancelled && setFailed(true);
    img.src = src;
    return () => { cancelled = true; };
  }, [src]);

  const displaySrc = alphaSrc ?? src;
  const canTint = !!alphaSrc && !failed;

  const maskStyle: React.CSSProperties | undefined = canTint
    ? {
        WebkitMaskImage: `url(${alphaSrc})`,
        maskImage: `url(${alphaSrc})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }
    : undefined;

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Base pen */}
      <img
        src={displaySrc}
        alt={label}
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.5)]"
        draggable={false}
      />

      {canTint && (
        <>
          {/* Color tint — preserves luminance, only changes hue */}
          <div
            aria-hidden
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              ...maskStyle,
              background: tint,
              mixBlendMode: "color",
            }}
          />
          {/* Subtle darkening for saturation (multiply) */}
          <div
            aria-hidden
            className="absolute inset-0 z-[21] pointer-events-none opacity-30"
            style={{
              ...maskStyle,
              background: tint,
              mixBlendMode: "multiply",
            }}
          />
          {/* Material gloss */}
          <div
            aria-hidden
            className="absolute inset-0 z-30 pointer-events-none"
            style={{
              ...maskStyle,
              opacity: material === "metal" ? 0.55 : 0.28,
              background:
                material === "metal"
                  ? "linear-gradient(115deg, transparent 25%, rgba(255,255,255,0.85) 45%, transparent 55%, rgba(255,255,255,0.4) 70%, transparent 82%)"
                  : "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
              mixBlendMode: "screen",
            }}
          />
        </>
      )}
    </div>
  );
}
