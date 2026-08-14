# CONTENT-TODO — everything Extol must supply before launch

Anything on the site I could not know is either wrapped in `[square brackets]` or
carries a visible **PLACEHOLDER** tag rendered on the page (the `ph` class).
Nothing invented is presented as fact without one of those two markers.

**To remove a marker:** delete the `ph` class from the element and its
`<span class="ph__tag">…</span>` child. When they're all gone, delete the `.ph`
rule from `assets/css/style.css` (section 24).

---

## 1 · BLOCKING — the site should not go live with these

| # | What | Where |
|---|---|---|
| 1 | ~~**Contact form endpoint.**~~ Resolved 2026-08-14 — the form was replaced by a Calendly link (`calendly.com/admin-extolaffiliates/30min`). No endpoint needed. | contact.html |
| 2 | **Real domain.** Canonical and Open Graph URLs are set to `https://www.extolaffiliates.com`. | `SITE` in the build script, or find/replace across all 12 files |
| 3 | **Company details.** Registered name, company number, registered address. | `contact.html`, `privacy.html`, footer |
| 4 | **Privacy policy legal review.** Drafted to a sensible UK GDPR shape, but a solicitor must approve it. Named processors are bracketed. | `privacy.html` |
| 5 | ~~**Email address.**~~ Confirmed `admin@extolaffiliates.com`, set on all pages 2026-08-14. | all pages |
| 6 | **LinkedIn URL.** Currently points at `linkedin.com`. | footer, `contact.html` |
| 7 | **Remove the staging `noindex`.** `vercel.json` sends `X-Robots-Tag: noindex, nofollow` so the staging URL can't be indexed or compete with the live domain. **Delete that header the moment the real domain is attached, or the site will be invisible to Google.** | `vercel.json` |

## 2 · Client quotes — all placeholder, none invented

Four quote slots are bracketed and tagged. I deliberately did **not** write plausible
testimonials, because a fabricated quote attributed even to an unnamed role is a fake
review. Supply real ones with written approval from the client, or delete the blocks.

`index.html` · `about.html` · `work-onboarding-operations.html` ·
`work-pipeline-engine.html` · `work-support-operations.html`

## 3 · Team — all placeholder

Four member cards with `[Full name]`, `[Role]`, `[Credentials]` and empty portrait
frames. House convention prints qualifications verbatim and unabbreviated
("BComm (WITS)", "ACII") — supply them exactly as held.

Portraits: 3:4 ratio. `about.html`

## 4 · Numbers — illustrative, tagged on every page they appear

Every statistic is plausible for this kind of work but **none is real**. Each stats
block carries a visible "Illustrative figures" tag. Replace with true numbers or
delete the block — a stats band with soft numbers is worse than no stats band.

- Home: 6 weeks / 40+ workflows / 11 tools / 0 headcount
- Work: 94% still live / 3 tools removed / 6 weeks / 2 quarters
- About: founded 2023 / 40+ / 4 live / 0 licences resold
- Each case study: its own four figures

## 5 · Case studies — structure is real, specifics are not

Three cases are written end to end in the right shape (situation → what we did →
what it changed → what we built → stack). The sector, stage, duration and outcome of
each need replacing with real engagements. Clients are described by sector and stage
rather than name — keep that convention unless you have written permission to name them.

`work-onboarding-operations.html` · `work-pipeline-engine.html` ·
`work-support-operations.html`

## 6 · Insights

One full article is written and ready: *The GTM automation stack, explained*
(`insights-gtm-automation-stack.html`). Its date reads July 2026 — correct it if that's
wrong. Four further titles are listed on `insights.html` under a "Planned" tag as
layout demonstration; either write them or delete those rows.

## 6a · Logo strip ("Associated with")

Five marks are live in `assets/img/logos/`, scrolling right to left on the dark
band under the hero. Each was trimmed of transparent padding and resized.

| File | Source | Treatment | Status |
|---|---|---|---|
| `london-media-lounge.png` | logo-white.png | white, used as-is | ✅ |
| `tavistock.png` | cropped-tavistock-logo@2x.png | dark, inverted to white | ✅ |
| `bloggerly-white.svg` | BloggerlyLogo.svg | reversed: white badge, B knocked out | ⚠️ see note below |
| `amidesigns.png` | amidessigns-logo-transparent.png | dark, inverted to white | ✅ |
| `3d-images.png` | 3d-images-logo-transparent.png | dark, inverted to white | ✅ full lockup, replaced the mark-only version |
| `shaka.png` | shaka-lockup-transparent.png | dark, inverted to white | ✅ **stacked** lockup — carries its own taller size class |

All six supplied logos are in. The original `Shaka Studio Lockup_Black_ copy.png`
was a 0-byte file; `shaka-lockup-transparent.png` was used instead.

**Worth improving:** Shaka's lockup is stacked (mark above word) while every other
logo is horizontal. It needs `--stacked` sizing to stay legible, which makes it
taller than its neighbours. A horizontal Shaka lockup would sit better.

Notes on treatment: the set mixes white, black and full-colour marks, so each gets
its own class (`--light`, `--dark`, `--stacked`) rather than one blanket filter.
A blanket `brightness(0) invert(1)` would have turned Bloggerly into a solid white
square, erasing the "B" inside it.

**Bloggerly needs checking.** Their supplied file is a red badge with the "B" set as
*live text* in Inter — a font this site doesn't load, so the letter renders in a
fallback face. To get a white version I built `bloggerly-white.svg`: a white badge
with the B knocked out. It works, but the letterform still depends on whatever
font the browser substitutes.
**Ask Bloggerly for their official reversed/white logo**, ideally with the B as a
vector path rather than text. Their original file (`bloggerly.svg`) is kept in the
folder if you want to revert to full colour — swap the `src` and change the class
from `--light` to `--brand`.

To add another: drop the file in, then copy a `<span class="marquee__logo ...">`
line in `index.html` — twice, since the list is duplicated so the loop reads full.

## 6b · Certificates (footer credential band)

A "Certified" band sits on every page, just above the copyright line — small,
monochrome, below the fold. Deliberately quieter than the client logos:
certificates are supporting evidence, not the headline claim.

Three slots, each bracketed:

```
[Certificate name]
[Issuer] · [Year]
```

Replace the bracketed text in **all 12 files** (find & replace on
`[Certificate name]`). Add or remove `<span class="cred">` blocks to change the
count. Delete the whole `<div class="footer__creds">` block if you drop the idea.

Before publishing:
- **Only list what you actually hold** — certificates are checkable.
- **Check the issuer's brand rules.** Most vendors specify how their name and
  badge may be used, and many allow you to state a certification but not to imply
  partnership. The generic tick mark used here avoids that problem; if you swap in
  an official badge graphic, follow their guidelines.
- Keep the text doing the work — at this size a badge graphic alone is unreadable.

An "About page" version was also mocked up (three hairline cards with a line each
on what the certificate proves). Worth adding alongside, since a visitor on About
is already looking for credibility.

## 7 · Nice to have

- **Open Graph image.** No `og:image` is set, so link previews will have no picture.
  Supply a 1200×630 PNG and add `<meta property="og:image">` to the head.
- **Real logo.** The wordmark is set in General Sans with an SVG node mark I drew from
  the brand's semantic field. If Extol has a real logo pack, it replaces both.
- **Favicon.** `assets/img/favicon.svg` uses the same mark. Add a 180×180 PNG for
  older iOS if you care about it.
- **Font licences.** General Sans and IBM Plex Mono are free for commercial use. If you
  prefer the house faces (Neue Montreal, Heldane), those must be purchased.

## 8 · Explicitly NOT needed

- **No cookie banner.** The site sets no analytics, advertising or tracking cookies,
  so under ICO guidance no consent banner is required. If you later add analytics,
  that changes and a banner becomes mandatory.
