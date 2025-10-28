#!/usr/bin/env python3
# scripts/ai_summary.py
#
# Reads Allure results → computes stats → (optionally) compares to previous summary
# → asks an LLM for a concise triage summary → emits summary.md + summary.json.
#
# Env:
#   OPENAI_API_KEY   (required if using OpenAI; otherwise set LLM_PROVIDER=none)
#   LLM_MODEL        (default: "gpt-4o-mini")
#   LLM_PROVIDER     (default: "openai"; options: "openai", "none")
#   ALLURE_BASE_URL  (optional, link to latest published Allure, e.g. https://<org>.github.io/<repo>/allure)
#   DATADOG_DASH_URL (optional, link to Datadog dashboard)
#   CI_RUN_URL       (optional, link to this workflow run)
#   PREV_SUMMARY_JSON (optional, path to previous summary.json to compute deltas)

import json, os, re, sys, time, glob, hashlib
from collections import defaultdict

# ---------- Config ----------
ALLURE_DIR = os.getenv("ALLURE_DIR", "allure-results")
OUT_JSON   = os.getenv("OUT_JSON", "summary.json")
OUT_MD     = os.getenv("OUT_MD", "summary.md")

LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
LLM_MODEL    = os.getenv("LLM_MODEL", "gpt-4o-mini")
ALLURE_LINK  = os.getenv("ALLURE_BASE_URL", "").strip()
DATADOG_LINK = os.getenv("DATADOG_DASH_URL", "").strip()
CI_RUN_URL   = os.getenv("CI_RUN_URL", "").strip()
PREV_SUMMARY = os.getenv("PREV_SUMMARY_JSON", "").strip()

# ---------- Helpers ----------
def sha_short(s: str, n=8):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()[:n]

def ms_to_hms(ms):
    sec = int(ms/1000)
    return f"{sec//60}m {sec%60}s"

def load_allure_results(path):
    """
    Load Allure *-result.json files. We avoid other files (e.g., attachments).
    Returns a list of dicts.
    """
    results = []
    for p in glob.glob(os.path.join(path, "*-result.json")):
        try:
            with open(p, "r", encoding="utf-8") as f:
                results.append(json.load(f))
        except Exception:
            pass
    return results

def aggregate(results):
    """
    Aggregate stats and detect flakes by grouping on testCaseId or fullName.
    """
    by_key = defaultdict(list)
    for r in results:
        key = r.get("testCaseId") or r.get("fullName") or r.get("name") or sha_short(json.dumps(r)[:200])
        by_key[key].append(r)

    total = 0
    passed = 0
    failed = 0
    skipped = 0
    durations_ms = 0

    failures = []
    # Flake detection: same test key showing multiple statuses across attempts
    flake_count = 0

    for key, runs in by_key.items():
        # choose latest run by stop time if present
        runs_sorted = sorted(runs, key=lambda x: (x.get("stop", 0), x.get("start", 0)))
        latest = runs_sorted[-1]
        status = latest.get("status", "unknown")
        total += 1

        # duration
        start = latest.get("start", 0)
        stop  = latest.get("stop", 0)
        if stop and start and stop >= start:
            durations_ms += (stop - start)

        # status counters
        if status == "passed":
            passed += 1
        elif status == "failed":
            failed += 1
            # stash failure details
            failures.append({
                "name": latest.get("fullName") or latest.get("name"),
                "statusMessage": latest.get("statusMessage", ""),
                "statusTrace": latest.get("statusTrace", ""),
                "labels": latest.get("labels", []),
            })
        else:
            skipped += 1

        # flake detection
        statuses = {r.get("status") for r in runs}
        if "passed" in statuses and "failed" in statuses:
            flake_count += 1

    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "skipped": skipped,
        "flaky": flake_count,
        "duration_ms": durations_ms,
        "failures": failures,
    }

def load_prev_summary(path):
    if not path or not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return None

def deltas(curr, prev):
    if not prev:
        return None
    def d(k): return curr.get(k,0) - prev.get(k,0)
    return {
        "total": d("total"),
        "passed": d("passed"),
        "failed": d("failed"),
        "skipped": d("skipped"),
        "flaky": d("flaky"),
        "duration_ms": curr.get("duration_ms",0) - prev.get("duration_ms",0),
    }

def format_delta(n, suffix=""):
    if n == 0: return "±0"
    sign = "▲" if n > 0 else "▼"
    return f"{sign}{abs(n)}{suffix}"

def pick_failure_snippets(failures, limit=6, char_budget=3500):
    """
    Build a compact text for the LLM with top-N failure patterns, within char budget.
    """
    chunks = []
    for f in failures[:limit]:
        name = f.get("name","(unknown)")
        msg  = (f.get("statusMessage") or f.get("statusTrace") or "")[:800]
        msg  = re.sub(r"\s+", " ", msg).strip()
        chunks.append(f"- {name}: {msg}")
        joined = "\n".join(chunks)
        if len(joined) > char_budget:
            chunks.pop()
            break
    return "\n".join(chunks)

def call_llm(prompt):
    if LLM_PROVIDER == "none":
        # Fallback: simple rules-based summary if no LLM provider
        return "*(LLM disabled)* Consider stabilizing flaky tests, grouping timeouts, and adding explicit waits for dynamic elements. Add network-idle waits before clicks and verify selectors are unique."
    elif LLM_PROVIDER == "openai":
        try:
            # OpenAI Python SDK v1 style
            from openai import OpenAI
            client = OpenAI()
            resp = client.chat.completions.create(
                model=LLM_MODEL,
                messages=[{"role":"user","content":prompt}],
                temperature=0.2,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            return f"*(LLM error: {e})*"
    else:
        return "*(Unknown LLM provider; set LLM_PROVIDER=openai or none)*"

def main():
    results = load_allure_results(ALLURE_DIR)
    if not results:
        print(f"No Allure results found in '{ALLURE_DIR}'.", file=sys.stderr)
        # still emit empty files to avoid CI failures
        with open(OUT_JSON,"w",encoding="utf-8") as f: json.dump({}, f)
        with open(OUT_MD,"w",encoding="utf-8") as f: f.write("**No Allure results found.**\n")
        return

    agg = aggregate(results)
    prev = load_prev_summary(PREV_SUMMARY)
    delta = deltas(agg, prev)

    # Build LLM prompt
    failure_snips = pick_failure_snippets(agg["failures"])
    core_line = f"{agg['passed']} passed, {agg['failed']} failed, {agg['flaky']} flaky, {agg['skipped']} skipped, total {agg['total']}."
    prompt = f"""
You are a QA triage assistant. Based on the following test run stats and failure snippets, produce a concise, highly actionable markdown summary:

Stats:
- {core_line}
- Duration: {ms_to_hms(agg['duration_ms'])}

Failure snippets:
{failure_snips or '(none)'}

Instructions:
- Start with 1–2 bullet lines that tell the story (what failed, where).
- Group common root causes (timeouts, locators, network, data setup) with one short fix each.
- If timeouts: recommend explicit waits (visible/attached/stable) or network-idle gating.
- If selector issues: propose robust locators (role, text, data-testid) and fallback strategies.
- If network errors: suggest retry/backoff or mock stabilization.
- Suggest up to 3 “missing tests” inferred from likely gaps (keep generic if diff unknown).
- Keep it under 12 bullets total, terse, and practical.
"""
    llm_summary = call_llm(prompt)

    # Markdown header with emojis & links
    dur = ms_to_hms(agg["duration_ms"])
    status_emoji = "✅" if agg["failed"] == 0 else ("⚠️" if agg["failed"] <= 2 else "❌")

    lines = []
    lines.append(f"**{status_emoji} QA AI Summary**")
    lines.append("")
    lines.append(f"- **Run:** {dur} · **Totals:** {agg['total']}  |  **Passed:** {agg['passed']} ✅  **Failed:** {agg['failed']} ❌  **Flaky:** {agg['flaky']} ⚠️  **Skipped:** {agg['skipped']} ⏭️")

    if delta:
        lines.append(f"- **Δ vs prev:** total {format_delta(delta['total'])}, "
                     f"passed {format_delta(delta['passed'])}, "
                     f"failed {format_delta(delta['failed'])}, "
                     f"flaky {format_delta(delta['flaky'])}, "
                     f"skipped {format_delta(delta['skipped'])}, "
                     f"duration {format_delta(int(delta['duration_ms']/1000), 's')}")

    link_parts = []
    if ALLURE_LINK:  link_parts.append(f"[Allure report]({ALLURE_LINK})")
    if DATADOG_LINK: link_parts.append(f"[Datadog]({DATADOG_LINK})")
    if CI_RUN_URL:   link_parts.append(f"[Workflow run]({CI_RUN_URL})")
    if link_parts:
        lines.append(f"- " + " · ".join(link_parts))

    lines.append("\n---\n")
    lines.append(llm_summary.strip())

    # write outputs
    with open(OUT_MD,"w",encoding="utf-8") as f:
        f.write("\n".join(lines).strip()+"\n")
    with open(OUT_JSON,"w",encoding="utf-8") as f:
        json.dump({
            "totals": {k: agg[k] for k in ["total","passed","failed","flaky","skipped","duration_ms"]},
            "generated_at": int(time.time()),
        }, f, indent=2)

if __name__ == "__main__":
    main()
