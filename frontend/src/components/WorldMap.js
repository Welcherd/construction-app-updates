import { cn } from "@/lib/utils";

// Rough landmass check for dot placement
function checkLandmass(x, y) {
  // North America
  if (x >= 25 && x <= 85 && y >= 15 && y <= 50) {
    if (x >= 25 && x <= 50 && y >= 15 && y <= 35) return true;
    if (x >= 45 && x <= 85 && y >= 25 && y <= 50) return true;
  }
  // South America
  if (x >= 45 && x <= 75 && y >= 50 && y <= 85) return true;
  // Europe
  if (x >= 105 && x <= 140 && y >= 15 && y <= 45) return true;
  // Africa
  if (x >= 105 && x <= 145 && y >= 40 && y <= 75) return true;
  // Asia
  if (x >= 135 && x <= 195 && y >= 10 && y <= 55) return true;
  // Australia
  if (x >= 165 && x <= 195 && y >= 55 && y <= 75) return true;
  return false;
}

export function WorldMap({ className }) {
  const connectionPoints = [
    { cx: 78, cy: 42, label: "New York" },
    { cx: 65, cy: 48, label: "Houston" },
    { cx: 52, cy: 55, label: "Sao Paulo" },
    { cx: 115, cy: 38, label: "London" },
    { cx: 120, cy: 42, label: "Berlin" },
    { cx: 135, cy: 50, label: "Dubai" },
    { cx: 155, cy: 44, label: "Mumbai" },
    { cx: 170, cy: 38, label: "Beijing" },
    { cx: 180, cy: 42, label: "Tokyo" },
    { cx: 175, cy: 60, label: "Sydney" },
    { cx: 122, cy: 52, label: "Lagos" },
    { cx: 60, cy: 40, label: "Toronto" },
  ];

  const connections = [
    [0, 3], [0, 1], [1, 2], [3, 4], [4, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [3, 10],
    [0, 11], [5, 10],
  ];

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <svg
        viewBox="0 0 220 90"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g className="text-border dark:text-border" opacity="0.4">
          {Array.from({ length: 22 }).map((_, col) =>
            Array.from({ length: 9 }).map((_, row) => {
              const x = col * 10 + 5;
              const y = row * 10 + 5;
              const isLand = checkLandmass(x, y);
              if (!isLand) return null;
              return (
                <circle
                  key={`${col}-${row}`}
                  cx={x}
                  cy={y}
                  r="0.6"
                  fill="currentColor"
                />
              );
            })
          )}
        </g>

        <g className="text-primary/20 dark:text-primary/15">
          {connections.map(([from, to], i) => (
            <line
              key={`line-${i}`}
              x1={connectionPoints[from].cx}
              y1={connectionPoints[from].cy}
              x2={connectionPoints[to].cx}
              y2={connectionPoints[to].cy}
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="2 1"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-6"
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </line>
          ))}
        </g>

        {connectionPoints.map((point, i) => (
          <g key={`point-${i}`}>
            <circle
              cx={point.cx}
              cy={point.cy}
              r="1.5"
              fill="none"
              className="text-primary"
              stroke="currentColor"
              strokeWidth="0.3"
              opacity="0"
            >
              <animate
                attributeName="r"
                from="1.5"
                to="4"
                dur="2.5s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="2.5s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={point.cx} cy={point.cy} r="1.2" className="fill-primary" />
            <circle cx={point.cx} cy={point.cy} r="0.5" className="fill-primary-foreground" opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function GlobalStatsBar() {
  const stats = [
    { value: "42", label: "Countries" },
    { value: "186K", label: "Workers" },
    { value: "12.4K", label: "Projects" },
    { value: "8.2K", label: "Equipment" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center rounded-lg bg-card border border-border px-2 py-2.5">
          <span className="text-base font-bold text-foreground font-display">{stat.value}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

export function getFlag(countryCode) {
  const flags = {
    US: "\u{1F1FA}\u{1F1F8}",
    GB: "\u{1F1EC}\u{1F1E7}",
    DE: "\u{1F1E9}\u{1F1EA}",
    BR: "\u{1F1E7}\u{1F1F7}",
    AE: "\u{1F1E6}\u{1F1EA}",
    IN: "\u{1F1EE}\u{1F1F3}",
    CN: "\u{1F1E8}\u{1F1F3}",
    JP: "\u{1F1EF}\u{1F1F5}",
    AU: "\u{1F1E6}\u{1F1FA}",
    NG: "\u{1F1F3}\u{1F1EC}",
    CA: "\u{1F1E8}\u{1F1E6}",
    MX: "\u{1F1F2}\u{1F1FD}",
    FR: "\u{1F1EB}\u{1F1F7}",
    SA: "\u{1F1F8}\u{1F1E6}",
    SG: "\u{1F1F8}\u{1F1EC}",
    KR: "\u{1F1F0}\u{1F1F7}",
  };
  return flags[countryCode] || "\u{1F30D}";
}
