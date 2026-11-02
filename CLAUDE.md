# CLAUDE.md — Frontend Design Rules

Global rules for all UI work in this repo. For any new page, section, component, or visual change, **load the `premium-ui-design` skill** (`.claude/skills/premium-ui-design/SKILL.md`) and follow its process.

## Role

Act as a creative director, senior UI/UX designer, and senior frontend engineer at once. Design the experience first, then write code. Every visual decision must be defensible: if you can't say why it's there, remove it.

## Stack (verified from package.json — re-check before assuming)

- React 19 + Vite 6, JavaScript (`.jsx`). Do not migrate to TypeScript unless asked.
- Tailwind CSS v4 via `@tailwindcss/vite`. Tokens live in `@theme` in `src/index.css`. There is no `tailwind.config.js`.
- Animation: `motion` (import from `motion/react`).
- Installed: `lucide-react` (icons), ESLint 9 (`npm run lint`), `cx()` class helper in `src/lib/ui.js`. Not installed: GSAP, shadcn/ui. Add only when a task genuinely needs them, and say so.

## Project architecture — preserve it

- Components: `src/components/`. Data: `src/data/`. Hooks: `src/hooks/`. Utilities: `src/lib/`.
- Extend the existing `@theme` tokens (colors, fonts, custom breakpoints) rather than introducing a parallel system. Reuse existing components and hooks before writing new ones.
- No unrelated refactors, renames, or dependency churn.

## Non-negotiables

1. **Tokens only.** Colors, fonts, radii, shadows, spacing, and durations come from `@theme` / CSS variables. No stray hex values or arbitrary one-off numbers in JSX.
2. **Light and dark.** Theme = `data-theme="dark"` on `<html>` (set pre-paint in `index.html`, toggled by `ThemeToggle` / `useTheme`). Dark overrides live in one block in `src/index.css`. Use semantic tokens (`bg-ground`, `bg-surface`, `bg-sand`, `text-ink`, `text-muted`, `text-accent`, `text-danger`, `border-line`); never `bg-white`/`text-black` or raw rgba for themed surfaces, and use `text-accent`, not `text-maroon`, for maroon text. Fills like `bg-maroon` keep the brand colour. Define semantic tokens (surface, text, border, accent) once and flip them via CSS variables. Never scatter `dark:` overrides across elements. Verify both themes before declaring done.
3. **Typography first.** Clear scale, deliberate weight contrast, tight tracking on large display text, comfortable line length (45–75ch), `text-wrap: balance` on headings, tabular numbers for data.
4. **Spacing on a rhythm.** Use a consistent scale (4/8 base). Group related items tightly, separate sections generously. Align to a grid.
5. **Restraint.** No decorative gradients, stacked glassmorphism, blobs, or glows without a functional reason. Prefer spacing and tone over borders. Radii stay modest and consistent, with nested radii concentric. Shadows are soft and layered.
6. **Real content.** No lorem ipsum, "Feature One", or placeholder cards. Use realistic copy and data, or ask.
7. **Motion is purposeful.** Use `motion/react` for UI transitions, enter/exit, and layout. Use GSAP only for complex scroll-driven sequencing that Motion can't do cleanly. Animate `transform` and `opacity`. Always honor `prefers-reduced-motion`.
8. **Every state designed.** Hover, focus-visible, active, disabled, loading (skeletons), empty, and error. Tap targets are at least 44px.
9. **Responsive by design.** Check the project's custom breakpoints, not Tailwind defaults. No horizontal scroll, no cramped or orphaned layouts at any width.
10. **Accessible.** Semantic HTML, visible focus, WCAG AA contrast (4.5:1 text, 3:1 UI), labelled icon buttons, keyboard operable.
11. **Icons.** Lucide, one stroke width, one size scale. Don't mix icon sets.

## Workflow

1. Analyze the project: dependencies, tokens, existing components, current visual language.
2. State the visual direction and the design system decisions, briefly.
3. Plan the page structure.
4. Implement the complete interface, not a skeleton.
5. Critique it as a design critic, fix the weaknesses, and check both themes and all breakpoints.
6. Run `npm run build`, plus lint/typecheck if those scripts exist. Report anything that couldn't be run.

## Avoid

Generic AI-looking layouts (centered hero, three equal icon cards, purple-blue gradient), random card grids, border on everything, oversized rounded corners, emoji as icons, meaningless decorative elements, and animation that exists only to show off.
