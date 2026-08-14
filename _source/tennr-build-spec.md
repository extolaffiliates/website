# Build spec — Tennr layout system, Extol green

Measured from tennr.com at 1440×900 via Playwright (computed styles, not eyeballed).
**Take: layout, rhythm, component mechanics.** Do NOT take their copy, images,
Lottie files, fonts, logo, or source. Words are the client's; palette is Extol's.

---

## 1 · Shell and grid

```
.shell       max-width 1440px; padding-inline 42px
```
Their container is an **asymmetric 3-column grid**: `120px | 1052px | 184px`.
The narrow left rail carries eyebrows/labels; the wide centre carries content;
the right rail is mostly air. Reproduce as:
`grid-template-columns: 120px minmax(0,1fr) 184px;` collapsing to one column below 1024px.

## 2 · Vertical rhythm — FIXED, not fluid

| Token | Value | Used on |
|---|---|---|
| `--sec-lg` | **140px** | feature-list |
| `--sec` | **120px** | most sections |
| `--sec-sm` | **80px** | testimonials |

Padding is `padding-block` on both sides. No `clamp()` at desktop; scale down
only below 900px (halve to 70/60/40).

## 3 · Measured section heights (the pacing to reproduce)

`757 · 1124 · 565 · 762 · 687 · 1079 · 844 · 610 · 953`

Deliberately uneven — roughly `short · LONG · short · medium · short · LONG ·
medium · short · LONG(footer)`. Do not normalise these. The footer is 953px and
is a full section in its own right, not a strip.

## 4 · Type system

| Role | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Display / H1 | 40px | **300** | **+0.4px (positive)** | restrained; never 80px+ |
| Section H2 | 26–28px | 400 | normal | the workhorse |
| Sub-head | 21px | 300 | −0.63px | |
| Body | 18px | **300** | **−0.54px (negative)** | |
| Eyebrow | 13–14px | **700** | **+1.82px / +2.4px** | UPPERCASE |

**The signature is the opposition:** display tracks OPEN (+), body tracks CLOSED (−).
Both run LIGHT (300). Reproduce that relationship exactly — it matters more than
the absolute numbers.

## 5 · Buttons — text, not boxes

Measured: `padding: 0; border: none; background: transparent;`
`font-size: 14px; letter-spacing: 1.82px; text-transform: uppercase; font-weight: 400`

They are **plain uppercase text links**, optionally with a hairline underline or a
thin box on the primary CTA only. Our current chunky outline buttons are wrong —
replace them.

## 6 · Repeater gaps — varied on purpose

`55px` (feature cards) · `26px` (card wrapper) · `96px` (feature list) · `80px`
(list content). Flexbox, not grid, for these rows.

## 7 · Nav

Height **99px**, `position: sticky`, `background: transparent`. Logo left,
horizontal links centre-right, one CTA far right. Not burger-only at desktop.

## 8 · Extol palette (unchanged — this is ours)

```
--field-top #0C1A11   --field-mid #1B3A22   --field-bot #25482A
--oat #EDE9DC   --oat-2 #E4DFCE   --forest #1D2A1B   --bone #EAE7DA
--moss #C6DE93  --fern #55703A
--ink-70 #4A5545   --ink-45 #5A6255   --rule #D2CBB6
```
Type: `"Helvetica Neue", Helvetica, Arial, sans-serif` (system, no webfont).

## 9 · Page inventory to build

`index · what-we-do · work · work-onboarding-operations · work-pipeline-engine ·
work-support-operations · insights · insights-gtm-automation-stack · about ·
contact · privacy · 404`

Shared chrome (head, header, nav overlay, footer) must be **identical** across all
12 — copy it verbatim from the current `index.html` and change only `<title>`,
`<meta name="description">` and the canonical URL.

## 10 · Keep from the current build

Film grain · zone-fade gradient bands between sections · the layered field motif ·
the iso stack and lead-record SVG diagrams · the logo marquee · split-text and
scroll-reveal motion · `prefers-reduced-motion` handling · the `?v=` cache-buster
on CSS/JS links.
