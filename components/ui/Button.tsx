/**
 * components/ui/Button.tsx — the one button primitive used site-wide. Three variants:
 * solid (primary CTA), outline (secondary CTA), ghost (low-emphasis text link with arrow).
 * Renders an <a>; set `external` for links that should open in a new tab safely.
 */
import type { ReactNode } from "react";
import Link from "next/link";

const sizeClasses = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClasses = {
  solid: "bg-steel text-white hover:bg-steel-hover",
  outline: "border border-grey-300 text-ink hover:border-steel hover:text-steel",
  ghost: "text-steel hover:text-steel-hover px-0 h-auto",
};

export default function Button({
  href,
  variant = "solid",
  external = false,
  children,
  className = "",
  size = "md",
  ...rest
}: {
  href: string;
  variant?: "solid" | "outline" | "ghost";
  external?: boolean;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const classes = `inline-flex items-center justify-center gap-2 rounded whitespace-nowrap font-semibold transition-colors focus-visible:outline-none ${
    variant === "ghost" ? "" : sizeClasses[size]
  } ${variantClasses[variant]} ${className}`.trim();

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
