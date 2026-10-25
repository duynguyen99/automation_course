import type { LessonTest, RunnerResult, TestResult } from "./types";

/** Removes Java comments while keeping string/char literals and line breaks intact. */
export function stripComments(code: string): string {
  let out = "";
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];
    if (ch === '"' || ch === "'") {
      const end = findLiteralEnd(code, i, ch);
      out += code.slice(i, end);
      i = end;
    } else if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i++;
    } else if (ch === "/" && next === "*") {
      const close = code.indexOf("*/", i + 2);
      const end = close < 0 ? code.length : close + 2;
      // Keep newlines (stable line numbers) and one space so `int/**/x` doesn't become `intx`.
      out += " " + code.slice(i, end).replace(/[^\n]/g, "");
      i = end;
    } else {
      out += ch;
      i++;
    }
  }
  return out;
}

function findLiteralEnd(code: string, start: number, quote: string): number {
  let i = start + 1;
  while (i < code.length && code[i] !== quote && code[i] !== "\n") {
    i += code[i] === "\\" ? 2 : 1;
  }
  return Math.min(i + 1, code.length);
}

/** Unicode-normalizes (Vietnamese IMEs may emit decomposed accents) and trims trailing spaces. */
export function normalizeOutput(text: string): string {
  return text
    .normalize("NFC")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trimEnd();
}

const NOT_RUN_HINT: Record<string, string> = {
  compile_error: "Code chưa biên dịch được. Hãy sửa lỗi ở khung Console trước.",
  runtime_error: "Chương trình bị lỗi khi đang chạy. Xem chi tiết ở khung Console.",
  timeout: "Chương trình chạy quá lâu (có thể bị vòng lặp vô hạn).",
};

type Verdict = { pass: boolean; hint?: string };
const STATUS_VI: Record<string, string> = { passed: "pass", failed: "fail", skipped: "bị bỏ qua", undefined: "chưa có step definition" };

function judgeJUnit(spec: NonNullable<LessonTest["junit"]>, run: RunnerResult): Verdict {
  const visible = (run.tests ?? []).filter((t) => !t.hidden);
  if (spec.name !== undefined) {
    const found = visible.find((t) => t.name === spec.name);
    if (!found) return { pass: false, hint: `Không tìm thấy test method tên ${spec.name}. Kiểm tra tên và annotation @Test.` };
    const want = spec.status ?? "passed";
    if (found.status !== want) {
      return { pass: false, hint: `Test ${spec.name} đang ${STATUS_VI[found.status]}${found.message ? `: ${found.message}` : ""}` };
    }
  }
  const passed = visible.filter((t) => t.status === "passed").length;
  const failed = visible.filter((t) => t.status === "failed").length;
  if (spec.passed !== undefined && passed < spec.passed) {
    return { pass: false, hint: `Cần ít nhất ${spec.passed} test pass, hiện có ${passed}.` };
  }
  if (spec.failed !== undefined && failed !== spec.failed) {
    return { pass: false, hint: `Cần đúng ${spec.failed} test fail, hiện có ${failed}.` };
  }
  return { pass: true };
}

function judgeCucumber(spec: NonNullable<LessonTest["cucumber"]>, run: RunnerResult): Verdict {
  const scenarios = run.scenarios ?? [];
  if (spec.scenario !== undefined) {
    const found = scenarios.find((s) => s.name === spec.scenario);
    if (!found) return { pass: false, hint: `Không tìm thấy Scenario "${spec.scenario}".` };
    const want = spec.status ?? "passed";
    if (found.status !== want) {
      const bad = found.steps.find((s) => s.status !== "passed");
      return { pass: false, hint: `Scenario đang ${STATUS_VI[found.status]}${bad ? ` ở bước "${bad.keyword} ${bad.text}"` : ""}.` };
    }
    if (spec.steps !== undefined && found.steps.length < spec.steps) {
      return { pass: false, hint: `Scenario cần ít nhất ${spec.steps} bước, hiện có ${found.steps.length}.` };
    }
  }
  const passed = scenarios.filter((s) => s.status === "passed").length;
  if (spec.passed !== undefined && passed < spec.passed) {
    return { pass: false, hint: `Cần ít nhất ${spec.passed} scenario pass, hiện có ${passed}.` };
  }
  return { pass: true };
}

function judge(test: LessonTest, files: Record<string, string>, run: RunnerResult): Verdict {
  if (test.source !== undefined || test.notSource !== undefined) {
    const code = test.file ? (files[test.file] ?? "") : Object.values(files).join("\n");
    const src = (test.raw ? code : stripComments(code)).normalize("NFC");
    const matches = (pattern: string) => new RegExp(pattern.normalize("NFC"), "m").test(src);
    if (test.source !== undefined && !matches(test.source)) return { pass: false };
    if (test.notSource !== undefined && matches(test.notSource)) return { pass: false };
    return { pass: true };
  }

  if (test.runs) {
    return run.status === "ok" ? { pass: true } : { pass: false, hint: NOT_RUN_HINT[run.status] };
  }

  // Output or checks from a program that crashed or never finished don't count.
  if (run.status !== "ok") {
    return { pass: false, hint: NOT_RUN_HINT[run.status] };
  }

  if (test.stdout) {
    const out = normalizeOutput(run.stdout);
    const { includes, equals, regex, notIncludes } = test.stdout;
    const nfc = (s: string) => s.normalize("NFC");
    const pass =
      (includes === undefined || out.includes(nfc(includes))) &&
      (equals === undefined || out === normalizeOutput(equals)) &&
      // No "m" flag: ^ and $ anchor the whole output so authors can assert exact line counts.
      (regex === undefined || new RegExp(nfc(regex)).test(out)) &&
      (notIncludes === undefined || !out.includes(nfc(notIncludes)));
    return { pass };
  }

  if (test.java) {
    const check = run.checks.find((c) => c.id === test.java);
    if (!check) return { pass: false, hint: "Không chạy được bước kiểm tra này." };
    return { pass: check.pass, hint: check.hint || undefined };
  }

  if (test.junit) return judgeJUnit(test.junit, run);

  if (test.hiddenTest) {
    const found = (run.tests ?? []).find((t) => t.hidden && t.name === test.hiddenTest);
    if (!found) return { pass: false, hint: "Không chạy được bước kiểm tra này." };
    return found.status === "passed" ? { pass: true } : { pass: false, hint: found.message };
  }

  if (test.cucumber) return judgeCucumber(test.cucumber, run);

  return { pass: false, hint: "Bài kiểm tra này chưa được cấu hình đúng." };
}

/** A page is passed only when the code compiled, ran cleanly and every test passed. */
export function isPassed(results: TestResult[], run: RunnerResult): boolean {
  return run.status === "ok" && results.length > 0 && results.every((t) => t.pass);
}

/** Grades every test of a lesson against the learner's code and the runner's result. */
export function grade(tests: LessonTest[], code: string | Record<string, string>, run: RunnerResult): TestResult[] {
  const files = typeof code === "string" ? { "Main.java": code } : code;
  return tests.map((test) => {
    const { pass, hint } = judge(test, files, run);
    if (pass) return { text: test.text, pass: true };
    const finalHint = test.hint ?? hint;
    return finalHint ? { text: test.text, pass: false, hint: finalHint } : { text: test.text, pass: false };
  });
}
