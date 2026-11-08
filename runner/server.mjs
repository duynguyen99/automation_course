// QA Academy code runner: compiles and runs learner Java (plain, JUnit, Cucumber, Selenium)
// and serves the practice website that Selenium lessons automate.
// Locally it binds 127.0.0.1. Deployed, it runs in the container from deploy/ with
// RUNNER_HOST=0.0.0.0 and RUNNER_TOKEN set, so only the web app can submit code.
import { timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";
import { exec } from "./exec.mjs";
import { MODES, runJob } from "./jobs.mjs";
import { handlePractice } from "./practice.mjs";

const PORT = Number(process.env.RUNNER_PORT ?? 4000);
const HOST = process.env.RUNNER_HOST ?? "127.0.0.1";
const TOKEN = process.env.RUNNER_TOKEN ?? "";

/** When a token is configured, /run requires the same value in the x-runner-token header. */
function authorized(req) {
  if (!TOKEN) return true;
  const given = Buffer.from(String(req.headers["x-runner-token"] ?? ""));
  const expected = Buffer.from(TOKEN);
  return given.length === expected.length && timingSafeEqual(given, expected);
}
const JAVA = process.env.JAVA_HOME ? `${process.env.JAVA_HOME}/bin/java` : "java";

const LIMITS = {
  bodyBytes: 300_000,
  maxFiles: 20,
  maxConcurrent: Number(process.env.RUNNER_CONCURRENCY ?? 2),
  maxQueue: 20,
};
// Names starting with "__" are lesson-provided hidden files (e.g. __HiddenTest.java).
const FILE_NAME = /^(?!.*\.\.)(?!\/)[A-Za-z_][A-Za-z0-9_\-/]*\.(java|feature|properties|json|csv|txt)$/;

// --- tiny concurrency gate so many clicks don't spawn many JVMs ---
let active = 0;
const waiting = [];
async function withSlot(task) {
  if (active >= LIMITS.maxConcurrent) {
    if (waiting.length >= LIMITS.maxQueue) {
      throw Object.assign(new Error("Máy chạy code đang bận, thử lại sau vài giây nhé"), { status: 429 });
    }
    await new Promise((r) => waiting.push(r));
  }
  active++;
  try {
    return await task();
  } finally {
    active--;
    waiting.shift()?.();
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > LIMITS.bodyBytes) {
        // Stop buffering but keep the socket open so the 413 response can still be sent.
        req.removeAllListeners("data");
        req.resume();
        reject(Object.assign(new Error("Code quá dài"), { status: 413 }));
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

/** Validates and normalizes a run request. Returns [job, error]. */
export function toJob(payload, legacyJava = false) {
  if (!payload || typeof payload !== "object") return [null, "Dữ liệu không hợp lệ"];
  const files = legacyJava ? [{ name: "Main.java", content: payload.code }] : payload.files;
  const mode = legacyJava ? "java" : payload.mode ?? "java";
  if (!MODES.includes(mode)) return [null, `mode không hợp lệ: ${mode}`];
  if (!Array.isArray(files) || files.length === 0 || files.length > LIMITS.maxFiles) return [null, "Danh sách file không hợp lệ"];
  for (const f of files) {
    if (typeof f?.name !== "string" || typeof f.content !== "string") return [null, "File thiếu name hoặc content"];
    if (!FILE_NAME.test(f.name)) return [null, `Tên file không hợp lệ: ${f.name}`];
  }
  for (const key of ["checks", "stdin"]) {
    if (payload[key] != null && typeof payload[key] !== "string") return [null, `${key} phải là chuỗi`];
  }
  const timeoutSec = Number(payload.timeoutSec) || undefined;
  if (timeoutSec !== undefined && (timeoutSec < 1 || timeoutSec > 180)) return [null, "timeoutSec ngoài phạm vi"];
  return [{ mode, files, checks: payload.checks, stdin: payload.stdin, timeoutSec }, null];
}

async function handleRun(req, res, legacyJava) {
  const [job, problem] = toJob(JSON.parse(await readBody(req)), legacyJava);
  if (problem) return send(res, 400, { error: problem });

  // Cancel the job if the caller goes away (closed tab, aborted fetch).
  const abort = new AbortController();
  res.on("close", () => !res.writableFinished && abort.abort());

  const stream = !legacyJava && String(req.headers.accept ?? "").includes("ndjson");
  if (!stream) {
    const result = await withSlot(() => runJob(job, { signal: abort.signal }));
    return send(res, 200, result);
  }

  res.writeHead(200, { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" });
  const emit = (event) => !res.writableEnded && res.write(JSON.stringify(event) + "\n");
  emit({ type: "phase", phase: "queued" });
  try {
    const result = await withSlot(() => runJob(job, { onEvent: emit, signal: abort.signal }));
    emit({ type: "result", result });
  } catch (err) {
    emit({ type: "error", error: err.status ? err.message : "Runner gặp lỗi nội bộ" });
    if (!err.status) console.error("[runner]", err);
  }
  res.end();
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (req.method === "GET" && url.pathname === "/health") {
      const v = await exec(JAVA, ["-version"], { timeoutMs: 10_000 });
      return send(res, 200, { ok: v.code === 0, java: v.stderr.split("\n")[0] });
    }
    if (req.method === "POST" && (url.pathname === "/run" || url.pathname === "/run/java")) {
      if (!authorized(req)) return send(res, 401, { error: "Thiếu hoặc sai runner token" });
      return await handleRun(req, res, url.pathname === "/run/java");
    }
    if (await handlePractice(req, res, url)) return;
    send(res, 404, { error: "Not found" });
  } catch (err) {
    if (!err.status) console.error("[runner]", err);
    if (!res.headersSent) send(res, err.status ?? 500, { error: err.status ? err.message : "Runner gặp lỗi nội bộ" });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[runner] listening on http://${HOST}:${PORT}  (practice site: /practice/)${TOKEN ? "  token required" : ""}`);
});
