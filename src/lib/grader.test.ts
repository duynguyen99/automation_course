import { describe, expect, it } from "vitest";
import { grade, isPassed, stripComments } from "./grader";
import type { LessonTest, RunnerResult } from "./types";

const okRun = (stdout: string, checks: RunnerResult["checks"] = []): RunnerResult => ({
  status: "ok",
  stdout,
  stderr: "",
  diagnostics: [],
  checks,
  timeMs: 10,
});

const compileError: RunnerResult = { ...okRun(""), status: "compile_error" };

describe("stripComments", () => {
  it("removes line and block comments", () => {
    expect(stripComments("int a = 1; // note\n/* block\n x */int b;")).toBe("int a = 1; \n \nint b;");
  });

  it("keeps comment markers inside string literals", () => {
    expect(stripComments('String u = "http://x"; // c')).toBe('String u = "http://x"; ');
  });

  it("replaces block comments with a space so tokens don't merge", () => {
    expect(stripComments("int/**/x")).toBe("int x");
  });

  it("keeps newlines from block comments so line numbers stay stable", () => {
    expect(stripComments("a/*\n\n*/b").split("\n")).toHaveLength(3);
  });
});

describe("grade", () => {
  const code = 'public class Main { public static void main(String[] a) { System.out.println("Xin chào"); } }';

  it("checks stdout includes and equals ignoring trailing whitespace", () => {
    const tests: LessonTest[] = [
      { text: "in Xin chào", stdout: { includes: "Xin chào" } },
      { text: "đúng nguyên văn", stdout: { equals: "Xin chào" } },
      { text: "không in Bye", stdout: { notIncludes: "Bye" } },
    ];
    const results = grade(tests, code, okRun("Xin chào  \n\n"));
    expect(results.map((r) => r.pass)).toEqual([true, true, true]);
  });

  it("matches Vietnamese text typed with decomposed accents", () => {
    const decomposed = "Xin chào".normalize("NFD");
    expect(grade([{ text: "x", stdout: { equals: "Xin chào" } }], code, okRun(decomposed))[0].pass).toBe(true);
  });

  it("fails stdout tests with a compile hint when code does not compile", () => {
    const [r] = grade([{ text: "x", stdout: { includes: "a" } }], code, compileError);
    expect(r.pass).toBe(false);
    expect(r.hint).toMatch(/biên dịch/);
  });

  it("evaluates source regex on comment-stripped code unless raw", () => {
    const src = "// int tuoi = 5;\npublic class Main {}";
    expect(grade([{ text: "x", source: "int\\s+tuoi" }], src, okRun(""))[0].pass).toBe(false);
    expect(grade([{ text: "x", source: "int\\s+tuoi", raw: true }], src, okRun(""))[0].pass).toBe(true);
    expect(grade([{ text: "x", notSource: "tuoi" }], src, okRun(""))[0].pass).toBe(true);
  });

  it("maps hidden java checks by id and uses their hint", () => {
    const run = okRun("", [{ id: "t1", pass: false, hint: "tong(2, 3) trả về 6" }]);
    const [found, missing] = grade([{ text: "a", java: "t1" }, { text: "b", java: "t2" }], code, run);
    expect(found).toEqual({ text: "a", pass: false, hint: "tong(2, 3) trả về 6" });
    expect(missing.pass).toBe(false);
  });

  it("prefers the lesson's own hint over the check hint", () => {
    const run = okRun("", [{ id: "t1", pass: false, hint: "raw" }]);
    expect(grade([{ text: "a", java: "t1", hint: "Gợi ý riêng" }], code, run)[0].hint).toBe("Gợi ý riêng");
  });

  it("has no hint on passing tests", () => {
    const [r] = grade([{ text: "a", runs: true, hint: "h" }], code, okRun(""));
    expect(r).toEqual({ text: "a", pass: true });
  });

  it("does not count output printed before a crash", () => {
    const crashed: RunnerResult = { ...okRun("Xin chào"), status: "runtime_error" };
    expect(grade([{ text: "x", stdout: { includes: "Xin chào" } }], code, crashed)[0].pass).toBe(false);
  });

  it("normalizes accents in source checks", () => {
    const src = "String s = \"Đăng nhập\";".normalize("NFD");
    expect(grade([{ text: "x", source: "Đăng nhập" }], src, okRun(""))[0].pass).toBe(true);
  });

  it("isPassed requires a clean run and at least one test", () => {
    const pass = [{ text: "a", pass: true }];
    expect(isPassed(pass, okRun(""))).toBe(true);
    expect(isPassed(pass, compileError)).toBe(false);
    expect(isPassed([], okRun(""))).toBe(false);
  });

  describe("junit and cucumber results", () => {
    const junitRun: RunnerResult = {
      ...okRun(""),
      tests: [
        { name: "a", className: "T", status: "passed", timeMs: 1, hidden: false },
        { name: "b", className: "T", status: "failed", message: "expected 5", timeMs: 1, hidden: false },
        { name: "secret", className: "__H", status: "passed", timeMs: 1, hidden: true },
      ],
    };

    it("checks a named visible test and its status", () => {
      expect(grade([{ text: "x", junit: { name: "a" } }], {}, junitRun)[0].pass).toBe(true);
      const [failed] = grade([{ text: "x", junit: { name: "b" } }], {}, junitRun);
      expect(failed.pass).toBe(false);
      expect(failed.hint).toContain("expected 5");
      expect(grade([{ text: "x", junit: { name: "b", status: "failed" } }], {}, junitRun)[0].pass).toBe(true);
    });

    it("counts only visible tests and supports hidden tests by name", () => {
      expect(grade([{ text: "x", junit: { passed: 2 } }], {}, junitRun)[0].pass).toBe(false);
      expect(grade([{ text: "x", junit: { failed: 1 } }], {}, junitRun)[0].pass).toBe(true);
      expect(grade([{ text: "x", hiddenTest: "secret" }], {}, junitRun)[0].pass).toBe(true);
      expect(grade([{ text: "x", hiddenTest: "a" }], {}, junitRun)[0].pass).toBe(false);
    });

    it("grades cucumber scenarios and points at the failing step", () => {
      const run: RunnerResult = {
        ...okRun(""),
        scenarios: [{
          feature: "F",
          name: "Đăng nhập",
          status: "undefined",
          tags: [],
          steps: [
            { keyword: "Given", text: "mở trang", status: "passed" },
            { keyword: "When", text: "nhập", status: "undefined" },
          ],
        }],
      };
      const [r] = grade([{ text: "x", cucumber: { scenario: "Đăng nhập" } }], {}, run);
      expect(r.pass).toBe(false);
      expect(r.hint).toContain("When nhập");
      expect(grade([{ text: "x", cucumber: { scenario: "Khác" } }], {}, run)[0].hint).toContain("Không tìm thấy");
    });

    it("restricts source checks to one file when asked", () => {
      const files = { "A.java": "class A {}", "B.java": "class B { @Test void t() {} }" };
      expect(grade([{ text: "x", source: "@Test", file: "A.java" }], files, okRun(""))[0].pass).toBe(false);
      expect(grade([{ text: "x", source: "@Test" }], files, okRun(""))[0].pass).toBe(true);
    });
  });

  it("treats runtime errors as failing `runs`", () => {
    const [r] = grade([{ text: "a", runs: true }], code, { ...okRun(""), status: "runtime_error" });
    expect(r.pass).toBe(false);
  });
});
