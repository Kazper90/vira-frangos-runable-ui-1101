import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * Architecture guards: UI must not reach around the service boundary.
 */
const ROOT = import.meta.dir;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts") ? [p] : [];
  });
}

const uiFiles = ["pages", "components", "queries", "hooks"].flatMap((d) => walk(join(ROOT, d)));

describe("mock / API boundary", () => {
  test("no UI file imports mock fixtures directly", () => {
    const offenders = uiFiles.filter((f) => /data\/mocks/.test(readFileSync(f, "utf8"))).map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  test("no UI file imports a concrete provider", () => {
    const offenders = uiFiles
      .filter((f) => /services\/providers/.test(readFileSync(f, "utf8")))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });

  test("pages/components never hard-code a 0.5 probability fallback", () => {
    const offenders = uiFiles
      .filter((f) => /\?\?\s*0\.5\b|\|\|\s*0\.5\b/.test(readFileSync(f, "utf8")))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });
});
