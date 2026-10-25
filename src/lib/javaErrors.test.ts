import { describe, expect, it } from "vitest";
import { explainErrors } from "./javaErrors";
import type { RunnerResult } from "./types";

const base: RunnerResult = { status: "ok", stdout: "", stderr: "", diagnostics: [], checks: [], timeMs: 1 };

const compile = (...messages: string[]): RunnerResult => ({
  ...base,
  status: "compile_error",
  diagnostics: messages.map((message, i) => ({ file: "Main.java", line: i + 3, column: 1, severity: "error", message })),
});

describe("explainErrors", () => {
  it("explains a missing semicolon with its line", () => {
    expect(explainErrors(compile("';' expected"))).toEqual([
      expect.objectContaining({ title: "Thiếu dấu chấm phẩy ;", line: 3 }),
    ]);
  });

  it("explains type mismatches using the types from the message", () => {
    const [e] = explainErrors(compile("incompatible types: String cannot be converted to int"));
    expect(e.detail).toContain("String");
    expect(e.detail).toContain("int");
  });

  it("falls back to the raw message for unknown compiler errors", () => {
    expect(explainErrors(compile("something exotic"))[0]).toMatchObject({ title: "Lỗi biên dịch", detail: "something exotic" });
  });

  it("ignores errors in hidden harness files and caps at three", () => {
    const run = compile("a", "b", "c", "d");
    run.diagnostics.push({ file: "__Checks.java", line: 1, column: 1, severity: "error", message: "x" });
    expect(explainErrors(run)).toHaveLength(3);
  });

  it("blames the lesson, not the learner, for internal errors", () => {
    expect(explainErrors({ ...compile("x"), internalError: true })[0].title).toBe("Bài học đang lỗi");
  });

  it("explains runtime exceptions with the learner's line number", () => {
    const run: RunnerResult = {
      ...base,
      status: "runtime_error",
      stderr: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 2\n\tat Main.main(Main.java:4)\n',
    };
    expect(explainErrors(run)[0]).toMatchObject({ title: "Truy cập ngoài phạm vi mảng", line: 4 });
    expect(explainErrors(run)[0].detail).toContain("0 đến 1");
  });

  it("explains timeouts and returns nothing for successful runs", () => {
    expect(explainErrors({ ...base, status: "timeout" })[0].title).toMatch(/quá lâu/);
    expect(explainErrors(base)).toEqual([]);
  });
});
