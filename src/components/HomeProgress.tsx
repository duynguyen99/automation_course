"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { exportProgress, importProgress, resetProgress, useProgress } from "@/lib/progress";
import type { LessonRef } from "@/lib/types";

export interface HomeChapter {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  lessons: LessonRef[];
}

export function ContinueButton({ lessons }: { lessons: LessonRef[] }) {
  const progress = useProgress();
  const done = lessons.filter((l) => progress.completed[l.id]).length;
  const nextLesson = lessons.find((l) => !progress.completed[l.id]) ?? lessons[0];
  if (!nextLesson) return null;
  const fresh = done === 0;
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href={nextLesson.href}
        className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-lg font-medium text-paper shadow-[0_14px_30px_-16px_rgb(0_0_0/0.8)] transition hover:bg-seal active:translate-y-px"
      >
        {fresh ? "Mở trang đầu tiên" : "Học tiếp"}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
      {!fresh && (
        <p className="text-ink-soft">
          Trang tiếp: <span className="font-display italic text-ink">{nextLesson.title}</span>
        </p>
      )}
    </div>
  );
}

export function ChapterProgress({ lessons }: { lessons: LessonRef[] }) {
  const progress = useProgress();
  const done = lessons.filter((l) => progress.completed[l.id]).length;
  const pct = lessons.length ? (done / lessons.length) * 100 : 0;
  return (
    <div className="flex items-center gap-3" aria-label={`Đã xong ${done} trên ${lessons.length} trang`}>
      <div className="h-1 w-24 overflow-hidden rounded-full bg-rule">
        <div className="h-full rounded-full bg-seal transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs tabular-nums text-ink-faint">
        {done}/{lessons.length}
      </span>
    </div>
  );
}

export function ProgressBackup() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const download = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qa-academy-tien-do-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Đã tải file tiến độ về máy.");
  };

  const reset = () => {
    const ok = window.confirm(
      "Xóa toàn bộ tiến độ? Các trang đã đóng dấu ĐẠT và code bạn đã viết sẽ mất hết. Nếu muốn giữ lại, hãy tải file tiến độ trước.",
    );
    if (!ok) return;
    resetProgress();
    setMessage("Đã xóa tiến độ. Bạn có thể bắt đầu lại từ trang đầu tiên.");
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    const ok = importProgress(await file.text());
    setMessage(ok ? "Đã khôi phục tiến độ học." : "File không hợp lệ, hãy chọn đúng file tiến độ đã tải.");
  };

  return (
    <div className="text-sm text-ink-soft">
      <p>
        Tiến độ được lưu ngay trên trình duyệt này. Muốn học trên máy khác? Hãy{" "}
        <button type="button" onClick={download} className="font-medium text-seal underline underline-offset-4 hover:text-ink">
          tải file tiến độ
        </button>{" "}
        rồi{" "}
        <button type="button" onClick={() => fileRef.current?.click()} className="font-medium text-seal underline underline-offset-4 hover:text-ink">
          mở lại ở máy kia
        </button>
        .
      </p>
      <p className="mt-2">
        Muốn học lại từ đầu?{" "}
        <button type="button" onClick={reset} className="font-medium text-seal underline underline-offset-4 hover:text-ink">
          Xóa toàn bộ tiến độ
        </button>
      </p>
      <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      {message && <p className="rise mt-2 text-ink">{message}</p>}
    </div>
  );
}
