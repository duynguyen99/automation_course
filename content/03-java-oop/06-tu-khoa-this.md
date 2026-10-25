---
title: "Từ khóa this: chính object này"
type: code
minutes: 8
files:
  - name: LoginPage.java
    content: |
      public class LoginPage {
          private String username = "";
          private String password = "";

          public void enterUsername(String username) {
              username = username;
          }

          public void enterPassword(String password) {
              password = password;
          }

          public String submit() {
              if (username.equals("lan") && password.equals("matkhau123")) {
                  return "Xin chào, " + username;
              }
              return "Sai tên đăng nhập hoặc mật khẩu";
          }
      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              LoginPage page = new LoginPage();
              page.enterUsername("lan");
              page.enterPassword("matkhau123");
              System.out.println(page.submit());
          }
      }
solution:
  LoginPage.java: |
    public class LoginPage {
        private String username = "";
        private String password = "";

        public LoginPage enterUsername(String username) {
            this.username = username;
            return this;
        }

        public LoginPage enterPassword(String password) {
            this.password = password;
            return this;
        }

        public String submit() {
            if (username.equals("lan") && password.equals("matkhau123")) {
                return "Xin chào, " + username;
            }
            return "Sai tên đăng nhập hoặc mật khẩu";
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            String msg = new LoginPage()
                    .enterUsername("lan")
                    .enterPassword("matkhau123")
                    .submit();
            System.out.println(msg);
        }
    }
checks: |
  eq("user", () -> { Object p = newObj("LoginPage"); callOn(p, "enterUsername", "khoa"); return field(p, "username"); }, "khoa", "username sau khi gọi enterUsername(\"khoa\")");
  eq("pass", () -> { Object p = newObj("LoginPage"); callOn(p, "enterPassword", "123456"); return field(p, "password"); }, "123456", "password sau khi gọi enterPassword(\"123456\")");
  ok("self", () -> { Object p = newObj("LoginPage"); return callOn(p, "enterUsername", "lan") == p && callOn(p, "enterPassword", "x") == p; }, "enterUsername và enterPassword phải trả về chính object đó (return this;)");
  eq("wrong", () -> { Object p = newObj("LoginPage"); callOn(p, "enterUsername", "lan"); callOn(p, "enterPassword", "sai"); return callOn(p, "submit"); }, "Sai tên đăng nhập hoặc mật khẩu", "submit() với mật khẩu sai");
tests:
  - text: '`enterUsername` lưu được tên đăng nhập vào thuộc tính'
    java: user
  - text: '`enterPassword` lưu được mật khẩu vào thuộc tính'
    java: pass
  - text: 'Hai method đều `return this`'
    java: self
  - text: 'Sai mật khẩu vẫn báo `Sai tên đăng nhập hoặc mật khẩu`'
    java: wrong
  - text: '`Main` gọi nối tiếp `.enterUsername(...).enterPassword(...)`'
    source: '\.enterUsername\([^)]*\)\s*\.enterPassword\('
    file: Main.java
  - text: 'Console in ra `Xin chào, lan`'
    stdout: { equals: "Xin chào, lan" }
hints:
  - 'Chạy thử code ban đầu: dù nhập đúng vẫn báo sai! Vì `username = username;` chỉ gán tham số cho chính nó. Sửa thành `this.username = username;`'
  - 'Đổi kiểu trả về từ `void` thành `LoginPage` và thêm `return this;` ở cuối method.'
  - 'Trong `main`: `String msg = new LoginPage().enterUsername("lan").enterPassword("matkhau123").submit();`'
---

Bạn đã gặp `this` trong constructor. Giờ ta xem kỹ nó, vì `this` gây ra một trong những bug "khó thấy" nhất của người mới.

## `this` = chính object đang chạy method

Khi bạn gọi `page.enterUsername("lan")`, bên trong method, `this` chính là `page`. Nếu gọi trên object khác, `this` là object khác đó.

### Bug kinh điển: quên `this`

```java
private String username = "";

public void enterUsername(String username) {
    username = username;      // SAI: không có tác dụng gì!
}
```

Trong method, tên `username` trỏ tới **tham số** (cái gần nhất). Dòng trên chỉ gán tham số cho chính nó, còn thuộc tính vẫn là `""`. Code biên dịch được, chạy không lỗi, nhưng sai. Viết đúng:

```java
this.username = username;     // ĐÚNG: thuộc tính của object này = tham số
```

## `return this`: gọi nối tiếp các method

Một method có thể **trả về chính object** của nó:

```java
public LoginPage enterUsername(String username) {
    this.username = username;
    return this;
}
```

Kiểu trả về là `LoginPage`, và giá trị trả về là `this`. Nhờ vậy, kết quả của lời gọi này lại là một `LoginPage`, ta chấm tiếp được luôn:

```java
new LoginPage()
        .enterUsername("lan")
        .enterPassword("matkhau123")
        .submit();
```

Bạn đã thấy kiểu gọi nối tiếp này với String (`tieuDe.trim().toLowerCase()`). Trong Page Object Model, cách viết này gọi là **fluent** (trôi chảy): test đọc lên như một câu văn, rất dễ hiểu với cả người không biết code.

## Đến lượt bạn

`LoginPage` bên phải đang có bug: nhập đúng `lan` / `matkhau123` mà vẫn báo sai. Hãy:

1. Sửa `enterUsername` và `enterPassword` cho đúng bằng `this.`.
2. Đổi hai method đó để trả về `LoginPage` và `return this;`.
3. Viết lại `main` theo kiểu gọi nối tiếp: `new LoginPage().enterUsername("lan").enterPassword("matkhau123").submit()`, rồi in kết quả:

```
Xin chào, lan
```
