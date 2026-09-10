/**
 * components/ui/JsonLd.tsx — renders one or more JSON-LD objects (from lib/schema.ts)
 * inside a <script type="application/ld+json"> tag. Accepts a single object or an array;
 * an array is wrapped as @graph so a page can emit several schema types at once.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
