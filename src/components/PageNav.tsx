import Link from "next/link";
import type { LessonRef } from "@/lib/types";

interface Props {
  prev: LessonRef | null;
  next: LessonRef | null;
  /** Emphasize "next" once the page is completed. */
  ready?: boolean;
}

export function PageNav({ prev, next, ready = false }: Props) {
  return (
    <nav className="mt-10 flex items-stretch justify-between gap-3 border-t border-rule pt-5" aria-label="Lật trang">
      {prev ? (
        <Link href={prev.href} className="group max-w-[45%] rounded-lg px-3 py-2 text-left transition hover:bg-paper-deep">
          <span className="block text-xs uppercase tracking-widest text-ink-faint">← Trang trước</span>
          <span className="block truncate font-display text-ink-soft group-hover:text-ink">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className={`group max-w-[55%] rounded-lg px-4 py-2 text-right transition active:translate-y-px ${
            ready ? "bg-ink text-paper shadow-[0_8px_20px_-12px_rgb(0_0_0/0.7)] hover:bg-seal" : "hover:bg-paper-deep"
          }`}
        >
          <span className={`block text-xs uppercase tracking-widest ${ready ? "text-paper/70" : "text-ink-faint"}`}>
            Trang sau →
          </span>
          <span className={`block truncate font-display ${ready ? "" : "text-ink-soft group-hover:text-ink"}`}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
