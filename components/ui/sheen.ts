"use client";

/**
 * components/ui/sheen.ts — ADR-0009 §3: the pointermove specular sheen behind every
 * `GlassCard` (`.glass-sheen`, CSS vars `--mx`/`--my`) used to attach its own
 * `pointermove` listener per card. A page can have dozens of cards, so this instead
 * registers a single delegated listener on `document` (lazily, on first `GlassCard`
 * mount) that walks up from `event.target` to the nearest `.glass-sheen` ancestor.
 * Mouse-only (`event.pointerType === "mouse"`) — cheaper and more precise than the
 * previous `matchMedia("(hover: hover) and (pointer: fine)")` check, since it reads
 * the actual pointer that moved rather than a static device capability.
 */
let initialized = false;

function onPointerMove(e: PointerEvent) {
  if (e.pointerType !== "mouse") return;
  const target = (e.target as Element | null)?.closest?.<HTMLElement>(".glass-sheen");
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * 100;
  const my = ((e.clientY - rect.top) / rect.height) * 100;
  target.style.setProperty("--mx", `${mx}%`);
  target.style.setProperty("--my", `${my}%`);
}

export function initGlassSheen(): void {
  if (initialized || typeof document === "undefined") return;
  initialized = true;
  document.addEventListener("pointermove", onPointerMove, { passive: true });
}
