// Compiles and runs one learner job in a private temp dir.
// Modes: "java" (runs Main through the hidden-check harness), "junit", "cucumber".
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exec, killStrayBrowsers } from "./exec.mjs";
import { watchBrowser } from "./live.mjs";
import { readCucumberReport, readJUnitReports } from "./reports.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const JARS = join(HERE, "lib", "jars");
// Resolve the real JDK instead of PATH shims (Oracle's javapath launcher starts the JVM as a
// grandchild), so the pid we hold is the JVM itself and its chromedriver children can be found.
async function resolveJavaHome() {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;
  const probe = await exec("java", ["-XshowSettings:properties", "-version"], { timeoutMs: 15_000 });
  return /^\s*java\.home = (.+)$/m.exec(probe.stderr)?.[1]?.trim() ?? null;
}
const JAVA_HOME = await resolveJavaHome();
const bin = (name) => (JAVA_HOME ? join(JAVA_HOME, "bin", name) : name);
const CHECKS_MARKER = "\u001e##CHECKS";

const harnessFiles = {
  "__Harness.java": await readFile(join(HERE, "java", "__Harness.java"), "utf8"),
  "__Lib.java": await readFile(join(HERE, "java", "__Lib.java"), "utf8"),
};

export const MODES = ["java", "junit", "cucumber"];
const DEFAULT_TIMEOUT_MS = { java: 8_000, junit: 30_000, cucumber: 45_000 };
const BROWSER_TIMEOUT_MS = 90_000;
const JVM_FLAGS = [
  "-Xmx384m", "-Xss4m", "-XX:+UseSerialGC", "-XX:TieredStopAtLevel=1",
  "-Dfile.encoding=UTF-8", "-Dstdout.encoding=UTF-8", "-Dstderr.encoding=UTF-8",
];

/** Parses javac output like `Main.java:3: error: ';' expected` plus the caret line. */
export function parseDiagnostics(stderr) {
  const lines = stderr.split("\n");
  const diagnostics = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^(.+?\.java):(\d+): (error|warning): (.*)$/.exec(lines[i]);
    if (!m) continue;
    let column = 1;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      if (/^\s*\^\s*$/.test(lines[j])) {
        column = lines[j].indexOf("^") + 1;
        break;
      }
    }
    const file = m[1].replace(/\\/g, "/").split("/src/").pop();
    diagnostics.push({ file, line: Number(m[2]), column, severity: m[3], message: m[4] });
  }
  return diagnostics;
}

function parseChecks(text) {
  const checks = [...text.matchAll(/##CHECK\|([^|\n]*)\|(PASS|FAIL)\|([^\n]*)/g)].map((m) => ({
    id: m[1],
    pass: m[2] === "PASS",
    hint: m[3],
  }));
  const checkError = /##CHECK_ERROR\|([^\n]*)/.exec(text)?.[1] ?? null;
  return { checks, checkError };
}

const isHidden = (name) => name.split("/").pop().startsWith("__");
const usesBrowser = (files) => files.some((f) => /org\.openqa\.selenium/.test(f.content));

async function writeSources(srcDir, files) {
  for (const f of files) {
    const target = join(srcDir, ...f.name.split("/"));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, f.content, "utf8");
  }
}

function launcherArgs(mode, srcDir, reportsDir, outDir) {
  const common = ["--disable-banner", "--details=none", `--reports-dir=${reportsDir}`];
  if (mode === "junit") {
    return [...common, "--include-engine=junit-jupiter", `--scan-class-path=${outDir}`];
  }
  return [
    ...common,
    "--include-engine=cucumber",
    `--select-directory=${join(srcDir, "features")}`,
    "--config=cucumber.glue=steps",
    `--config=cucumber.plugin=pretty, json:${join(reportsDir, "cucumber.json").replace(/\\/g, "/")}`,
    "--config=cucumber.ansi-colors.disabled=true",
    "--config=cucumber.publish.quiet=true",
  ];
}

/**
 * Runs a job. `onEvent` receives {type:"phase"|"frame", ...} while running.
 * Resolves with the RunnerResult the web app grades.
 */
export async function runJob({ mode = "java", files, checks, stdin, timeoutSec }, { onEvent = () => {}, signal } = {}) {
  const dir = await mkdtemp(join(tmpdir(), "qa-run-"));
  const srcDir = join(dir, "src");
  const outDir = join(dir, "out");
  const tmpDirForJvm = join(dir, "tmp");
  const reportsDir = join(dir, "reports");
  let stopWatching = null;
  try {
    await Promise.all([mkdir(outDir, { recursive: true }), mkdir(tmpDirForJvm), mkdir(reportsDir)]);
    const sources = mode === "java"
      ? [...files, ...Object.entries(harnessFiles).map(([name, content]) => ({ name, content })),
         { name: "__Checks.java", content: checksSource(checks) }]
      : files;
    await writeSources(srcDir, sources);

    const classPath = [outDir, join(JARS, "*")].join(delimiter);
    const javaFiles = sources.filter((f) => f.name.endsWith(".java")).map((f) => join(srcDir, ...f.name.split("/")));
    onEvent({ type: "phase", phase: "compile" });
    const compile = await exec(
      bin("javac"),
      ["-J-Dfile.encoding=UTF-8", "-J-Dstderr.encoding=UTF-8", "-encoding", "UTF-8", "--release", "21",
       "-nowarn", "-Xmaxerrs", "20", "-cp", classPath, "-d", outDir, ...javaFiles],
      { cwd: srcDir, timeoutMs: 45_000, signal },
    );
    if (compile.code !== 0) {
      const diagnostics = parseDiagnostics(compile.stderr);
      return {
        status: compile.timedOut ? "timeout" : "compile_error",
        stdout: "",
        stderr: compile.stderr,
        diagnostics,
        // Errors only in hidden files mean the lesson itself is broken, not the learner.
        internalError: diagnostics.length > 0 && diagnostics.every((d) => isHidden(d.file)),
        checks: [],
        timeMs: compile.ms,
      };
    }

    const browser = usesBrowser(files);
    if (browser) stopWatching = watchBrowser(tmpDirForJvm, (data) => onEvent({ type: "frame", data }));
    const timeoutMs = (timeoutSec ? timeoutSec * 1000 : 0) || (browser ? BROWSER_TIMEOUT_MS : DEFAULT_TIMEOUT_MS[mode]);
    const env = { ...process.env, TEMP: tmpDirForJvm, TMP: tmpDirForJvm, TMPDIR: tmpDirForJvm };
    const mainArgs = mode === "java"
      ? [...JVM_FLAGS, `-Djava.io.tmpdir=${tmpDirForJvm}`, "-cp", classPath, "__Harness"]
      : [...JVM_FLAGS, `-Djava.io.tmpdir=${tmpDirForJvm}`, "-cp", classPath,
         "org.junit.platform.console.ConsoleLauncher", "execute", ...launcherArgs(mode, srcDir, reportsDir, outDir)];

    onEvent({ type: "phase", phase: "run" });
    const run = await exec(bin("java"), mainArgs, { cwd: srcDir, env, stdin: stdin ?? "", timeoutMs, signal });
    const screenshot = stopWatching ? await stopWatching() : null;
    stopWatching = null;
    if (browser) await killStrayBrowsers(dir, run.pid);

    const base = { stderr: run.stderr, diagnostics: [], truncated: run.truncated, timeMs: compile.ms + run.ms, screenshot };
    if (mode === "java") return javaResult(run, base);
    // Tests from hidden classes (named __Something) grade the lesson but aren't shown to the learner.
    const tests = (await readJUnitReports(reportsDir)).map((t) => ({
      ...t,
      hidden: isHidden((t.className ?? "").split(".").pop()),
    }));
    const scenarios = mode === "cucumber" ? await readCucumberReport(join(reportsDir, "cucumber.json")) : undefined;
    return {
      ...base,
      status: run.timedOut ? "timeout" : run.code === 0 || run.code === 1 ? "ok" : "runtime_error",
      stdout: cleanLauncherOutput(run.stdout, srcDir),
      checks: [],
      tests,
      scenarios,
    };
  } finally {
    if (stopWatching) await stopWatching();
    // A JVM killed by taskkill can hold files briefly on Windows, so retry before giving up.
    rm(dir, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }).catch((err) =>
      console.warn("[runner] could not remove", dir, err.code),
    );
  }
}

function checksSource(body) {
  return `public class __Checks extends __Lib {\n  static void run() throws Exception {\n${body ?? ""}\n  }\n}\n`;
}

function javaResult(run, base) {
  const markerAt = run.stdout.lastIndexOf(CHECKS_MARKER);
  const learnerOut = markerAt >= 0 ? run.stdout.slice(0, markerAt).replace(/\n$/, "") : run.stdout;
  const { checks, checkError } = parseChecks(markerAt >= 0 ? run.stdout.slice(markerAt) : "");
  const crashed = /^(Exception in thread "main"|##NO_MAIN_CLASS|##MAIN_NOT_PUBLIC)/m.test(run.stderr);
  const status = run.timedOut ? "timeout" : crashed || markerAt < 0 ? "runtime_error" : "ok";
  return { ...base, status, stdout: learnerOut, checks, checkError };
}

/** The launcher's own summary/tree is noise for beginners; keep what tests printed. */
function cleanLauncherOutput(text, srcDir) {
  // Failures are shown as structured test results, so drop the launcher's failure dump.
  const failuresAt = text.search(/^Failures \(\d+\):/m);
  const kept = failuresAt >= 0 ? text.slice(0, failuresAt) : text;
  // "file:///C:/.../qa-run-x/src/features/a.feature:2" -> "features/a.feature:2"
  const srcUrl = "file:///" + srcDir.replace(/\\/g, "/").replace(/^\//, "") + "/";
  return kept
    .split(srcUrl).join("")
    .split("\n")
    .filter((l) => !/^(Test run finished after|Thanks for using JUnit|WARNING: Delegated to|\[\s+\d+ (containers|tests))/.test(l.trim()))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
