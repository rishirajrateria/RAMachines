/**
 * components/layout/SkipLink.tsx — visually-hidden-until-focused link to the main
 * content region, for keyboard and screen-reader users.
 */
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to content
    </a>
  );
}
