import { findLesson } from "@/lib/course";
import { gradeRun } from "@/lib/gradeRun";
import type { Lesson, RunEvent, RunnerResult } from "@/lib/types";

const RUNNER_URL = process.env.RUNNER_URL ?? "http://127.0.0.1:4000";
const MAX_CODE_CHARS = 100_000;
const RUNNER_DOWN = "Không kết nối được máy chạy code. Hãy mở terminal và chạy: npm run runner";

function error(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

/** Learners may only edit the lesson's own non-readonly files; everything else comes from the lesson. */
function buildFiles(lesson: Lesson, submitted: Record<string, unknown>) {
  const visible: Record<string, string> = {};
  for (const f of lesson.files) {
    const value = submitted[f.name];
    visible[f.name] = !f.readonly && typeof value === "string" ? value : f.content;
  }
  const runnerFiles = [
    ...Object.entries(visible).map(([name, content]) => ({ name, content })),
    ...lesson.hiddenFiles.map(({ name, content }) => ({ name, content })),
  ];
  return { visible, runnerFiles };
}

export async function POST(request: Request) {
  let body: { lessonId?: unknown; files?: unknown };
  try {
    body = await request.json();
  } catch {
    return error(400, "Dữ liệu gửi lên không hợp lệ");
  }
  if (typeof body.lessonId !== "string" || !body.files || typeof body.files !== "object") {
    return error(400, "Thiếu lessonId hoặc files");
  }
  const submitted = body.files as Record<string, unknown>;
  const size = Object.values(submitted).reduce<number>((n, v) => n + (typeof v === "string" ? v.length : 0), 0);
  if (size > MAX_CODE_CHARS) return error(413, "Code quá dài");

  const found = findLesson(body.lessonId);
  if (!found || found.lesson.type !== "code") return error(404, "Không tìm thấy bài học");
  const { lesson } = found;
  const { visible, runnerFiles } = buildFiles(lesson, submitted);

  let upstream: Response;
  try {
    upstream = await fetch(`${RUNNER_URL}/run`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/x-ndjson" },
      body: JSON.stringify({
        mode: lesson.mode,
        files: runnerFiles,
        checks: lesson.checks,
        stdin: lesson.stdin,
        timeoutSec: lesson.timeoutSec,
      }),
      signal: request.signal,
    });
  } catch (err) {
    console.error("[api/run] runner unreachable", err);
    return error(503, RUNNER_DOWN);
  }
  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.json().catch(() => ({}));
    return error(upstream.status === 429 ? 429 : 502, detail.error ?? "Runner trả về lỗi");
  }

  // Pass phase/frame events through; replace the raw result with the graded one.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 1);
        if (!line.trim()) continue;
        const event = JSON.parse(line) as RunEvent | { type: "result"; result: RunnerResult };
        const out: RunEvent = event.type === "result" ? { type: "graded", graded: gradeRun(lesson, visible, event.result) } : event;
        controller.enqueue(encoder.encode(JSON.stringify(out) + "\n"));
      }
    },
  });

  return new Response(upstream.body.pipeThrough(transform), {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" },
  });
}
