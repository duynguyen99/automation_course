// Readers for the reports produced by the JUnit console launcher and Cucumber.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const ENTITIES = { "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&amp;": "&" };
const decode = (s = "") =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(lt|gt|quot|apos|amp);/g, (m) => ENTITIES[m]);

const attr = (tag, name) => decode(new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1]);

/** Parses one legacy JUnit XML report into test results. */
export function parseJUnitXml(xml) {
  const tests = [];
  const re = /<testcase\b([^>]*?)(\/>|>([\s\S]*?)<\/testcase>)/g;
  for (const m of xml.matchAll(re)) {
    const open = m[1];
    const body = m[3] ?? "";
    const failure = /<(failure|error)\b([^>]*)>/.exec(body);
    const status = failure ? "failed" : /<skipped\b/.test(body) ? "skipped" : "passed";
    tests.push({
      name: attr(open, "name").replace(/\(\)$/, ""),
      className: attr(open, "classname"),
      status,
      message: failure ? (attr(failure[2], "message") || attr(failure[2], "type")).replace(/\r\n/g, "\n").trim() : undefined,
      timeMs: Math.round(Number(attr(open, "time") || 0) * 1000),
    });
  }
  return tests;
}

export async function readJUnitReports(dir) {
  let files = [];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".xml"));
  } catch {
    return [];
  }
  const all = await Promise.all(files.map(async (f) => parseJUnitXml(await readFile(join(dir, f), "utf8"))));
  return all.flat();
}

/** Flattens Cucumber's JSON report into scenarios with step results. */
export function parseCucumberJson(json) {
  const scenarios = [];
  for (const feature of JSON.parse(json || "[]")) {
    for (const el of feature.elements ?? []) {
      if (el.type !== "scenario") continue;
      const steps = (el.steps ?? []).map((s) => ({
        keyword: (s.keyword ?? "").trim(),
        text: s.name ?? "",
        status: s.result?.status ?? "undefined",
        error: s.result?.error_message ? s.result.error_message.split("\n").slice(0, 3).join("\n") : undefined,
      }));
      const hookFailed = [...(el.before ?? []), ...(el.after ?? [])].some((h) => h.result?.status === "failed");
      const statuses = steps.map((s) => s.status);
      const status = hookFailed || statuses.includes("failed")
        ? "failed"
        : statuses.includes("undefined")
          ? "undefined"
          : statuses.every((s) => s === "passed")
            ? "passed"
            : "skipped";
      scenarios.push({ feature: feature.name, name: el.name, status, steps, tags: (el.tags ?? []).map((t) => t.name) });
    }
  }
  return scenarios;
}

export async function readCucumberReport(file) {
  try {
    return parseCucumberJson(await readFile(file, "utf8"));
  } catch {
    return [];
  }
}
