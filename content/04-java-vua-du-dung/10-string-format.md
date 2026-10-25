---
title: "String.format: trình bày báo cáo"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(dongKetQua("Đăng nhập đúng", 1240));
          System.out.println(dongKetQua("Thêm vào giỏ hàng", 980));
          System.out.println(tomTat(8, 10));
          System.out.println(tomTat(0, 0));
      }

      static String dongKetQua(String tenTest, int thoiGianMs) {
          return tenTest + " " + thoiGianMs + "ms";
      }

      static String tomTat(int soPass, int tong) {
          return soPass + "/" + tong;
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(dongKetQua("Đăng nhập đúng", 1240));
          System.out.println(dongKetQua("Thêm vào giỏ hàng", 980));
          System.out.println(tomTat(8, 10));
          System.out.println(tomTat(0, 0));
      }

      static String dongKetQua(String tenTest, int thoiGianMs) {
          return String.format("%-20s%6d ms", tenTest, thoiGianMs);
      }

      static String tomTat(int soPass, int tong) {
          if (tong == 0) {
              return "Chưa có test nào";
          }
          return String.format("Kết quả: %d/%d test đạt (%d%%)", soPass, tong, soPass * 100 / tong);
      }
  }
checks: |
  eq("row", () -> call("dongKetQua", "Tìm kiếm", 75), "Tìm kiếm                75 ms", "dongKetQua(\"Tìm kiếm\", 75)");
  eq("row2", () -> call("dongKetQua", "Thanh toán thành công", 123456), "Thanh toán thành công123456 ms", "dongKetQua(\"Thanh toán thành công\", 123456)");
  eq("sum", () -> call("tomTat", 3, 4), "Kết quả: 3/4 test đạt (75%)", "tomTat(3, 4)");
  eq("sum2", () -> call("tomTat", 2, 3), "Kết quả: 2/3 test đạt (66%)", "tomTat(2, 3)");
  eq("zero", () -> call("tomTat", 0, 0), "Chưa có test nào", "tomTat(0, 0)");
tests:
  - text: '`dongKetQua("Tìm kiếm", 75)` căn đúng cột: tên rộng 20, số rộng 6'
    java: row
  - text: 'Tên dài hơn 20 ký tự thì không bị cắt'
    java: row2
  - text: '`tomTat(3, 4)` trả về `Kết quả: 3/4 test đạt (75%)`'
    java: sum
  - text: 'Phần trăm làm tròn xuống: `tomTat(2, 3)` → `(66%)`'
    java: sum2
  - text: '`tomTat(0, 0)` trả về `Chưa có test nào` (không chia cho 0)'
    java: zero
  - text: 'Dùng `String.format`'
    source: 'String\.format\s*\('
hints:
  - 'Mẫu cho `dongKetQua`: `String.format("%-20s%6d ms", tenTest, thoiGianMs)`'
  - 'Muốn in dấu `%` thật trong `String.format` thì viết `%%`. Phần trăm: `soPass * 100 / tong`.'
  - 'Kiểm tra `tong == 0` trước, nếu không `soPass * 100 / 0` sẽ ném `ArithmeticException`.'
---

Báo cáo test mà các con số lệch lung tung thì rất khó đọc. Nối chuỗi bằng `+` mãi cũng mỏi tay. **`String.format`** cho bạn viết một **khuôn mẫu** có chỗ trống, rồi điền giá trị vào.

```java
String s = String.format("Test %s chạy hết %d ms", "Đăng nhập", 1240);
// "Test Đăng nhập chạy hết 1240 ms"
```

Mỗi `%...` là một **chỗ trống**, được điền lần lượt bằng các giá trị phía sau.

## Các chỗ trống hay dùng

| Mẫu | Ý nghĩa | Ví dụ | Kết quả |
|---|---|---|---|
| `%s` | chữ (String, hoặc bất cứ thứ gì) | `format("%s", "Chrome")` | `Chrome` |
| `%d` | số nguyên | `format("%d món", 3)` | `3 món` |
| `%%` | dấu `%` thật | `format("%d%%", 80)` | `80%` |
| `%-10s` | chữ, chiếm 10 ô, **căn trái** | `format("[%-6s]", "Hi")` | `[Hi    ]` |
| `%6d` | số, chiếm 6 ô, **căn phải** | `format("[%6d]", 42)` | `[    42]` |

Con số giữa `%` và chữ cái là **độ rộng tối thiểu**. Giá trị ngắn hơn thì được đệm thêm dấu cách; dài hơn thì vẫn giữ nguyên, không bị cắt. Dấu `-` nghĩa là căn trái. Nhờ vậy, các dòng báo cáo thẳng cột với nhau:

```
Đăng nhập đúng        1240 ms
Thêm vào giỏ hàng      980 ms
```

> Có thể bạn sẽ gặp `%.1f` để in số thập phân. Cẩn thận: nó định dạng theo **ngôn ngữ của máy tính**, nên máy cài tiếng Việt có thể in `80,5` thay vì `80.5`. Bài này chỉ dùng số nguyên cho chắc chắn.

## Hai người anh em

- `System.out.printf("%d món%n", 3);`: in thẳng ra Console theo khuôn mẫu. `%n` là xuống dòng.
- `"%d món".formatted(3)`: viết gọn hơn, kết quả giống `String.format`.

## Đến lượt bạn

1. `dongKetQua(tenTest, thoiGianMs)`: dùng mẫu `"%-20s%6d ms"` (tên căn trái rộng 20, số căn phải rộng 6, rồi ` ms`).
2. `tomTat(soPass, tong)`:
   - Nếu `tong` bằng 0: trả về `Chưa có test nào`.
   - Ngược lại: trả về `Kết quả: 8/10 test đạt (80%)`, phần trăm = `soPass * 100 / tong` (chia số nguyên, tự làm tròn xuống).
