import type { ReactNode } from "react";
import type { TestResult } from "@/lib/types";

/** The lesson's "Bài kiểm tra" list, coloured by the latest run. */
export function TestChecklist({ labels, results }: { labels: ReactNode[]; results: TestResult[] | null }) {
  return (
    <section className="mt-10" aria-labelledby="tests-heading">
      <h2 id="tests-heading" className="font-display text-lg font-semibold">
        Bài kiểm tra
      </h2>
      <ol className="mt-3 space-y-2">
        {labels.map((label, i) => {
          const t = results?.[i] ?? null;
          const state = t === null ? "idle" : t.pass ? "pass" : "fail";
          return (
            <li
              key={i}
              className={`flex gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                state === "pass" ? "border-pass/40 bg-pass-soft" : state === "fail" ? "border-seal/40 bg-seal-soft" : "border-rule bg-paper/60"
              }`}
            >
              <span
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold ${
                  state === "pass" ? "bg-pass text-paper" : state === "fail" ? "bg-seal text-paper" : "border border-ink-faint text-ink-faint"
                }`}
                aria-label={state === "pass" ? "Đạt" : state === "fail" ? "Chưa đạt" : "Chưa chạy"}
              >
                {state === "pass" ? "✓" : state === "fail" ? "✕" : i + 1}
              </span>
              <div className="min-w-0 text-[0.97rem] leading-relaxed">
                <div className="[&_code]:rounded [&_code]:bg-paper-deep [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">{label}</div>
                {t && !t.pass && t.hint && <p className="mt-1 whitespace-pre-wrap text-sm text-seal">{t.hint}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
