import type * as React from "react";
import { Link } from "wouter";
import { navItems } from "@/routes";
import { Brand } from "./brand";
import { configuredSource } from "@/services";
import { AccountSurfaces } from "./account-surfaces";
import { BottomTabBar } from "./bottom-tab-bar";
import { Container } from "./container";
import { SessionUiProvider } from "./session-context";
import { TopBar } from "./top-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionUiProvider>
      <a
        href="#vf-main"
        className="sr-only z-50 rounded-vf-sm bg-vf-lime px-4 py-2 font-bold text-vf-lime-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="flex min-h-dvh flex-col">
        <TopBar />
        {configuredSource === "MOCK" && <MockStrip />}
        <main id="vf-main" className="flex-1 pb-12 lg:pb-16">
          {children}
        </main>
        <Footer />
      </div>
      <BottomTabBar />
      <AccountSurfaces />
    </SessionUiProvider>
  );
}

/** Persistent provenance strip — mock values can never be mistaken for live intelligence. */
function MockStrip() {
  return (
    <div className="border-b border-[rgba(255,181,71,0.2)] bg-vf-amber-dim">
      <Container className="flex items-center gap-2 py-1.5 text-[11.5px] text-vf-amber">
        <span className="vf-num font-semibold uppercase tracking-[0.12em]">Mock data</span>
        <span className="truncate text-vf-amber/80">
          Development fixtures — not VF predictions, not live intelligence.
        </span>
      </Container>
    </div>
  );
}

/**
 * Global footer. Figma (frame 1:6 › Footer): logo + tagline, link columns, legal line and
 * "Play Smart. Stay Ahead.". Only links to routes that exist in Phase 1 are rendered —
 * Figma's VF Lab / Performance / Discussions / Rankings / Specialisations / About / Help /
 * Terms / Privacy have no route yet and are not linked (see design.md, gaps).
 */
function Footer() {
  const platform = navItems.filter((n) => n.identity !== "community" && n.key !== "home");
  const community = navItems.filter((n) => n.identity === "community");
  return (
    <footer className="border-t border-vf-line pb-[calc(var(--vf-tabbar-h)+env(safe-area-inset-bottom))] lg:pb-0">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 md:grid-cols-[minmax(0,2fr)_1fr_1fr] lg:py-10">
        <div className="col-span-2 md:col-span-1">
          <Brand />
          <p className="mt-3.5 text-xs text-vf-text-4">More than tips. It's intelligence.</p>
          <p className="mt-1 text-xs text-vf-text-4">We don't predict everything. We filter what matters.</p>
        </div>
        <FooterCol title="Platform" items={platform} />
        <FooterCol title="Community" items={community} community />
      </Container>
      <Container className="flex flex-col gap-2 border-t border-vf-line py-5 text-[11px] text-vf-text-4 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Vira Frangos · Football Intelligence</span>
        <span className="vf-num uppercase tracking-[0.12em]">Play Smart. Stay Ahead.</span>
      </Container>
    </footer>
  );
}

function FooterCol({
  title,
  items,
  community = false,
}: {
  title: string;
  items: typeof navItems;
  community?: boolean;
}) {
  return (
    <nav aria-label={`Footer — ${title}`}>
      <div className={community ? "text-[11px] font-semibold text-vf-red-text" : "text-[11px] font-semibold text-vf-text-4"}>
        {title}
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((n) => (
          <li key={n.key}>
            <Link to={n.path} className="text-xs text-vf-text-3 transition-colors hover:text-vf-text">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
