---
title: "try / catch: bắt lấy sự cố"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          String[] oSoLuong = {"2", " 5 ", "abc", "3"};
          for (String text : oSoLuong) {
              System.out.println("Số lượng: " + docSoLuong(text));
          }
      }

      static int docSoLuong(String text) {
          // Bọc dòng dưới bằng try / catch
          return Integer.parseInt(text.trim());
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String[] oSoLuong = {"2", " 5 ", "abc", "3"};
          for (String text : oSoLuong) {
              System.out.println("Số lượng: " + docSoLuong(text));
          }
      }

      static int docSoLuong(String text) {
          try {
              return Integer.parseInt(text.trim());
          } catch (NumberFormatException e) {
              System.out.println("Không đọc được: " + text);
              return 0;
          }
      }
  }
checks: |
  eq("num", () -> call("docSoLuong", "12"), 12, "docSoLuong(\"12\")");
  eq("trim", () -> call("docSoLuong", "  7 "), 7, "docSoLuong(\"  7 \")");
  eq("bad", () -> call("docSoLuong", "hai"), 0, "docSoLuong(\"hai\")");
  eq("blank", () -> call("docSoLuong", ""), 0, "docSoLuong(\"\") với ô trống");
tests:
  - text: '`docSoLuong("12")` trả về `12`'
    java: num
  - text: 'Bỏ dấu cách thừa: `docSoLuong("  7 ")` trả về `7`'
    java: trim
  - text: 'Chữ không phải số → trả về `0`, không làm chương trình dừng'
    java: bad
  - text: 'Ô trống → trả về `0`'
    java: blank
  - text: 'Bắt đúng `NumberFormatException`'
    source: 'catch\s*\(\s*NumberFormatException\s+\w+\s*\)'
  - text: 'Console in đủ 5 dòng, chương trình chạy tới cuối'
    stdout: { equals: "Số lượng: 2\nSố lượng: 5\nKhông đọc được: abc\nSố lượng: 0\nSố lượng: 3" }
hints:
  - 'Cấu trúc: `try { return Integer.parseInt(text.trim()); } catch (NumberFormatException e) { ... }`'
  - 'Trong `catch`: in `"Không đọc được: " + text` rồi `return 0;`'
---

Chạy thử code ban đầu: ô `"abc"` làm chương trình **dừng hẳn**, ô `"3"` phía sau không bao giờ được đọc. Trong một bộ test, điều đó giống như một test lỗi kéo sập cả 200 test còn lại. Ta cần một cách **bắt lấy** sự cố và xử lý nó.

## try / catch

```java
try {
    int soLuong = Integer.parseInt("abc");   // có thể gây sự cố
    System.out.println("Đọc được: " + soLuong);
} catch (NumberFormatException e) {
    System.out.println("Ô số lượng không hợp lệ");
}
System.out.println("Chương trình chạy tiếp");
```

- `try { ... }`: "thử làm" đoạn code có thể gây sự cố.
- `catch (NumberFormatException e) { ... }`: nếu **đúng loại** sự cố đó xảy ra, nhảy vào đây xử lý. `e` là object exception, chứa thông tin về sự cố.
- Sau đó chương trình **chạy tiếp bình thường**.

## Luồng chạy

| Trường hợp | Điều gì xảy ra |
|---|---|
| Không có sự cố | chạy hết `try`, **bỏ qua** `catch` |
| Có sự cố ở giữa `try` | các dòng còn lại trong `try` bị **bỏ qua**, nhảy ngay vào `catch` |

Với ví dụ trên, dòng `"Đọc được: ..."` không được in, vì sự cố xảy ra ở dòng ngay trước nó.

## Lấy thông tin từ exception

```java
catch (NumberFormatException e) {
    System.out.println("Lỗi: " + e.getMessage());
    // Lỗi: For input string: "abc"
}
```

`e.getMessage()` trả về **thông điệp** của sự cố. Rất hữu ích khi ghi log hay báo cáo test.

> Chỉ bắt những exception bạn **biết cách xử lý**. Bắt mọi thứ rồi lờ đi (`catch (Exception e) { }` với thân rỗng) là thói quen rất xấu: lỗi vẫn còn đó, chỉ là bạn không nhìn thấy nữa. Với tester, một lỗi bị giấu đi còn nguy hiểm hơn lỗi lộ ra.

## Đến lượt bạn

Ô "số lượng" trong giỏ hàng là chữ do người dùng gõ. Sửa `docSoLuong(text)`:

1. Bỏ dấu cách hai đầu rồi đổi thành số bằng `Integer.parseInt`.
2. Nếu xảy ra `NumberFormatException`: in `Không đọc được: ` + text, rồi trả về `0`.

```
Số lượng: 2
Số lượng: 5
Không đọc được: abc
Số lượng: 0
Số lượng: 3
```

(Dòng "Không đọc được" in ra **trước** "Số lượng: 0", vì Java phải chạy xong `docSoLuong` mới có số để nối vào chuỗi.)
