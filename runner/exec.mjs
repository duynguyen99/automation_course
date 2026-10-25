// Process helpers: run with timeout/output cap, and clean up stray browsers afterwards.
import { spawn } from "node:child_process";

export const OUTPUT_CAP = 200_000;
const isWin = process.platform === "win32";

// On Windows `java` is often the Oracle javapath shim, which starts the real JVM as a
// child process; killing only the shim leaves the JVM running and holding the pipes open.
export function killTree(pid) {
  if (!pid) return;
  if (isWin) {
    spawn("taskkill", ["/pid", String(pid), "/T", "/F"], { windowsHide: true }).on("error", () => {});
  } else {
    try {
      process.kill(-pid, "SIGKILL"); // whole process group (spawned detached)
    } catch {
      // already gone
    }
  }
}

/** Runs a process, enforcing a timeout and an output cap. Resolves with what it printed. */
export function exec(cmd, args, { cwd, env, stdin = "", timeoutMs, signal }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(cmd, args, { cwd, env, windowsHide: true, detached: !isWin });
    let stdout = "";
    let stderr = "";
    let truncated = false;
    let timedOut = false;
    let cancelled = false;

    // setEncoding uses a StringDecoder, so multi-byte characters split across chunks stay intact.
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    const append = (current, chunk) => {
      if (current.length >= OUTPUT_CAP) {
        truncated = true;
        return current;
      }
      return current + chunk;
    };
    child.stdout.on("data", (c) => (stdout = append(stdout, c)));
    child.stderr.on("data", (c) => (stderr = append(stderr, c)));

    const timer = setTimeout(() => {
      timedOut = true;
      killTree(child.pid);
    }, timeoutMs);
    const onAbort = () => {
      cancelled = true;
      killTree(child.pid);
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    const finish = (code, extraErr = "") => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      resolve({
        code,
        pid: child.pid,
        stdout: stdout.replace(/\r\n/g, "\n"),
        stderr: (stderr + extraErr).replace(/\r\n/g, "\n"),
        timedOut,
        cancelled,
        truncated,
        ms: Date.now() - started,
      });
    };
    child.on("error", (err) => finish(-1, String(err)));
    child.on("close", (code) => finish(code));
    child.stdin.on("error", () => {}); // process may exit before reading stdin
    child.stdin.end(stdin);
  });
}

/**
 * Kills browsers and drivers a learner forgot to quit(). Chrome is matched by its
 * user-data-dir (inside the run's private temp dir); chromedriver by its dead parent JVM.
 */
export async function killStrayBrowsers(runDir, javaPid) {
  if (isWin) {
    const dir = runDir.replace(/'/g, "''");
    const script =
      `Get-CimInstance Win32_Process | Where-Object { ` +
      `($_.CommandLine -and $_.CommandLine.Contains('${dir}')) -or ` +
      `($_.Name -like 'chromedriver*' -and $_.ParentProcessId -eq ${Number(javaPid) || -1}) } | ` +
      `ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`;
    await exec("powershell", ["-NoProfile", "-NonInteractive", "-Command", script], { timeoutMs: 15_000 });
  } else {
    await exec("pkill", ["-9", "-f", runDir], { timeoutMs: 5_000 });
  }
}
