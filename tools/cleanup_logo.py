#!/usr/bin/env python3
"""
Logo cleaner: remove video playback controls from the bottom of a screenshot
without cropping the actual logo, then optionally export at 1920x1080.

Usage:
  python3 tools/cleanup_logo.py --input "Screenshot 2025-08-07 at 16.56.44.png" \
                               --output OFFICIAL_JUNIOR_NEWS_DIGEST_LOGO.png \
                               --export_hd
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageFilter


def compute_overlay_height(img: Image.Image) -> int:
    """Heuristically estimate the height of the dark playback overlay.

    We default to 100–140px on 1080p images, scaled proportionally for others.
    """
    width, height = img.size
    # Scale overlay estimate based on height
    base = max(80, min(140, int(height * 0.11)))
    return base


def inpaint_bottom_band(img: Image.Image, overlay_h: int) -> Image.Image:
    """Replace the bottom overlay by column-wise color extension.

    This avoids duplicating shapes (waves/letters) and keeps the logo intact.
    We sample the average color of a thin strip just above the overlay for
    each column, then fill the overlay band using these per-column colors with
    a slight vertical fade for a natural look.
    """
    width, height = img.size
    result = img.copy()

    paste_top = height - overlay_h
    # Sample band: 8 px just above the overlay
    sample_h = max(6, min(12, overlay_h // 10))
    sample_top = max(0, paste_top - sample_h)
    sample = img.crop((0, sample_top, width, sample_top + sample_h)).convert("RGB")
    sample_px = sample.load()

    # Create a new image for the overlay area
    band = Image.new("RGB", (width, overlay_h))
    band_px = band.load()

    for x in range(width):
        # Average column color from the sample
        r = g = b = 0
        for y in range(sample_h):
            pr, pg, pb = sample_px[x, y]
            r += pr; g += pg; b += pb
        r //= sample_h; g //= sample_h; b //= sample_h

        # Vertical fade: slightly darker toward the bottom (5-8%)
        for y in range(overlay_h):
            t = y / max(1, overlay_h - 1)
            k = 1.0 - 0.08 * t
            band_px[x, y] = (int(r * k), int(g * k), int(b * k))

    # Light blur to remove potential banding
    band = band.filter(ImageFilter.GaussianBlur(0.6))
    result.paste(band, (0, paste_top))

    # Feather seam
    feather_band = result.crop((0, paste_top - 4, width, paste_top + 6)).filter(
        ImageFilter.GaussianBlur(1.0)
    )
    result.paste(feather_band, (0, paste_top - 4))

    return result


def export_hd(img: Image.Image) -> Image.Image:
    """Export to 1920x1080 canvas without adding oversized borders."""
    target_w, target_h = 1920, 1080
    # Scale to fit height first (to avoid re-introducing bottom band)
    scale = target_h / img.height
    new_w = int(img.width * scale)
    resized = img.resize((new_w, target_h), Image.Resampling.LANCZOS)

    # If wider than target, center-crop; if narrower, pad minimally left/right
    if resized.width >= target_w:
        left = (resized.width - target_w) // 2
        return resized.crop((left, 0, left + target_w, target_h))

    # Minimal padding without large borders (use sky-blue average)
    canvas = Image.new("RGB", (target_w, target_h), (135, 206, 235))
    x = (target_w - resized.width) // 2
    canvas.paste(resized, (x, 0))
    return canvas


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--export_hd", action="store_true")
    args = parser.parse_args()

    in_path = Path(args.input)
    out_path = Path(args.output)

    img = Image.open(in_path).convert("RGB")
    overlay_h = compute_overlay_height(img)
    cleaned = inpaint_bottom_band(img, overlay_h)

    if args.export_hd:
        cleaned = export_hd(cleaned)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    cleaned.save(out_path)
    print(f"✅ Cleaned logo saved: {out_path} ({cleaned.size[0]}x{cleaned.size[1]})")


if __name__ == "__main__":
    main()


