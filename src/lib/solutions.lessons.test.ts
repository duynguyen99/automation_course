import { describe, expect, it } from "vitest";
import { allLessons } from "./course";
import { grade } from "./grader";
import type { Lesson, RunnerResult } from "./types";

// Needs the runner: `npm run runner`. Browser lessons open real Chrome windows.
const RUNNER_URL = process.env.RUNNER_URL ?? "http://127.0.0.1:4000";
const ONLY = process.env.LESSON; // e.g. LESSON=selenium npm run verify:lessons

function filesFor(lesson: Lesson, visible: Record<string, string>) {
  return [
    ...Object.entries(visible).map(([name, content]) => ({ name, content })),
    ...lesson.hiddenFiles.map(({ name, content }) => ({ name, content })),
  ];
}

async function run(lesson: Lesson, visible: Record<string, string>): Promise<RunnerResult> {
  const res = await fetch(`${RUNNER_URL}/run`, {
    method: "POST",
    body: JSON.stringify({
      mode: lesson.mode,
      files: filesFor(lesson, visible),
      checks: lesson.checks,
      stdin: lesson.stdin,
      timeoutSec: lesson.timeoutSec,
    }),
  });
  if (!res.ok) throw new Error(`runner ${res.status}: ${await res.text()}`);
  return res.json();
}

const seedOf = (l: Lesson) => Object.fromEntries(l.files.map((f) => [f.name, f.content]));
const solvedOf = (l: Lesson) => ({ ...seedOf(l), ...l.solution });

const codeLessons = allLessons().filter((l) => l.type === "code" && (!ONLY || l.id.includes(ONLY)));

describe.each(codeLessons.map((l) => [l.id, l] as const))("%s", (_id, lesson) => {
  it("solution passes every test", async () => {
    const visible = solvedOf(lesson);
    const result = await run(lesson, visible);
    expect(result.checkError ?? null).toBeNull();
    const failing = grade(lesson.tests, visible, result).filter((t) => !t.pass);
    expect(failing, `${result.status}\n${result.stderr}\n${result.stdout}`.slice(0, 3000)).toEqual([]);
    expect(result.status).toBe("ok");
  }, 180_000);

  it("starting code does not already pass", async () => {
    const visible = seedOf(lesson);
    const result = await run(lesson, visible);
    const results = grade(lesson.tests, visible, result);
    expect(result.status === "ok" && results.every((t) => t.pass)).toBe(false);
  }, 180_000);
});
