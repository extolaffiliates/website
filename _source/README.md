# _source — original assets

Untouched originals as supplied. **Not deployed** (excluded in `.vercelignore`).
Everything the site actually serves lives in `assets/` and has been processed —
trimmed of transparent padding, resized and recompressed. Keep these so that work
can be redone or reversed.

## Logos → `assets/img/logos/`

| Original | Ships as | What was done |
|---|---|---|
| `3d-images-logo-transparent.png` | `3d-images.png` | trimmed, 828×168 → 400×70 |
| `logo-white.png` | `london-media-lounge.png` | trimmed 1920×1080 → 320×166 (was mostly empty canvas) |
| `cropped-tavistock-logo@2x.png` | `tavistock.png` | trimmed only |
| `amidessigns-logo-transparent.png` | `amidesigns.png` | trimmed, 1147×305 → 320×82 |
| `shaka-lockup-transparent.png` | `shaka.png` | trimmed, 444×390 → 400×350 |
| `BloggerlyLogo.svg` | `bloggerly.svg` + `bloggerly-white.svg` | white reversed version authored from it |
| `favicon.svg` | *(unused)* | was a base64 raster in an SVG shell, superseded by the 3D Images lockup |

Dark logos are inverted to white in CSS, not baked in — see `.marquee__logo--dark`.

## Fonts → `assets/fonts/`

`Archivo-VariableFont_wdth,wght.ttf` → `Archivo-Variable.woff2` (652 KB → 182 KB).
The italic variable font is archived but **not shipped** — the design uses no italics.

To regenerate the woff2:

```bash
python3 -c "
from fontTools.ttLib import TTFont
f = TTFont('_source/fonts/Archivo-VariableFont_wdth,wght.ttf')
f.flavor = 'woff2'
f.save('assets/fonts/Archivo-Variable.woff2')"
```

Archivo is OFL licensed — `OFL.txt` must ship alongside it, and it does.
