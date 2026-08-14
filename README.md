# Extol Affiliates — website

A 12-page static site. Plain HTML, CSS and JavaScript — **no build step, no
dependencies, no install.** Double-click `index.html` to open it, or drag the whole
folder onto Netlify to deploy.

Read `DESIGN.md` for the brand decisions and `CONTENT-TODO.md` for everything that
still needs real content before launch.

---

## Assets

Everything the site loads at runtime lives inside this folder — there are no
external requests. Verified: 13 assets referenced, 0 missing, 0 off-site.

```
assets/css/style.css
assets/fonts/                oranienbaum-regular.woff2 (35 KB) + OFL.txt
assets/img/favicon.svg
assets/img/logos/          3d-images · amidesigns · bloggerly-white · london-media-lounge · shaka · tavistock
assets/img/team/           devasya-dwivedi.jpg · anshul-mikita-prajapati.jpg
assets/js/main.js
assets/js/vendor/          gsap.min.js · ScrollTrigger.min.js  (GSAP 3.12.5, vendored)
```

The typeface is Oranienbaum, self-hosted and preloaded on every page. It is
SIL Open Font Licensed; `OFL.txt` sits beside it as the licence requires.

GSAP used to load from jsdelivr. It is now served from `assets/js/vendor/` so a
CDN outage, a strict CSP or an offline preview cannot break the motion. To
upgrade, replace both files and bump the `?v=` string on the script tags.

Originals of every logo and font ever trialled are kept in `_source/`, which is
excluded from deploys via `.vercelignore`.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `work.html` | Case study index |
| `work-onboarding-operations.html` | Case 01 |
| `work-pipeline-engine.html` | Case 02 |
| `work-support-operations.html` | Case 03 |
| `insights.html` | Article index |
| `insights-gtm-automation-stack.html` | Full article |
| `about.html` | About, principles, team |
| `contact.html` | Enquiry form |
| `privacy.html` | Privacy policy |
| `404.html` | Not found |

## Structure

```
assets/css/style.css     the whole design system, one file, sectioned 01–25
assets/js/main.js        nav, marquee, split-text, scroll-reveal, counters
assets/img/favicon.svg   the node mark
```

Header, overlay menu and footer markup are repeated in each file — deliberate for a
no-build static site. **If you edit the nav or footer, edit it in all 12 files**
(find and replace works fine).

Every page opens on the same deep-green "field": a gradient plus layered planes, with a
scrim over it so copy always has contrast. The header starts light over the field and
flips to forest ink once you scroll past it.

## Editing

- **Copy** — open the `.html` file and edit the text. Everything is plain HTML.
- **Colour and type** — `assets/css/style.css`, section 01 (`:root`). Every colour on
  the site comes from those six tokens.
- **A new page** — copy an existing one, replace the `<main>` contents, update
  `<title>`, the meta description and the canonical URL.

## Deploying

Any static host. Nothing to compile.

- **Netlify** — drag this folder onto netlify.com/drop.
- **Vercel / Cloudflare Pages** — point at the folder, no build command, output = root.
- **GitHub Pages** — push and enable Pages on the branch root.

`404.html` is picked up automatically by Netlify, Vercel and GitHub Pages.

## Replacing the current site

extolaffiliates.com currently serves a single-page **Next.js app on Vercel**. This
static site replaces it. DNS already points at Vercel, so the least disruptive route
is to deploy this folder to Vercel too and move the domain across — no DNS change,
no propagation wait.

**Do not touch the MX records.** They route Google Workspace email. Only the `A` and
`www CNAME` records concern the website; editing anything else takes email down.

1. **Deploy this folder as a new Vercel project.** From this directory:
   ```bash
   vercel --prod
   ```
   No build command, no framework preset — it is plain static output.
2. **Check the preview URL thoroughly** before touching the domain. Every page, on
   mobile and desktop.
3. **Move the domain.** In the Vercel dashboard, remove `extolaffiliates.com` and
   `www.extolaffiliates.com` from the old Next.js project, then add them to the new
   one. Vercel will offer to transfer rather than making you delete — take that.
4. **Verify** both apex and `www` resolve, and that email still sends and receives.
5. **Keep the old project** (do not delete) for at least a month, so you can point the
   domain back within minutes if something is wrong.

### Redirects
The old site was a single page; its internal links were `#anchor` fragments, which
never reach the server and so need no redirects. If Search Console shows any indexed
path beyond `/`, add a `vercel.json` redirect for it. Worth checking before the swap.

### Before you swap
The site is **not ready for the public** while placeholders remain — see
`CONTENT-TODO.md` §1. Replacing a live site with one containing `[Certificate name]`
and illustrative statistics is worse than leaving the current one up. Clear the
blocking list first.

To preview locally with correct paths:

```bash
python3 -m http.server 4321
```

## Third-party

Loaded from CDNs, so the site needs a network connection to look right:

- **Fontshare** — Zodiak (display serif) and Switzer (body)
- **Google Fonts** — IBM Plex Mono (labels)
- **jsDelivr** — GSAP 3.12.5 core + ScrollTrigger

If any of them fail, the page still renders and reads correctly — fonts fall back to
system faces and all animated content is shown immediately rather than hidden. To
self-host instead, download the three files into `assets/` and change the `<link>`
and `<script>` tags in each page.

## Accessibility

Skip link, visible focus rings, real landmarks, `aria-label` on split-text headings,
labelled form fields, and `aria-current` on the active nav item. All motion is disabled
under `prefers-reduced-motion`. Diagrams carry descriptive `aria-label` text.

Two things to verify with real content: colour contrast if you change the tokens, and
alt text on any photography you add.

## Compliance

No analytics, no tracking cookies, no third-party embeds that set cookies — so no
consent banner is required under ICO guidance. If you add analytics later, that
changes.
