# Morph brand assets

Source of truth for Morph's visual identity. Product code copies from here;
edits to brand assets happen in this directory first.

## Concept — "morph bars"

The mark is three verticals whose corners relax from square to pill to full
circle: an abstract letter **M** caught mid-transformation. It reads as
"Morph" at any size and renders with three primitives.

## Tokens

| Token         | Hex       | Use                                    |
| ------------- | --------- | -------------------------------------- |
| indigo        | `#4F46E5` | primary; gradient start                |
| indigo-light  | `#6366F1` | gradient midpoint / secondary surfaces |
| cyan          | `#06B6D4` | gradient end; accents                  |
| ink           | `#0F172A` | wordmark and text on light surfaces    |
| paper         | `#F8FAFC` | light backgrounds                      |

Gradient: linear, indigo `#4F46E5` → cyan `#06B6D4`, applied across all
three shapes (`gradientUnits="userSpaceOnUse"`). Do not re-colour or split
the gradient per shape.

## Assets

| File                     | What it is                                             | Consumed by |
| ------------------------ | ------------------------------------------------------ | ----------- |
| `mark.svg` / `mark-mono.svg` | the icon, gradient / `currentColor` variants       | app UI, docs |
| `wordmark.svg` / `wordmark-mono.svg` | "Morph" text, ink / `currentColor`     | headers, footer credits |
| `lockup.svg`              | mark + wordmark, horizontal                           | navbar, README |
| `favicon.svg`             | 32-viewBox compact mark                               | browsers (with the .ico) |
| `banner.svg`              | login-page decorative banner                          | Studio login |
| `hero.svg`               | default published-site hero (1600×900)                | template default content |
| `site-placeholder.svg`   | dashboard site-card thumbnail                         | Studio site list |
| `og-image.svg`           | 1200×630 social card (rasterize before use)           | — |

## Usage rules

- Clear space around the mark: one bar-width on all sides.
- Minimum mark size: 16×16 px (use `favicon.svg` proportions below 24 px).
- The wordmark uses the system UI font stack by design — no font files.
- Mono variants inherit `currentColor`; use them on coloured surfaces.
- Never stretch, rotate, outline, or re-colour the gradient.

## Regenerating `favicon.ico`

```
python brand/scripts/generate-favicon.py apps/studio/public/favicon.ico
```

Dependency-free (stdlib only); rasterizes the same geometry as
`favicon.svg` into 16/32/48 px entries. Keep the geometry in the script and
`favicon.svg` in sync.
