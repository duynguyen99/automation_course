# Hướng dẫn soạn bài: QA Academy

This file is the contract for anyone (human or agent) writing lessons. Read it fully, then read the
existing lessons in `content/00-bat-dau`, `content/01-java-co-ban-1`, `content/02-java-co-ban-2` and the
samples `content/06-junit-assertj/02-test-dau-tien.md`, `content/07-web-hoat-dong/05-luyen-css-selector.md`,
`content/08-selenium/02-mo-trinh-duyet.md`, `content/10-cucumber-bdd/03-step-definition.md`. Match their voice exactly.

## 1. Who the learner is

- A Vietnamese woman from a **non-IT background** who has never programmed before chapter 1. By the
  chapter you're writing, she knows exactly what the earlier chapters taught, nothing more.
- Goal: get hired as a **web automation tester** (Java + Selenium + Cucumber) in Vietnam.
- Tone: warm, encouraging, concrete, never condescending. Address her as "bạn". No gendered assumptions.

## 2. Writing rules

- **Vietnamese prose; technical terms in English** (class, object, method, test case, locator, assertion,
  step definition, framework...). On first use, explain the term in Vietnamese, often with the English term in
  bold: "**kế thừa** (*inheritance*)".
- **One idea per page.** A page is 3–8 minutes. If a page needs two big ideas, split it.
- Start from a **real-life analogy** or a tester's real problem, then the code, then the exercise.
- Every code example relates to testing/e-commerce/the practice shop when possible (login, cart, price,
  test report, browser...). Avoid foo/bar.
- Markdown features used: `##`/`###` headings, tables, fenced ```java code, `>` blockquote for tips/warnings,
  **bold** = highlighted key term (renders as a highlighter mark). Don't overuse bold.
- End code pages with "## Đến lượt bạn" describing the task precisely (exact output text, names, values).
- Version facts (Oct 2026): Java 21 (LTS), Maven 3.9, JUnit 6 (Jupiter API, package `org.junit.jupiter.api`),
  AssertJ 3.27, Selenium 4.51 (Selenium Manager auto-downloads drivers; `WebDriverManager` is NOT needed),
  Cucumber-JVM 8 (`io.cucumber.java.en.*`, runs on the JUnit Platform via `cucumber-junit-platform-engine`
  + `@Suite`), REST Assured 6, TestNG 7.12, Allure Report. Don't teach deprecated APIs
  (`PageFactory`/`@FindBy` only as "you'll see this in old projects", never `Thread.sleep` as a wait strategy
  except to show why it's bad, no `implicitlyWait` + explicit mix, no JUnit 4 `@Before`).

## 3. File format

One chapter = `content/NN-slug/` with `_chapter.md`. One lesson = `NN-slug.md` (two-digit order prefix;
the slug becomes the URL, use ASCII Vietnamese without accents, hyphens). YAML frontmatter + markdown body.

```yaml
---
title: "Tên bài"            # quoted
type: read | code | quiz | locator
minutes: 6
# ---- code lessons ----
mode: java | junit | cucumber   # default java
seed: |                     # single file Main.java   (OR use `files`)
  public class Main { ... }
files:                      # multi-file: tabs in the editor
  - name: LoginPage.java
    readonly: true          # optional: learner can read but not edit
    content: |
      ...
  - name: LoginTest.java
    content: |
      ...
hiddenFiles:                # sent to the runner, never shown; names MUST start with __
  - name: __HiddenTest.java
    content: |
      ...
solution: |                 # single file: string. Multi-file: map { fileName: content }
  ...
checks: |                   # java mode only: hidden Java run after Main.main (see §5)
  eq("t1", () -> call("tong", 2, 3), 5, "tong(2, 3)");
tests:                      # each test = one line in "Bài kiểm tra"; be granular, 2–6 tests
  - text: 'Mô tả (inline markdown)'
    stdout: { equals: "...", includes: "...", regex: '...', notIncludes: "..." }
  - text: '...'
    source: 'regex'         # matched against all visible files, comments stripped; `file:` to restrict; `raw: true` keeps comments
    notSource: 'regex'
  - text: '...'
    java: t1                # id from `checks`
  - text: '...'
    runs: true              # compiles and runs without exception
  - text: '...'
    junit: { name: methodName, status: passed|failed }   # or { passed: 3 } (min) / { failed: 1 } (exact)
  - text: '...'
    hiddenTest: methodName  # a test method in a hidden __*Test class must pass
  - text: '...'
    cucumber: { scenario: "Tên scenario", status: passed, steps: 3 }   # or { passed: 2 }
hints: ['...', '...']       # 1–3 hints, progressively more explicit
timeout: 90                 # seconds; set 90 for Selenium lessons
practice: login.html        # practice page this lesson automates (adds "Mở trang mẫu" link)
# ---- quiz ----
questions:
  - q: "..."
    options: ["...", "...", "..."]
    answer: 1               # 0-based
    explain: "..."          # shown when answered correctly
# ---- locator (in-browser CSS/XPath practice, no runner) ----
locator:
  - prompt: 'Tìm ...'
    accept: css | xpath | any
    answer: 'CSS selector that selects EXACTLY the expected elements'  # always CSS, even for xpath tasks
    html: |
      <div>...</div>
---
Markdown body...
```

YAML gotchas: quote strings containing `: ` or `#`; prefer single quotes for regex (`'\s+'`); inside
single quotes write `''` for a literal `'`; block scalars (`|`) for code.

Grading notes:
- `stdout.regex` runs on the WHOLE trimmed output (no multiline flag: `^`/`$` = start/end of output).
- `source` regexes use the multiline flag. They run on code with comments removed.
- Vietnamese text is NFC-normalized on both sides.
- A page passes only if the run status is ok AND every test passes.
- Seeds must **compile** (or deliberately not, if the lesson is about compile errors) and must **not pass**.

## 4. Runner modes

- `java`: compiles all visible + hidden files with `javac --release 21`, runs `Main.main` through a harness,
  then runs `checks`. Libraries on the classpath: everything in §2 (Selenium, AssertJ, Jackson, REST Assured...).
- `junit`: compiles all files, runs JUnit Platform (Jupiter engine) scanning all classes. Test classes must be
  in the **default package** (no `package` line). Learner tests appear in the "Kết quả test" tab; hidden
  test classes named `__Something` are graded but not shown. Prefer AssertJ `assertThat` in teaching.
- `cucumber`: features must be under `features/` (e.g. `features/login.feature`); step definitions and hooks
  must be in package `steps` (file `steps/LoginSteps.java` with `package steps;`). Glue is fixed to `steps`.
  Other helper classes (page objects) can also go in `steps/` or a package under it, e.g. `steps/pages/LoginPage.java`
  with `package steps.pages;`... simpler: keep page objects in package `steps` too.
  The "Kịch bản" tab shows each scenario and step status.
- Any lesson whose code imports `org.openqa.selenium` gets the **live browser view** automatically.
  Learner code just does `new ChromeDriver()`; a real Chrome window opens (headed). Always use
  `try { ... } finally { driver.quit(); }` (or `@AfterEach`/`@After` hooks) in seeds and solutions.

## 5. Hidden checks (java mode) — helpers available in `checks`

`checks` is the body of `static void run()` in a class that extends `__Lib`. All lookups are by name via
reflection, so a missing class/method fails that check with a Vietnamese message instead of breaking compile.

| Helper | Meaning |
|---|---|
| `eq(id, () -> expr, expected, "label")` | pass if values equal (numbers by value, arrays by content) |
| `ok(id, () -> booleanExpr, "hint if false")` | pass if expression is true |
| `check(id, boolean, "hint")` | raw |
| `throwsEx(id, () -> expr, "IllegalArgumentException", "label")` | pass if it throws that exception (or subclass) |
| `call("method", args...)` | call a static method of `Main` |
| `invokeStatic("Class", "method", args...)` | static method of another class |
| `newObj("Class", args...)` | construct an object |
| `callOn(obj, "method", args...)` | instance method (inherited too) |
| `field(obj, "name")` | read a field (private OK) |
| `fieldIsPrivate("Class", "field")`, `extendsClass("Child", "Parent")`, `isInterface("X")`, `isAbstract("X")`, `hasClass("X")`, `hasStaticMethod("m", n)` | structure checks |
| `out()`, `lines()` | the learner's console output |

Example (OOP):

```yaml
checks: |
  ok("t1", () -> hasClass("Product"), "Chưa có class Product");
  eq("t2", () -> { Object p = newObj("Product", "Trà Sen", 420000); return callOn(p, "getPrice"); }, 420000, "getPrice()");
  ok("t3", () -> fieldIsPrivate("Product", "price"), "Thuộc tính price phải là private");
```

Lambdas returning a value need a `return` inside braces. Use `(Object)` cast when passing an array as the
single vararg: `call("demPass", (Object) new String[]{"PASS"})`.

## 6. The practice website "Tiệm Trà Mộc" (http://localhost:4000/practice/)

Served by the runner from `runner/practice/`. You may ADD new static pages there if a lesson needs one (plain
HTML/CSS/JS, include `/practice/assets/site.css` and `/practice/assets/site.js`), but do not change ids/text of
existing pages. Stable facts:

| Page | Key elements |
|---|---|
| `index.html` | `h1#page-title` "Tiệm Trà Mộc"; hub links `#link-login`, `#link-products`, `#link-cart`, `#link-checkout`, `#link-dynamic`, `#link-alerts`, `#link-frames`, `#link-windows`, `#link-table` |
| header (all pages) | `.site-header`, `.logo`, nav links, `#cart-link`, `#cart-count` |
| `login.html` (title "Đăng nhập - Tiệm Trà Mộc") | `#username`, `#password`, `#remember` (checkbox), `#login-btn`, `#error-message` (`.alert-error`, hidden until error). Accounts: `lan`/`matkhau123` OK → redirects (~0.6 s) to `account.html?name=Lan`; `khoa`/`matkhau123` → "Tài khoản của bạn đã bị khóa". Errors: empty user "Vui lòng nhập tên đăng nhập", empty pass "Vui lòng nhập mật khẩu", wrong "Sai tên đăng nhập hoặc mật khẩu" |
| `account.html` (title "Tài khoản - Tiệm Trà Mộc") | `h1#welcome` "Xin chào, Lan", `#logout` |
| `products.html` | `#search` (filters on input), `#sort` select (`default`, `price-asc`, `price-desc`, `name`), `#result-count` ("6 sản phẩm"), `#product-list` > `article.product-card[data-id][data-category]` > `.product-name`, `.price` (e.g. "185.000₫"), `.stock`, `button.add-to-cart` (disabled + text "Hết hàng" for out of stock), toast `#toast` "Đã thêm vào giỏ hàng", `#no-result` |
| products data | 1 Trà Shan Tuyết 185000 (12), 2 Trà Ô Long Lâm Đồng 240000 (8), 3 Trà Sen Tây Hồ 420000 (3), 4 Trà Nhài Thái Nguyên 150000 (20), 5 Hồng Trà Hà Giang 210000 (0, hết hàng), 6 Ấm Tử Sa Mini 560000 (5) |
| `cart.html` | `#cart-table` rows `tr.cart-row[data-id]` with `.item-name`, `.item-price`, `input.item-qty`, `.item-subtotal`, `button.remove-item`; `#cart-total`; `#empty-cart`; `#checkout-btn`. Cart is localStorage, so add items on products.html in the same session first |
| `checkout.html` | `#fullname`, `#phone` (regex `^0\d{9}$`), `#email`, `#city` select (`HN` Hà Nội, `HCM`, `DN`, `CT`), `#address`, radios `#ship-standard` (checked) / `#ship-express` name=shipping, `#agree`, `#place-order`; errors `#fullname-error`, `#phone-error` "Số điện thoại không hợp lệ", `#email-error` "Email không hợp lệ", `#city-error` "Vui lòng chọn tỉnh/thành", `#agree-error` "Bạn cần đồng ý với điều khoản"; success `#order-success` contains "Đặt hàng thành công!" and `#order-code` (TM + 6 digits) |
| `dynamic.html` | `#load-btn` → `#loading` spinner then after 2–4 s `#result` "Đơn hàng TM2026 đang được giao"; `#confirm-btn` disabled for 3 s, click → `#confirm-message` "Đã xác nhận đơn hàng!"; `#status` text changes from "Đang xử lý" to "Hoàn tất" after 2–4 s |
| `alerts.html` | `#alert-btn` (alert "Chào mừng bạn đến Tiệm Trà Mộc!" → result "Đã đóng thông báo"), `#confirm-btn` (confirm → "Đã xóa giỏ hàng" / "Đã hủy"), `#prompt-btn` (prompt; "TRAMOC10" → "Áp dụng mã thành công: giảm 10%"), result in `#alert-result` |
| `frames.html` | `iframe#newsletter-frame` (name `newsletter`) containing `#newsletter-email`, `#subscribe-btn`, `#subscribe-message` ("Đã đăng ký: <email>"); outside: `#outside-text` "Cảm ơn bạn đã ghé thăm" |
| `windows.html` | `#policy-link` opens `window-new.html` in a new tab: title "Chính sách đổi trả - Tiệm Trà Mộc", `#policy-title`, `#policy-text` |
| `table.html` | `table.orders` rows (no ids): TM1001 Nguyễn Thị Lan Hà Nội 370.000₫ Đã giao; TM1002 Trần Minh Khoa TP. Hồ Chí Minh 840.000₫ Đang giao; TM1003 Lê Hoàng Mai Đà Nẵng 150.000₫ Đã hủy; TM1004 Phạm Quốc Bảo Cần Thơ 560.000₫ Đang giao; TM1005 Võ Thu Hà Hà Nội 1.240.000₫ Chờ xác nhận; each row has `button.view` → `#selected-order` "TM1002 - Trần Minh Khoa" |
| API `/practice/api` | `GET /products`, `GET /products/{id}` (404 JSON `{error}`), `POST /login` `{username,password}` → 200 `{token,name}` / 401 / 403 locked, `GET /orders` and `POST /orders` `{productId, quantity}` need `Authorization: Bearer <token>` → 201 `{id,user,productId,quantity,total,status:"MOI"}`, 400 invalid, 409 not enough stock |

## 7. Verification (mandatory)

The runner must be running (`npm run runner`, already running on port 4000 — do not restart or edit it).
For each chapter you write:

```bash
npx vitest run src/lib/content.test.ts              # parses every lesson
LESSON=<chapter-slug> npm run verify:lessons        # e.g. LESSON=java-oop  (substring of lesson ids)
```

Every code lesson must: solution passes all tests with status ok; seed does not pass. Fix lessons until
green. Selenium lessons open real Chrome windows; that's expected.
