import Link from "next/link";
import { ChapterProgress, ContinueButton, ProgressBackup } from "@/components/HomeProgress";
import { allLessons, getCourse, toRef } from "@/lib/course";

const TOOLCHAIN = [
  { name: "Java 21", role: "ngôn ngữ" },
  { name: "Maven", role: "quản lý project" },
  { name: "JUnit 6", role: "viết test" },
  { name: "AssertJ", role: "so sánh kết quả" },
  { name: "Selenium 4", role: "điều khiển trình duyệt" },
  { name: "Cucumber 8", role: "BDD · Gherkin" },
  { name: "Allure", role: "báo cáo" },
  { name: "GitHub Actions", role: "chạy tự động" },
];

export default function Home() {
  const course = getCourse();
  const lessons = allLessons(course).map(toRef);

  return (
    <main className="paper min-h-dvh">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:py-20">
        {/* ---------- cover ---------- */}
        <section className="lg:sticky lg:top-16 lg:self-start">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-seal">QA·Academy — Ấn bản 2026</p>
          <h1 className="mt-5 font-display text-[3.1rem] font-semibold leading-[1.02] tracking-tight text-balance sm:text-[4.4rem]">
            Sổ tay
            <br />
            <span className="italic text-seal">Automation</span> Tester
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Từ người chưa từng viết một dòng code đến tự tay xây framework test web bằng Java, Selenium và Cucumber.
            Mỗi trang một bài nhỏ: đọc, gõ code, bấm chạy, thấy kết quả ngay.
          </p>
          <div className="mt-9">
            <ContinueButton lessons={lessons} />
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-rule pt-6">
            {TOOLCHAIN.map((t) => (
              <div key={t.name} className="border-b border-dotted border-rule pb-1.5">
                <dt className="font-medium">{t.name}</dt>
                <dd className="text-xs text-ink-faint">{t.role}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- table of contents ---------- */}
        <section aria-labelledby="toc">
          <h2 id="toc" className="font-display text-3xl font-semibold">
            Mục lục
          </h2>
          <ol className="mt-6 border-t-2 border-ink">
            {course.map((ch) => {
              const ready = ch.lessons.length > 0;
              const first = ch.lessons[0];
              return (
                <li key={ch.slug} className="border-b border-rule">
                  <div className={`grid grid-cols-[3rem_1fr] gap-x-3 py-5 ${ready ? "" : "opacity-55"}`}>
                    <span className="font-display text-3xl font-semibold italic leading-none text-seal tabular-nums">
                      {String(ch.number).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        {ready ? (
                          <Link href={`/learn/${first.chapterSlug}/${first.slug}`} className="font-display text-xl font-semibold hover:text-seal">
                            {ch.title}
                          </Link>
                        ) : (
                          <span className="font-display text-xl font-semibold">{ch.title}</span>
                        )}
                        {ready ? (
                          <ChapterProgress lessons={ch.lessons.map(toRef)} />
                        ) : (
                          <span className="font-mono text-[0.68rem] uppercase tracking-widest text-ink-faint">Đang viết</span>
                        )}
                      </div>
                      {ch.subtitle && <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{ch.subtitle}</p>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-8">
            <ProgressBackup />
          </div>
        </section>
      </div>
    </main>
  );
}
