"use client";

import { useRef, useState, type ReactNode } from "react";
import { PageNav } from "./PageNav";
import { Seal } from "./Seal";
import { detectKind, evaluateLocator, sameElements } from "@/lib/locator";
import { markComplete, useProgress } from "@/lib/progress";
import type { LessonRef, LocatorTask } from "@/lib/types";

interface Props {
  lessonId: string;
  header: ReactNode;
  body: ReactNode;
  tasks: (Omit<LocatorTask, "prompt"> & { prompt: ReactNode })[];
  prev: LessonRef | null;
  next: LessonRef | null;
}

const PREVIEW_CSS = `
  body { font-family: "Segoe UI", system-ui, sans-serif; margin: 16px; color: #2b2a26; background: #fff; }
  [data-qa-hit] { outline: 3px solid #f4b400 !important; outline-offset: 2px; background-color: rgb(244 180 0 / 0.18) !important; }
  button, input, select { font: inherit; }
`;

/** One exercise: HTML source, a live preview, and a box to type the locator. */
function LocatorTaskCard({ task, index, solved, onSolved }: {
  task: Props["tasks"][number];
  index: number;
  solved: boolean;
  onSolved: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [value, setValue] = useState("");
  const [info, setInfo] = useState<{ count: number; error?: string; ok: boolean; wrongKind?: string } | null>(null);

  /** Highlights what the locator matches in the preview and checks it against the answer. */
  const check = (locator: string) => {
    setValue(locator);
    const doc = frameRef.current?.contentDocument;
    if (!doc?.body) return;
    doc.querySelectorAll("[data-qa-hit]").forEach((el) => el.removeAttribute("data-qa-hit"));
    if (!locator.trim()) {
      setInfo(null);
      return;
    }
    const kind = detectKind(locator);
    const wrongKind =
      task.accept !== "any" && task.accept !== kind
        ? task.accept === "css" ? "Bài này yêu cầu CSS selector" : "Bài này yêu cầu XPath (bắt đầu bằng //)"
        : undefined;
    const { elements, error } = evaluateLocator(doc, locator, kind);
    elements.forEach((el) => el.setAttribute("data-qa-hit", ""));
    const expected = evaluateLocator(doc, task.answer, "css").elements;
    const ok = !error && !wrongKind && sameElements(elements, expected);
    setInfo({ count: elements.length, error, ok, wrongKind });
    if (ok) onSolved();
  };

  const srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>${PREVIEW_CSS}</style></head><body>${task.html}</body></html>`;

  return (
    <section className="rounded-xl border border-rule bg-paper/70 p-4 sm:p-5">
      <h3 className="flex items-center gap-3 font-display text-lg font-semibold">
        <span className={`grid size-7 place-items-center rounded-full text-sm ${solved ? "bg-pass text-paper" : "bg-ink text-paper"}`}>
          {solved ? "✓" : index + 1}
        </span>
        <span className="[&_code]:font-mono [&_code]:text-[0.85em]">{task.prompt}</span>
      </h3>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <pre className="scroll-desk max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-desk p-3 font-mono text-[0.8rem] leading-relaxed text-desk-text">{task.html.trim()}</pre>
        <iframe
          ref={frameRef}
          title={`Trang mẫu cho bài ${index + 1}`}
          srcDoc={srcdoc}
          sandbox="allow-same-origin"
          className="h-72 w-full rounded-lg border border-rule bg-white"
        />
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-ink-soft">
          {task.accept === "xpath" ? "XPath của bạn" : task.accept === "css" ? "CSS selector của bạn" : "CSS selector hoặc XPath"}
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => check(e.target.value)}
          placeholder={task.placeholder ?? (task.accept === "xpath" ? "//button[text()='...']" : "#id hoặc .class")}
          spellCheck={false}
          autoComplete="off"
          className="mt-1 w-full rounded-lg border border-rule bg-white px-3 py-2.5 font-mono text-[0.95rem] text-[#1f2733] outline-none focus:border-ink"
        />
      </label>
      <p className={`mt-2 min-h-6 text-sm ${info?.ok ? "text-pass" : info?.error || info?.wrongKind ? "text-seal" : "text-ink-soft"}`} aria-live="polite">
        {info?.error ?? info?.wrongKind ??
          (info
            ? info.ok
              ? `Chính xác! Locator khớp đúng ${info.count} phần tử cần tìm.`
              : `Đang khớp ${info.count} phần tử (tô vàng ở khung bên phải). Chưa đúng phần tử cần tìm.`
            : "Gõ locator, các phần tử khớp sẽ được tô vàng ngay.")}
      </p>
    </section>
  );
}

export function LocatorLesson({ lessonId, header, body, tasks, prev, next }: Props) {
  const completed = Boolean(useProgress().completed[lessonId]);
  const [solved, setSolved] = useState<boolean[]>(() => tasks.map(() => false));
  const allSolved = solved.every(Boolean);

  const solve = (i: number) => {
    setSolved((s) => {
      if (s[i]) return s;
      const nextSolved = s.map((v, j) => (j === i ? true : v));
      if (nextSolved.every(Boolean)) markComplete(lessonId);
      return nextSolved;
    });
  };

  return (
    <div className="scroll-thin h-full overflow-y-auto px-3 py-6 sm:px-6 sm:py-10">
      <article className="paper page-in relative mx-auto max-w-[60rem] rounded-sm border border-paper-edge px-5 pb-10 pt-10 shadow-[0_30px_60px_-40px_rgb(0_0_0/0.55)] sm:px-12">
        {(completed || allSolved) && (
          <div className="absolute right-6 top-6 sm:right-10">
            <Seal />
          </div>
        )}
        {header}
        {body && <div className="mt-6">{body}</div>}
        <div className="mt-8 space-y-6">
          {tasks.map((task, i) => (
            <LocatorTaskCard
              key={i}
              task={task}
              index={i}
              solved={solved[i]}
              onSolved={() => solve(i)}
            />
          ))}
        </div>
        {allSolved && (
          <p className="rise mt-6 rounded-lg bg-ink px-4 py-3 text-paper">
            <strong className="font-display text-lg">Xuất sắc!</strong> Bạn đã tìm đúng tất cả phần tử.
          </p>
        )}
        <PageNav prev={prev} next={next} ready={completed || allSolved} />
      </article>
    </div>
  );
}
