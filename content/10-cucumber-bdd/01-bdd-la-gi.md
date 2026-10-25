---
title: "BDD là gì? Khi khách hàng cũng đọc được test"
type: read
minutes: 7
---

Hãy tưởng tượng chủ Tiệm Trà Mộc nói với đội phát triển: *"Khách đăng nhập sai thì phải báo lỗi."* Nghe rất rõ ràng, đúng không? Nhưng thử hỏi ba người trong đội:

- Lập trình viên hiểu: hiện chữ đỏ "Lỗi".
- Tester hiểu: hiện câu "Sai tên đăng nhập hoặc mật khẩu", và ô mật khẩu được xóa trắng.
- Chủ tiệm thực ra muốn: báo lỗi, **và** khóa tài khoản sau 5 lần sai.

Ba người, ba cách hiểu. Bug lớn nhất thường không nằm trong code, mà nằm trong **sự hiểu lầm** giữa người với người.

## BDD: thống nhất bằng ví dụ cụ thể

**BDD** (*Behavior-Driven Development*, phát triển hướng hành vi) là cách làm việc trong đó cả đội ngồi lại và mô tả **hành vi** của phần mềm bằng những **ví dụ cụ thể**, viết bằng ngôn ngữ tự nhiên, *trước khi* code. Ví dụ:

```gherkin
Scenario: Đăng nhập sai mật khẩu
  Given tôi đang ở trang đăng nhập
  When tôi đăng nhập với "lan" và "sai123"
  Then tôi thấy thông báo lỗi "Sai tên đăng nhập hoặc mật khẩu"
```

Đọc đoạn trên, chủ tiệm (không biết code) vẫn gật gù: "Đúng rồi, nhưng thêm giúp tôi trường hợp sai 5 lần nhé". Sự hiểu lầm được phát hiện **trước khi** ai đó mất hai ngày code sai.

Điều kỳ diệu: chính đoạn văn đó, nhờ công cụ **Cucumber**, sẽ trở thành **test tự động chạy được**. Tài liệu yêu cầu và test là **một**, nên không bao giờ "lệch pha" nhau.

## "Ba người bạn" (*Three Amigos*)

Trong BDD, mỗi tính năng được bàn bởi ba góc nhìn, gọi vui là **Three Amigos**:

| Vai trò | Câu hỏi họ hay đặt ra |
|---|---|
| **Business** (BA, Product Owner, khách hàng) | Ta cần giải quyết vấn đề gì? Quy tắc kinh doanh là gì? |
| **Developer** (lập trình viên) | Làm thế nào? Có gì khó về kỹ thuật? |
| **Tester** (chính là bạn!) | Nếu... thì sao? Ô trống? Tài khoản bị khóa? Mất mạng giữa chừng? |

Tester có vai trò rất quan trọng ở đây: bạn là người giỏi nghĩ ra **các trường hợp ngoại lệ**. Mỗi câu "nếu... thì sao?" của bạn sẽ trở thành một Scenario mới.

## Vì sao khách hàng đọc được?

Vì kịch bản viết bằng **Gherkin**, một "ngôn ngữ" gần như văn nói, chỉ có vài từ khóa như `Given` (cho trước), `When` (khi), `Then` (thì). Không có dấu chấm phẩy, không có `public static void`. Phần kỹ thuật (Selenium, locator, wait...) được giấu ở tầng dưới, trong các method Java gọi là **step definition**.

```text
 Gherkin (.feature)      ←  khách hàng, BA, tester đọc và viết
        ↓  Cucumber nối từng câu với method Java
 Step definition (Java)  ←  tester automation viết
        ↓
 Page Object, Selenium   ←  điều khiển trình duyệt
```

> **Lưu ý:** Cucumber chỉ là **công cụ**. BDD là **cách làm việc**. Nhiều công ty dùng Cucumber nhưng chỉ có tester đọc file `.feature`, như vậy vẫn có ích (test dễ đọc, dễ bảo trì), nhưng chưa phải BDD đầy đủ. Khi phỏng vấn, nói được sự khác nhau này là một điểm cộng lớn.

## Trong chương này

Bạn sẽ đi từ viết kịch bản Gherkin, nối nó với Java, dùng tham số, bảng dữ liệu, hook... cho tới chạy kịch bản trên **trình duyệt thật** với Page Object Model bạn đã học. Cuối chương, bạn sẽ tự viết bộ test cho trang thanh toán của Tiệm Trà Mộc. Bắt đầu thôi!
