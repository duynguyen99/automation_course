import type { GradeResponse, RunMode } from "@/lib/types";

const ICON: Record<string, { mark: string; tone: string }> = {
  passed: { mark: "✓", tone: "bg-[#2e7a4e] text-white" },
  failed: { mark: "✕", tone: "bg-[#b8432b] text-white" },
  skipped: { mark: "–", tone: "bg-[#4b5161] text-white" },
  undefined: { mark: "?", tone: "bg-[#b7791f] text-white" },
  pending: { mark: "…", tone: "bg-[#b7791f] text-white" },
  ambiguous: { mark: "!", tone: "bg-[#b7791f] text-white" },
};

function Badge({ status }: { status: string }) {
  const icon = ICON[status] ?? ICON.skipped;
  return (
    <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold ${icon.tone}`} aria-label={status}>
      {icon.mark}
    </span>
  );
}

/** JUnit test list or Cucumber scenario tree, like an IDE's test runner panel. */
export function TestReport({ mode, result, running }: { mode: RunMode; result: GradeResponse | null; running: boolean }) {
  if (running || !result) {
    return <p className="px-4 py-3 font-sans text-sm text-desk-muted">{running ? "Đang chạy test…" : "Chạy code để xem kết quả từng test."}</p>;
  }
  if (result.run.status === "compile_error") {
    return <p className="px-4 py-3 font-sans text-sm text-[#f08a7a]">Code chưa biên dịch được nên chưa chạy test nào. Xem tab Console.</p>;
  }

  if (mode === "cucumber") {
    const scenarios = result.run.scenarios ?? [];
    if (scenarios.length === 0) return <p className="px-4 py-3 font-sans text-sm text-desk-muted">Không có scenario nào được chạy.</p>;
    return (
      <ol className="space-y-3 px-4 py-3 font-sans text-sm text-desk-text">
        {scenarios.map((s, i) => (
          <li key={i} className="rounded-md border border-desk-line bg-desk p-3">
            <p className="flex gap-2 font-semibold">
              <Badge status={s.status} />
              <span>
                <span className="text-[#f0a868]">Scenario:</span> {s.name}
                {s.tags.length > 0 && <span className="ml-2 font-mono text-xs text-[#d6a8ff]">{s.tags.join(" ")}</span>}
              </span>
            </p>
            <ul className="mt-2 space-y-1 pl-7 font-mono text-[0.82rem]">
              {s.steps.map((st, j) => (
                <li key={j}>
                  <span className="flex gap-2">
                    <Badge status={st.status} />
                    <span>
                      <span className="text-[#8cc4ff]">{st.keyword}</span> {st.text}
                    </span>
                  </span>
                  {st.error && <pre className="mt-1 whitespace-pre-wrap pl-7 text-[0.75rem] text-[#f5b3a6]">{st.error}</pre>}
                  {st.status === "undefined" && (
                    <p className="mt-1 pl-7 font-sans text-[0.78rem] text-[#e9c46a]">Bước này chưa có step definition (chưa có method Java nào khớp).</p>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    );
  }

  const tests = result.run.tests ?? [];
  if (tests.length === 0) {
    return <p className="px-4 py-3 font-sans text-sm text-desk-muted">Không tìm thấy test nào. Bạn đã thêm annotation <code>@Test</code> chưa?</p>;
  }
  const passed = tests.filter((t) => t.status === "passed").length;
  return (
    <div className="px-4 py-3 font-sans text-sm text-desk-text">
      <p className="mb-2 font-mono text-xs text-desk-muted">
        {passed}/{tests.length} test pass
      </p>
      <ul className="space-y-1.5">
        {tests.map((t, i) => (
          <li key={i} className="rounded-md border border-desk-line bg-desk px-3 py-2">
            <p className="flex gap-2">
              <Badge status={t.status} />
              <span className="font-mono text-[0.85rem]">
                <span className="text-desk-muted">{t.className}.</span>
                {t.name}
                <span className="ml-2 text-xs text-desk-muted">{t.timeMs}ms</span>
              </span>
            </p>
            {t.message && <pre className="mt-1 whitespace-pre-wrap pl-7 font-mono text-[0.78rem] text-[#f5b3a6]">{t.message}</pre>}
          </li>
        ))}
      </ul>
    </div>
  );
}
