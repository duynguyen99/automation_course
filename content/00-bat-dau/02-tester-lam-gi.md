---
title: "Tester làm gì? Automation là gì?"
type: read
minutes: 5
---

## Tester: người đi tìm lỗi trước khách hàng

Mỗi phần mềm, ứng dụng hay trang web bạn dùng đều có thể có **bug**, tức là lỗi khiến nó chạy sai so với mong đợi. Ví dụ:

- Bấm "Đặt hàng" mà không có gì xảy ra.
- Nhập sai mật khẩu nhưng vẫn đăng nhập được.
- Giỏ hàng có 2 món mà tổng tiền lại tính như 3 món.

**Tester** (hay **QA**, viết tắt của *Quality Assurance*) là người kiểm tra phần mềm để tìm ra những lỗi đó **trước khi** khách hàng gặp phải.

## Test case: một kịch bản kiểm tra

Tester không bấm lung tung. Họ viết ra các **test case**, mỗi test case gồm các bước cụ thể và kết quả mong đợi. Ví dụ test case "Đăng nhập thành công":

| Bước | Hành động | Kết quả mong đợi |
|---|---|---|
| 1 | Mở trang đăng nhập | Thấy form đăng nhập |
| 2 | Nhập tên `lan.nguyen` và mật khẩu đúng | Chữ hiện trong ô |
| 3 | Bấm nút **Đăng nhập** | Chuyển tới trang chủ, hiện "Xin chào, Lan" |

Nếu kết quả thực tế khớp với mong đợi, test case **pass** (đạt). Nếu không khớp, test case **fail** (không đạt) và tester báo bug cho lập trình viên.

## Manual test và Automation test

**Manual test** (test thủ công) là con người tự tay làm từng bước như trên. Cách này tốt khi khám phá tính năng mới, nhưng sẽ rất mệt nếu phải lặp lại hàng trăm test case mỗi lần phần mềm cập nhật.

**Automation test** (test tự động) là viết **chương trình** để máy tính làm các bước đó thay bạn. Chương trình sẽ:

1. Tự mở trình duyệt Chrome.
2. Tự gõ tên đăng nhập, mật khẩu.
3. Tự bấm nút.
4. Tự so sánh kết quả thực tế với kết quả mong đợi, rồi báo pass hay fail.

Viết một lần, chạy được hàng nghìn lần, vào lúc 2 giờ sáng cũng được, không bao giờ "mỏi tay" hay bỏ sót bước.

> Một bộ test tự động có thể kiểm tra 300 test case trong 15 phút. Làm thủ công, một người có thể mất cả tuần.

## Automation Tester cần biết gì?

Để viết được những chương trình như vậy, bạn cần học:

- **Một ngôn ngữ lập trình**: ở đây là **Java**, ngôn ngữ phổ biến nhất trong các tin tuyển dụng automation tester ở Việt Nam.
- **Selenium**: thư viện giúp Java điều khiển trình duyệt.
- **JUnit**: công cụ để viết và chạy test, rồi báo pass/fail.
- **Cucumber**: viết kịch bản test bằng câu chữ gần với ngôn ngữ tự nhiên.
- Cùng vài công cụ phụ trợ như Maven, Git, Allure. Đến lúc cần, sách sẽ giới thiệu từng cái.

Nghe có vẻ nhiều, nhưng mỗi thứ sẽ được dạy từng chút một, theo đúng thứ tự.
