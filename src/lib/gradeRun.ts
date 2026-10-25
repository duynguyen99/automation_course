import { grade, isPassed } from "./grader";
import { explainErrors } from "./javaErrors";
import type { GradeResponse, Lesson, RunnerResult } from "./types";

/** Grades a runner result for a lesson and strips what the learner must not see. */
export function gradeRun(lesson: Lesson, visible: Record<string, string>, run: RunnerResult): GradeResponse {
  const tests = grade(lesson.tests, visible, run);
  const shownRun = { ...run, tests: run.tests?.filter((t) => !t.hidden) };
  return { run: shownRun, tests, passed: isPassed(tests, run), friendly: explainErrors(run) };
}
