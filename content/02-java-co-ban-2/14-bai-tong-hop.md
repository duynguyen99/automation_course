---
title: "Bài tổng hợp: Logic của form đăng nhập"
type: code
minutes: 15
seed: |
  public class Main {
      public static void main(String[] args) {
          // Tự thử method của bạn ở đây
          System.out.println(kiemTraDangNhap("admin", "123456"));
          System.out.println(kiemTraDangNhap("", "123456"));
      }

      static String kiemTraDangNhap(String taiKhoan, String matKhau) {
          // Viết logic ở đây
          return "";
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(kiemTraDangNhap("admin", "123456"));
          System.out.println(kiemTraDangNhap("", "123456"));
      }

      static String kiemTraDangNhap(String taiKhoan, String matKhau) {
          String tk = taiKhoan.trim();
          if (tk.isEmpty()) {
              return "Vui lòng nhập tài khoản";
          }
          if (matKhau.length() < 6) {
              return "Mật khẩu phải có ít nhất 6 ký tự";
          }
          if (tk.equals("admin") && matKhau.equals("123456")) {
              return "Đăng nhập thành công";
          }
          return "Sai tài khoản hoặc mật khẩu";
      }
  }
checks: |
  eq("ok", () -> call("kiemTraDangNhap", "admin", "123456"), "Đăng nhập thành công", "kiemTraDangNhap(\"admin\", \"123456\")");
  eq("empty", () -> call("kiemTraDangNhap", "", "123456"), "Vui lòng nhập tài khoản", "kiemTraDangNhap(\"\", \"123456\")");
  eq("spaces", () -> call("kiemTraDangNhap", "   ", "123456"), "Vui lòng nhập tài khoản", "kiemTraDangNhap(\"   \", \"123456\")");
  eq("short", () -> call("kiemTraDangNhap", "admin", "123"), "Mật khẩu phải có ít nhất 6 ký tự", "kiemTraDangNhap(\"admin\", \"123\")");
  eq("wrong", () -> call("kiemTraDangNhap", "admin", "654321"), "Sai tài khoản hoặc mật khẩu", "kiemTraDangNhap(\"admin\", \"654321\")");
  eq("user", () -> call("kiemTraDangNhap", "lan", "123456"), "Sai tài khoản hoặc mật khẩu", "kiemTraDangNhap(\"lan\", \"123456\")");
  eq("trim", () -> call("kiemTraDangNhap", " admin ", "123456"), "Đăng nhập thành công", "kiemTraDangNhap(\" admin \", \"123456\")");
  eq("order", () -> call("kiemTraDangNhap", "", "1"), "Vui lòng nhập tài khoản", "kiemTraDangNhap(\"\", \"1\")");
tests:
  - text: 'Đúng tài khoản `admin` và mật khẩu `123456` → `Đăng nhập thành công`'
    java: ok
  - text: 'Tài khoản rỗng → `Vui lòng nhập tài khoản`'
    java: empty
  - text: 'Tài khoản chỉ toàn dấu cách cũng coi là rỗng'
    java: spaces
  - text: 'Mật khẩu dưới 6 ký tự → `Mật khẩu phải có ít nhất 6 ký tự`'
    java: short
  - text: 'Sai mật khẩu → `Sai tài khoản hoặc mật khẩu`'
    java: wrong
  - text: 'Sai tài khoản → `Sai tài khoản hoặc mật khẩu`'
    java: user
  - text: 'Tài khoản có dấu cách thừa hai đầu (`" admin "`) vẫn đăng nhập được'
    java: trim
  - text: 'Vừa rỗng tài khoản vừa mật khẩu ngắn thì báo lỗi tài khoản trước'
    java: order
hints:
  - 'Kiểm tra theo đúng thứ tự trong bảng. Gặp lỗi thì `return` ngay, các dòng phía sau sẽ không chạy nữa.'
  - 'Bỏ dấu cách bằng `trim()` trước khi kiểm tra rỗng: `taiKhoan.trim().isEmpty()`'
  - 'So sánh String bằng `equals`, kết hợp hai điều kiện bằng `&&`.'
---

Bài cuối chương, và cũng là bài "thật" nhất cho tới giờ. Mọi website đều có form đăng nhập, và bạn sẽ test nó **rất** nhiều lần trong sự nghiệp. Lần này bạn đứng ở phía bên kia: tự viết **logic** của form, để hiểu vì sao tester phải thử nhiều trường hợp như vậy.

## Quy tắc

Method `kiemTraDangNhap(taiKhoan, matKhau)` kiểm tra **theo đúng thứ tự** sau và trả về thông báo **đầu tiên** gặp phải:

| Thứ tự | Trường hợp | Trả về |
|---|---|---|
| 1 | Tài khoản rỗng (sau khi bỏ dấu cách hai đầu) | `Vui lòng nhập tài khoản` |
| 2 | Mật khẩu ngắn hơn 6 ký tự | `Mật khẩu phải có ít nhất 6 ký tự` |
| 3 | Tài khoản là `admin` **và** mật khẩu là `123456` | `Đăng nhập thành công` |
| 4 | Còn lại | `Sai tài khoản hoặc mật khẩu` |

Tài khoản được bỏ dấu cách hai đầu trước khi kiểm tra, nên `" admin "` cũng đăng nhập được.

## Tư duy của tester

Hãy nhìn danh sách **Bài kiểm tra** bên dưới. Có tới 8 trường hợp cho một form chỉ có hai ô nhập! Đó chính là cách tester nghĩ: không chỉ thử trường hợp "đẹp", mà còn thử ô trống, toàn dấu cách, dữ liệu sát giới hạn, nhiều lỗi cùng lúc...

Mẹo: dùng `main` để tự gọi method với nhiều giá trị khác nhau và xem kết quả trước khi bấm kiểm tra.

> Hoàn thành bài này, bạn đã đi qua toàn bộ phần **Java cơ bản**. Chương tiếp theo sẽ học cách tổ chức code bằng class và object, nền móng để viết Page Object Model sau này.
