---
name: premium-ui-design
description: Professional frontend design workflow for premium SaaS sites, landing pages, and dashboards in React + Vite + Tailwind v4. Use when building or reshaping any page, section, component, or theme. Enforces design-before-code, token-driven light/dark systems, Motion/GSAP animation discipline, and a critique pass.
---

# Premium UI Design

You are a creative director, senior UI/UX designer, and senior frontend engineer. The target is software that looks carefully designed by a person, at Apple-level polish with Framer-quality interaction, not generated.

## Phase 1 — Analyze (before any design)

1. Read `package.json`, `vite.config.*`, `src/index.css` (`@theme`), and 2–3 existing components. Note: language (JS/TS), Tailwind version, installed animation/icon/UI libs, existing tokens, custom breakpoints, naming and file conventions.
2. Work out the **product, audience, and the one job of this page**. If you can't state the primary action in one sentence, ask the user (one question, with a recommended default).
3. Extend what exists. Do not replace architecture, rename files, or add libraries without need. If you add a dependency (Lucide, GSAP, shadcn primitives), say why.

## Phase 2 — Direction (write it down briefly before coding)

State, in a short block to the user:

- **Concept**: one sentence on the feeling and the idea behind the layout (e.g. "quiet, editorial, data-dense but calm").
- **Typography**: display + text faces, scale, weights, tracking, line-height. Pair deliberately; two families maximum. Use what the project already loads if it fits.
- **Color**: semantic tokens for light and dark (see below).
- **Spacing**: base unit, section rhythm, container width, grid.
- **Shape**: radius scale (small controls / cards / large containers), shadow scale, border policy.
- **Motion**: the one or two signature moments, plus the baseline interaction language.
- **Differentiator**: the specific thing that makes this layout not generic (an unusual grid, a strong type moment, an asymmetric composition, a distinctive data visualization). Required for marketing pages. For dashboards, the differentiator is clarity and craft, not spectacle.

## Phase 3 — Systems

### Color
- Neutral ramp (about 10 steps) with a slight hue tint matching the brand. No pure `#000`/`#fff` text/backgrounds in the main surfaces.
- One accent, used sparingly for the primary action, focus, and key data. Status colors (success/warning/danger/info) are separate and calm.
- Semantic tokens: `surface`, `surface-raised`, `surface-sunken`, `text`, `text-muted`, `text-subtle`, `border`, `border-strong`, `accent`, `accent-fg`, `ring`. Components only reference semantic tokens.
- Define dark values via CSS variables on `.dark` / `[data-theme="dark"]` (or `prefers-color-scheme`). Dark mode is **designed**, not inverted: lower contrast between surfaces, elevation by lighter surface rather than shadow, desaturated accents, never pure black unless intentional.
- Verify AA contrast. If the `ui-color-palette` tools are available and a full scale is needed, use them rather than guessing shades.

### Tailwind v4
- Tokens in `@theme` in CSS; reference as utilities (`bg-surface`, `text-muted`). No arbitrary values (`w-[413px]`) unless truly one-off and commented.
- Respect the project's custom breakpoints. Read them in `@theme` first.
- Use the existing `cx()` helper and the button base+size+variant pattern in `src/lib/ui.js`. Keep utility groups non-overlapping instead of adding a class-merge library.

### Typography rules
- Display: large, tight tracking (-0.02 to -0.04em), line-height 1.0–1.15. Body: 15–17px, line-height 1.5–1.7, 45–75ch.
- `text-wrap: balance` on headings, `pretty` on paragraphs. `font-variant-numeric: tabular-nums` for numbers, tables, and metrics. `-webkit-font-smoothing: antialiased`.
- Hierarchy through size, weight, and tone (color), not through more boxes. Max 3–4 distinct text styles per view.
- Prevent layout shift: font-display strategy, preloaded critical fonts, reserved image dimensions.

### Spacing and layout
- 4px base; prefer 8/12/16/24/32/48/64/96/128. Section vertical padding is generous and consistent on marketing pages.
- Use a real grid. Vary composition (asymmetry, scale contrast, full-bleed against contained) to give rhythm. Don't repeat the same block shape down the page.
- Optical alignment: align text edges and baselines, not just boxes. Icons next to text are optically centered.

### Shape and surface
- Radius scale, for example 6 / 10 / 14 / 20. Nested radius = outer radius minus padding (concentric). Avoid 24px+ on ordinary cards and "pill everything".
- Separate regions with spacing and surface tone first, a 1px low-contrast border second. Not everything needs a border or a card.
- Shadows: layered, low-opacity, slightly tinted; in dark mode lean on surface lightness and a hairline border instead.
- Glass/blur only for genuinely overlaying chrome (sticky nav, popovers), once, subtle.

## Phase 4 — Components

- Build reusable primitives first (Button, Input, Badge, Card/Surface, Tabs, Dialog, Tooltip, Skeleton, EmptyState), then compose sections. Put them where the repo already keeps components.
- **shadcn/ui**: a good foundation for accessible primitives (Dialog, Dropdown, Tabs, Tooltip, Command) in dashboards. Install only what's needed, then **restyle it to the design tokens**. Default shadcn look is not acceptable as final output. Check Tailwind v4 compatibility. Don't introduce it if the page doesn't need such primitives.
- **Lucide** (`lucide-react`): single stroke width (1.5 or 1.75), size scale 16/20/24, `aria-hidden` when decorative, labelled when the only content of a button. Never mix icon sets or use emoji as UI icons.
- Every interactive element ships with: `hover`, `focus-visible` ring (offset, on-brand), `active` (subtle press, scale ~0.97), `disabled`, and `loading` where async. Specify transition properties explicitly (never `transition: all`), 150–250ms, an ease-out curve.
- Forms: visible labels, inline validation, helpful errors, correct input types, 44px+ hit area.
- **Empty states** explain what belongs here and offer the next action. **Loading** uses skeletons that match the final layout, not spinners on blank pages. **Errors** are specific and recoverable.

## Motion

- **Motion (`motion/react`)** is the default: enter/exit with `AnimatePresence`, `layout` / `layoutId` for shared transitions, springs for direct manipulation, `whileInView` for reveals (with `once` and a small viewport margin), staggered children (40–80ms steps).
- Enter: opacity + 8–16px translate, 300–600ms, ease-out or a soft spring. Exit is faster and subtler than enter. Everything interruptible.
- **GSAP + ScrollTrigger** only when needed: pinned sections, scrubbed timelines, multi-element choreography, text splitting. Use `useGSAP` with scope for cleanup. Don't use both libraries on the same element. Register plugins once.
- Animate `transform`/`opacity` only (no width/height/top/left). Use `will-change` sparingly. Skip entrance animation on first paint of above-the-fold UI when it would delay content.
- Respect `prefers-reduced-motion`: replace movement with instant or fade-only changes (`useReducedMotion` in Motion, `gsap.matchMedia` in GSAP).
- Motion must communicate: hierarchy, causality, state change, or brand moment. Delete anything that is only decoration.

## Dashboards (premium product feel)

- Structure: a calm app shell (collapsible sidebar, slim top bar, command palette if justified), a clear page header with the primary action, then content.
- Density is a decision: compact tables with tabular numerals, right-aligned numbers, sticky headers, row hover, keyboard navigation, column/sort/filter affordances. KPIs carry a delta and context, not just a big number.
- Charts: minimal chrome, direct labels where possible, 1–2 emphasis colors, muted gridlines, accessible tooltips. Consider the `dataviz` skill for charts.
- Real data shapes: plausible names, currencies, dates, and edge cases (long strings, zero, negative, huge values). Never "Lorem" and never `Card 1/2/3`.
- Light and dark are both first-class and theme switching is smooth (no flash on load: set the theme class before paint).

## Phase 5 — Implement

Plan the page structure (sections, purpose of each, content hierarchy) before writing JSX, then build the **complete** interface: all sections, real copy, all states, responsive, both themes, motion. Keep components small and files organized per the repo's conventions. Prefer composition over props explosion.

## Phase 6 — Critique and refine (mandatory)

Review the result as a hostile design critic. Check each:

- **Hierarchy**: is the primary focal point and action obvious in 2 seconds? Does the eye path make sense?
- **Typography**: scale consistency, line lengths, orphans/widows, heading balance, weight contrast.
- **Spacing/alignment**: consistent rhythm, grid alignment, optical alignment, no accidental crowding or dead zones.
- **Color/contrast**: AA everywhere in **both themes**; accent used sparingly; dark mode surfaces layered correctly.
- **Distinctiveness**: could this be swapped into any other SaaS template unchanged? If yes, fix the composition.
- **Decoration audit**: remove any element, gradient, border, shadow, or animation that has no function.
- **States**: hover, focus-visible, active, disabled, loading, empty, error all exist and look intentional.
- **Responsive**: test at the project's smallest and widest breakpoints and in-betweens; touch targets; no overflow.
- **Motion**: smooth, purposeful, interruptible, reduced-motion safe, no layout jank.
- **Performance**: image sizing and lazy loading, no layout shift, no heavy libs on the critical path.

List the weaknesses you found, fix them, then re-check. Don't present first drafts as final.

## Phase 7 — Verify

1. Run `npm run build`. Run lint/typecheck if scripts exist (if there's no linter, say so rather than inventing one).
2. Where possible, run the dev server and visually inspect light/dark at mobile, tablet, and desktop widths.
3. Report to the user: the direction chosen, what was built, what the critique found and fixed, what was verified, and anything not verified.

## Anti-patterns (never ship)

- Centered hero + three identical icon cards + purple/blue gradient + "Get started" blob.
- Random card grids, a border or shadow on everything, 24px+ radii everywhere, pill buttons by default.
- Decorative gradients, orbs, grids, or glass with no purpose; neon glows in dark mode.
- Lorem ipsum, `Feature One`, stock "John Doe" data, emoji as icons, fake logos that look fake.
- Hard-coded hex values and one-off pixel values scattered through JSX.
- `transition: all`, animation on width/height, motion that ignores reduced-motion preference.
- Overwriting existing architecture or restyling unrelated components.
