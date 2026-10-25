"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GradeResponse, RunEvent } from "./types";
import type { RunPhase } from "@/components/OutputPanel";

interface Handlers {
  onFirstFrame?: () => void;
  onGraded?: (graded: GradeResponse) => void;
}

/** Sends code to /api/run and follows the NDJSON stream (phases, live frames, graded result). */
export function useRunner(lessonId: string, { onFirstFrame, onGraded }: Handlers) {
  const [phase, setPhase] = useState<RunPhase>("idle");
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const inFlight = useRef(false);
  const handlers = useRef({ onFirstFrame, onGraded });
  useEffect(() => {
    handlers.current = { onFirstFrame, onGraded };
  }, [onFirstFrame, onGraded]);

  const run = useCallback(
    async (files: Record<string, string>) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setPhase("queued");
      setError(null);
      setFrame(null);
      let sawFrame = false;
      try {
        const res = await fetch("/api/run", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ lessonId, files }),
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Có lỗi xảy ra, thử lại nhé.");
          setResult(null);
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let newline: number;
          while ((newline = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, newline);
            buffer = buffer.slice(newline + 1);
            if (!line.trim()) continue;
            const event = JSON.parse(line) as RunEvent;
            if (event.type === "phase") setPhase(event.phase);
            else if (event.type === "frame") {
              setFrame(event.data);
              if (!sawFrame) {
                sawFrame = true;
                handlers.current.onFirstFrame?.();
              }
            } else if (event.type === "graded") {
              setResult(event.graded);
              handlers.current.onGraded?.(event.graded);
            } else if (event.type === "error") setError(event.error);
          }
        }
      } catch {
        setError("Không gửi được code. Kiểm tra kết nối rồi thử lại.");
      } finally {
        inFlight.current = false;
        setPhase("idle");
      }
    },
    [lessonId],
  );

  const clear = useCallback(() => {
    setResult(null);
    setFrame(null);
    setError(null);
  }, []);

  return { run, phase, result, error, frame, clear };
}
