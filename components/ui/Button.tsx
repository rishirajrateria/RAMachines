/**
 * components/ui/Button.tsx — the one button primitive used site-wide. Three variants:
 * solid (primary CTA), outline (secondary CTA), ghost (low-emphasis text link with arrow).
 * Renders an <a>; set `external` for links that should open in a new tab safely.
 * `tone` (ADR-0002) switches the accent from steel to the warm spark colour, for
 * secondary CTAs ("Request Quote" in the header, illustrated-card CTAs…). `icon` renders
 * a leading icon without every call site having to import Icons itself.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "./Icons";

const sizeClasses = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const variantClasses = {
  // ADR-0004: solid buttons use the teal-brand gradient (a 1px darker "hover" tone
  // stands in for the border on darken/lift); outline is a teal border.
  steel: {
    solid: "bg-btn-primary text-white shadow-sm hover:brightness-95 hover:-translate-y-0.5",
    outline: "border border-teal text-ink hover:border-teal-hover hover:text-teal-hover",
    ghost: "text-teal hover:text-teal-hover px-0 h-auto",
  },
  spark: {
    solid: "bg-btn-spark text-white shadow-sm hover:brightness-95 hover:-translate-y-0.5",
    outline: "border border-grey-300 text-ink hover:border-spark hover:text-spark",
    ghost: "text-spark hover:text-spark-hover px-0 h-auto",
  },
};

export default function Button({
  href,
  variant = "solid",
  tone = "steel",
  external = false,
  icon,
  children,
  className = "",
  size = "md",
  ...rest
}: {
  href: string;
  variant?: "solid" | "outline" | "ghost";
  tone?: "steel" | "spark";
  external?: boolean;
  icon?: IconName;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap font-semibold transition focus-visible:outline-none ${
    variant === "ghost" ? "" : sizeClasses[size]
  } ${variantClasses[tone][variant]} ${className}`.trim();

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const content = (
    <>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </>
  );

  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
