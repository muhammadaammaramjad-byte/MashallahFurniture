# Mashallah Furniture — Ideas & Professional Roadmap

A prioritized catalogue of feature ideas, UX/conversion improvements, content additions, technical upgrades, and operational initiatives for evolving Mashallah Furniture into a best-in-class furniture commerce experience.

Each idea includes **why it matters**, **effort**, and **impact** so the team can pick up any card in isolation.

Legend: 🟢 low effort · 🟡 medium · 🔴 high · ⭐ high business impact

---

## 1. Catalog & Content Depth

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Per-product detail page** (`Shop/product.html?id=fnXXX`) with gallery, dimensions, materials, highlights, reviews, "customers also bought". | Product-level pages are the single highest-leverage commerce surface. Conversion, SEO, and AOV all improve. | 🟡 | ⭐⭐⭐ |
| **Richer product data** — already started in `assets/data/products.json` (gallery, SKU, dimensions, materials, warranty, sustainability). Next: per-product reviews JSON and `relatedIds[]`. | Unlocks the detail page above plus filter surface area. | 🟢 | ⭐⭐ |
| **Structured data / JSON-LD** on product and home pages (Product, Offer, Organization, BreadcrumbList). | Google rich results, richer social shares, better SEO. | 🟢 | ⭐⭐ |
| **Blog / editorial** (`/Journal/`) — buying guides, care guides, designer interviews, room-by-room inspiration. | Top-of-funnel traffic and brand authority; gives collections narrative depth. | 🟡 | ⭐⭐ |
| **Lookbook pages** per collection with interactive "shop-the-look" hotspots on lifestyle images. | Converts aspirational visitors into cart additions. | 🟡 | ⭐⭐ |

## 2. Conversion & Merchandising

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Free design consultation** booking modal (30-minute video call with a designer). CTA already exists on `index.html`; wire it to a simple Calendly embed or a lightweight in-house flow. | High-intent lead capture, great for AOV on large rooms. | 🟡 | ⭐⭐⭐ |
| **"Complete the room" bundles** — preset curated bundles (e.g. "Japandi Bedroom" = platform bed + nightstand + pendant) with a bundle discount. | Increases AOV and tells a design story. | 🟡 | ⭐⭐ |
| **Compare up to 3 products** toggle on Shop cards. | Common user need when deciding between high-ticket items. | 🟡 | ⭐ |
| **Back-in-stock notifications** — form field on sold-out products (e.g. `fn005`). Store email in `localStorage` for now; migrate to server later. | Recovers lost demand on OOS items. | 🟢 | ⭐ |
| **Recently viewed** rail on Home and Shop. | Low-cost, proven uplift in return-user conversion. | 🟢 | ⭐ |
| **Price-drop badge** automatically when `oldPrice > price` (already modeled in JSON — compute `discountPercent`). | Transparent savings. Drives the "SALE" psychology. | 🟢 | ⭐ |
| **Dynamic trust bar** — "30-day returns · Free shipping over $99 · 100-night mattress trial". Present above the fold on all pages. | Objection-handling real-estate. | 🟢 | ⭐ |

## 3. Account & Checkout

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Guest checkout** path that doesn't require account creation. | Reduces friction — industry-standard. | 🟡 | ⭐⭐⭐ |
| **Saved addresses & payment methods** (localStorage for now, server-backed later). | Smoother repeat purchases. | 🟡 | ⭐⭐ |
| **Order tracking page** using the simulated order ID — display timeline steps (Ordered → Packing → Shipped → Delivered). | Reduces support tickets and gives customers confidence. | 🟡 | ⭐⭐ |
| **Wishlist sharing** — shareable link that loads the wishlist from a query param. Great for gift-giving. | Viral loops, wedding registries. | 🟡 | ⭐ |
| **Wallet top-up → gift card** gifting flow. | Great for holiday season. | 🟡 | ⭐ |

## 4. Search & Navigation

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Full-text search over products with fuzzy matching** (e.g. Fuse.js, ~1 KB once minified). Currently `Search/search.html` is a placeholder. | Fast, forgiving search dramatically boosts findability. | 🟢 | ⭐⭐⭐ |
| **Faceted filters on Shop** — category, price range, color swatch, in-stock only, rating, sustainability badge. | Table stakes for a 30+ product catalog. | 🟡 | ⭐⭐⭐ |
| **Tag-based browsing** — clickable chips like "boucle", "walnut", "compact", "ergonomic". | Leverages the rich tag data already in `products.json`. | 🟢 | ⭐⭐ |
| **Mega-menu** on desktop navbar with category thumbnails. | Lets shoppers teleport; reduces page depth. | 🟡 | ⭐ |
| **URL state for filters** — bookmarkable and shareable. | Better UX + SEO-indexable filter pages. | 🟡 | ⭐ |

## 5. Trust, Reviews & Social Proof

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Verified reviews** per product — ratings, photos, Q&A. Start with a simple `assets/data/reviews.json`. | Single biggest conversion lever on expensive goods. | 🟡 | ⭐⭐⭐ |
| **User-generated photos** (#MashallahAtHome) in a homepage rail. | Social proof + inspiration. | 🟡 | ⭐⭐ |
| **Press / as-seen-in strip** (logos: AD, Dwell, Apartment Therapy). | Brand credibility in seconds. | 🟢 | ⭐ |
| **Trade Program landing page** (designers, architects, stagers) with a simple application form. | Higher-AOV B2B channel. | 🟡 | ⭐⭐ |

## 6. Design System & UI Polish

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Centralize tokens** (colors, spacing, radii) as CSS custom properties in `css/global.css` so every page references the same palette. | Consistency across 10+ pages. | 🟢 | ⭐⭐ |
| **Shared card, button, input primitives** (`.btn`, `.card`, `.chip`, `.badge`). Several pages re-implement these today. | Reduced CSS bloat, predictable UI. | 🟡 | ⭐⭐ |
| **Dark mode** that respects `prefers-color-scheme` and persists to `localStorage`. Toggle already exists on Home — wire it to a `.dark` body class with token overrides. | Modern standard; battery-friendly. | 🟡 | ⭐ |
| **Skeleton loaders** on product grids while data fetches. | Perceived performance. | 🟢 | ⭐ |
| **Animation budget** — audit home.css (~2,400 lines) for unused keyframes; respect `prefers-reduced-motion`. | Performance + accessibility. | 🟡 | ⭐ |

## 7. Accessibility

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Run axe-core / Lighthouse a11y pass** on every page and remediate violations. | Legal/inclusion baseline. | 🟡 | ⭐⭐ |
| **Focus-visible states** on every interactive element (outlined with `--accent`). Partially done on `index.html` and `404.html` — extend to all pages. | Keyboard navigation is a dealbreaker for many users. | 🟢 | ⭐⭐ |
| **Image alt text audit** — many Unsplash photos currently have short or duplicate alt. Make alt text descriptive and context-specific. | Screen readers + SEO. | 🟢 | ⭐ |
| **Form labels** — ensure every input has a persistent visible label or aria-label. | Accessible + better autofill. | 🟢 | ⭐ |
| **Color contrast** audit for light-grey text on cream backgrounds. Aim for 4.5:1 minimum. | WCAG AA. | 🟢 | ⭐ |

## 8. Performance

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Serve images from a CDN with width queries** (Unsplash already supports `&w=`). Use `<picture>` with multiple sources for responsive loading. | Faster LCP on mobile. | 🟢 | ⭐⭐ |
| **Lazy-load below-the-fold images** (`loading="lazy"`). | Simple & effective. | 🟢 | ⭐⭐ |
| **Split big per-page CSS** (`Home/home.css` is 2,384 lines, `Collections/collections.css` is 3,037) into critical + deferred. | Faster first paint. | 🟡 | ⭐ |
| **Bundle with Vite** and enable code splitting so only needed JS loads per route. | Smaller payloads. | 🟡 | ⭐ |
| **Font subsetting** — load only the weights you actually use (Inter 400/500/600 + Cormorant 600/700). | -50–100 KB on initial load. | 🟢 | ⭐ |

## 9. SEO & Marketing

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Sitemap.xml & robots.txt**. | Crawler basics. | 🟢 | ⭐⭐ |
| **Meta descriptions per page** — currently only `index.html` and `404.html` have them. | Click-through from search results. | 🟢 | ⭐⭐ |
| **Open Graph & Twitter cards** with dedicated social share images. | Better social previews. | 🟢 | ⭐ |
| **Canonical URLs** on all product pages once detail pages exist. | Avoids duplicate-content penalties. | 🟢 | ⭐ |
| **Email capture** with double opt-in and a real ESP (Klaviyo, Mailchimp, Buttondown). Currently inert form on Home. | Best-ROI marketing channel for e-commerce. | 🟡 | ⭐⭐⭐ |

## 10. Operational & Engineering Hygiene

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **TypeScript migration** (Vite already supports it). Start with `js/store.js`, `js/components.js`, `js/toast.js`. | Safer refactors, fewer bugs. | 🔴 | ⭐⭐ |
| **ESLint + Prettier + Husky pre-commit** hooks. | Consistent code quality. | 🟢 | ⭐⭐ |
| **Unit tests** with Vitest for `store.js` (cart math, wishlist toggling, wallet). | Protects core commerce logic. | 🟡 | ⭐⭐ |
| **Playwright smoke tests** — "can I add to cart, open cart, proceed to checkout?". | Catches regressions that break revenue. | 🟡 | ⭐⭐⭐ |
| **CI pipeline** — GitHub Actions: install, typecheck, lint, test, build. | Every PR green-gated. | 🟢 | ⭐⭐ |
| **Vercel / Netlify preview deploys** per PR for easy review. | Huge review-velocity unlock. | 🟢 | ⭐⭐ |
| **Environment config** — one `.env.example` with public keys (analytics, ESP) and docs on how to set them. | Smooth onboarding. | 🟢 | ⭐ |

## 11. Payments & Fulfillment (simulation-ready)

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Stripe Payment Element** behind a feature flag. The existing wallet simulation is great for dev; Stripe is ready for the first real transaction. | Real checkout capability. | 🔴 | ⭐⭐⭐ |
| **Tax & shipping calculator** with a simple lookup by ZIP/region. | Transparent totals. | 🟡 | ⭐⭐ |
| **Split fulfillment** display for multi-item orders ("Ships in 2 packages"). | Sets expectations. | 🟡 | ⭐ |
| **Klarna / Affirm** integration for higher-ticket items ($500+). | Lifts conversion on big-ticket pieces. | 🟡 | ⭐⭐ |

## 12. Sustainability Storytelling

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **"Second Life" page** — explain the furniture take-back program (already referenced in FAQ). | Differentiator. | 🟢 | ⭐ |
| **Product-level sustainability badges** with tooltip explainers (FSC, OEKO-TEX, LWG, BIFMA). Data already in `products.json`. | Builds trust with conscious shoppers. | 🟢 | ⭐⭐ |
| **Annual impact report** (trees planted, water saved, leather diverted). | Story you can pitch to press. | 🟡 | ⭐ |

## 13. Accessibility Aids & Internationalization

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **Multi-language** — English + Arabic (RTL), French, German. All static content lives in HTML; consider moving to JSON-backed i18n. | Brand name is non-English-first; global audience. | 🔴 | ⭐⭐ |
| **Currency switcher** — USD / EUR / GBP / CAD / AED / PKR with a `localStorage`-persisted preference. | International reach. | 🟡 | ⭐⭐ |
| **Unit switcher** — cm ↔ in on product dimensions. | Removes friction for US shoppers. | 🟢 | ⭐ |

## 14. Analytics & Experimentation

| Idea | Why | Effort | Impact |
|---|---|---|---|
| **GA4 + a lightweight event layer** (`mashallahAnalytics.track(event, props)`). | Understand funnel + iterate. | 🟡 | ⭐⭐ |
| **Hotjar / FullStory session recordings** (respecting privacy). | See friction points. | 🟢 | ⭐⭐ |
| **A/B testing framework** for hero headlines, CTA copy, and pricing anchors. | Data-driven iteration. | 🟡 | ⭐ |

---

## Quick Wins (do these first)

1. Fix remaining brand naming inconsistencies across all pages and `<title>` tags. ✅ *Done in this PR.*
2. Enrich `products.json` with SKU, dimensions, materials, warranty, sustainability, and tags. ✅ *Done in this PR — 30 products.*
3. Polish `index.html` and `404.html` with a consistent design system. ✅ *Done in this PR.*
4. Add `categories.json`, `testimonials.json`, `brands.json`, `faq.json`, `collections.json` data files. ✅ *Done in this PR.*
5. Add meta descriptions and OpenGraph on every top-level page. 🔜
6. Add `sitemap.xml` and `robots.txt`. 🔜
7. Add a real faceted filter experience on `Shop/shop.html`. 🔜
8. Build a real product detail page. 🔜
9. Wire the newsletter form to an ESP. 🔜
10. Wire up GitHub Actions CI (lint + build). 🔜

---

## Suggested Next Milestone (post this PR)

**Milestone: "Product Detail v1"**
- `Shop/product.html?id=fnXXX`
- Gallery + zoom, dimensions, materials, highlights, warranty, sustainability, reviews, "complete the look" rail
- URL-shareable
- Structured data (JSON-LD)
- **Why:** Without product pages the site can't convert high-intent visitors. This unlocks real SEO and real revenue.
