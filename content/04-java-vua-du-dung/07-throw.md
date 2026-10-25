---
title: "throw: tự báo sự cố"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(giaSauGiam(500000, 10));
          System.out.println(giaSauGiam(500000, 150));
          System.out.println("Kết thúc");
      }

      static int giaSauGiam(int gia, int phanTram) {
          // Kiểm tra tham số, ném IllegalArgumentException nếu không hợp lệ

          return gia - gia * phanTram / 100;
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(giaSauGiam(500000, 10));
          try {
              System.out.println(giaSauGiam(500000, 150));
          } catch (IllegalArgumentException e) {
              System.out.println("Lỗi: " + e.getMessage());
          }
          System.out.println("Kết thúc");
      }

      static int giaSauGiam(int gia, int phanTram) {
          if (gia < 0) {
              throw new IllegalArgumentException("Giá không được âm");
          }
          if (phanTram < 0 || phanTram > 100) {
              throw new IllegalArgumentException("Phần trăm giảm phải từ 0 đến 100");
          }
          return gia - gia * phanTram / 100;
      }
  }
checks: |
  eq("ok", () -> call("giaSauGiam", 200000, 25), 150000, "giaSauGiam(200000, 25)");
  eq("edge", () -> call("giaSauGiam", 200000, 100), 0, "giaSauGiam(200000, 100)");
  throwsEx("high", () -> call("giaSauGiam", 200000, 101), "IllegalArgumentException", "giaSauGiam(200000, 101)");
  throwsEx("low", () -> call("giaSauGiam", 200000, -5), "IllegalArgumentException", "giaSauGiam(200000, -5)");
  throwsEx("neg", () -> call("giaSauGiam", -1, 10), "IllegalArgumentException", "giaSauGiam(-1, 10)");
  ok("msg", () -> { try { call("giaSauGiam", 100, 200); return false; } catch (IllegalArgumentException e) { return "Phần trăm giảm phải từ 0 đến 100".equals(e.getMessage()); } }, "Message khi phần trăm sai phải là: Phần trăm giảm phải từ 0 đến 100");
  ok("msg2", () -> { try { call("giaSauGiam", -100, 10); return false; } catch (IllegalArgumentException e) { return "Giá không được âm".equals(e.getMessage()); } }, "Message khi giá âm phải là: Giá không được âm");
tests:
  - text: 'Tham số hợp lệ vẫn tính đúng: `giaSauGiam(200000, 25)` → `150000`'
    java: ok
  - text: 'Giảm đúng `100%` vẫn hợp lệ → `0`'
    java: edge
  - text: 'Phần trăm trên 100 → ném `IllegalArgumentException`'
    java: high
  - text: 'Phần trăm âm → ném `IllegalArgumentException`'
    java: low
  - text: 'Giá âm → ném `IllegalArgumentException`'
    java: neg
  - text: 'Message đúng: `Phần trăm giảm phải từ 0 đến 100`'
    java: msg
  - text: 'Message đúng: `Giá không được âm`'
    java: msg2
  - text: '`main` bắt lỗi và in ra `450000`, `Lỗi: Phần trăm giảm phải từ 0 đến 100`, `Kết thúc`'
    stdout: { equals: "450000\nLỗi: Phần trăm giảm phải từ 0 đến 100\nKết thúc" }
hints:
  - 'Ném exception: `throw new IllegalArgumentException("Giá không được âm");`. Sau `throw`, method dừng ngay, không chạy tới `return`.'
  - 'Phần trăm không hợp lệ khi `phanTram < 0 || phanTram > 100`.'
  - 'Trong `main`, bọc lời gọi `giaSauGiam(500000, 150)` bằng `try { ... } catch (IllegalArgumentException e) { System.out.println("Lỗi: " + e.getMessage()); }`'
---

Trang trước bạn **bắt** exception do Java ném ra. Giờ đến lượt bạn **tự ném**. Khi nào? Khi method nhận vào dữ liệu vô lý mà không thể làm tiếp được.

`giaSauGiam(500000, 150)` nghĩa là giảm 150%: cửa hàng phải trả ngược tiền cho khách! Code hiện tại vẫn vui vẻ trả về `-250000`. Một kết quả sai mà không ai hay biết là thứ tệ nhất có thể xảy ra.

## Ném exception bằng `throw`

```java
static int giaSauGiam(int gia, int phanTram) {
    if (phanTram < 0 || phanTram > 100) {
        throw new IllegalArgumentException("Phần trăm giảm phải từ 0 đến 100");
    }
    return gia - gia * phanTram / 100;
}
```

- `new IllegalArgumentException("...")`: tạo một object exception (đúng vậy, exception cũng là object!) kèm thông điệp mô tả sự cố.
- `throw`: ném nó ra. Method **dừng ngay**, không chạy tới `return`.
- Nơi gọi method sẽ nhận exception này. Nếu không ai `catch`, chương trình dừng và in stack trace kèm thông điệp của bạn.

`IllegalArgumentException` là exception có sẵn của Java, nghĩa là "tham số không hợp lệ". Hãy luôn viết **thông điệp rõ ràng**: người đọc stack trace sẽ cảm ơn bạn.

## Nguyên tắc "fail fast"

Phát hiện sai **càng sớm càng tốt**, và báo **càng to càng tốt**. Đây cũng là triết lý của automation test:

- Setter ở chương 3 lặng lẽ bỏ qua giá âm. Giờ bạn có thể làm tốt hơn: ném exception để người gọi biết ngay là họ sai.
- Hàm đọc dữ liệu test thấy dữ liệu hỏng? Ném exception với thông điệp chỉ rõ dòng nào hỏng, thay vì chạy tiếp với dữ liệu sai.

## Tester kiểm tra cả trường hợp "phải lỗi"

Nhìn danh sách **Bài kiểm tra** bên dưới: có tới 5 test kiểm tra rằng method **ném lỗi đúng lúc**. Ở chương JUnit, bạn sẽ viết những test như vậy bằng `assertThatThrownBy(...)`. Một method không báo lỗi khi nhận dữ liệu sai cũng là một bug!

## Đến lượt bạn

1. Trong `giaSauGiam(gia, phanTram)`:
   - `gia < 0` → ném `IllegalArgumentException` với message `Giá không được âm`.
   - `phanTram` nhỏ hơn 0 hoặc lớn hơn 100 → ném `IllegalArgumentException` với message `Phần trăm giảm phải từ 0 đến 100`.
2. Trong `main`, bọc lời gọi `giaSauGiam(500000, 150)` bằng `try / catch`, in `Lỗi: ` + message. Chương trình phải chạy tới dòng `Kết thúc`:

```
450000
Lỗi: Phần trăm giảm phải từ 0 đến 100
Kết thúc
```
