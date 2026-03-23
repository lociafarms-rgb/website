#!/usr/bin/env python3
"""Optimize Locia Farms website images.

- Creates WebP versions next to original files (same basename + .webp)
- Resizes to max width (default 2000px) to prevent huge payloads
- Preserves originals (no destructive edits)

Usage:
  python3 scripts/optimize_images.py --root images --max-width 2000 --quality 80
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def iter_images(root: Path):
    exts = {".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"}
    for p in root.rglob("*"):
        if p.is_file() and p.suffix in exts:
            yield p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path("images"))
    ap.add_argument("--max-width", type=int, default=2000)
    ap.add_argument("--quality", type=int, default=80)
    ap.add_argument("--force", action="store_true", help="overwrite existing .webp")
    args = ap.parse_args()

    root = args.root
    if not root.exists():
        raise SystemExit(f"Root not found: {root}")

    count = 0
    saved_kb = 0
    for src in iter_images(root):
        # Skip already-optimized derivatives
        if src.suffix.lower() == ".webp":
            continue

        dst = src.with_suffix(".webp")
        if dst.exists() and not args.force:
            continue

        try:
            im = Image.open(src)
        except Exception:
            continue

        # Convert to RGB for webp
        if im.mode in ("RGBA", "LA"):
            # WebP supports alpha; keep if present
            pass
        elif im.mode != "RGB":
            im = im.convert("RGB")

        w, h = im.size
        if w > args.max_width:
            new_h = int(h * (args.max_width / w))
            im = im.resize((args.max_width, new_h), Image.Resampling.LANCZOS)

        # Save webp
        dst.parent.mkdir(parents=True, exist_ok=True)
        im.save(dst, format="WEBP", quality=args.quality, method=6)

        # Rough savings
        try:
            saved_kb += max(0, src.stat().st_size - dst.stat().st_size) // 1024
        except Exception:
            pass

        count += 1

    print(f"Generated {count} .webp files; approx saved {saved_kb} KB")


if __name__ == "__main__":
    main()
