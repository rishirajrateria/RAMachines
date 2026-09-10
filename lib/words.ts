/**
 * lib/words.ts — word-counting helper used by scripts/content-audit.mjs and by page
 * templates that want to self-check against the ADR §5 word-count targets in dev.
 */
export function wordCount(...parts: (string | string[] | undefined)[]): number {
  let total = 0;
  for (const part of parts) {
    if (!part) continue;
    const strings = Array.isArray(part) ? part : [part];
    for (const s of strings) {
      const trimmed = s.trim();
      if (!trimmed) continue;
      total += trimmed.split(/\s+/).length;
    }
  }
  return total;
}
