import matter from "gray-matter";
import type { Chapter, Lesson, LessonFile, LessonTest, LessonType, LocatorTask, QuizQuestion, RunMode } from "./types";

const TYPES: LessonType[] = ["read", "code", "quiz", "locator"];
const MODES: RunMode[] = ["java", "junit", "cucumber"];

/** Turns `03-bien-la-gi.md` into `bien-la-gi`. */
export function slugFromFile(file: string): string {
  return file.replace(/\.md$/, "").replace(/^\d+-/, "");
}

export function orderFromName(name: string): number {
  return Number(/^(\d+)-/.exec(name)?.[1] ?? Number.MAX_SAFE_INTEGER);
}

class ContentError extends Error {
  constructor(where: string, message: string) {
    super(`[content] ${where}: ${message}`);
  }
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function parseTest(raw: unknown, where: string): LessonTest {
  if (!raw || typeof raw !== "object") throw new ContentError(where, "test phải là object");
  const t = raw as Record<string, unknown>;
  if (typeof t.text !== "string") throw new ContentError(where, "test thiếu `text`");
  const matchers = ["stdout", "source", "notSource", "java", "runs", "junit", "hiddenTest", "cucumber"].filter(
    (k) => t[k] !== undefined,
  );
  if (matchers.length === 0) throw new ContentError(where, `test "${t.text}" chưa có cách chấm`);
  for (const key of ["source", "notSource"]) {
    if (t[key] !== undefined) {
      try {
        new RegExp(String(t[key]));
      } catch {
        throw new ContentError(where, `regex sai ở test "${t.text}"`);
      }
    }
  }
  return {
    text: t.text,
    stdout: t.stdout as LessonTest["stdout"],
    source: str(t.source),
    notSource: str(t.notSource),
    file: str(t.file),
    raw: t.raw === true,
    java: str(t.java),
    runs: t.runs === true,
    junit: t.junit as LessonTest["junit"],
    hiddenTest: str(t.hiddenTest),
    cucumber: t.cucumber as LessonTest["cucumber"],
    hint: str(t.hint),
  };
}

function parseFiles(raw: unknown, where: string, key: string): LessonFile[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) throw new ContentError(where, `${key} phải là danh sách`);
  return raw.map((f) => {
    const file = f as Record<string, unknown>;
    if (typeof file?.name !== "string" || typeof file.content !== "string") {
      throw new ContentError(where, `${key}: mỗi file cần name và content`);
    }
    return { name: file.name, content: file.content, readonly: file.readonly === true };
  });
}

function parseSolution(raw: unknown, files: LessonFile[], where: string): Record<string, string> | undefined {
  if (raw === undefined) return undefined;
  if (typeof raw === "string") {
    const target = files.find((f) => !f.readonly) ?? files[0];
    return { [target.name]: raw };
  }
  if (typeof raw !== "object" || raw === null) throw new ContentError(where, "solution phải là chuỗi hoặc map file → code");
  const solution = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, String(v)]));
  for (const name of Object.keys(solution)) {
    if (!files.some((f) => f.name === name)) throw new ContentError(where, `solution có file lạ: ${name}`);
  }
  return solution;
}

function parseLocator(raw: unknown, where: string): LocatorTask[] | undefined {
  if (raw === undefined) return undefined;
  if (!Array.isArray(raw) || raw.length === 0) throw new ContentError(where, "locator phải là danh sách bài");
  return raw.map((r) => {
    const t = r as Record<string, unknown>;
    if (typeof t.prompt !== "string" || typeof t.html !== "string" || typeof t.answer !== "string") {
      throw new ContentError(where, "mỗi bài locator cần prompt, html và answer");
    }
    const accept = (t.accept ?? "any") as LocatorTask["accept"];
    if (!["css", "xpath", "any"].includes(accept)) throw new ContentError(where, `accept không hợp lệ: ${accept}`);
    return { prompt: t.prompt, html: t.html, answer: t.answer, accept, placeholder: str(t.placeholder) };
  });
}

function parseQuestion(raw: unknown, where: string): QuizQuestion {
  const q = raw as Record<string, unknown>;
  if (typeof q?.q !== "string" || !Array.isArray(q.options) || typeof q.answer !== "number") {
    throw new ContentError(where, "câu hỏi quiz cần q, options, answer");
  }
  if (q.answer < 0 || q.answer >= q.options.length) throw new ContentError(where, `answer ngoài phạm vi: ${q.q}`);
  return { q: q.q, options: q.options.map(String), answer: q.answer, explain: str(q.explain) };
}

export function parseLesson(source: string, chapterSlug: string, file: string): Lesson {
  const where = `${chapterSlug}/${file}`;
  const { data, content } = matter(source);
  const type = (data.type ?? "read") as LessonType;
  if (!TYPES.includes(type)) throw new ContentError(where, `type không hợp lệ: ${type}`);
  if (typeof data.title !== "string") throw new ContentError(where, "thiếu title");

  const tests = Array.isArray(data.tests) ? data.tests.map((t: unknown) => parseTest(t, where)) : [];
  const questions = Array.isArray(data.questions) ? data.questions.map((q: unknown) => parseQuestion(q, where)) : [];
  const mode = (data.mode ?? "java") as RunMode;
  if (!MODES.includes(mode)) throw new ContentError(where, `mode không hợp lệ: ${mode}`);
  const files = typeof data.seed === "string"
    ? [{ name: "Main.java", content: data.seed }]
    : parseFiles(data.files, where, "files");
  const hiddenFiles = parseFiles(data.hiddenFiles, where, "hiddenFiles");
  if (hiddenFiles.some((f) => !f.name.split("/").pop()!.startsWith("__"))) {
    throw new ContentError(where, "tên file ẩn phải bắt đầu bằng __");
  }
  if (type === "code" && (files.length === 0 || tests.length === 0)) throw new ContentError(where, "bài code cần seed/files và tests");
  if (type === "quiz" && questions.length === 0) throw new ContentError(where, "bài quiz cần questions");
  const locator = parseLocator(data.locator, where);
  if (type === "locator" && !locator) throw new ContentError(where, "bài locator cần mục locator");
  if (mode === "cucumber" && ![...files, ...hiddenFiles].some((f) => f.name.startsWith("features/"))) {
    throw new ContentError(where, "bài cucumber cần ít nhất một file features/*.feature");
  }

  const checkIds = new Set([...String(data.checks ?? "").matchAll(/(?:eq|ok|check|throwsEx)\("([^"]+)"/g)].map((m) => m[1]));
  for (const t of tests) {
    if (t.java && !checkIds.has(t.java)) throw new ContentError(where, `test "${t.text}" trỏ tới check "${t.java}" không tồn tại`);
  }

  const slug = slugFromFile(file);
  return {
    id: `${chapterSlug}/${slug}`,
    slug,
    chapterSlug,
    title: data.title,
    type,
    minutes: typeof data.minutes === "number" ? data.minutes : undefined,
    body: content.trim(),
    mode,
    files,
    hiddenFiles,
    solution: files.length ? parseSolution(data.solution, files, where) : undefined,
    tests,
    checks: str(data.checks),
    stdin: str(data.stdin),
    timeoutSec: typeof data.timeout === "number" ? data.timeout : undefined,
    practice: str(data.practice),
    locator,
    hints: Array.isArray(data.hints) ? data.hints.map(String) : [],
    questions,
  };
}

export function parseChapterMeta(source: string, folder: string): Omit<Chapter, "lessons"> {
  const { data, content } = matter(source);
  if (typeof data.title !== "string") throw new ContentError(folder, "_chapter.md thiếu title");
  return {
    slug: slugFromFile(folder),
    number: orderFromName(folder),
    title: data.title,
    subtitle: str(data.subtitle) ?? "",
    description: content.trim(),
  };
}
