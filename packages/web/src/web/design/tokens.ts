/**
 * TypeScript mirror of the CSS design tokens in styles.css, for logic that needs
 * them at runtime (breakpoints, motion). Colours stay in CSS — reference them via
 * Tailwind utilities (`bg-vf-surface`, `text-vf-lime`) or `var(--vf-*)`.
 */
export const breakpoints = {
  mobile: 390,
  mobileL: 430,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
} as const;

export const motion = {
  fast: 140,
  base: 240,
  slow: 520,
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export const cssVar = (name: string) => `var(--vf-${name})`;
