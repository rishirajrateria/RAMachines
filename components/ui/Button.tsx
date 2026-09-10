/**
 * components/ui/Button.tsx — ADR-0005 §5: the one button primitive, now three
 * pill variants — primary (teal fill, white text), secondary (`.glass-pill`,
 * ink text), tertiary (text link with an arrow, no pill). `variant` keeps its
 * old values ("solid"|"outline"|"ghost") mapped onto the new look so every call
 * site keeps compiling: solid → primary, outline → secondary, ghost → tertiary.
 * `tone` is accepted for backward compatibility only — ADR-0005 §4: tone "spark"
 * now renders primary teal, i.e. `tone` no longer changes the rendered colour.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "./Icons";

const sizeClasses = {
  md: "h-12 px-6 text-sm",
  lg: "h-12 px-7 text-base",
};

const variantClasses = {
  solid: "bg-teal text-white shadow-[inset_0_1px_0_rgba(255,255,255,.35)] hover:bg-teal-hover hover:-translate-y-0.5",
  outline: "glass-pill h-12 text-ink hover:-translate-y-0.5",
  ghost: "h-auto px-0 text-teal hover:text-teal-hover",
};

export default function Button({
  href,
  variant = "solid",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- accepted for backward compatibility, never rendered (ADR-0005 §4)
  tone: _tone,
  external = false,
  icon,
  children,
  className = "",
  size = "md",
  ...rest
}: {
  href: string;
  variant?: "solid" | "outline" | "ghost";
  /** @deprecated kept for backward compatibility — no longer changes colour (ADR-0005 §4). */
  tone?: "steel" | "spark";
  external?: boolean;
  icon?: IconName;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg";
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">) {
  const classes = `inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-transform duration-200 focus-visible:outline-none ${
    variant === "solid" ? "rounded-full" : ""
  } ${variant === "solid" ? sizeClasses[size] : ""} ${variantClasses[variant]} ${className}`.trim();

  const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

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
