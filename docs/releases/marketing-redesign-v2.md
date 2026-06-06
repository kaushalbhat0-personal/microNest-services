# Marketing Redesign v2

_Release date: 2026-06-06_

## Before vs After

### Homepage

| Aspect | Before | After |
|--------|--------|-------|
| Sections | 3 (Hero, Ecosystems grid, CTA) | 8 (Hero, Problem, Showcase, Why Choose, Real Screens, Social Proof, Pricing, Final CTA) |
| Hero text | "Your platform. Your ecosystems." | "Run your business without spreadsheets." |
| Design | Indigo gradient hero, gray sections | Cream background with charcoal text, lavender accent |
| Product preview | None | Dashboard mockup with live stats |
| Navigation | Simple link list | Premium nav with Products dropdown, full-screen mobile drawer |
| Mobile | Basic responsive | Floating CTA, full-screen drawer, touch-optimized targets |

### Ecosystems Page

| Aspect | Before | After |
|--------|--------|-------|
| Layout | Dashboard-style cards in grid | Large featured cards with screenshots, benefits, dual CTAs |
| Available products | 4 equal cards | 2 large featured (StayNest, ClinicNest) + 2 coming soon |
| Coming soon | Same card style, grayed out | Separated section with distinct styling |
| Roadmap | None | Visual timeline with status indicators |
| Product details | Name + description only | Screenshots, feature tags, benefit lists, CTAs |

## Sections Added

### Homepage
1. **Hero** — Conversion-focused headline, real dashboard mockup, dual CTAs
2. **Problem** — 4 pain-point cards targeting each audience segment
3. **Ecosystem Showcase** — Large product cards with live/early-access status, screenshots, feature tags, CTAs
4. **Why Customers Choose** — 3-column value proposition (Purpose Built, Unified Login, Grow Together)
5. **Real Screens** — 4 software mockups showing actual dashboard views
6. **Social Proof** — 3 testimonial cards with generic placeholders
7. **Pricing Preview** — 3 pricing tiers with feature comparison
8. **Final CTA** — Strong conversion call-to-action on dark background

### Ecosystems Page
1. **Available Now** — Large featured cards with product screenshots, benefit lists, feature tags, status badges, dual CTAs
2. **Coming Soon** — Distinct section with smaller cards, notification CTA
3. **Ecosystem Roadmap** — Visual vertical timeline with color-coded status indicators

## Mobile Improvements

- **Floating bottom CTA** — Appears on mobile after scrolling 400px, fixed to bottom, with "Start Free" button
- **Full-screen navigation drawer** — Slide-in from right with backdrop, large touch targets (48px+), product list, CTA at bottom
- **Bottom padding** — `pb-16` on main content to prevent content from being hidden behind floating CTA
- **One-column layouts first** — All sections stack vertically on mobile, expand to multi-column on `sm:` and `md:` breakpoints
- **Tighter spacing** — Reduced padding and gaps on mobile, expanded on desktop
- **Tap targets** — All interactive elements sized for touch (min 44px)
- **Hamburger menu** — Accessible, full-screen overlay replaces the previous hidden desktop-only nav

## SEO Improvements

- **Root layout metadata** — Updated title template, description, OpenGraph tags
- **Homepage metadata** — Page-specific title, description, OpenGraph
- **Ecosystems page metadata** — Page-specific title, description, OpenGraph with all ecosystem names
- **Semantic HTML** — Proper section elements, heading hierarchy (h1 → h2 → h3)
- **Title template** — `%s | MicroNest` pattern for consistent page titles

## Conversion Improvements

| Goal | Implementation |
|------|---------------|
| Mobile signups | Floating bottom CTA on all marketing pages |
| Product discovery | "Explore StayNest" and "See Ecosystems" CTAs in hero |
| Trust building | Real dashboard mockups, social proof, transparent pricing |
| Understanding | Problem → Solution → Showcase → Screens → Pricing flow |
| Reduced friction | Multiple CTA placements throughout the page |
| Social validation | Testimonial cards with role-specific quotes |
| Urgency | "Free forever" and "No credit card" messaging |

## Performance Impact

- **Build result:** Successful — zero errors
- **No heavy animation libraries** — Uses CSS transitions and Tailwind's built-in `animate-fadeIn` only
- **No Framer Motion, GSAP** — All animations are CSS-based
- **Lighthouse mobile target:** >90 (no blocking scripts, no heavy libraries)
- **Bundle size:** Homepage — 176B (static), Ecosystems — 176B (static)

## Files Created

| File | Purpose |
|------|--------|
| `packages/ui/src/FloatingCTA.tsx` | Mobile floating bottom CTA component |
| `docs/releases/marketing-redesign-v2.md` | This release document |

## Files Modified

| File | Change |
|------|--------|
| `apps/web/tailwind.config.ts` | Added `border-light` color token |
| `apps/web/src/app/layout.tsx` | Updated metadata, OpenGraph, body colors |
| `apps/web/src/app/(marketing)/layout.tsx` | Added FloatingCTA, mobile padding |
| `apps/web/src/app/(marketing)/page.tsx` | Complete homepage rewrite |
| `apps/web/src/app/(marketing)/ecosystems/page.tsx` | Complete ecosystems rewrite |
| `packages/ui/src/MarketingNav.tsx` | Premium redesign with Products dropdown + mobile drawer |
| `packages/ui/src/Footer.tsx` | Enhanced multi-column footer |
| `packages/ui/src/index.ts` | Added FloatingCTA export |
| `docs/current-state.md` | Added Marketing Site Redesign v2 section |

## Remaining Recommendations

1. **About page** — Create `/about` page (linked from nav, currently 404)
2. **StayNest page mobile** — Add FloatingCTA integration to the StayNest landing page
3. **Product screenshots** — Replace CSS mockups with actual product screenshots once available
4. **Social proof** — Replace generic placeholders with real customer testimonials and company names
5. **Analytics** — Add conversion tracking (signup events, CTA clicks)
6. **Performance** — Audit Lighthouse score post-deployment to confirm >90 mobile score
7. **Pricing page** — Consider aligning pricing card styling with homepage pricing preview
