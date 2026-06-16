// Client-side logo extraction. Uses @imgly/background-removal (WASM) to
// robustly remove backgrounds from photos, business cards, screenshots and
// non-isolated logos. Then trims transparent padding around the result.

export type ExtractProgress = (stage: string) => void;

export async function extractLogo(
  input: File | Blob,
  onProgress?: ExtractProgress,
): Promise<string> {
  onProgress?.("Loading extractor…");
  const { removeBackground } = await import("@imgly/background-removal");

  onProgress?.("Removing background…");
  const cleanBlob = await removeBackground(input, {
    output: { format: "image/png", quality: 0.95 },
  });

  onProgress?.("Optimizing preview…");
  const url = URL.createObjectURL(cleanBlob);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const trimmed = trimTransparent(canvas);
    return trimmed.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function fileToDataURL(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function trimTransparent(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let top = height, bottom = 0, left = width, right = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 12) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (right < left || bottom < top) return canvas;
  const pad = 6;
  const w = Math.min(width, right - left + 1 + pad * 2);
  const h = Math.min(height, bottom - top + 1 + pad * 2);
  const out = document.createElement("canvas");
  out.width = w; out.height = h;
  out.getContext("2d")!.drawImage(
    canvas,
    Math.max(0, left - pad), Math.max(0, top - pad), w, h,
    0, 0, w, h,
  );
  return out;
}
