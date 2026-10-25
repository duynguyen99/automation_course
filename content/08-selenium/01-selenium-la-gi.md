---
title: "Selenium là gì và hoạt động thế nào?"
type: read
minutes: 6
---

Hãy tưởng tượng bạn thuê một **người trợ lý** ngồi trước máy tính. Bạn đưa cho trợ lý một tờ giấy ghi: *"Mở trang đăng nhập, gõ chữ `lan` vào ô tên đăng nhập, bấm nút Đăng nhập, rồi đọc cho tôi dòng chào mừng"*. Trợ lý làm đúng từng bước, không mệt, không quên, làm 100 lần vẫn như lần đầu.

**Selenium WebDriver** chính là người trợ lý đó. Tờ giấy là code Java của bạn.

## Selenium là gì?

**Selenium** là bộ thư viện mã nguồn mở giúp **điều khiển trình duyệt bằng code**: mở trang, click, gõ phím, đọc chữ trên màn hình. Nó là công cụ automation web phổ biến nhất thế giới, và gần như mọi tin tuyển dụng "Automation Tester Java" ở Việt Nam đều ghi "Selenium WebDriver".

Trong khóa học này ta dùng **Selenium 4.51**.

## Chuyện gì xảy ra khi bạn chạy một dòng Selenium?

Lấy ví dụ dòng code sau:

```java
driver.findElement(By.id("login-btn")).click();
```

Lệnh "click" đi qua 4 chặng, giống một lá thư được chuyển qua bưu điện:

| Chặng | Ai làm | Việc gì |
|---|---|---|
| 1 | **Code Java của bạn** (WebDriver API) | Gọi method `click()` |
| 2 | **Giao thức W3C WebDriver** | Selenium "dịch" lệnh thành một yêu cầu HTTP chuẩn, kiểu *"phần tử số 7, hãy click"* |
| 3 | **chromedriver** | Một chương trình nhỏ chạy trên máy, nhận yêu cầu rồi ra lệnh cho Chrome |
| 4 | **Chrome** | Thực sự click vào nút, giống hệt người dùng thật |

Kết quả (thành công hay lỗi) lại đi ngược về code của bạn theo đúng đường đó.

- **WebDriver API** là các class và method bạn dùng trong Java: `WebDriver`, `WebElement`, `By`...
- **W3C WebDriver** là một **giao thức** (*protocol*), tức một bộ quy tắc giao tiếp được tổ chức W3C chuẩn hóa. Nhờ có chuẩn chung, cùng một code Java có thể điều khiển Chrome, Firefox, Edge hay Safari.
- Mỗi trình duyệt có **driver** riêng: `chromedriver` cho Chrome, `geckodriver` cho Firefox, `msedgedriver` cho Edge.

## Selenium Manager: khỏi lo tải driver

Ngày xưa, tester phải tự tải `chromedriver` đúng phiên bản Chrome, mỗi lần Chrome cập nhật lại tải lại. Rất phiền! Từ Selenium 4.6, **Selenium Manager** được tích hợp sẵn: khi bạn viết `new ChromeDriver()`, nó tự kiểm tra phiên bản Chrome trên máy và tải driver phù hợp.

> Trong các dự án cũ bạn có thể gặp thư viện `WebDriverManager` hoặc dòng `System.setProperty("webdriver.chrome.driver", ...)`. Với Selenium 4 hiện đại, bạn **không cần** chúng nữa.

## Selenium không làm được gì?

- Selenium chỉ điều khiển **trình duyệt**. Nó không test app điện thoại (đó là việc của Appium) hay API (đó là REST Assured, bạn sẽ học ở chương bonus).
- Selenium **không tự kiểm tra** đúng sai. Nó chỉ thao tác và đọc dữ liệu. Việc so sánh "thực tế có giống mong đợi không" là của **JUnit + AssertJ**, thứ bạn đã biết rồi.

Selenium là đôi tay và đôi mắt, JUnit là bộ não chấm điểm. Ghép hai thứ lại, bạn có một bài **test tự động** hoàn chỉnh.

Trang tiếp theo, bạn sẽ tự tay mở trình duyệt bằng code!
