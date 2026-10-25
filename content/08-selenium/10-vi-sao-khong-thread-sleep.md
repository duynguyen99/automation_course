---
title: "Vì sao không dùng Thread.sleep? Implicit hay explicit wait?"
type: quiz
minutes: 7
questions:
  - q: "Trang mất từ 2 đến 4 giây để hiện kết quả. Viết `Thread.sleep(3000)` thì sao?"
    options:
      - "Luôn ổn, vì 3 giây là trung bình"
      - "Lúc trang chậm 4 giây test sẽ fail, lúc trang nhanh 2 giây thì phí 1 giây"
      - "Selenium tự hiểu và chờ đúng thời gian cần thiết"
    answer: 1
    explain: "`Thread.sleep` chờ một khoảng cố định, không quan tâm trang đã sẵn sàng hay chưa. Vừa chậm, vừa chập chờn."
  - q: "`new WebDriverWait(driver, Duration.ofSeconds(10))` và phần tử hiện ra sau 1 giây. Code chờ bao lâu?"
    options:
      - "Khoảng 1 giây"
      - "Đúng 10 giây"
      - "11 giây"
    answer: 0
    explain: "Explicit wait dừng chờ ngay khi điều kiện đúng. 10 giây chỉ là thời gian tối đa."
  - q: "Hết thời gian chờ mà điều kiện vẫn chưa đúng, `wait.until(...)` làm gì?"
    options:
      - "Trả về `null` và chạy tiếp"
      - "Ném `TimeoutException`, test fail"
      - "Chờ thêm 10 giây nữa"
    answer: 1
    explain: "Test fail rõ ràng với thông báo chờ điều kiện gì, bao lâu. Rất dễ điều tra."
  - q: "Vì sao không nên dùng chung implicit wait và explicit wait trong một dự án?"
    options:
      - "Vì code sẽ không biên dịch được"
      - "Vì thời gian chờ có thể cộng dồn khó đoán, test chậm và khó hiểu"
      - "Vì explicit wait sẽ bị tắt"
    answer: 1
    explain: "Tài liệu chính thức của Selenium khuyên không trộn hai loại. Hãy chọn explicit wait."
  - q: "Muốn chờ nút \"Xác nhận\" đang bị khóa trở nên bấm được, dùng điều kiện nào?"
    options:
      - "`ExpectedConditions.visibilityOfElementLocated`"
      - "`ExpectedConditions.elementToBeClickable`"
      - "`ExpectedConditions.alertIsPresent`"
    answer: 1
    explain: "Nút bị khóa vẫn hiển thị, nên chờ visibility là chưa đủ. Phải chờ nó bấm được (hiện và đang bật)."
---

Bài trước bạn đã dùng `WebDriverWait`. Nhưng trên mạng, bạn sẽ thấy rất nhiều code kiểu này:

```java
driver.findElement(By.id("load-btn")).click();
Thread.sleep(3000);   // ngủ 3 giây cho chắc
```

## Thread.sleep: chờ "mù"

`Thread.sleep(3000)` bắt chương trình **ngủ đúng 3 giây**, bất kể trang đã sẵn sàng hay chưa. Giống như hẹn bạn đi cà phê mà không nhắn tin, cứ đứng chờ trước cửa đúng 30 phút rồi về:

- Trang nhanh (1 giây)? Bạn **phí** 2 giây. Nhân với 500 test case, mỗi lần chạy mất thêm gần 17 phút.
- Trang chậm (4 giây, ví dụ máy chủ test đang bận)? Test **fail**, dù ứng dụng không hề có bug.

Kết quả là bộ test vừa chậm vừa **flaky**, và cả team mất dần niềm tin vào automation. Trong dự án thật, `Thread.sleep` gần như luôn bị từ chối khi review code.

## Implicit wait: chờ ngầm cho mọi lệnh tìm

Selenium còn một kiểu chờ nữa:

```java
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
```

**Implicit wait** (chờ ngầm) cài một lần cho cả driver: mỗi khi `findElement` không thấy phần tử, Selenium sẽ thử lại tới 10 giây. Nghe tiện, nhưng:

- Nó **chỉ** chờ phần tử **có mặt** trong HTML. Nó không chờ phần tử hiện ra, không chờ nút hết bị khóa, không chờ chữ thay đổi. Ở `dynamic.html`, `#result` có sẵn trong HTML từ đầu (chỉ bị ẩn), nên implicit wait không giúp gì cả!
- Khi trộn với explicit wait, hai khoảng chờ có thể **chồng lên nhau** và cho ra thời gian chờ khó đoán.
- `findElements` dùng để kiểm tra "không có phần tử" cũng sẽ bị chậm mất 10 giây.

## So sánh nhanh

| | `Thread.sleep` | Implicit wait | Explicit wait (`WebDriverWait`) |
|---|---|---|---|
| Chờ điều gì | Không gì cả, ngủ cố định | Phần tử có trong HTML | **Bất kỳ điều kiện nào bạn chọn** |
| Dừng sớm khi xong? | Không | Có | Có |
| Khuyên dùng? | Không | Không trộn với explicit | **Có** |

> Quy tắc của khóa học (và của hầu hết các team chuyên nghiệp): **chỉ dùng explicit wait**. Sau thao tác nào làm trang thay đổi (bấm nút, chuyển trang, tải dữ liệu), hãy chờ đúng điều kiện bạn cần.

Trả lời 5 câu hỏi bên dưới để chắc chắn bạn đã nắm vững nhé.
