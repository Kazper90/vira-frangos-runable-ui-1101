# Vira Frangos — Design (Experience Layer V1)

> "More than tips. It's intelligence." — Football Intelligence, web (desktop + mobile web).
> Principle: **Hide Complexity, Expose Intelligence.**

## Source of truth

The VF Figma file (Mobile V2 + Desktop) is the visual authority. During Phase 1 the Figma
prototype could not be rendered from the engineering sandbox (WebGL canvas, no API token),
so every token below is **provisional** and must be reconciled against Figma before any
parity claim. Change values here and in `packages/web/src/web/styles.css` only — never inline.

## Brand & Colors

Tokens live as CSS variables in `packages/web/src/web/styles.css` (`--vf-*`) and are exposed to
Tailwind via `@theme` (`bg-vf-ink`, `text-vf-lime`, ...). TypeScript mirror for breakpoints and
motion: `packages/web/src/web/design/tokens.ts`.

| Token | Value | Use |
|-------|-------|-----|
| vf-ink | #07080A | App background (charcoal/black base) |
| vf-carbon | #0E1013 | Section background |
| vf-surface | #14171B | Cards |
| vf-raised | #1B1F24 | Raised cards, inputs, hover |
| vf-line | rgba(255,255,255,0.08) | Hairlines |
| vf-line-strong | rgba(255,255,255,0.14) | Emphasised borders |
| vf-text | #F2F4F1 | Primary text |
| vf-text-2 | #A4ABA6 | Secondary text |
| vf-text-3 | #6B726D | Tertiary / meta |
| vf-lime | #C8FF3D | VF Core — intelligence accent (QUALIFIED, primary CTA) |
| vf-lime-dim | rgba(200,255,61,0.12) | Lime washes |
| vf-red | #FF3D4A | Community — social energy (never used for VF intelligence) |
| vf-amber | #FFB547 | RESEARCH ONLY state |
| vf-steel | #8A93A0 | UNAVAILABLE state |
| vf-live | #FF5A36 | LIVE indicator |
| vf-positive / vf-negative | #7DFFB0 / #FF7A7A | Supplied value sign (render only) |

Rules: lime = VF intelligence only. Red = Community only. Amber = research only. No other hues.

## Typography

- Display: **Barlow Condensed** 600/700, uppercase, tight tracking — headlines, team names, section titles.
- Body: **Manrope** 400–700.
- Data: **JetBrains Mono** tabular numerals — probabilities, odds, value, scores.

## Layout

- Breakpoints: mobile 390/430 (base), `md` 768, `lg` 1024 (desktop nav switch), `xl` 1440, `2xl` 1920.
- Container: max 1360px content at 1440, 1600px at 1920; 16px gutter mobile, 32px desktop.
- Desktop: sticky top bar with full nav. Mobile: compact top bar + fixed bottom tab bar
  (Home · Matches · JARVIS · Live · More) and a "More" drawer.

## System state (mandatory visibility)

Every intelligence surface shows its qualification state and its data source:
QUALIFIED (lime) · RESEARCH ONLY (amber, hatched) · UNAVAILABLE (steel) · LIVE / NOT QUALIFIED.
Mock data shows a persistent `MOCK DATA` marker. Decisions and VF Score render only for QUALIFIED markets.

## Pages (Phase 1)

- `/` Home — proposition, pipeline, featured match intelligence, high-signal opportunities, upcoming matches, scientific status, community preview.
- `/matches` Matches — minimal list (full discovery in Phase 3).
- `/match/:id` Match Intelligence — market tabs, probability → fair odds → market odds → value → decision → VF Score → best price, explanation.
- `/my-bets`, `/jarvis`, `/live`, `/community`, `/pricing` — functional placeholder routes.

## Architecture

UI → `queries/` hooks → `services/` interface (`VfDataService`) → provider (`MockProvider` | `ApiProvider` adapter) → VF backend.
Contracts: `src/web/contracts/`. Mocks: `src/web/data/mocks/`. The UI never knows which provider is active
and performs no scientific calculation.
