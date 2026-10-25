"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { PageNav } from "./PageNav";
import { Seal } from "./Seal";
import { markComplete, useProgress } from "@/lib/progress";
import type { LessonRef } from "@/lib/types";

interface Props {
  lessonId: string;
  header: ReactNode;
  body: ReactNode;
  prev: LessonRef | null;
  next: LessonRef | null;
}

/** A plain reading page: one centered book page with a "got it" button. */
export function ReadLesson({ lessonId, header, body, prev, next }: Props) {
  const router = useRouter();
  const completed = Boolean(useProgress().completed[lessonId]);

  const finish = () => {
    markComplete(lessonId);
    if (next) router.push(next.href);
  };

  return (
    <div className="scroll-thin h-full overflow-y-auto px-3 py-6 sm:px-6 sm:py-10">
      <article className="paper page-in relative mx-auto max-w-[46rem] rounded-sm border border-paper-edge px-6 pb-10 pt-10 shadow-[0_1px_0_var(--paper-edge),0_30px_60px_-40px_rgb(0_0_0/0.55)] sm:px-14">
        {completed && (
          <div className="absolute right-6 top-6 sm:right-10">
            <Seal label="ĐÃ ĐỌC" />
          </div>
        )}
        {header}
        <div className="mt-6">{body}</div>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={finish}
            className="rounded-full bg-ink px-6 py-3 font-medium text-paper shadow-[0_10px_24px_-14px_rgb(0_0_0/0.8)] transition hover:bg-seal active:translate-y-px"
          >
            {next ? "Mình đã hiểu, sang trang tiếp →" : "Mình đã hiểu ✓"}
          </button>
        </div>
        <PageNav prev={prev} next={next} ready={completed} />
      </article>
    </div>
  );
}
