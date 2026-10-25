export type LessonType = "read" | "code" | "quiz" | "locator";
export type RunMode = "java" | "junit" | "cucumber";

/** How a single test of a code lesson is judged. Exactly one matcher is set. */
export interface LessonTest {
  text: string;
  /** Console output checks. `regex` runs on the whole trimmed output (^/$ anchor the whole text). */
  stdout?: { includes?: string; equals?: string; regex?: string; notIncludes?: string };
  /** Regex the learner's source must match (comments stripped unless raw). All visible files are joined. */
  source?: string;
  /** Regex the learner's source must NOT match. */
  notSource?: string;
  /** Restrict source/notSource to one file. */
  file?: string;
  raw?: boolean;
  /** Id of a hidden Java check emitted by the lesson's `checks` block (java mode). */
  java?: string;
  /** Passes when the code compiles and runs without an exception. */
  runs?: boolean;
  /** JUnit results of the learner's own (visible) tests. */
  junit?: { passed?: number; failed?: number; name?: string; status?: TestStatus };
  /** A test method in a hidden `__*` class that must pass. */
  hiddenTest?: string;
  /** Cucumber scenario results. */
  cucumber?: { passed?: number; scenario?: string; status?: ScenarioStatus; steps?: number };
  /** Hint shown when this test fails. */
  hint?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain?: string;
}

export interface LessonFile {
  name: string;
  content: string;
  readonly?: boolean;
}

/** In-browser locator exercise: find exactly the elements `answer` selects. */
export interface LocatorTask {
  prompt: string; // markdown
  html: string;
  answer: string; // CSS selector the author uses to define the expected elements
  accept: "css" | "xpath" | "any";
  placeholder?: string;
}

export interface Lesson {
  id: string; // `${chapterSlug}/${lessonSlug}`
  slug: string;
  chapterSlug: string;
  title: string;
  type: LessonType;
  minutes?: number;
  body: string; // markdown
  mode: RunMode;
  /** Editable files shown in tabs (single-file lessons get one Main.java). */
  files: LessonFile[];
  /** Files sent to the runner but never shown (e.g. __HiddenTest.java). */
  hiddenFiles: LessonFile[];
  solution?: Record<string, string>;
  tests: LessonTest[];
  checks?: string;
  stdin?: string;
  timeoutSec?: number;
  /** Practice-site page this lesson automates, e.g. "login.html". */
  practice?: string;
  locator?: LocatorTask[];
  hints: string[];
  questions: QuizQuestion[];
}

export interface Chapter {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  lessons: Lesson[];
}

export interface LessonRef {
  id: string;
  title: string;
  type: LessonType;
  href: string;
}

// ---- runner protocol ----

export type RunStatus = "ok" | "compile_error" | "runtime_error" | "timeout";
export type TestStatus = "passed" | "failed" | "skipped";
export type ScenarioStatus = "passed" | "failed" | "undefined" | "skipped";

export interface Diagnostic {
  file: string;
  line: number;
  column: number;
  severity: "error" | "warning";
  message: string;
}

export interface JUnitTest {
  name: string;
  className?: string;
  status: TestStatus;
  message?: string;
  timeMs: number;
  hidden: boolean;
}

export interface Scenario {
  feature: string;
  name: string;
  status: ScenarioStatus;
  steps: { keyword: string; text: string; status: string; error?: string }[];
  tags: string[];
}

export interface RunnerResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  diagnostics: Diagnostic[];
  internalError?: boolean;
  checks: { id: string; pass: boolean; hint: string }[];
  checkError?: string | null;
  truncated?: boolean;
  timeMs: number;
  tests?: JUnitTest[];
  scenarios?: Scenario[];
  /** Last browser frame (base64 JPEG) when the code drove Chrome. */
  screenshot?: string | null;
}

export interface TestResult {
  text: string;
  pass: boolean;
  hint?: string;
}

/** A plain-Vietnamese explanation of a compiler or runtime error. */
export interface FriendlyError {
  title: string;
  detail: string;
  file?: string;
  line?: number;
}

export interface GradeResponse {
  run: RunnerResult;
  tests: TestResult[];
  passed: boolean;
  friendly: FriendlyError[];
}

/** Events streamed by /api/run (NDJSON). */
export type RunEvent =
  | { type: "phase"; phase: "queued" | "compile" | "run" }
  | { type: "frame"; data: string }
  | { type: "graded"; graded: GradeResponse }
  | { type: "error"; error: string };
