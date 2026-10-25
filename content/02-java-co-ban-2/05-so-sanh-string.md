---
title: "So sánh String: luôn dùng equals"
type: code
minutes: 6
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(kiemTraTieuDe("Trang chủ", "Trang chủ"));
      }

      static String kiemTraTieuDe(String thucTe, String mongDoi) {
          // Trả về "PASS" nếu thucTe giống hệt mongDoi, ngược lại trả về "FAIL"
          return "";
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(kiemTraTieuDe("Trang chủ", "Trang chủ"));
      }

      static String kiemTraTieuDe(String thucTe, String mongDoi) {
          if (thucTe.equals(mongDoi)) {
              return "PASS";
          } else {
              return "FAIL";
          }
      }
  }
checks: |
  eq("t1", () -> call("kiemTraTieuDe", "Giỏ hàng", "Giỏ hàng"), "PASS", "kiemTraTieuDe(\"Giỏ hàng\", \"Giỏ hàng\")");
  eq("t2", () -> call("kiemTraTieuDe", "Giỏ hàng", "Giỏ Hàng"), "FAIL", "kiemTraTieuDe(\"Giỏ hàng\", \"Giỏ Hàng\")");
  eq("t3", () -> call("kiemTraTieuDe", new String("Đăng nhập"), "Đăng nhập"), "PASS", "kiemTraTieuDe với hai String được tạo riêng");
tests:
  - text: 'Hai tiêu đề giống nhau → `"PASS"`'
    java: t1
  - text: 'Khác nhau một chữ hoa → `"FAIL"`'
    java: t2
  - text: 'Vẫn đúng khi hai String được tạo ở hai nơi khác nhau (đây là lý do không dùng `==`)'
    java: t3
  - text: 'Dùng `.equals(`'
    source: '\.equals\s*\('
hints:
  - 'Viết: `if (thucTe.equals(mongDoi)) { ... }`'
---

Đây là trang **cực kỳ quan trọng** với tester, vì bạn sẽ so sánh chữ suốt ngày: tiêu đề trang, nội dung thông báo, tên sản phẩm...

## Đừng so sánh String bằng `==`

```java
String a = "Xin chào";
String b = new String("Xin chào");

System.out.println(a == b);        // false  (!!)
System.out.println(a.equals(b));   // true
```

Với String, `==` không so sánh **nội dung**. Nó hỏi "hai biến này có phải **cùng một đối tượng** trong bộ nhớ không?". Hai chuỗi giống hệt nhau vẫn có thể nằm ở hai chỗ khác nhau, nên `==` trả về `false`. Khi viết test Selenium, chữ lấy từ trang web luôn là một String mới, nên `==` gần như **luôn sai**.

> **Quy tắc vàng:** so sánh số dùng `==`, so sánh String dùng `.equals(...)`.

## Một số cách so sánh khác

```java
String tieuDe = "Giỏ Hàng";

tieuDe.equals("Giỏ hàng")             // false (phân biệt hoa thường)
tieuDe.equalsIgnoreCase("giỏ hàng")   // true  (không phân biệt)
!tieuDe.equals("Thanh toán")          // true  (khác nhau)
```

## Đến lượt bạn

Viết method `kiemTraTieuDe` trả về `"PASS"` nếu tiêu đề thực tế **giống hệt** tiêu đề mong đợi (phân biệt hoa thường), ngược lại trả về `"FAIL"`.
