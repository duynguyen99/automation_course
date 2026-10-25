---
title: "Kiểm tra nhanh: Báo cáo & CI"
type: quiz
minutes: 5
questions:
  - q: "Allure tạo báo cáo theo hai bước. Bước đầu tiên là gì?"
    options:
      - "Lệnh `allure serve` chạy test giúp bạn"
      - "Khi chạy test, thư viện Allure ghi kết quả vào thư mục `allure-results`"
      - "Copy file HTML mẫu vào thư mục `target`"
    answer: 1
    explain: "Chạy test sinh ra `allure-results` (các file JSON), sau đó lệnh `allure` mới đọc thư mục đó để tạo trang báo cáo."
  - q: "Trong hook `@After` của Cucumber, nên chụp màn hình khi nào?"
    options:
      - "Sau `driver.quit()`"
      - "Trước `driver.quit()`, khi `scenario.isFailed()` là `true`"
      - "Ở đầu mỗi step"
    answer: 1
    explain: "Sau `quit()` thì trình duyệt đã đóng, không còn gì để chụp."
  - q: "Lệnh nào lấy ảnh chụp màn hình dạng `byte[]`?"
    options:
      - "`driver.screenshot()`"
      - "`((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES)`"
      - "`driver.getScreenshotAs(\"png\")`"
    answer: 1
    explain: "Phải ép kiểu sang `TakesScreenshot`, rồi chọn kiểu kết quả bằng `OutputType`."
  - q: "Vì sao nên thêm `--window-size=1280,800` khi chạy headless?"
    options:
      - "Để Chrome chạy nhanh hơn"
      - "Vì headless mặc định cửa sổ khá nhỏ, trang có thể chuyển sang giao diện khác và test fail khó hiểu"
      - "Vì không có tham số này thì headless không chạy"
    answer: 1
    explain: "Kích thước cố định giúp giao diện lúc test giống lúc bạn viết test."
  - q: "Chạy test song song với `protected static WebDriver driver;` trong `BaseTest` sẽ ra sao?"
    options:
      - "Không sao cả"
      - "Các test giành nhau một biến driver, dẫn tới lỗi ngẫu nhiên"
      - "Java báo lỗi biên dịch"
    answer: 1
    explain: "Mỗi luồng cần trình duyệt riêng: dùng `ThreadLocal<WebDriver>` hoặc context theo từng Scenario."
  - q: "Trong workflow GitHub Actions, `if: always()` ở bước upload báo cáo để làm gì?"
    options:
      - "Để bước đó luôn chạy, kể cả khi bước chạy test fail"
      - "Để test luôn pass"
      - "Để workflow chạy mỗi phút"
    answer: 0
    explain: "Lúc test fail mới là lúc cần báo cáo nhất. Không có `if: always()`, các bước sau một bước fail sẽ bị bỏ qua."
  - q: "Trên máy `ubuntu-latest` của GitHub Actions, cần làm gì để có Chrome?"
    options:
      - "Thêm bước tải và cài Chrome bằng tay"
      - "Không cần gì: Chrome đã cài sẵn, Selenium Manager lo phần ChromeDriver; chỉ cần chạy headless"
      - "GitHub Actions không chạy được Selenium"
    answer: 1
    explain: "Máy ảo của GitHub có sẵn Chrome. Vì không có màn hình nên chạy ở chế độ headless."
  - q: "Một test lúc pass lúc fail mà không ai sửa code. Việc **đầu tiên** nên làm là gì?"
    options:
      - "Bật retry 5 lần cho chắc"
      - "Xóa test đó đi"
      - "Tìm nguyên nhân gốc: xem ảnh chụp, thông báo lỗi; thường là do chờ sai cách hoặc dữ liệu dùng chung"
    answer: 2
    explain: "Retry và quarantine chỉ là biện pháp tạm thời. Sửa tận gốc mới giữ được niềm tin vào bộ test."
---

Tám câu về báo cáo, headless, song song và CI. Đây cũng là những chủ đề nhà tuyển dụng hay hỏi để biết bạn đã làm dự án "thật" hay chưa.
