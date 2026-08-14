# Extol Affiliates — DESIGN.md

Route A · Forest & moss. Structure and UX modelled on **tennr.com**, dressed in
Extol's own green. Every token derives from Extol alone.

---

## 01 · Scope

**Site TYPE** — Company. AI automation agency and AI consultancy with a go-to-market
specialism. Follows the COMPANY section pattern.

**Build TIER** — Tier 1 bespoke block-build, adapted to static HTML: hand-written CSS
design system + GSAP (core + ScrollTrigger via CDN). No page builder, no theme, no
build step. The craft is stack-agnostic (house law 7).

**CLIENT UNIVERSE** — **This build replaces the existing site.** extolaffiliates.com
currently runs a single-page Next.js 14 app on Vercel (live since 2026-04-20). This
static multi-page site supersedes it. Decision taken 2026-07-30. Migration steps are
in README.md → "Replacing the current site"; the old build's palette, fonts and logo
pack are deliberately not carried over.

**BRAND input** — New identity originated here. The client chose to design a new mark
rather than carry over `logo-icon.png` / `logo-wordmark.png` from the existing site.

---

## 02 · The semantic field

**Extol** — to raise, to lift, to praise highly. **Affiliates** — the linked, the allied.

The double meaning running the mark and the taglines: Extol is both *elevation* (the
number goes up) and *endorsement* (you are worth recommending).

**The mark** — an ascending series of connected nodes, the last one in moss. Reads three
ways at once: a growth line, an affiliate network, an automation flow. *Interim — a new
mark is still to be designed.*

**The field motif** — layered planes fanning upward out of the dark. Reads as the four-layer
stack the whole proposition rests on, and as light breaking through. It is the site's
signature image and it appears at the top of every page.

---

## 03 · Route history

| Route | What it was | Verdict |
|---|---|---|
| A₁ | Editorial premium — Zodiak serif on warm cream, brass accent | Reviewed, rejected: read as premium-advisory, not AI |
| A₂ | Clean technical — General Sans, near-monochrome greige | Reviewed, rejected: "too light / washed out" |
| **A₃** | **Tennr structure, forest & moss green** | **Shipped** |

Two green alternates were built and shown before A₃ was picked: **B** emerald & jade
(cooler, more fintech) and **C** olive & chartreuse (warmer, edgier). Both remain valid
if positioning shifts — the palette is six tokens in one place.

---

## 04 · Tokens (narrative names)

| Name | Hex | Job |
|---|---|---|
| **Field top** | `#0C1A11` | deepest forest — top of every field |
| **Field mid** | `#1B3A22` | mid gradient |
| **Field bottom** | `#25482A` | base of the field |
| **Oat** | `#EDE9DC` | primary light canvas — warm, never white |
| **Oat 2** | `#E4DFCE` | alternating light section |
| **Forest** | `#1D2A1B` | ink on oat — warm, never black |
| **Bone** | `#EAE7DA` | ink on the field |
| **Moss** | `#C6DE93` | accent on dark |
| **Fern** | `#55703A` | accent on light |

**Colour law observed:** no pure black, no pure white, warm neutral throughout.
**Palette purity observed:** none of these hexes appears in another Shaka client's palette.

---

## 05 · Type

**One face, everywhere: Oranienbaum.**

| | |
|---|---|
| Face | **Oranienbaum** Regular |
| Licence | SIL Open Font License 1.1 — free for commercial use, embeddable |
| Source | self-hosted, `assets/fonts/oranienbaum-regular.woff2` (35 KB) |
| Weights available | **400 only** |

Oranienbaum is a high-contrast display serif. It replaced the previous
Helvetica system stack on 2026-08-14 at the client's instruction.

### The constraint this creates

The face ships in **one weight**. Every `font-weight` in the stylesheet is
therefore `400`, and `font-synthesis: none` is set on `body` so no browser
fakes a bold — synthetic bold on a high-contrast serif thickens the stems and
leaves the hairlines alone, which looks broken.

Hierarchy runs on **size, tracking, colour and case** instead of weight:

- Eyebrows — 13px, `0.14em` tracking, uppercase, `--ink-45`
- Display — large, `0.01em` tracking
- Body — 18px, `-0.030em` tracking, `--ink-70`
- Emphasis (`<strong>`) — marked by colour (`--ink`), not weight

### Known trade-off

This is a display face doing body-text duty. At 18px its hairlines are thin,
and long prose (the insights article, the privacy page) reads lighter and more
editorial than a text face would. If body copy ever needs to feel sturdier, the
fix is a second face for body only — not a heavier weight, which does not exist.

The font has **no `→` glyph** (U+2192). All arrows on the site are already
inline SVG (`.fig-arrow`), so nothing breaks — but do not type a literal arrow.

---

## 06 · Structure — what was taken from the reference

- **Full-bleed saturated field hero**, copy bottom-left, not centred.
- **Layered geometric motif** over a vertical gradient, brightening toward the centre.
- **Film grain** across the whole page at 5%.
- Mono eyebrow → light serif H1 → light sans paragraph → **square outline button**.
- **Minimal nav**: logo left, CTA + burger right, full-screen overlay menu.
- Alternating **oat sections with bespoke flat illustration** — no photography anywhere.
- **Callout chips** on the set-piece diagram, appearing one at a time on scroll.
- Warm ink, never black; warm paper, never white.

## 07 · Motion

Split-text heading reveals (each word masked so nothing ghosts over the copy beneath) ·
scroll-reveal with stagger · animated counters · path-drawing diagrams · callout chips ·
the field motif settling into place on load · marquee tagline strips.

Everything degrades: content is visible by default and only hidden once JS confirms GSAP
loaded. `prefers-reduced-motion` disables all of it.

**Zone transitions.** The page tone travels with the scroll rather than cutting at
section edges. Each section keeps its own background and JS inserts a gradient band
at every boundary where the colour changes, bleeding the previous zone down into the
next (`.zone-fade`, `initZoneFades()`).

An earlier attempt animated `body`'s background colour with ScrollTrigger. It was
abandoned: whichever trigger point you choose, one section's text ends up on the
other section's colour mid-transition — the dark CTA zone would fire while the light
pricing section's dark text was still on screen. Per-section backgrounds plus a
blended boundary gives the same travelling-tone effect with contrast guaranteed, and
it works without JS.

**Never animate `opacity` on `.plane`** — each plane's own opacity is what builds the
depth of the field. Fade the `[data-motif]` group instead.

## 08 · Refuses to be

- No drop shadows. No rounded cards. No glassmorphism. No icon-soup.
- No purple-to-indigo gradients. No emoji. No stock photography.
- No pure black `#000`, no pure white `#FFF`.
- No centred-everything layouts. No one-pager.
- Nothing that could sit unchanged on another developer's site.

## 09 · Compliance

Static, no analytics, no third-party cookies → no cookie banner required (ICO).
Privacy policy ships regardless.

The studio credit that normally sits in the footer is **removed at the client's
request** (2026-07-31). Noted here because it is otherwise a house constant across
every build — do not reinstate it.
