"""Deterministic portrait enhancement (no generative AI).

Reads assets/originals/higor-lima-original.webp and writes public/images/profile/higor-lima.webp.
Every step is a classic, parameterised photo adjustment, so the result is fully reproducible:

1. Darken and neutralise the background curtain (luminance mask, head protected by a feathered ellipse).
2. Gentle global temperature correction (slightly cooler).
3. Skin: reduce excess red/orange saturation and roll off specular highlights (forehead, nose).
4. Soft fill light on facial shadows.
5. Mild contrast curve and unsharp mask.

Usage: python scripts/enhance-portrait.py [--compare out.png]
"""

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets' / 'originals' / 'higor-lima-original.webp'
TARGET = ROOT / 'public' / 'images' / 'profile' / 'higor-lima.webp'

# Tunable parameters
BG_DARKEN = 0.62  # fraction of brightness removed from the background
BG_DESATURATE = 0.7  # how much colour cast to remove from the background
TEMPERATURE = (0.985, 1.0, 1.02)  # R, G, B multipliers
SKIN_DESATURATE = 0.08
SKIN_RED_REDUCTION = 0.035  # nudges skin hue from red-orange toward neutral
SKIN_HIGHLIGHT_ROLLOFF = 0.18
FILL_LIGHT = 0.08
CONTRAST = 0.06
HEAD_ELLIPSE = (0.49, 0.33, 0.27, 0.27)  # cx, cy, rx, ry as fractions of width/height


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def luminance(rgb):
    return rgb @ np.array([0.2126, 0.7152, 0.0722])


def blur(mask, radius):
    img = Image.fromarray(np.uint8(np.clip(mask, 0, 1) * 255))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius))).astype(float) / 255


def rgb_to_hsv(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maxc = rgb.max(-1)
    minc = rgb.min(-1)
    delta = maxc - minc
    sat = np.where(maxc > 0, delta / np.maximum(maxc, 1e-6), 0)
    safe = np.maximum(delta, 1e-6)
    hue = np.where(maxc == r, ((g - b) / safe) % 6, np.where(maxc == g, (b - r) / safe + 2, (r - g) / safe + 4)) * 60
    hue = np.where(delta == 0, 0, hue)
    return hue, sat, maxc


def enhance(rgb):
    h, w, _ = rgb.shape
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy, rx, ry = HEAD_ELLIPSE
    dist = np.sqrt(((xx / w - cx) / rx) ** 2 + ((yy / h - cy) / ry) ** 2)
    head = 1 - smoothstep(0.85, 1.15, dist)

    lum = luminance(rgb)
    dark = 1 - smoothstep(0.07, 0.17, blur(lum, 6))
    # Near the head only the darkest pixels (curtain, not hair) are treated, which avoids a halo.
    dark_strict = 1 - smoothstep(0.05, 0.085, blur(lum, 2))
    bg = blur(dark * (1 - head) + dark_strict * head, 4)

    # 1. Background: darker and neutral, curtain texture preserved.
    grey = lum[..., None].repeat(3, -1)
    rgb = rgb + (grey - rgb) * (bg * BG_DESATURATE)[..., None]
    rgb = rgb * (1 - bg * BG_DARKEN)[..., None]

    # 2. Temperature.
    rgb = rgb * np.array(TEMPERATURE)

    # 3. Skin tone and highlights.
    hue, sat, val = rgb_to_hsv(np.clip(rgb, 0, 1))
    skin = smoothstep(0.15, 0.32, sat) * (1 - smoothstep(38, 55, hue)) * smoothstep(0.12, 0.3, val) * (1 - bg)
    skin = blur(skin, 14)
    lum = luminance(rgb)
    grey = lum[..., None].repeat(3, -1)
    rgb = rgb + (grey - rgb) * (skin * SKIN_DESATURATE)[..., None]
    rgb[..., 0] *= 1 - SKIN_RED_REDUCTION * skin
    rolloff = 1 - SKIN_HIGHLIGHT_ROLLOFF * smoothstep(0.66, 0.88, lum) * skin
    rgb = rgb * rolloff[..., None]

    # 4. Fill light on facial shadows.
    lum = luminance(rgb)
    lift = FILL_LIGHT * smoothstep(0.12, 0.24, lum) * (1 - smoothstep(0.3, 0.55, lum)) * head * (1 - bg)
    rgb = rgb * (1 + lift)[..., None]

    # 5. Mild S-curve contrast applied to luminance only, so saturation is unchanged.
    rgb = np.clip(rgb, 0, 1)
    lum = luminance(rgb)
    curved = lum - CONTRAST * np.sin(2 * np.pi * lum) / (2 * np.pi) * 4
    rgb = rgb * (curved / np.maximum(lum, 1e-4))[..., None]
    return np.clip(rgb, 0, 1)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--compare', type=Path, help='also write a side-by-side before/after PNG')
    args = parser.parse_args()

    original = Image.open(SOURCE).convert('RGB')
    result = Image.fromarray(np.uint8(np.round(enhance(np.asarray(original).astype(float) / 255) * 255)))
    result = result.filter(ImageFilter.UnsharpMask(radius=2, percent=35, threshold=3))
    result.save(TARGET, 'WEBP', quality=90, method=6)
    print(f'wrote {TARGET.relative_to(ROOT)}')

    if args.compare:
        w, h = original.size
        combo = Image.new('RGB', (w * 2, h))
        combo.paste(original, (0, 0))
        combo.paste(result, (w, 0))
        combo.resize((w, h // 2)).save(args.compare)
        print(f'wrote {args.compare}')


if __name__ == '__main__':
    main()
