import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const targets = [
  {
    src: 'images/splash-home-01.jpg',
    widths: [800, 1200, 1600],
    formats: ['webp', 'jpeg'],
  },
  {
    src: 'images/splash-home-goat-01.jpeg',
    widths: [800, 1200],
    formats: ['webp'],
  },
  {
    src: 'images/splash-home-chickens-01.jpeg',
    widths: [800, 1200],
    formats: ['webp'],
  },
  {
    src: 'images/splash-home-02.jpeg',
    widths: [800, 1200],
    formats: ['webp'],
  },
];

function outPath(src, width, fmt) {
  const ext = path.extname(src);
  const base = src.slice(0, -ext.length);
  return `${base}.${width}w.${fmt}`;
}

async function exists(p) {
  try { await fs.stat(p); return true; } catch { return false; }
}

let changed = 0;
for (const t of targets) {
  if (!(await exists(t.src))) {
    console.error(`Missing: ${t.src}`);
    continue;
  }

  const img = sharp(t.src);
  const meta = await img.metadata();

  for (const w of t.widths) {
    if (meta.width && meta.width < w) continue;

    for (const fmt of t.formats) {
      const out = outPath(t.src, w, fmt);
      if (await exists(out)) continue;

      let pipeline = sharp(t.src).resize({ width: w, withoutEnlargement: true });
      if (fmt === 'webp') pipeline = pipeline.webp({ quality: 82 });
      if (fmt === 'jpeg') pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });

      await pipeline.toFile(out);
      changed++;
      console.log(`Wrote ${out}`);
    }
  }
}

console.log(`Done. New files: ${changed}`);
