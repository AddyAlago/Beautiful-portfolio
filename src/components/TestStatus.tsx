// src/components/TestStatus.tsx
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

type Status = {
  workflow: string;
  project: string;
  conclusion: "success" | "failure" | "cancelled" | string;
  sha: string;
  runId: string;
  runNumber: number;
  updatedAt: string;
};

const SOURCES = [
  {
    key: "desktop",
    label: "E2E Desktop",
    json: "https://addyalago.github.io/Beautiful-portfolio/desktop/status.json",
    href: "https://addyalago.github.io/Beautiful-portfolio/desktop",
  },
  {
    key: "mobile",
    label: "E2E Mobile",
    json: "https://addyalago.github.io/Beautiful-portfolio/mobile/status.json",
    href: "https://addyalago.github.io/Beautiful-portfolio/mobile",
  },
  {
    key: "a11y",
    label: "A11Y",
    json: "https://addyalago.github.io/Beautiful-portfolio/a11y/status.json",
    href: "https://addyalago.github.io/Beautiful-portfolio/a11y",
  },
];

function colorFor(conclusion?: string) {
  if (conclusion === "success") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (conclusion === "cancelled") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  if (conclusion === "unknown") return "bg-gray-50 text-gray-700 ring-1 ring-gray-200";
  return "bg-rose-50 text-rose-700 ring-1 ring-rose-200"; // failure/other
}

function iconFor(conclusion?: string) {
  if (conclusion === "success") return <CheckCircle2 className="h-4 w-4" aria-hidden />;
  if (conclusion === "cancelled") return <Clock className="h-4 w-4" aria-hidden />;
  if (conclusion === "unknown") return <Clock className="h-4 w-4" aria-hidden />;
  return <XCircle className="h-4 w-4" aria-hidden />;
}

export default function TestStatus() {
  const [data, setData] = useState<Record<string, Status | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
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
      } finally {
        if (alive) setLoading(false);
      }
    })();
    // Optional: re-poll every 60s
    const t = setInterval(() => {
      SOURCES.forEach(async (s) => {
        try {
          const res = await fetch(s.json, { cache: "no-store" });
          if (res.ok) {
            const json = (await res.json()) as Status;
            setData((d) => ({ ...d, [s.key]: json }));
          }
        } catch {}
      });
    }, 60000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3" data-testid="test-status">
      {SOURCES.map((s) => {
        const st = data[s.key];
        const conclusion = st ? (st.conclusion as string) : "unknown";
        const cls = colorFor(conclusion);
        const time = st ? new Date(st.updatedAt).toLocaleString() : "—";
        const icon = iconFor(conclusion);
        return (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${cls} hover:opacity-90 transition`}
            aria-label={`${s.label} report (${conclusion}) updated ${time}`}
          >
            {icon}
            <span className="font-medium">{s.label}</span>
            <span className="text-xs opacity-80">· {conclusion}</span>
            <span className="text-xs opacity-80">· {time}</span>
          </a>
        );
      })}
      {loading && (
        <span className="text-sm text-muted-foreground">Loading test status…</span>
      )}
    </div>
  );
}
