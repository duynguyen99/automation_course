"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useProgress } from "@/lib/progress";
import type { LessonRef } from "@/lib/types";

export interface OutlineChapter {
  slug: string;
  number: number;
  title: string;
  lessons: LessonRef[];
}

interface Props {
  chapterNumber: number;
  chapterTitle: string;
  page: number;
  totalPages: number;
  currentId: string;
  outline: OutlineChapter[];
  children: ReactNode;
}

const TYPE_MARK: Record<LessonRef["type"], string> = { read: "Đọc", code: "Code", quiz: "Quiz", locator: "Locator" };

export function LessonFrame({ chapterNumber, chapterTitle, page, totalPages, currentId, outline, children }: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const progress = useProgress();
  const done = Object.keys(progress.completed).length;
  const percent = Math.round((done / totalPages) * 100);

  useEffect(() => {
    if (!tocOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTocOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tocOpen]);

  return (
    <div className="flex h-dvh flex-col bg-paper-deep">
      <header className="relative z-20 flex h-14 shrink-0 items-center gap-3 border-b border-rule bg-paper px-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink hover:text-seal">
          QA<span className="text-seal">·</span>Academy
        </Link>
        <span className="hidden h-5 w-px bg-rule sm:block" aria-hidden />
        <p className="hidden min-w-0 truncate font-display italic text-ink-soft sm:block">
          Chương {chapterNumber} — {chapterTitle}
        </p>
        <div className="ml-auto flex items-center gap-3">
          <span className="font-mono text-xs text-ink-soft tabular-nums">
            Trang {page}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="rounded-md border border-rule px-3 py-1.5 text-sm font-medium text-ink transition hover:border-ink hover:bg-paper-deep active:translate-y-px"
            aria-haspopup="dialog"
          >
            Mục lục
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-transparent" aria-hidden>
          <div className="h-full bg-seal transition-[width] duration-700" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <div className="min-h-0 flex-1">{children}</div>

      {tocOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Mục lục">
          <button type="button" className="flex-1 bg-black/30 backdrop-blur-[1px]" aria-label="Đóng mục lục" onClick={() => setTocOpen(false)} />
          <nav className="paper scroll-thin rise w-[min(26rem,92vw)] overflow-y-auto border-l border-rule px-6 py-6 shadow-2xl">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold">Mục lục</h2>
              <button type="button" onClick={() => setTocOpen(false)} className="text-sm text-ink-soft hover:text-seal">
                Đóng ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Đã xong {done} / {totalPages} trang ({percent}%)
            </p>
            {outline.map((ch) => (
              <section key={ch.slug} className="mt-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-seal">
                  Chương {ch.number} · {ch.title}
                </h3>
                <ol className="mt-2 space-y-0.5">
                  {ch.lessons.map((l) => {
                    const current = l.id === currentId;
                    const complete = Boolean(progress.completed[l.id]);
                    return (
                      <li key={l.id}>
                        <Link
                          href={l.href}
                          onClick={() => setTocOpen(false)}
                          aria-current={current ? "page" : undefined}
                          className={`group flex items-center gap-3 rounded-md px-2 py-1.5 text-[0.95rem] transition ${
                            current ? "bg-seal-soft text-ink" : "hover:bg-paper-deep"
                          }`}
                        >
                          <span
                            className={`grid size-5 shrink-0 place-items-center rounded-full border text-[0.65rem] ${
                              complete ? "border-pass bg-pass text-paper" : "border-rule text-transparent"
                            }`}
                            aria-label={complete ? "Đã xong" : "Chưa xong"}
                          >
                            ✓
                          </span>
                          <span className="min-w-0 flex-1 truncate">{l.title}</span>
                          <span className="font-mono text-[0.65rem] uppercase text-ink-faint">{TYPE_MARK[l.type]}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
