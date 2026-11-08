# QA Academy: Sổ tay Automation Tester

Khóa học tương tác bằng tiếng Việt, kiểu freeCodeCamp. Khóa học đưa một người chưa biết lập trình đi từ Java cơ bản đến Selenium, Cucumber và CI. Mỗi trang là một bài nhỏ: bên trái là bài học, bên phải là editor và khung kết quả. Code chạy thật bằng JDK và được chấm tự động. Với bài Selenium, trình duyệt Chrome do code điều khiển được hiển thị trực tiếp ngay trong trang.

## Chạy ở máy local

Yêu cầu:
- Node 22+.
- JDK 21 trở lên.
- Google Chrome (cho các bài Selenium).

```bash
npm install
npm run runner:setup   # một lần: tự tải Maven (nếu chưa có) + thư viện Java vào runner/lib/jars
npm run runner         # terminal 1: máy chạy code + website mẫu, http://localhost:4000/practice/
npm run dev -- -p 3100 # terminal 2: web học, http://localhost:3100
```

## Kiến trúc

```
Next.js (src/)                               Runner (runner/, Node, không dependency)
├─ content/**.md → bài học                   ├─ server.mjs   POST /run (NDJSON stream), /practice/*
├─ /learn/[chapter]/[lesson]                 ├─ jobs.mjs     javac → java: mode java | junit | cucumber
├─ /api/run ── files + checks ─────────────► ├─ live.mjs     tìm DevToolsActivePort → CDP screencast
│          ◄── phase, frame (jpeg), result ─ ├─ reports.mjs  đọc JUnit XML + Cucumber JSON
├─ grader.ts      chấm từng test của bài     ├─ java/__Harness.java, __Lib.java  hidden checks
└─ javaErrors.ts  giải thích lỗi tiếng Việt  └─ practice/    website mẫu "Tiệm Trà Mộc" + JSON API
```

- **java**: chạy `Main.main` qua harness, sau đó chạy `checks` ẩn của bài.
- **junit**: chạy JUnit Platform (Jupiter). Kết quả hiện ở tab "Kết quả test". Class test tên `__*` là test ẩn dùng để chấm.
- **cucumber**: feature đặt trong `features/`, glue là package `steps`. Kết quả từng bước hiện ở tab "Kịch bản".
- **Trình duyệt live**: code học viên chỉ cần viết `new ChromeDriver()`. Mỗi lần chạy có thư mục TEMP riêng, runner tìm file `DevToolsActivePort` mà Chrome ghi ra, nối vào qua CDP và stream màn hình về web. Chạy xong, Chrome và chromedriver còn sót được dọn sạch.

Runner hiện **chỉ dùng cho local** (bind 127.0.0.1). Trước khi đưa lên mạng phải chạy runner trong container khóa chặt: giới hạn mạng, filesystem chỉ đọc, giới hạn CPU/RAM/PID, user không phải root, Chrome chạy dưới Xvfb. Ngoài ra cần thêm auth và rate limit cho `/api/run`, và chạy hidden check ở một JVM riêng.

## Viết bài học

Xem [content/AUTHORING.md](content/AUTHORING.md): format frontmatter, các loại bài (`read`, `code`, `quiz`, `locator`), các loại test, helper cho hidden check, danh sách id/text của website mẫu và quy trình kiểm tra.

## Kiểm thử

```bash
npm test                                  # unit test: grader, giải thích lỗi, nội dung
npm run verify:lessons                    # cần runner: lời giải mọi bài phải pass, code ban đầu phải chưa pass
LESSON=selenium npm run verify:lessons    # chỉ kiểm tra các bài có id chứa "selenium"
```

Tiến độ học lưu trong `localStorage`. Ở trang chủ có nút xuất/nhập file để chuyển sang máy khác.
