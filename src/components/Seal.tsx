/** Red ink stamp shown on a page once it's passed, like a teacher's mark. */
export function Seal({ label = "ĐẠT" }: { label?: string }) {
  return (
    <div
      className="stamp pointer-events-none grid size-24 place-items-center rounded-full border-[3px] border-seal text-seal opacity-90 mix-blend-multiply dark:mix-blend-screen"
      style={{ boxShadow: "inset 0 0 0 4px var(--paper), inset 0 0 0 6px var(--seal)" }}
      aria-hidden
    >
      <span className="font-display text-2xl font-bold tracking-[0.12em]">{label}</span>
    </div>
  );
}
