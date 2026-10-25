"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CodeEditor } from "./CodeEditor";
import { OutputPanel, type OutputTab } from "./OutputPanel";
import { PageNav } from "./PageNav";
import { Seal } from "./Seal";
import { TestChecklist } from "./TestChecklist";
import { clearCode, codeKey, markComplete, recordFailedAttempt, saveCode, useProgress } from "@/lib/progress";
import { useRunner } from "@/lib/useRunner";
import type { GradeResponse, LessonFile, LessonRef, RunMode } from "@/lib/types";

interface Props {
  lessonId: string;
  header: ReactNode;
  body: ReactNode;
  /** Pre-rendered test descriptions (inline markdown), same order as the lesson's tests. */
  testLabels: ReactNode[];
  hints: ReactNode[];
  mode: RunMode;
  files: LessonFile[];
  solution?: Record<string, string>;
  usesBrowser: boolean;
  practiceUrl?: string;
  prev: LessonRef | null;
  next: LessonRef | null;
}

const SOLUTION_AFTER_FAILS = 3;
const SAVE_DELAY_MS = 400;

export function CodeLesson(props: Props) {
  const { lessonId, header, body, testLabels, hints, mode, files, solution, usesBrowser, practiceUrl, prev, next } = props;
  const progress = useProgress();
  // Drafts edited during this visit; files not edited yet show the saved code (or the seed).
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [active, setActive] = useState(files.find((f) => !f.readonly)?.name ?? files[0].name);
  const [tab, setTab] = useState<OutputTab>("console");
  const [showSolution, setShowSolution] = useState(false);
  const pending = useRef<Record<string, string>>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const codeOf = useCallback(
    (f: LessonFile) => drafts[f.name] ?? (f.readonly ? undefined : progress.code[codeKey(lessonId, f.name)]) ?? f.content,
    [drafts, progress.code, lessonId],
  );
  const current = useMemo(() => Object.fromEntries(files.map((f) => [f.name, codeOf(f)])), [files, codeOf]);

  const onGraded = useCallback(
    (graded: GradeResponse) => {
      if (graded.passed) markComplete(lessonId);
      else recordFailedAttempt(lessonId);
      if (graded.run.status === "compile_error" || graded.friendly.length > 0) setTab("console");
      else if (mode !== "java") setTab("report");
    },
    [lessonId, mode],
  );
  const onFirstFrame = useCallback(() => setTab("browser"), []);
  const runner = useRunner(lessonId, { onGraded, onFirstFrame });

  const completed = Boolean(progress.completed[lessonId]);
  const fails = progress.attempts[lessonId] ?? 0;

  const flush = useCallback(() => {
    clearTimeout(saveTimer.current);
    for (const [name, code] of Object.entries(pending.current)) saveCode(codeKey(lessonId, name), code);
    pending.current = {};
  }, [lessonId]);

  // Save an unsaved edit when leaving the page or closing the tab.
  useEffect(() => {
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  const onChange = (name: string, value: string) => {
    setDrafts((d) => ({ ...d, [name]: value }));
    pending.current[name] = value;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, SAVE_DELAY_MS);
  };

  const run = useCallback(() => runner.run(current), [runner, current]);

  const reset = () => {
    if (!window.confirm("Đưa code về như ban đầu? Code bạn đang viết sẽ mất.")) return;
    clearTimeout(saveTimer.current);
    pending.current = {};
    clearCode(lessonId);
    setDrafts({});
    runner.clear();
  };

  const useSolution = () => {
    if (!solution) return;
    for (const [name, code] of Object.entries(solution)) onChange(name, code);
  };

  const result = runner.result;
  const justPassed = result?.passed ?? false;
  const activeFile = files.find((f) => f.name === active) ?? files[0];

  return (
    // Phones: one long scrolling page (lesson, then editor). Desktop: two panes that scroll independently.
    <div className="scroll-thin grid h-full min-h-0 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:overflow-hidden">
      {/* ---------- left: the book page ---------- */}
      <article className="paper scroll-thin relative border-paper-edge lg:min-h-0 lg:overflow-y-auto lg:border-r lg:shadow-[inset_-18px_0_24px_-24px_rgb(0_0_0/0.45)]">
        <div className="page-in mx-auto max-w-[44rem] px-6 pb-10 pt-8 sm:px-10">
          {header}
          {(completed || justPassed) && (
            <div className="absolute right-6 top-6 sm:right-10">
              <Seal />
            </div>
          )}
          <div className="mt-6">{body}</div>

          <TestChecklist labels={testLabels} results={result?.tests ?? null} />

          {justPassed && (
            <p className="rise mt-4 rounded-lg bg-ink px-4 py-3 text-paper">
              <strong className="font-display text-lg">Tuyệt vời!</strong> Bạn đã qua trang này. Lật sang trang tiếp theo nhé.
            </p>
          )}

          {hints.length > 0 && (
            <details className="mt-5 rounded-lg border border-dashed border-rule px-4 py-3">
              <summary className="cursor-pointer select-none font-medium text-ink-soft">Cần gợi ý?</summary>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.97rem]">
                {hints.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </details>
          )}

          {solution && (fails >= SOLUTION_AFTER_FAILS || completed) && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowSolution((s) => !s)}
                className="text-sm font-medium text-seal underline underline-offset-4 hover:text-ink"
              >
                {showSolution ? "Ẩn lời giải" : "Xem lời giải mẫu"}
              </button>
              {showSolution && (
                <div className="rise mt-2 space-y-2">
                  {Object.entries(solution).map(([name, code]) => (
                    <div key={name}>
                      {Object.keys(solution).length > 1 && <p className="font-mono text-xs text-ink-soft">{name}</p>}
                      <pre className="scroll-desk overflow-x-auto rounded-lg bg-desk p-4 font-mono text-sm text-desk-text">{code}</pre>
                    </div>
                  ))}
                  <button type="button" onClick={useSolution} className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
                    Chép lời giải vào editor
                  </button>
                </div>
              )}
            </div>
          )}

          <PageNav prev={prev} next={next} ready={completed || justPassed} />
        </div>
      </article>

      {/* ---------- right: the desk ---------- */}
      <section className="flex h-[88dvh] flex-col bg-desk lg:h-auto lg:min-h-0" aria-label="Khu vực viết code">
        <div className="flex h-11 shrink-0 items-end gap-1 border-b border-desk-line px-3">
          <div className="scroll-desk flex min-w-0 items-end gap-1 overflow-x-auto" role="tablist" aria-label="File">
            {files.map((f) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={f.name === active}
                onClick={() => setActive(f.name)}
                className={`shrink-0 rounded-t-md border-x border-t px-3 py-1.5 font-mono text-xs transition ${
                  f.name === active ? "border-desk-line bg-[#191c25] text-desk-text" : "border-transparent text-desk-muted hover:text-desk-text"
                }`}
              >
                {f.name}
                {f.readonly && <span className="ml-1.5 text-[0.6rem] text-desk-muted">(chỉ đọc)</span>}
              </button>
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 self-center">
            <button type="button" onClick={reset} className="rounded-md px-2.5 py-1.5 text-xs text-desk-muted transition hover:bg-desk-raised hover:text-desk-text">
              Đặt lại code
            </button>
            <button
              type="button"
              onClick={run}
              disabled={runner.phase !== "idle"}
              className="flex items-center gap-2 rounded-md bg-[#f4d774] px-3.5 py-1.5 text-sm font-semibold text-[#1d1a10] shadow-[0_0_0_1px_rgb(0_0_0/0.2),0_6px_16px_-8px_#f4d774] transition hover:bg-[#ffe38a] active:translate-y-px disabled:cursor-wait disabled:opacity-70"
            >
              {runner.phase !== "idle" ? "Đang chạy…" : "▶ Chạy & kiểm tra"}
              <kbd className="hidden rounded bg-black/10 px-1 font-mono text-[0.65rem] font-normal sm:inline">Ctrl ↵</kbd>
            </button>
          </div>
        </div>
        <div className="min-h-[16rem] flex-[3]">
          <CodeEditor
            path={activeFile.name}
            value={current[activeFile.name]}
            readOnly={activeFile.readonly}
            onChange={(v) => onChange(activeFile.name, v)}
            onRun={run}
            errors={result?.friendly ?? []}
          />
        </div>
        <div className="flex min-h-[13rem] flex-[2] flex-col">
          <OutputPanel
            mode={mode}
            showBrowser={usesBrowser}
            tab={tab}
            onTab={setTab}
            result={result}
            phase={runner.phase}
            error={runner.error}
            frame={runner.frame}
            practiceUrl={practiceUrl}
          />
        </div>
      </section>
    </div>
  );
}
