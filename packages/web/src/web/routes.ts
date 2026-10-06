/**
 * Central route registry — the single place paths, labels, and nav placement live.
 */
import {
  Bot,
  CircleDollarSign,
  Home,
  NotebookPen,
  Radio,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export const paths = {
  home: "/",
  matches: "/matches",
  match: (id: string) => `/match/${encodeURIComponent(id)}`,
  matchPattern: "/match/:id",
  myBets: "/my-bets",
  jarvis: "/jarvis",
  live: "/live",
  community: "/community",
  pricing: "/pricing",
} as const;

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: LucideIcon;
  /** Shown in the mobile bottom tab bar (the rest go into "More"). */
  mobileTab: boolean;
  /** Community uses the red identity; JARVIS its own. */
  identity?: "core" | "community" | "jarvis";
  phase: number;
}

export const navItems: NavItem[] = [
  { key: "home", label: "Home", path: paths.home, icon: Home, mobileTab: true, phase: 2 },
  { key: "matches", label: "Matches", path: paths.matches, icon: Trophy, mobileTab: true, phase: 3 },
  // Figma (frame 1:6 › Nav) order: Home · Matches · Community · VF Lab · Performance · My Bets.
  // VF Lab / Performance have no Phase 1 route (not added — see design.md). JARVIS, Live and
  // Pricing are Phase 1 routes not present in that Figma frame; they follow the Figma items.
  { key: "community", label: "Community", path: paths.community, icon: Users, mobileTab: false, identity: "community", phase: 8 },
  { key: "my-bets", label: "My Bets", path: paths.myBets, icon: NotebookPen, mobileTab: false, phase: 5 },
  { key: "jarvis", label: "JARVIS", path: paths.jarvis, icon: Bot, mobileTab: true, identity: "jarvis", phase: 6 },
  { key: "live", label: "Live", path: paths.live, icon: Radio, mobileTab: true, phase: 7 },
  { key: "pricing", label: "Pricing", path: paths.pricing, icon: CircleDollarSign, mobileTab: false, phase: 9 },
];

export function isActivePath(itemPath: string, location: string): boolean {
  if (itemPath === paths.home) return location === "/";
  if (itemPath === paths.matches) return location === paths.matches || location.startsWith("/match/");
  return location === itemPath || location.startsWith(`${itemPath}/`);
}
