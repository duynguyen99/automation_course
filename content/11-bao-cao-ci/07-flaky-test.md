---
title: "Flaky test: lúc xanh lúc đỏ, và chiến lược chạy lại"
type: read
minutes: 8
---

Có một loại test khiến cả đội mất niềm tin vào automation: chạy lần 1 **fail**, bấm chạy lại **pass**, không ai sửa gì cả. Đó là **flaky test** (test "chập chờn").

Nguy hiểm nhất của flaky test không phải là nó fail, mà là mọi người **quen** với việc nó fail. Dần dần, khi có bug thật làm test đỏ, ai cũng nghĩ "chắc lại chập chờn thôi, chạy lại đi". Bộ test mất hết giá trị.

## Vì sao test bị flaky?

| Nguyên nhân | Ví dụ ở Tiệm Trà Mộc | Cách chữa |
|---|---|---|
| **Chờ không đúng cách** | Tìm `#welcome` ngay sau khi bấm đăng nhập, trong khi trang cần 0,6 giây mới chuyển | Explicit wait với điều kiện cụ thể. Không `Thread.sleep` |
| **Dữ liệu dùng chung** | Hai test cùng sửa giỏ hàng của tài khoản `lan` | Mỗi test tự tạo dữ liệu riêng, tự dọn sau khi chạy |
| **Phụ thuộc thứ tự** | Test "thanh toán" chỉ pass nếu test "thêm vào giỏ" chạy trước | Mỗi test tự chuẩn bị đủ bối cảnh (`@BeforeEach`, `Background`) |
| **Locator mong manh** | XPath tuyệt đối `/html/body/div[2]/div[3]/button` | Dùng `id`, `data-*`, CSS ngắn gọn |
| **Kích thước màn hình** | Headless mặc định cửa sổ nhỏ, menu bị thu gọn | Đặt `--window-size` cố định |
| **Môi trường** | Server test chậm vào giờ cao điểm, mạng chập chờn | Timeout hợp lý, báo cho đội hạ tầng |
| **Hiệu ứng, animation** | Bấm nút khi popup còn đang trượt vào | Chờ `elementToBeClickable` |

Phần lớn flaky test trong UI automation đến từ **hàng đầu tiên**: chờ sai cách.

## Chiến lược xử lý

**1. Tìm nguyên nhân gốc trước tiên.** Xem ảnh chụp màn hình lúc fail, đọc thông báo lỗi. `NoSuchElementException` ngay sau một thao tác thường là thiếu wait. `StaleElementReferenceException` nghĩa là trang đã vẽ lại phần tử, cần tìm lại phần tử.

**2. Cách ly (*quarantine*).** Nếu chưa sửa được ngay, gắn tag (ví dụ `@flaky`) và tạm loại khỏi bộ chạy chính, kèm một ticket Jira để theo dõi. Đừng để nó làm đỏ CI của cả đội mỗi ngày.

**3. Chạy lại tự động (*retry*), nhưng là phương án cuối.** Các công cụ đều hỗ trợ:

| Công cụ | Cách chạy lại test fail |
|---|---|
| Maven Surefire | `mvn test -Dsurefire.rerunFailingTestsCount=2` (chạy lại tối đa 2 lần) |
| Cucumber | Plugin `rerun:target/rerun.txt` ghi lại Scenario fail, lần chạy sau chỉ chạy file đó |
| TestNG | Class cài đặt `IRetryAnalyzer`, gắn vào `@Test(retryAnalyzer = ...)` |

> **Retry là thuốc giảm đau, không phải thuốc chữa bệnh.** Nó giúp CI bớt đỏ vì lý do môi trường, nhưng cũng có thể che giấu bug thật (ví dụ bug chỉ xảy ra 1/3 số lần). Nếu dùng retry, hãy để báo cáo vẫn đánh dấu những test "pass ở lần chạy lại" để còn theo dõi.

## Khi phỏng vấn

"Bạn xử lý flaky test thế nào?" là câu hỏi rất hay gặp. Một câu trả lời tốt có ba ý:

1. Tìm nguyên nhân: thường là wait, dữ liệu, thứ tự, môi trường.
2. Sửa tận gốc: explicit wait, dữ liệu độc lập, locator ổn định.
3. Retry và quarantine chỉ là biện pháp tạm thời, có theo dõi.
