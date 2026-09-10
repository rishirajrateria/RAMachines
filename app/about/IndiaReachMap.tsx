/**
 * app/about/IndiaReachMap.tsx — static inline SVG "India & export reach" graphic
 * for /about (SPEC: "no heavy map libraries"). The path below is a simple,
 * deliberately stylised outline of India (not survey-accurate cartography) with
 * a marker on Kolkata; `exportRegions` renders alongside as a row of chips.
 * Server component — no client JS, no external map tiles or scripts.
 */
export default function IndiaReachMap({ regions }: { regions: string[] }) {
  return (
    <div>
      <svg
        viewBox="0 0 240 300"
        width={240}
        height={300}
        role="img"
        aria-label="Stylised outline map of India with a marker on Kolkata, our manufacturing headquarters"
        className="h-auto w-full max-w-[240px] text-grey-300"
      >
        <path
          d="M120,10 L140,20 L150,45 L145,70 L170,90 L185,110 L200,130 L210,145 L215,165 L195,175 L180,190 L175,220 L165,245 L150,265 L140,285 L125,270 L115,250 L100,230 L90,205 L75,180 L65,150 L60,120 L70,95 L75,60 L90,45 L100,25 Z"
          fill="currentColor"
          stroke="#C9CBD0"
          strokeWidth={1.5}
        />
        <circle cx={178} cy={152} r={5} fill="#1F4E79" stroke="#ffffff" strokeWidth={1.5} />
        <text x={186} y={149} fontSize="11" fontFamily="var(--font-ui)" fill="#111214" fontWeight={600}>
          Kolkata
        </text>
        <text x={186} y={161} fontSize="9" fontFamily="var(--font-ui)" fill="#5B5F68">
          HQ &amp; works
        </text>
      </svg>
      <ul className="mt-6 flex flex-wrap gap-2">
        {regions.map((region) => (
          <li
            key={region}
            className="rounded border border-grey-200 px-3 py-1.5 text-xs font-semibold text-grey-700"
          >
            {region}
          </li>
        ))}
      </ul>
    </div>
  );
}
