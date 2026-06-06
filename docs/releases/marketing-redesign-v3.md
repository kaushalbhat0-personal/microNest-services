# Marketing Redesign v3 — Platform-First Narrative

_Release date: 2026-06-06_

## Core Thesis

MicroNest is NOT StayNest.

MicroNest is the parent platform. StayNest is one ecosystem inside it.

This redesign establishes MicroNest as a premium ecosystem platform — the "Shopify App Store for business operations."

## Before vs After

### Homepage

| Aspect | v2 | v3 |
|--------|----|----|
| Headline | "Run your business without spreadsheets" | "One platform. Multiple business operating systems." |
| Brand positioning | Product-first (StayNest-focused) | Platform-first (MicroNest as parent) |
| Hero mockup | StayNest stats dashboard | MicroNest Hub with activated ecosystems + cross-ecosystem metrics |
| Problem section | 4 industry cards (PG, Clinics, Freelancers, Real Estate) | Visual transition: fragmented tools → MicroNest (Excel, WhatsApp, Notebook, Sheets, Reminders) |
| Ecosystem showcase | Card grids | Horizontal product rows (Apple product page style) |
| Why choose | 3 cards (Purpose Built, Unified Login, Grow Together) | 4 pillar diagrams (One Login, Shared Billing, Shared Analytics, Shared Infrastructure) |
| Real screens | 4 dashboard mockups (Analytics, Rent, Residents, Maintenance) | **Removed** — replaced by Ecosystem Map |
| Social proof | Testimonial cards | Animated CountUp metrics (1,000+ Residents, 500+ Payments, 100+ Maintenance, 50+ Properties) |
| Roadmap | Not on homepage | New dedicated section with timeline |
| Final CTA | "Start with StayNest today." | "Start with one ecosystem. Expand when you're ready." |

### Ecosystems Page

| Aspect | v2 | v3 |
|--------|----|----|
| Header | "Our ecosystems" | "Choose your operating system" |
| Layout | Large cards with feature tags | Product comparison rows with bullet feature lists |
| Content | Screenshot + feature tags + CTAs | Screenshot + 4 detailed features + dual CTAs |
| Coming soon | Cards with same styling | Dashed-border cards with distinct visual |

## New Sections

1. **Hero** — Platform-first narrative with MicroNest Hub mockup showing:
   - Left sidebar with Dashboard / Ecosystems / Settings
   - Active ecosystems (StayNest + ClinicNest with status badges)
   - Available ecosystems (FreelanceNest + PropertyNest)
   - Cross-ecosystem metrics (Residents, Appointments, Revenue, Tasks)

2. **Problem Transition** — Visual graphic showing 5 fragmented tools (Excel, WhatsApp, Notebook, Sheets, Manual Reminders) with arrow transitioning to MicroNest as unified solution

3. **Horizontal Product Showcase** — Full-width alternating rows:
   - StayNest: Screenshot left, content right (metrics grid + rent table)
   - ClinicNest: Content left, screenshot right (appointment schedule)
   - Coming Soon: FreelanceNest + PropertyNest in dashed-border containers

4. **Four Pillars** — With SVG icons and descriptions:
   - One Login (lock icon)
   - Shared Billing (card icon)
   - Shared Analytics (chart icon)
   - Shared Infrastructure (grid icon)

5. **Ecosystem Map** — Visual diagram:
   - MicroNest in center (lavender border, white background)
   - 4 products in 2x2 grid around it (StayNest, ClinicNest, FreelanceNest, PropertyNest)
   - Status badges (Live, Early Access, Coming Soon)
   - Activation flow hint text

6. **Social Proof Counters** — Using CountUp component:
   - 1,000+ Residents Managed
   - 500+ Rent Payments Tracked
   - 100+ Maintenance Requests Closed
   - 50+ Active Properties

7. **Roadmap Timeline** — Vertical timeline with:
   - StayNest: Available Now (green)
   - ClinicNest: Early Access (amber)
   - FreelanceNest: In Development (lavender)
   - PropertyNest: In Development (lavender)
   - Each with description text

## Mobile Improvements

| Feature | v2 | v3 |
|---------|----|----|
| Floating CTA visibility | Appears after 400px scroll | Always visible |
| Floating CTA branding | Generic "Start building" | Branded with MicroNest logo |
| Touch targets | 44px minimum | 44px minimum + explicit min-h-[44px] on CTA |
| Content priority | Copy-first | Screenshots-first |
| Layout strategy | Single-column | Single-column with horizontal scrolling for screenshots |
| Navigation | Full-screen drawer | Full-screen drawer (unchanged) |

## Conversion Improvements

| Goal | Implementation |
|------|---------------|
| Platform understanding | "One platform. Multiple business operating systems." hero with MicroNest Hub mockup |
| Ecosystem activation | Ecosystem map showing connected products with status badges |
| Trust in platform | Animated metrics counters showing real usage data |
| Low friction entry | "Start with one ecosystem. Expand when you're ready." — no commitment required |
| Mobile conversion | Always-visible floating CTA with branded MicroNest identity |
| Product discovery | Horizontal showcase rows with detailed feature bullets (not just tag lists) |

## Design System Changes

- **No card grids** — Replaced with horizontal product rows, pillar diagrams, and map layouts
- **Larger typography** — display-xl (72px) for hero, display-lg (56px) for product names, display-md (40px) for section headings
- **More whitespace** — Increased section padding (py-20 → py-20 sm:py-28 lg:py-28 from v2)
- **Fewer borders** — Removed excessive borders, used background contrast instead
- **Product-first layouts** — Real software mockups as primary visual element
- **Visual storytelling** — Problem transition graphic, ecosystem map, roadmap timeline

## Performance

- **Build:** Zero errors, 39/39 pages
- **Homepage:** 551B (increase from 176B due to CountUp client component)
- **Bundle:** 111kB First Load JS (5kB increase for CountUp)
- **No heavy libraries** — Uses existing CountUp, no Framer Motion/GSAP
- **All animations** — CSS transitions + Tailwind animate-fadeIn + CountUp cubic ease-out

## Files Modified

| File | Change |
|------|--------|
| `apps/web/src/app/layout.tsx` | Platform-first metadata, removed APP_NAME import |
| `apps/web/src/app/(marketing)/page.tsx` | Complete v3 rewrite |
| `apps/web/src/app/(marketing)/ecosystems/page.tsx` | Complete v3 rewrite |
| `packages/ui/src/FloatingCTA.tsx` | Always visible, branded, larger targets |
| `docs/current-state.md` | Updated to v3 |
| `docs/releases/marketing-redesign-v3.md` | This file |

## Remaining Recommendations

1. **About page** — Create `/about` (linked in nav, currently 404). Should tell the MicroNest platform story.
2. **StayNest landing page** — Audit against v3 design language (use horizontal showcase pattern, update CTAs to reference MicroNest)
3. **ClinicNest landing page** — Currently a minimal stub. Expand with same horizontal showcase pattern.
4. **Real screenshots** — Replace CSS mockups with actual product screenshots once available.
5. **Ecosystem map interactive** — Consider making the ecosystem map interactive (click to activate/explore).
6. **Social proof** — Replace demo metric values (1,000+, 500+, etc.) with real platform analytics once available.
7. **Pricing page** — Align with platform narrative (ecosystem-based pricing, not just StayNest).
