/**
 * components/layout/AmbientLight.tsx — ADR-0005 §1: a fixed, full-viewport "light
 * layer" behind all content. Three large blurred radial orbs (teal, aqua, white)
 * placed top-left, right and bottom. Static except a very slow 40s drift,
 * disabled under prefers-reduced-motion (handled by .ambient-orb--drift in
 * app/globals.css). Purely decorative — aria-hidden, no pointer events.
 */
export default function AmbientLight() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      <span
        className="ambient-orb ambient-orb--drift"
        style={{
          top: "-12%",
          left: "-10%",
          width: "56vw",
          height: "56vw",
          maxWidth: 640,
          maxHeight: 640,
          backgroundColor: "#0F766E",
          opacity: 0.14,
        }}
      />
      <span
        className="ambient-orb ambient-orb--drift"
        style={{
          top: "8%",
          right: "-14%",
          width: "48vw",
          height: "48vw",
          maxWidth: 560,
          maxHeight: 560,
          backgroundColor: "#5EEAD4",
          opacity: 0.12,
          animationDelay: "-13s",
        }}
      />
      <span
        className="ambient-orb ambient-orb--drift"
        style={{
          bottom: "-16%",
          left: "22%",
          width: "52vw",
          height: "52vw",
          maxWidth: 600,
          maxHeight: 600,
          backgroundColor: "#FFFFFF",
          opacity: 0.5,
          animationDelay: "-26s",
        }}
      />
    </div>
  );
}
