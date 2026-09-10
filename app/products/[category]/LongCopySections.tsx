/**
 * app/products/[category]/LongCopySections.tsx — renders a category's `longCopy`
 * (350–500 words, already trimmed per ADR-0003) as one calm prose column
 * (ADR-0005 §6: "longCopy as .prose-calm"). No repeated facts panel, no
 * alternating image blocks — the category's line-art image already appears in
 * the hero, so it is not repeated here.
 */
import type { Category } from "@/data/types";
import Prose from "@/components/ui/Prose";

export default function LongCopySections({ category }: { category: Category }) {
  return (
    <Prose>
      {category.longCopy.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </Prose>
  );
}
