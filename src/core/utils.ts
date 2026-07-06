import * as THREE from 'three';

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Resolve a public/ asset path for both dev and GitHub Pages base URL. */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.replace(/^\//, '')}`;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = assetUrl(src);
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Image on a light rounded card — used for logos and service diagrams. */
export function makeCardTexture(
  img: HTMLImageElement,
  opts: { width?: number; height?: number; pad?: number; bg?: string; radius?: number } = {},
): THREE.CanvasTexture {
  const { width = 800, height = 500, pad = 44, bg = '#f5f7fb', radius = 6 } = opts;
  const [canvas, ctx] = makeCanvas(width, height);
  roundRect(ctx, 0, 0, width, height, radius);
  ctx.fillStyle = bg;
  ctx.fill();
  const availW = width - pad * 2;
  const availH = height - pad * 2;
  const scale = Math.min(availW / img.naturalWidth, availH / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.save();
  roundRect(ctx, 0, 0, width, height, radius);
  ctx.clip();
  ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
  ctx.restore();
  return toTexture(canvas);
}

/** Cover-cropped rounded photo card. */
export function makePhotoTexture(
  img: HTMLImageElement,
  w = 640,
  h = 800,
  radius = 40,
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(w, h);
  roundRect(ctx, 0, 0, w, h, radius);
  ctx.clip();
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return toTexture(canvas);
}

/** Small text label rendered to a texture (for 3D tag sprites). */
export function makeLabelTexture(
  text: string,
  opts: { fontSize?: number; color?: string; bg?: string } = {},
): { texture: THREE.CanvasTexture; aspect: number } {
  const { fontSize = 56, color = '#dfe9ff', bg = 'rgba(12,18,32,0.85)' } = opts;
  const font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
  const [measureCanvas, measureCtx] = makeCanvas(8, 8);
  measureCtx.font = font;
  const metrics = measureCtx.measureText(text);
  measureCanvas.remove();
  const padX = fontSize * 0.7;
  const padY = fontSize * 0.45;
  const w = Math.ceil(metrics.width + padX * 2);
  const h = Math.ceil(fontSize + padY * 2);
  const [canvas, ctx] = makeCanvas(w, h);
  roundRect(ctx, 1, 1, w - 2, h - 2, h / 2 - 1);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = 'rgba(110,231,255,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + fontSize * 0.05);
  return { texture: toTexture(canvas), aspect: w / h };
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Dark glass card with a big index number and the project title. */
export function makeProjectCardTexture(num: string, title: string): THREE.CanvasTexture {
  const w = 820;
  const h = 512;
  const [canvas, ctx] = makeCanvas(w, h);
  roundRect(ctx, 0, 0, w, h, 6);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0b1322');
  grad.addColorStop(1, '#101c31');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(110,231,255,0.4)';
  ctx.lineWidth = 3;
  roundRect(ctx, 1.5, 1.5, w - 3, h - 3, 5);
  ctx.stroke();

  ctx.fillStyle = 'rgba(110,231,255,0.14)';
  ctx.font = '700 300px "Space Grotesk", sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(num, w - 36, h - 40);

  ctx.fillStyle = '#6ee7ff';
  ctx.fillRect(48, 66, 64, 6);

  ctx.fillStyle = '#eef4ff';
  ctx.font = '700 58px "Space Grotesk", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const lines = wrapLines(ctx, title, w - 120);
  lines.slice(0, 4).forEach((line, i) => {
    ctx.fillText(line, 48, 116 + i * 78);
  });
  return toTexture(canvas);
}

/** Soft round sprite for particles. */
export function makeDotTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(canvas);
}
