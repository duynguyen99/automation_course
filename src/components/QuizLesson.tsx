"use client";

import { useState, type ReactNode } from "react";
import { PageNav } from "./PageNav";
import { Seal } from "./Seal";
import { markComplete, recordFailedAttempt, useProgress } from "@/lib/progress";
import type { LessonRef } from "@/lib/types";

export interface QuizItem {
  q: ReactNode;
  options: ReactNode[];
  answer: number;
  explain?: ReactNode;
}

interface Props {
  lessonId: string;
  header: ReactNode;
  body: ReactNode;
  questions: QuizItem[];
  prev: LessonRef | null;
  next: LessonRef | null;
}

const LETTERS = "ABCDEFGH";

export function QuizLesson({ lessonId, header, body, questions, prev, next }: Props) {
  const completed = Boolean(useProgress().completed[lessonId]);
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const score = picked.filter((p, i) => p === questions[i].answer).length;
  const allAnswered = picked.every((p) => p !== null);
  const perfect = submitted && score === questions.length;

  const choose = (qi: number, oi: number) => {
    if (submitted) return;
    setPicked((prevPicked) => prevPicked.map((p, i) => (i === qi ? oi : p)));
  };

  const submit = () => {
    setSubmitted(true);
    if (score === questions.length) markComplete(lessonId);
    else recordFailedAttempt(lessonId);
  };

  const retry = () => {
    // Keep the right answers, clear only the wrong ones.
    setPicked((prevPicked) => prevPicked.map((p, i) => (p === questions[i].answer ? p : null)));
    setSubmitted(false);
  };

  return (
    <div className="scroll-thin h-full overflow-y-auto px-3 py-6 sm:px-6 sm:py-10">
      <article className="paper page-in relative mx-auto max-w-[46rem] rounded-sm border border-paper-edge px-6 pb-10 pt-10 shadow-[0_30px_60px_-40px_rgb(0_0_0/0.55)] sm:px-14">
        {(completed || perfect) && (
          <div className="absolute right-6 top-6 sm:right-10">
            <Seal />
          </div>
        )}
        {header}
        {body && <div className="mt-6">{body}</div>}

        <ol className="mt-8 space-y-8">
          {questions.map((question, qi) => {
            const chosen = picked[qi];
            return (
              <li key={qi}>
                <fieldset>
                  <legend className="flex gap-3 font-display text-[1.12rem] font-semibold leading-snug">
                    <span className="text-seal">{qi + 1}.</span>
                    <span className="[&_code]:font-mono [&_code]:text-[0.85em]">{question.q}</span>
                  </legend>
                  <div className="mt-3 grid gap-2">
                    {question.options.map((opt, oi) => {
                      const isChosen = chosen === oi;
                      const isRight = oi === question.answer;
                      const tone = !submitted
                        ? isChosen
                          ? "border-ink bg-paper-deep"
                          : "border-rule hover:border-ink-soft"
                        : isChosen && isRight
                          ? "border-pass bg-pass-soft"
                          : isChosen
                            ? "border-seal bg-seal-soft"
                            : "border-rule opacity-70";
                      return (
                        <label
                          key={oi}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${tone} ${submitted ? "cursor-default" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`q${qi}`}
                            className="sr-only"
                            checked={isChosen}
                            onChange={() => choose(qi, oi)}
                            disabled={submitted}
                          />
                          <span
                            className={`grid size-6 shrink-0 place-items-center rounded-full border font-mono text-xs ${
                              isChosen ? "border-ink bg-ink text-paper" : "border-ink-faint text-ink-soft"
                            }`}
                          >
                            {LETTERS[oi]}
                          </span>
                          <span className="pt-0.5 [&_code]:rounded [&_code]:bg-paper-deep [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">
                            {opt}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {submitted && chosen !== null && (
                    <p className={`rise mt-2 text-[0.95rem] ${chosen === question.answer ? "text-pass" : "text-seal"}`}>
                      {chosen === question.answer ? "Đúng rồi! " : "Chưa đúng. "}
                      {chosen === question.answer && question.explain}
                      {chosen !== question.answer && "Đọc lại câu hỏi và thử lần nữa nhé."}
                    </p>
                  )}
                </fieldset>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {!submitted && (
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered}
              className="rounded-full bg-ink px-6 py-3 font-medium text-paper transition hover:bg-seal active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            >
              Nộp bài
            </button>
          )}
          {submitted && (
            <>
              <p className="font-display text-xl">
                Đúng <span className={perfect ? "text-pass" : "text-seal"}>{score}</span> / {questions.length}
              </p>
              {!perfect && (
                <button type="button" onClick={retry} className="rounded-full border border-ink px-5 py-2.5 font-medium hover:bg-paper-deep">
                  Làm lại các câu sai
                </button>
              )}
            </>
          )}
        </div>

        <PageNav prev={prev} next={next} ready={completed || perfect} />
      </article>
    </div>
  );
}
