import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CodeLesson } from "@/components/CodeLesson";
import { LessonFrame, type OutlineChapter } from "@/components/LessonFrame";
import { InlineMarkdown, Markdown } from "@/components/Markdown";
import { LocatorLesson } from "@/components/LocatorLesson";
import { QuizLesson } from "@/components/QuizLesson";
import { ReadLesson } from "@/components/ReadLesson";
import { allLessons, findLesson, getCourse, toRef } from "@/lib/course";

export function generateStaticParams() {
  return allLessons().map((l) => ({ chapter: l.chapterSlug, lesson: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/learn/[chapter]/[lesson]">): Promise<Metadata> {
  const { chapter, lesson } = await params;
  const found = findLesson(`${chapter}/${lesson}`);
  return { title: found ? `${found.lesson.title} · QA Academy` : "QA Academy" };
}

const TYPE_LABEL = { read: "Bài đọc", code: "Thực hành", quiz: "Kiểm tra nhanh", locator: "Luyện locator" } as const;
const PRACTICE_URL = process.env.NEXT_PUBLIC_PRACTICE_URL ?? "http://localhost:4000/practice";

type Params = PageProps<"/learn/[chapter]/[lesson]">["params"];

export default function LessonPage({ params }: PageProps<"/learn/[chapter]/[lesson]">) {
  return (
    <Suspense fallback={<div className="paper h-dvh" aria-busy="true" />}>
      <LessonContent params={params} />
    </Suspense>
  );
}

async function LessonContent({ params }: { params: Params }) {
  const { chapter: chapterSlug, lesson: lessonSlug } = await params;
  const course = getCourse();
  const found = findLesson(`${chapterSlug}/${lessonSlug}`, course);
  if (!found) notFound();
  const { lesson, chapter, page, totalPages, prev, next } = found;

  const outline: OutlineChapter[] = course
    .filter((c) => c.lessons.length > 0)
    .map((c) => ({ slug: c.slug, number: c.number, title: c.title, lessons: c.lessons.map(toRef) }));

  const header = (
    <header>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-seal">
        {TYPE_LABEL[lesson.type]}
        {lesson.minutes ? <span className="text-ink-faint"> · {lesson.minutes} phút</span> : null}
      </p>
      <h1 className="mt-2 max-w-[85%] font-display text-[2rem] font-semibold leading-tight tracking-tight text-balance sm:text-[2.35rem]">
        {lesson.title}
      </h1>
    </header>
  );
  const body = lesson.body ? <Markdown>{lesson.body}</Markdown> : null;

  return (
    <LessonFrame
      chapterNumber={chapter.number}
      chapterTitle={chapter.title}
      page={page}
      totalPages={totalPages}
      currentId={lesson.id}
      outline={outline}
    >
      {lesson.type === "code" && (
        <CodeLesson
          key={lesson.id}
          lessonId={lesson.id}
          header={header}
          body={body}
          testLabels={lesson.tests.map((t, i) => <InlineMarkdown key={i}>{t.text}</InlineMarkdown>)}
          hints={lesson.hints.map((h, i) => <InlineMarkdown key={i}>{h}</InlineMarkdown>)}
          mode={lesson.mode}
          files={lesson.files}
          solution={lesson.solution}
          usesBrowser={Boolean(lesson.practice) || lesson.files.some((f) => f.content.includes("org.openqa.selenium"))}
          practiceUrl={lesson.practice ? `${PRACTICE_URL}/${lesson.practice}` : undefined}
          prev={prev}
          next={next}
        />
      )}
      {lesson.type === "locator" && lesson.locator && (
        <LocatorLesson
          key={lesson.id}
          lessonId={lesson.id}
          header={header}
          body={body}
          tasks={lesson.locator.map((t) => ({ ...t, prompt: <InlineMarkdown>{t.prompt}</InlineMarkdown> }))}
          prev={prev}
          next={next}
        />
      )}
      {lesson.type === "read" && <ReadLesson key={lesson.id} lessonId={lesson.id} header={header} body={body} prev={prev} next={next} />}
      {lesson.type === "quiz" && (
        <QuizLesson
          key={lesson.id}
          lessonId={lesson.id}
          header={header}
          body={body}
          questions={lesson.questions.map((q) => ({
            q: <InlineMarkdown>{q.q}</InlineMarkdown>,
            options: q.options.map((o, i) => <InlineMarkdown key={i}>{o}</InlineMarkdown>),
            answer: q.answer,
            explain: q.explain ? <InlineMarkdown>{q.explain}</InlineMarkdown> : undefined,
          }))}
          prev={prev}
          next={next}
        />
      )}
    </LessonFrame>
  );
}
