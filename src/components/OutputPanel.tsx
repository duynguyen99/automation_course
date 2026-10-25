"use client";

import type { GradeResponse, RunMode } from "@/lib/types";
import { TestReport } from "./TestReport";

export type OutputTab = "console" | "browser" | "report";
export type RunPhase = "idle" | "queued" | "compile" | "run";

interface Props {
  mode: RunMode;
  showBrowser: boolean;
  tab: OutputTab;
  onTab: (tab: OutputTab) => void;
  result: GradeResponse | null;
  phase: RunPhase;
  error: string | null;
  frame: string | null;
  practiceUrl?: string;
}

const PHASE_TEXT: Record<RunPhase, string> = {
  idle: "",
  queued: "đang xếp hàng…",
  compile: "đang biên dịch…",
  run: "đang chạy…",
};

const STATUS_LABEL: Record<string, { text: string; tone: string }> = {
  ok: { text: "Chạy xong", tone: "text-[#8fd3a6]" },
  compile_error: { text: "Lỗi biên dịch", tone: "text-[#f08a7a]" },
  runtime_error: { text: "Lỗi khi chạy", tone: "text-[#f08a7a]" },
  timeout: { text: "Quá thời gian", tone: "text-[#e9c46a]" },
};

export function OutputPanel({ mode, showBrowser, tab, onTab, result, phase, error, frame, practiceUrl }: Props) {
  const running = phase !== "idle";
  const status = result ? STATUS_LABEL[result.run.status] : null;
  const tabs: { id: OutputTab; label: string }[] = [
    { id: "console", label: "Console" },
    ...(mode !== "java" ? [{ id: "report" as const, label: mode === "cucumber" ? "Kịch bản" : "Kết quả test" }] : []),
    ...(showBrowser ? [{ id: "browser" as const, label: "Trình duyệt" }] : []),
  ];

  return (
    <section className="flex min-h-0 flex-1 flex-col border-t border-desk-line bg-desk-raised" aria-label="Kết quả chạy">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-desk-line px-2 text-xs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => onTab(t.id)}
            className={`rounded px-2.5 py-1 font-mono uppercase tracking-[0.14em] transition ${
              tab === t.id ? "bg-desk-line text-desk-text" : "text-desk-muted hover:text-desk-text"
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto pr-2 font-mono">
          {running && <span className="animate-pulse text-[#e9c46a]">● {PHASE_TEXT[phase]}</span>}
          {!running && status && (
            <span className={status.tone}>
              ● {status.text} · {(result!.run.timeMs / 1000).toFixed(1)}s
            </span>
          )}
        </span>
      </div>

      <div className="scroll-desk min-h-0 flex-1 overflow-auto" aria-live="polite">
        {tab === "console" && <ConsoleBody result={result} running={running} error={error} />}
        {tab === "report" && <TestReport mode={mode} result={result} running={running} />}
        {tab === "browser" && <BrowserView frame={frame ?? result?.run.screenshot ?? null} running={running} practiceUrl={practiceUrl} />}
      </div>
    </section>
  );
}

function ConsoleBody({ result, running, error }: { result: GradeResponse | null; running: boolean; error: string | null }) {
  return (
    <div className="px-4 py-3 font-mono text-[0.86rem] leading-relaxed text-desk-text">
      {error && <p className="font-sans text-[#f08a7a]">{error}</p>}
      {!error && !result && !running && (
        <p className="font-sans text-desk-muted">
          Bấm <kbd className="rounded border border-desk-line px-1.5 py-0.5 text-desk-text">Chạy &amp; kiểm tra</kbd> hoặc{" "}
          <kbd className="rounded border border-desk-line px-1.5 py-0.5 text-desk-text">Ctrl + Enter</kbd> để xem kết quả ở đây.
        </p>
      )}
      {result && !running && (
        <div className="space-y-3">
          {result.friendly.map((f, i) => (
            <div key={i} className="rise rounded-md border border-[#5a2f2a] bg-[#2a1d1f] px-3 py-2 font-sans">
              <p className="font-semibold text-[#f5b3a6]">
                {f.line ? (
                  <span className="mr-2 font-mono text-xs text-[#f08a7a]">
                    {f.file ? `${f.file} · ` : ""}Dòng {f.line}
                  </span>
                ) : null}
                {f.title}
              </p>
              <p className="mt-0.5 text-[0.9rem] text-[#e6cfc9]">{f.detail}</p>
            </div>
          ))}
          {result.run.stdout && <pre className="whitespace-pre-wrap break-words">{result.run.stdout}</pre>}
          {!result.run.stdout && result.run.status === "ok" && <p className="font-sans text-desk-muted">(Chương trình không in ra gì)</p>}
          {result.run.stderr && result.run.status !== "ok" && (
            <details className="text-desk-muted">
              <summary className="cursor-pointer select-none font-sans text-xs uppercase tracking-widest">Thông báo gốc của Java</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words text-[0.8rem] text-[#c9a39b]">{result.run.stderr}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

function BrowserView({ frame, running, practiceUrl }: { frame: string | null; running: boolean; practiceUrl?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-desk-line bg-[#2a2f3c] px-3 py-1.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#f08a7a]" />
          <span className="size-2.5 rounded-full bg-[#e9c46a]" />
          <span className="size-2.5 rounded-full bg-[#8fd3a6]" />
        </span>
        <span className="truncate rounded bg-desk px-2 py-0.5 font-mono text-[0.7rem] text-desk-muted">
          {running ? "Chrome đang được điều khiển bởi code của bạn" : "Chrome (khung hình cuối)"}
        </span>
        {practiceUrl && (
          <a href={practiceUrl} target="_blank" rel="noreferrer" className="ml-auto shrink-0 text-xs text-[#f4d774] underline underline-offset-2">
            Mở trang mẫu ↗
          </a>
        )}
      </div>
      <div className="grid min-h-0 flex-1 place-items-center bg-[#0f1116] p-2">
        {frame ? (
          // eslint-disable-next-line @next/next/no-img-element -- live base64 frames, not optimizable assets
          <img src={`data:image/jpeg;base64,${frame}`} alt="Màn hình trình duyệt do code điều khiển" className="max-h-full max-w-full rounded shadow-lg" />
        ) : (
          <p className="max-w-xs text-center font-sans text-sm text-desk-muted">
            {running ? "Đang mở Chrome… (lần đầu có thể mất 10–20 giây)" : "Khi code mở trình duyệt, màn hình sẽ hiện trực tiếp ở đây."}
          </p>
        )}
      </div>
    </div>
  );
}
