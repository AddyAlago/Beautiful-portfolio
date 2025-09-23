import { useEffect, useState } from "react";
import { Monitor, Smartphone, Accessibility, ChevronRight } from "lucide-react";

type Status = {
  workflow: string;
  project: string;
  conclusion: "success" | "failure" | "cancelled" | string;
  updatedAt: string;
  sha: string;
  runId: string;
  runNumber: number;
};

type Source = {
  key: "desktop" | "mobile" | "a11y";
  label: string;
  href: string;
  json: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const SOURCES: Source[] = [
  {
    key: "desktop",
    label: "E2E Desktop",
    href: "https://addyalago.github.io/Beautiful-portfolio/allure/desktop/",
    json: "https://addyalago.github.io/Beautiful-portfolio/desktop/status.json",
    Icon: Monitor,
  },
  {
    key: "mobile",
    label: "E2E Mobile",
    href: "https://addyalago.github.io/Beautiful-portfolio/allure/mobile/",
    json: "https://addyalago.github.io/Beautiful-portfolio/mobile/status.json",
    Icon: Smartphone,
  },
  {
    key: "a11y",
    label: "A11Y",
    href: "https://addyalago.github.io/Beautiful-portfolio/allure/a11y/",
    json: "https://addyalago.github.io/Beautiful-portfolio/a11y/status.json",
    Icon: Accessibility,
  },
];

function classesFor(conclusion?: string) {
  if (conclusion === "success") return "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (conclusion === "cancelled") return "bg-amber-50 text-amber-800 border-amber-200";
  if (!conclusion || conclusion === "unknown") return "bg-gray-50 text-gray-700 border-gray-200";
  return "bg-rose-50 text-rose-800 border-rose-200";
}

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
            const json = (await res.json()) as Status;
            return [s.key, json] as const;
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
        // --- SKELETON (only before first paint) ---
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
        // --- REAL CARDS (after fetch) ---
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
