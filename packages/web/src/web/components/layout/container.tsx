import type * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Responsive container. Mobile 16px gutters; tablet 32px; desktop 40px (Figma); content max 1360 (1440 screens)
 * widening to 1600 on 1920 screens.
 */
export function Container({
  className,
  as: As = "div",
  ...props
}: React.ComponentProps<"div"> & { as?: "div" | "section" | "header" | "main" | "footer" }) {
  return <As className={cn("mx-auto w-full max-w-[1360px] px-4 md:px-8 lg:px-10 2xl:max-w-[1600px]", className)} {...props} />;
}
