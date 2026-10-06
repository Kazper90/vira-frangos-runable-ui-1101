import { Link, useLocation } from "wouter";
import { DataSourceBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { configuredSource } from "@/services";
import { cn } from "@/lib/utils";
import { isActivePath, navItems } from "@/routes";
import { Brand } from "./brand";
import { Container } from "./container";
import { useSessionUi } from "./session-context";

/**
 * Global top bar. Figma (frame 1:6 › Nav): 57px, #0A0A0A @0.97 + 32px backdrop blur,
 * 1px white@0.07 bottom rule, logo image, Inter Medium 13 items (#666, active lime with a
 * 1px underline), "My Frango" text action and a lime "Get Started" button.
 */
export function TopBar() {
  const [location] = useLocation();
  const { openAuth, openProfile } = useSessionUi();

  return (
    <header className="sticky top-0 z-40 border-b border-vf-line bg-vf-ink/[0.97] backdrop-blur-[32px]">
      <Container className="flex h-[var(--vf-topbar-h)] items-center gap-6 xl:gap-10">
        <div className="hidden lg:block">
          <Brand />
        </div>
        <div className="lg:hidden">
          <Brand compact />
        </div>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden h-full flex-1 items-center gap-4 lg:flex xl:gap-[26px]">
          {navItems.map((item) => {
            const active = isActivePath(item.path, location);
            const community = item.identity === "community";
            return (
              <Link
                key={item.key}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full items-center text-[13px] font-medium whitespace-nowrap transition-colors duration-200",
                  active ? (community ? "text-vf-red-text" : "text-vf-lime") : "text-vf-text-3 hover:text-vf-text",
                )}
              >
                {item.label}
                {active && (
                  <span
                    className={cn("absolute inset-x-0 bottom-[14px] h-px", community ? "bg-vf-red" : "bg-vf-lime")}
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:gap-[18px]">
          <DataSourceBadge source={configuredSource} />
          <button
            type="button"
            onClick={openProfile}
            className="hidden cursor-pointer text-[13px] font-medium text-vf-text-3 transition-colors hover:text-vf-text xl:inline-flex"
          >
            My Frango
          </button>
          <Button size="md" className="hidden xl:inline-flex" onClick={openAuth}>
            Get Started
          </Button>
          <button
            type="button"
            onClick={openProfile}
            className="cursor-pointer rounded-full xl:hidden"
            aria-label="Open profile"
          >
            <Avatar size={32} />
          </button>
        </div>
      </Container>
    </header>
  );
}
