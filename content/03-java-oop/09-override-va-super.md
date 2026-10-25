---
title: "Override và super: con làm khác cha"
type: code
minutes: 9
files:
  - name: BasePage.java
    readonly: true
    content: |
      public class BasePage {
          private String path;

          public BasePage(String path) {
              this.path = path;
          }

          public String getPath() {
              return path;
          }

          public String open() {
              return "Mở trang " + path;
          }
      }
  - name: LoginPage.java
    content: |
      public class LoginPage extends BasePage {
          public LoginPage() {
              super("???");   // Sửa: trang đăng nhập có đường dẫn "login.html"
          }

          // Override method open() ở đây

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              BasePage products = new BasePage("products.html");
              LoginPage login = new LoginPage();
              System.out.println(products.open());
              System.out.println(login.open());
          }
      }
solution:
  LoginPage.java: |
    public class LoginPage extends BasePage {
        public LoginPage() {
            super("login.html");
        }

        @Override
        public String open() {
            return super.open() + " và chờ ô #username hiện ra";
        }
    }
checks: |
  eq("path", () -> callOn(newObj("LoginPage"), "getPath"), "login.html", "getPath() của new LoginPage()");
  eq("open", () -> callOn(newObj("LoginPage"), "open"), "Mở trang login.html và chờ ô #username hiện ra", "open() của LoginPage");
  eq("parent", () -> callOn(newObj("BasePage", "cart.html"), "open"), "Mở trang cart.html", "open() của new BasePage(\"cart.html\")");
tests:
  - text: 'Constructor của `LoginPage` gọi `super("login.html")`'
    java: path
  - text: '`LoginPage.open()` trả về `Mở trang login.html và chờ ô #username hiện ra`'
    java: open
  - text: '`BasePage.open()` của các trang khác không bị ảnh hưởng'
    java: parent
  - text: 'Có `@Override` phía trên method `open()`'
    source: '@Override\s+public\s+String\s+open\s*\(\s*\)'
    file: LoginPage.java
  - text: 'Dùng lại code của cha bằng `super.open()`'
    source: 'super\.open\s*\(\s*\)'
    file: LoginPage.java
  - text: 'Console in ra hai dòng đúng như đề'
    stdout: { equals: "Mở trang products.html\nMở trang login.html và chờ ô #username hiện ra" }
hints:
  - 'Trong constructor, đổi `"???"` thành `"login.html"`.'
  - 'Override: viết lại method **cùng tên, cùng tham số, cùng kiểu trả về** với cha, có `@Override` phía trên: `@Override public String open() { ... }`'
  - 'Thân method: `return super.open() + " và chờ ô #username hiện ra";`'
---

Kế thừa cho con **mọi thứ** của cha. Nhưng đôi khi con cần làm **khác** một chút. Ví dụ trang đăng nhập: mở trang xong còn phải đợi ô nhập tên đăng nhập hiện ra rồi mới thao tác được.

## Override: viết đè method của cha

```java
public class LoginPage extends BasePage {
    @Override
    public String open() {
        return "Mở trang đăng nhập theo cách riêng";
    }
}
```

**Override** (ghi đè) là viết lại một method mà cha đã có, **cùng tên, cùng tham số, cùng kiểu trả về**. Khi gọi `login.open()`, Java dùng phiên bản của con.

`@Override` là một **annotation** (chú thích cho Java đọc). Nó không bắt buộc, nhưng hãy luôn viết: nếu bạn gõ nhầm tên thành `opne()`, Java sẽ báo lỗi ngay thay vì lặng lẽ tạo ra một method mới. Bạn sẽ gặp lại các annotation như `@Test` khi học JUnit.

## `super.method()`: gọi phiên bản của cha

Thường ta không muốn bỏ hẳn code của cha, mà chỉ **thêm** vào:

```java
@Override
public String open() {
    return super.open() + " và chờ ô #username hiện ra";
}
```

`super` nghĩa là "phần cha của tôi". `super.open()` chạy `open()` của `BasePage` (trả về `Mở trang login.html`), rồi con nối thêm phần của mình.

## `super(...)`: gọi constructor của cha

`BasePage` có constructor nhận `path`. Khi tạo một `LoginPage`, phần "cha" bên trong nó cũng phải được tạo, nên constructor của con **phải** gọi constructor của cha:

```java
public LoginPage() {
    super("login.html");    // phải là dòng ĐẦU TIÊN trong constructor
}
```

Nếu thiếu dòng này, Java sẽ báo lỗi biên dịch vì không biết đưa `path` nào cho `BasePage`. Để ý thêm: `path` là `private` trong `BasePage`, nên `LoginPage` không đụng trực tiếp vào được, mà phải đi qua `super(...)` và `getPath()`.

> `this` là "chính tôi", `super` là "phần cha của tôi". Hai từ này hay đi cùng nhau trong code POM.

## Đến lượt bạn

`BasePage.java` chỉ đọc. Trong `LoginPage.java`:

1. Sửa constructor để gọi `super("login.html")`.
2. Override `open()` (nhớ `@Override`) để trả về kết quả của `super.open()` nối thêm ` và chờ ô #username hiện ra`.

Không cần sửa `Main.java`. Chạy lên phải thấy:

```
Mở trang products.html
Mở trang login.html và chờ ô #username hiện ra
```
