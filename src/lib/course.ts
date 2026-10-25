import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { orderFromName, parseChapterMeta, parseLesson } from "./lessonParser";
import type { Chapter, Lesson, LessonRef } from "./types";

const CONTENT_DIR = join(process.cwd(), "content");

function byOrder(a: string, b: string) {
  return orderFromName(a) - orderFromName(b) || a.localeCompare(b);
}

function loadCourse(): Chapter[] {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d+-/.test(d.name))
    .map((d) => d.name)
    .sort(byOrder)
    .map((folder) => {
      const dir = join(CONTENT_DIR, folder);
      const metaPath = join(dir, "_chapter.md");
      const meta = parseChapterMeta(existsSync(metaPath) ? readFileSync(metaPath, "utf8") : "", folder);
      const lessons = readdirSync(dir)
        .filter((f) => /^\d+-.+\.md$/.test(f))
        .sort(byOrder)
        .map((f) => parseLesson(readFileSync(join(dir, f), "utf8"), meta.slug, f));
      return { ...meta, lessons };
    });
}

let cached: Chapter[] | null = null;

/** All chapters in reading order. Re-read on every call in dev so content edits show up. */
export function getCourse(): Chapter[] {
  if (process.env.NODE_ENV !== "production") return loadCourse();
  cached ??= loadCourse();
  return cached;
}

export function lessonHref(lesson: Pick<Lesson, "chapterSlug" | "slug">): string {
  return `/learn/${lesson.chapterSlug}/${lesson.slug}`;
}

export function toRef(lesson: Lesson): LessonRef {
  return { id: lesson.id, title: lesson.title, type: lesson.type, href: lessonHref(lesson) };
}

export function allLessons(course = getCourse()): Lesson[] {
  return course.flatMap((c) => c.lessons);
}

export function findLesson(id: string, course = getCourse()) {
  const lessons = allLessons(course);
  const index = lessons.findIndex((l) => l.id === id);
  if (index < 0) return null;
  const lesson = lessons[index];
  const chapter = course.find((c) => c.slug === lesson.chapterSlug)!;
  return {
    lesson,
    chapter,
    page: index + 1,
    totalPages: lessons.length,
    prev: index > 0 ? toRef(lessons[index - 1]) : null,
    next: index < lessons.length - 1 ? toRef(lessons[index + 1]) : null,
  };
}
