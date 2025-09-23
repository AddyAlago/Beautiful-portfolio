import { useEffect, useState } from "react";
import { Monitor, Smartphone, Accessibility, Image as ImageIcon, ChevronRight } from "lucide-react";

type Status = {
  conclusion: "success" | "failure" | "unknown";
  updatedAt: string;
};

type Source = {
  key: "desktop" | "mobile" | "a11y" | "visual";
  label: string;
  // Where the user goes on click. Use per-suite Playwright HTML (always published)
  // or switch to per-suite Allure if you enabled publishing full per-suite Allure sites.
  href: string;
  // Allure widget summary JSON we publish in the aggregator:
  json: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const BASE = "https://addyalago.github.io/Beautiful-portfolio";
const SOURCES: Source[] = [
  {
    key: "desktop",
    label: "E2E Desktop",
    href: `${BASE}/playwright/desktop/`, // or `${BASE}/allure/desktop/` if you publish per-suite Allure
    json: `${BASE}/allure/desktop/widgets/summary.json`,
    Icon: Monitor,
  },
  {
    key: "mobile",
    label: "E2E Mobile",
    href: `${BASE}/playwright/mobile/`,
    json: `${BASE}/allure/mobile/widgets/summary.json`,
    Icon: Smartphone,
  },
  {
    key: "a11y",
    label: "A11Y",
    href: `${BASE}/playwright/a11y/`,
    json: `${BASE}/allure/a11y/widgets/summary.json`,
    Icon: Accessibility,
  },
  {
    key: "visual",
    label: "Visual",
    href: `${BASE}/playwright/visual/`,
    json: `${BASE}/allure/visual/widgets/summary.json`,
    Icon: ImageIcon,
  },
];

function classesFor(conclusion?: string) {
  if (conclusion === "success") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (conclusion === "cancelled") return "bg-amber-50 text-amber-800 border-amber-200";
  if (!conclusion || conclusion === "unknown") return "bg-gray-50 text-gray-700 border-gray-200";
  return "bg-rose-50 text-rose-800 border-rose-200";
}

// Minimal shape from Allure widgets/summary.json
type AllureSummary = {
  statistic?: { failed?: number; broken?: number; total?: number };
  time?: { stop?: number }; // ms epoch
};

export default function StatusCardsRight() {
  const [data, setData] = useState<Record<string, Status | null>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const entries = await Promise.all(
        SOURCES.map(async (s) => {
          try {
            const res = await fetch(s.json, { cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            const json = (await res.json()) as AllureSummary;

            const failed = (json.statistic?.failed ?? 0) + (json.statistic?.broken ?? 0);
            const total = json.statistic?.total ?? 0;
            const conclusion: Status["conclusion"] =
              total === 0 ? "unknown" : failed > 0 ? "failure" : "success";

            const stop = json.time?.stop ?? Date.now();
            const status: Status = {
              conclusion,
              updatedAt: new Date(stop).toISOString(),
            };
            return [s.key, status] as const;
          } catch {
            return [s.key, null] as const;
          }
        })
      );
      if (alive) setData(Object.fromEntries(entries));
    })();
    return () => {
      alive = false;
    };
  }, []);

  const hasAnyData = Object.keys(data).length > 0;

  return (
    <div className="h-60 w-full md:w-80" data-testid="status-cards">
      {!hasAnyData ? (
        <div data-testid="badges-skeleton" className="grid h-full grid-rows-3 gap-3 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border px-3 py-2 border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 w-full">
                <div className="h-5 w-5 rounded-full bg-gray-200" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 w-28 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-40 bg-gray-200 rounded opacity-80" />
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-full grid-rows-3 gap-3">
          {SOURCES.map(({ key, label, href, Icon }) => {
            const st = data[key];
            const conclusion = st?.conclusion ?? "unknown";
            const ts = st ? new Date(st.updatedAt).toLocaleString() : "—";
            const cls = classesFor(conclusion);
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between rounded-xl border px-3 py-2 ${cls} transition hover:opacity-95`}
                title={`${label} · ${conclusion} · ${ts}`}
                data-testid={`status-card-${key}`}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium truncate">{label}</div>
                    <div className="text-xs opacity-80 truncate">
                      {conclusion} · {ts}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-60 group-hover:opacity-100 transition shrink-0" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
