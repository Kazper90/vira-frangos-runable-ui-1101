import * as React from "react";
import { useLocation } from "wouter";

/** Resets scroll on route change. */
export function ScrollToTop() {
  const [location] = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);
  return null;
}
