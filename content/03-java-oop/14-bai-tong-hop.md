---
title: "Bài tổng hợp: Page object đầu tay"
type: code
minutes: 18
files:
  - name: Page.java
    readonly: true
    content: |
      public interface Page {
          String title();
      }
  - name: LoginPage.java
    content: |
      public class LoginPage {
          // 1. implements Page
          // 2. Hai thuộc tính private: username và password (mặc định "")
          // 3. Viết thân cho các method bên dưới

          public String title() {
              return "";
          }

          public LoginPage enterUsername(String username) {
              return this;
          }

          public LoginPage enterPassword(String password) {
              return this;
          }

          public String submit() {
              return "";
          }
      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              String[] ketQua = {
                  kiemTra("Tiêu đề trang", new LoginPage().title(), "Đăng nhập - Tiệm Trà Mộc"),
                  kiemTra("Đăng nhập đúng",
                          new LoginPage().enterUsername("lan").enterPassword("matkhau123").submit(),
                          "Xin chào, Lan"),
                  kiemTra("Sai mật khẩu",
                          new LoginPage().enterUsername("lan").enterPassword("123456").submit(),
                          "Sai tên đăng nhập hoặc mật khẩu"),
                  kiemTra("Bỏ trống tên đăng nhập",
                          new LoginPage().enterPassword("matkhau123").submit(),
                          "Vui lòng nhập tên đăng nhập"),
                  kiemTra("Tài khoản bị khóa",
                          new LoginPage().enterUsername("khoa").enterPassword("matkhau123").submit(),
                          "Tài khoản của bạn đã bị khóa")
              };
              // In từng kết quả, đếm số PASS, rồi in dòng tổng kết

          }

          static String kiemTra(String tenTest, String thucTe, String mongDoi) {
              // Viết logic so sánh ở đây
              return "";
          }
      }
solution:
  LoginPage.java: |
    public class LoginPage implements Page {
        private String username = "";
        private String password = "";

        @Override
        public String title() {
            return "Đăng nhập - Tiệm Trà Mộc";
        }

        public LoginPage enterUsername(String username) {
            this.username = username;
            return this;
        }

        public LoginPage enterPassword(String password) {
            this.password = password;
            return this;
        }

        public String submit() {
            if (username.isEmpty()) {
                return "Vui lòng nhập tên đăng nhập";
            }
            if (password.isEmpty()) {
                return "Vui lòng nhập mật khẩu";
            }
            if (username.equals("khoa") && password.equals("matkhau123")) {
                return "Tài khoản của bạn đã bị khóa";
            }
            if (username.equals("lan") && password.equals("matkhau123")) {
                return "Xin chào, Lan";
            }
            return "Sai tên đăng nhập hoặc mật khẩu";
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            String[] ketQua = {
                kiemTra("Tiêu đề trang", new LoginPage().title(), "Đăng nhập - Tiệm Trà Mộc"),
                kiemTra("Đăng nhập đúng",
                        new LoginPage().enterUsername("lan").enterPassword("matkhau123").submit(),
                        "Xin chào, Lan"),
                kiemTra("Sai mật khẩu",
                        new LoginPage().enterUsername("lan").enterPassword("123456").submit(),
                        "Sai tên đăng nhập hoặc mật khẩu"),
                kiemTra("Bỏ trống tên đăng nhập",
                        new LoginPage().enterPassword("matkhau123").submit(),
                        "Vui lòng nhập tên đăng nhập"),
                kiemTra("Tài khoản bị khóa",
                        new LoginPage().enterUsername("khoa").enterPassword("matkhau123").submit(),
                        "Tài khoản của bạn đã bị khóa")
            };
            int soPass = 0;
            for (String kq : ketQua) {
                System.out.println(kq);
                if (kq.startsWith("PASS")) {
                    soPass++;
                }
            }
            System.out.println("Kết quả: " + soPass + "/" + ketQua.length + " test PASS");
        }

        static String kiemTra(String tenTest, String thucTe, String mongDoi) {
            if (thucTe.equals(mongDoi)) {
                return "PASS: " + tenTest;
            }
            return "FAIL: " + tenTest + " (mong đợi \"" + mongDoi + "\", thực tế \"" + thucTe + "\")";
        }
    }
checks: |
  ok("page", () -> extendsClass("LoginPage", "Page") && "Đăng nhập - Tiệm Trà Mộc".equals(callOn(newObj("LoginPage"), "title")), "LoginPage phải implements Page và title() trả về \"Đăng nhập - Tiệm Trà Mộc\"");
  ok("priv", () -> fieldIsPrivate("LoginPage", "username") && fieldIsPrivate("LoginPage", "password"), "username và password phải là thuộc tính private");
  ok("self", () -> { Object p = newObj("LoginPage"); return callOn(p, "enterUsername", "lan") == p && callOn(p, "enterPassword", "x") == p; }, "enterUsername và enterPassword phải return this");
  eq("nopass", () -> { Object p = newObj("LoginPage"); callOn(p, "enterUsername", "lan"); return callOn(p, "submit"); }, "Vui lòng nhập mật khẩu", "submit() khi bỏ trống mật khẩu");
  eq("nouser", () -> callOn(newObj("LoginPage"), "submit"), "Vui lòng nhập tên đăng nhập", "submit() khi bỏ trống cả hai ô");
  eq("other", () -> { Object p = newObj("LoginPage"); callOn(p, "enterUsername", "mai"); callOn(p, "enterPassword", "matkhau123"); return callOn(p, "submit"); }, "Sai tên đăng nhập hoặc mật khẩu", "submit() với tài khoản mai / matkhau123");
  eq("lockedwrong", () -> { Object p = newObj("LoginPage"); callOn(p, "enterUsername", "khoa"); callOn(p, "enterPassword", "sai"); return callOn(p, "submit"); }, "Sai tên đăng nhập hoặc mật khẩu", "submit() với khoa / sai");
  eq("pass", () -> call("kiemTra", "Mở trang", "abc", "abc"), "PASS: Mở trang", "kiemTra(\"Mở trang\", \"abc\", \"abc\")");
  eq("fail", () -> call("kiemTra", "Giỏ hàng", "2 món", "3 món"), "FAIL: Giỏ hàng (mong đợi \"3 món\", thực tế \"2 món\")", "kiemTra(\"Giỏ hàng\", \"2 món\", \"3 món\")");
tests:
  - text: '`LoginPage` implements `Page`, `title()` trả về `Đăng nhập - Tiệm Trà Mộc`'
    java: page
  - text: '`username` và `password` là `private`'
    java: priv
  - text: '`enterUsername` và `enterPassword` trả về chính object (gọi nối tiếp được)'
    java: self
  - text: 'Bỏ trống mật khẩu → `Vui lòng nhập mật khẩu`'
    java: nopass
  - text: 'Bỏ trống cả hai → báo lỗi tên đăng nhập trước'
    java: nouser
  - text: 'Tài khoản không tồn tại (`mai`) → `Sai tên đăng nhập hoặc mật khẩu`'
    java: other
  - text: '`khoa` nhập sai mật khẩu → `Sai tên đăng nhập hoặc mật khẩu` (chưa được biết là bị khóa)'
    java: lockedwrong
  - text: '`kiemTra` trả về `PASS: <tên>` khi khớp'
    java: pass
  - text: '`kiemTra` trả về `FAIL: <tên> (mong đợi "...", thực tế "...")` khi không khớp'
    java: fail
  - text: 'Console in 5 dòng PASS và dòng `Kết quả: 5/5 test PASS`'
    stdout: { equals: "PASS: Tiêu đề trang\nPASS: Đăng nhập đúng\nPASS: Sai mật khẩu\nPASS: Bỏ trống tên đăng nhập\nPASS: Tài khoản bị khóa\nKết quả: 5/5 test PASS" }
hints:
  - 'Làm `LoginPage` trước: `public class LoginPage implements Page`, hai thuộc tính `private String username = "";`, thêm `public String title()`. Trong hai method enter, nhớ `this.username = username;`.'
  - '`submit()` kiểm tra theo đúng thứ tự trong bảng, gặp trường hợp nào thì `return` ngay. Tên rỗng: `username.isEmpty()`.'
  - 'Chuỗi FAIL có dấu ngoặc kép bên trong, viết bằng `\"`: `"FAIL: " + tenTest + " (mong đợi \"" + mongDoi + "\", thực tế \"" + thucTe + "\")"`. Đếm PASS bằng `kq.startsWith("PASS")`.'
---

Bài cuối chương, bạn sẽ ghép mọi thứ lại thành một mô hình thu nhỏ của **Page Object Model**, đúng cấu trúc mà các dự án automation thật đang dùng. Chưa có trình duyệt, nhưng tư duy thì y hệt:

- `Page` (interface): hợp đồng chung của mọi trang.
- `LoginPage` (class): một "page object", giấu dữ liệu bên trong và mở ra các hành động.
- `Main`: đóng vai bộ test, gọi page object rồi so sánh thực tế với mong đợi.

## Quy tắc của trang đăng nhập

Giống trang `login.html` của Tiệm Trà Mộc. Method `submit()` kiểm tra **theo đúng thứ tự** và trả về thông báo **đầu tiên** gặp phải:

| Thứ tự | Trường hợp | `submit()` trả về |
|---|---|---|
| 1 | Tên đăng nhập rỗng | `Vui lòng nhập tên đăng nhập` |
| 2 | Mật khẩu rỗng | `Vui lòng nhập mật khẩu` |
| 3 | `khoa` / `matkhau123` | `Tài khoản của bạn đã bị khóa` |
| 4 | `lan` / `matkhau123` | `Xin chào, Lan` |
| 5 | Còn lại | `Sai tên đăng nhập hoặc mật khẩu` |

`title()` trả về `Đăng nhập - Tiệm Trà Mộc`.

## Việc cần làm

**`LoginPage.java`:**

1. `implements Page` và viết `title()`.
2. Hai thuộc tính `private String username = "";` và `private String password = "";`.
3. `enterUsername`, `enterPassword` lưu giá trị vào thuộc tính rồi `return this`.
4. `submit()` theo bảng trên.

**`Main.java`:**

1. `kiemTra(tenTest, thucTe, mongDoi)`: nếu `thucTe` bằng `mongDoi` thì trả về `PASS: ` + tên test; nếu không thì trả về dạng
   `FAIL: Giỏ hàng (mong đợi "3 món", thực tế "2 món")`.
2. Trong `main`, mảng `ketQua` đã có sẵn 5 test. Duyệt mảng, in từng dòng, đếm số dòng bắt đầu bằng `PASS`, rồi in dòng tổng kết:

```
PASS: Tiêu đề trang
PASS: Đăng nhập đúng
PASS: Sai mật khẩu
PASS: Bỏ trống tên đăng nhập
PASS: Tài khoản bị khóa
Kết quả: 5/5 test PASS
```

> Thử làm sai một chỗ trong `submit()` (ví dụ đổi `Lan` thành `lan`) và chạy lại: bạn sẽ thấy một dòng FAIL với thông báo rõ ràng. Một thông báo FAIL tốt phải cho biết **mong đợi gì** và **thực tế ra sao**, đó là thói quen bạn sẽ giữ suốt nghề tester.

Hoàn thành bài này, bạn đã nắm được bốn trụ cột của OOP: **đóng gói**, **kế thừa**, **đa hình** và **trừu tượng** (interface, abstract class). Chương sau sẽ trang bị những công cụ Java dùng hằng ngày: List, Map, exception...
