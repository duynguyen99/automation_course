---
title: "Hộp đồ nghề của String"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(chuanHoa("  Đăng Nhập  "));
          System.out.println(laEmailHopLe("lan@shop.vn"));
      }

      static String chuanHoa(String text) {
          // Bỏ dấu cách thừa ở hai đầu, rồi đổi thành chữ thường
          return text;
      }

      static boolean laEmailHopLe(String email) {
          // Hợp lệ khi: có chứa "@", không chứa dấu cách, và dài ít nhất 6 ký tự
          return false;
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(chuanHoa("  Đăng Nhập  "));
          System.out.println(laEmailHopLe("lan@shop.vn"));
      }

      static String chuanHoa(String text) {
          return text.trim().toLowerCase();
      }

      static boolean laEmailHopLe(String email) {
          return email.contains("@") && !email.contains(" ") && email.length() >= 6;
      }
  }
checks: |
  eq("t1", () -> call("chuanHoa", "  Đăng Nhập  "), "đăng nhập", "chuanHoa(\"  Đăng Nhập  \")");
  eq("t2", () -> call("chuanHoa", "GIỎ HÀNG"), "giỏ hàng", "chuanHoa(\"GIỎ HÀNG\")");
  eq("t3", () -> call("laEmailHopLe", "lan@shop.vn"), true, "laEmailHopLe(\"lan@shop.vn\")");
  eq("t4", () -> call("laEmailHopLe", "lan.shop.vn"), false, "laEmailHopLe(\"lan.shop.vn\")");
  eq("t5", () -> call("laEmailHopLe", "la n@shop.vn"), false, "laEmailHopLe(\"la n@shop.vn\")");
  eq("t6", () -> call("laEmailHopLe", "a@b.c"), false, "laEmailHopLe(\"a@b.c\")");
tests:
  - text: '`chuanHoa("  Đăng Nhập  ")` trả về `"đăng nhập"`'
    java: t1
  - text: '`chuanHoa("GIỎ HÀNG")` trả về `"giỏ hàng"`'
    java: t2
  - text: '`laEmailHopLe("lan@shop.vn")` trả về `true`'
    java: t3
  - text: 'Thiếu `@` → `false`'
    java: t4
  - text: 'Có dấu cách → `false`'
    java: t5
  - text: 'Ngắn hơn 6 ký tự (`"a@b.c"`) → `false`'
    java: t6
hints:
  - 'Có thể gọi nối tiếp: `text.trim().toLowerCase()`'
  - '"Không chứa dấu cách" là `!email.contains(" ")`'
---

String không chỉ là chữ. Nó còn đi kèm một **hộp đồ nghề** gồm các method có sẵn, gọi bằng dấu chấm: `bien.tenMethod()`. Đây là những món tester dùng nhiều nhất khi kiểm tra nội dung trên trang web:

| Method | Làm gì | Ví dụ với `s = " Xin Chào "` | Kết quả |
|---|---|---|---|
| `length()` | đếm số ký tự | `s.length()` | `10` |
| `trim()` | bỏ dấu cách ở hai đầu | `s.trim()` | `"Xin Chào"` |
| `toLowerCase()` | đổi thành chữ thường | `s.toLowerCase()` | `" xin chào "` |
| `toUpperCase()` | đổi thành chữ hoa | `s.toUpperCase()` | `" XIN CHÀO "` |
| `contains(x)` | có chứa x không | `s.contains("Chào")` | `true` |
| `startsWith(x)` | có bắt đầu bằng x | `s.startsWith("Xin")` | `false` (vì có dấu cách) |
| `replace(a, b)` | thay a bằng b | `s.replace("Chào", "Hi")` | `" Xin Hi "` |
| `isEmpty()` | có rỗng không | `"".isEmpty()` | `true` |

Các method có thể **gọi nối tiếp** nhau, chạy từ trái sang phải:

```java
String tieuDe = "   GIỎ HÀNG (3)   ";
boolean ok = tieuDe.trim().toLowerCase().startsWith("giỏ hàng");   // true
```

> **Lưu ý:** các method này **không sửa** String ban đầu mà trả về một String **mới**. `s.trim();` đứng một mình không có tác dụng gì; phải viết `s = s.trim();` hoặc dùng kết quả ngay.

## Tại sao tester cần chuẩn hóa?

Chữ lấy từ trang web thường dính dấu cách thừa hoặc có chữ hoa chữ thường lung tung do CSS. So sánh trực tiếp sẽ fail oan. Chuẩn hóa trước khi so sánh giúp test **ổn định** hơn.

## Đến lượt bạn

1. `chuanHoa(text)`: bỏ dấu cách hai đầu rồi đổi thành chữ thường.
2. `laEmailHopLe(email)`: trả về `true` khi email **có** `@`, **không có** dấu cách, và dài **ít nhất 6** ký tự.
