// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");

function tokensIn(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf("\n}", start));
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

// [foreground, background, minimum ratio]: 4.5 for text (WCAG AA), 3 for UI parts.
const PAIRS: [string, string, number][] = [
  ["color-text", "color-bg", 4.5],
  ["color-text", "color-surface", 4.5],
  ["color-text", "color-surface-alt", 4.5],
  ["color-muted", "color-bg", 4.5],
  ["color-muted", "color-surface", 4.5],
  ["color-primary", "color-bg", 4.5],
  ["color-primary", "color-surface", 4.5],
  ["color-primary", "color-primary-soft", 4.5],
  ["color-primary", "color-surface-alt", 4.5],
  ["color-primary", "color-accent-soft", 4.5],
  ["color-primary-contrast", "color-primary", 4.5],
  ["color-accent", "color-surface", 4.5],
  ["color-text", "color-accent-soft", 4.5],
  ["color-success", "color-surface", 4.5],
  ["color-success", "color-success-soft", 4.5],
  ["color-danger", "color-surface", 4.5],
  ["color-surface", "color-danger", 4.5],
  ["color-text", "color-danger-soft", 4.5],
  ["color-primary-contrast", "color-primary-hover", 4.5],
  ["color-disabled-text", "color-disabled-bg", 4.5],
  ["color-focus", "color-bg", 3],
  ["color-focus", "color-surface", 3],
  ["color-focus", "color-surface-alt", 3],
  ["color-border-strong", "color-surface", 3],
  ["code-text", "code-bg", 4.5],
  ["code-keyword", "code-bg", 4.5],
  ["code-string", "code-bg", 4.5],
  ["code-number", "code-bg", 4.5],
  ["code-comment", "code-bg", 4.5],
  ["code-function", "code-bg", 4.5],
];

describe.each([
  ["light", ":root"],
  ["dark", '[data-theme="dark"]'],
])("%s theme tokens", (_name, selector) => {
  const tokens = tokensIn(selector);

  it.each(PAIRS)("%s on %s meets %s:1", (fg, bg, minimum) => {
    expect(tokens[fg], fg).toBeDefined();
    expect(tokens[bg], bg).toBeDefined();
    expect(contrast(tokens[fg]!, tokens[bg]!)).toBeGreaterThanOrEqual(minimum);
  });
});
