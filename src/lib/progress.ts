"use client";

import { useSyncExternalStore } from "react";

const KEY = "qa-academy:progress:v1";

export interface Progress {
  completed: Record<string, number>; // lessonId -> timestamp
  code: Record<string, string>; // lessonId -> learner's latest code
  attempts: Record<string, number>; // lessonId -> failed check runs
}

const EMPTY: Progress = { completed: {}, code: {}, attempts: {} };
const listeners = new Set<() => void>();
let snapshot: Progress | null = null;

function read(): Progress {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { ...EMPTY, ...parsed };
  } catch {
    return EMPTY;
  }
}

function write(next: Progress) {
  snapshot = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked: progress stays in memory for this tab
  }
  listeners.forEach((l) => l());
}

function getSnapshot(): Progress {
  snapshot ??= read();
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      snapshot = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function markComplete(lessonId: string) {
  const p = getSnapshot();
  if (p.completed[lessonId]) return;
  write({ ...p, completed: { ...p.completed, [lessonId]: Date.now() } });
}

/** Storage key of one file of a lesson. Main.java keeps the bare lesson id (pre multi-file saves). */
export function codeKey(lessonId: string, file: string): string {
  return file === "Main.java" ? lessonId : `${lessonId}::${file}`;
}

export function saveCode(key: string, code: string) {
  const p = getSnapshot();
  write({ ...p, code: { ...p.code, [key]: code } });
}

/** Forgets every saved file of a lesson. */
export function clearCode(lessonId: string) {
  const p = getSnapshot();
  const code = Object.fromEntries(
    Object.entries(p.code).filter(([key]) => key !== lessonId && !key.startsWith(`${lessonId}::`)),
  );
  write({ ...p, code });
}

export function recordFailedAttempt(lessonId: string) {
  const p = getSnapshot();
  write({ ...p, attempts: { ...p.attempts, [lessonId]: (p.attempts[lessonId] ?? 0) + 1 } });
}

/** Forgets everything: completed pages, saved code and attempt counts. */
export function resetProgress() {
  write(EMPTY);
}

export function exportProgress(): string {
  return JSON.stringify(getSnapshot(), null, 2);
}

export function importProgress(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<Progress>;
    if (typeof parsed !== "object" || parsed === null || typeof parsed.completed !== "object") return false;
    write({ ...EMPTY, ...parsed });
    return true;
  } catch {
    return false;
  }
}
