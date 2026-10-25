import { describe, expect, it } from "vitest";
import { allLessons, findLesson, getCourse } from "./course";

describe("course content", () => {
  const course = getCourse();
  const lessons = allLessons(course);

  it("parses every chapter and lesson", () => {
    expect(course.length).toBeGreaterThan(0);
    expect(lessons.length).toBeGreaterThan(0);
  });

  it("has unique lesson ids", () => {
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
  });

  it("gives every code lesson a solution", () => {
    const missing = lessons.filter((l) => l.type === "code" && !l.solution).map((l) => l.id);
    expect(missing).toEqual([]);
  });

  it("links pages in reading order", () => {
    const first = findLesson(lessons[0].id, course)!;
    expect(first.prev).toBeNull();
    expect(first.next?.id).toBe(lessons[1]?.id);
  });
});
