// Client-side background removal via canvas flood-fill on edge color.
// Works well for clean logos on uniform backgrounds (white, photo of business card, screenshots).

export async function extractLogo(file: File, tolerance = 36): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    const MAX = 1200;
    const scale = Math.min(1, MAX / Math.max(img.width, img.height));
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bg = sampleEdgeColor(data);
    removeBackground(data, bg, tolerance);
    ctx.putImageData(data, 0, 0);
    const trimmed = trimTransparent(canvas);
    return trimmed.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
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

function sampleEdgeColor(img: ImageData) {
  const { width, height, data } = img;
  const samples: number[][] = [];
  const step = Math.max(2, Math.floor(width / 40));
  for (let x = 0; x < width; x += step) {
    samples.push(pixel(data, x, 0, width));
    samples.push(pixel(data, x, height - 1, width));
  }
  for (let y = 0; y < height; y += step) {
    samples.push(pixel(data, 0, y, width));
    samples.push(pixel(data, width - 1, y, width));
  }
  const avg = [0, 0, 0];
  for (const s of samples) {
    avg[0] += s[0]; avg[1] += s[1]; avg[2] += s[2];
  }
  return [avg[0] / samples.length, avg[1] / samples.length, avg[2] / samples.length];
}

function pixel(data: Uint8ClampedArray, x: number, y: number, w: number): number[] {
  const i = (y * w + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function removeBackground(img: ImageData, bg: number[], tolerance: number) {
  const { data } = img;
  const t2 = tolerance * tolerance * 3;
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bg[0];
    const dg = data[i + 1] - bg[1];
    const db = data[i + 2] - bg[2];
    const d = dr * dr + dg * dg + db * db;
    if (d < t2) {
      data[i + 3] = 0;
    } else if (d < t2 * 2) {
      // soft edge
      data[i + 3] = Math.round(((d - t2) / t2) * 255);
    }
  }
}

function trimTransparent(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let top = height, bottom = 0, left = width, right = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 10) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }
  if (right < left || bottom < top) return canvas;
  const pad = 8;
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

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
