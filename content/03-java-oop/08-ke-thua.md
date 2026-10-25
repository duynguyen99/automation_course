---
title: "Kế thừa: extends"
type: code
minutes: 9
files:
  - name: BasePage.java
    readonly: true
    content: |
      public class BasePage {
          public String open(String path) {
              return "Mở trang http://localhost:4000/practice/" + path;
          }

          public String headerText() {
              return "Tiệm Trà Mộc";
          }
      }
  - name: LoginPage.java
    content: |
      public class LoginPage {
          // Cho LoginPage kế thừa BasePage, rồi viết method login ở đây

      }
  - name: ProductsPage.java
    content: |
      public class ProductsPage {
          // Cho ProductsPage kế thừa BasePage, rồi viết method search ở đây

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              LoginPage loginPage = new LoginPage();
              ProductsPage productsPage = new ProductsPage();
              // In 4 dòng theo đề bài

          }
      }
solution:
  LoginPage.java: |
    public class LoginPage extends BasePage {
        public String login(String username, String password) {
            return "Đăng nhập với tài khoản " + username;
        }
    }
  ProductsPage.java: |
    public class ProductsPage extends BasePage {
        public String search(String keyword) {
            return "Tìm kiếm: " + keyword;
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            LoginPage loginPage = new LoginPage();
            ProductsPage productsPage = new ProductsPage();
            System.out.println(loginPage.open("login.html"));
            System.out.println(loginPage.login("lan", "matkhau123"));
            System.out.println(productsPage.headerText());
            System.out.println(productsPage.search("trà sen"));
        }
    }
checks: |
  ok("ext1", () -> extendsClass("LoginPage", "BasePage"), "LoginPage chưa extends BasePage");
  ok("ext2", () -> extendsClass("ProductsPage", "BasePage"), "ProductsPage chưa extends BasePage");
  eq("login", () -> callOn(newObj("LoginPage"), "login", "khoa", "matkhau123"), "Đăng nhập với tài khoản khoa", "login(\"khoa\", \"matkhau123\")");
  eq("search", () -> callOn(newObj("ProductsPage"), "search", "ô long"), "Tìm kiếm: ô long", "search(\"ô long\")");
  eq("inherit", () -> callOn(newObj("ProductsPage"), "open", "products.html"), "Mở trang http://localhost:4000/practice/products.html", "ProductsPage.open(\"products.html\") (thừa hưởng từ BasePage)");
tests:
  - text: '`LoginPage` kế thừa `BasePage`'
    java: ext1
  - text: '`ProductsPage` kế thừa `BasePage`'
    java: ext2
  - text: '`login("khoa", "matkhau123")` trả về `Đăng nhập với tài khoản khoa`'
    java: login
  - text: '`search("ô long")` trả về `Tìm kiếm: ô long`'
    java: search
  - text: '`ProductsPage` dùng được `open(...)` mà không cần viết lại'
    java: inherit
  - text: 'Console in đúng 4 dòng theo đề'
    stdout: { equals: "Mở trang http://localhost:4000/practice/login.html\nĐăng nhập với tài khoản lan\nTiệm Trà Mộc\nTìm kiếm: trà sen" }
hints:
  - 'Thêm `extends BasePage` ngay sau tên class: `public class LoginPage extends BasePage { ... }`'
  - '`public String login(String username, String password) { return "Đăng nhập với tài khoản " + username; }`'
  - 'Trong `main`, gọi `loginPage.open("login.html")` dù `LoginPage` không tự viết `open`: nó được thừa hưởng từ `BasePage`.'
---

Trang web nào của Tiệm Trà Mộc cũng có chung phần đầu trang (logo "Tiệm Trà Mộc") và đều cần "mở trang". Nếu viết lại `open(...)` trong từng class `LoginPage`, `ProductsPage`, `CartPage`... thì vừa mỏi tay, vừa khi đổi địa chỉ website phải sửa ở rất nhiều chỗ.

## Con thừa hưởng từ cha

**Kế thừa** (*inheritance*) cho phép một class **nhận lại toàn bộ** thuộc tính và method của class khác, rồi thêm phần riêng của mình.

```java
public class BasePage {
    public String open(String path) {
        return "Mở trang http://localhost:4000/practice/" + path;
    }
}

public class LoginPage extends BasePage {
    public String login(String username, String password) {
        return "Đăng nhập với tài khoản " + username;
    }
}
```

Chữ `extends` nghĩa là "mở rộng từ". `BasePage` là **class cha** (*parent*, *superclass*), `LoginPage` là **class con** (*child*, *subclass*).

```java
LoginPage page = new LoginPage();
page.open("login.html");    // được thừa hưởng từ BasePage
page.login("lan", "...");   // phần riêng của LoginPage
```

## Quan hệ "là một"

Kế thừa đúng khi câu "**con là một cha**" nghe hợp lý:

- `LoginPage` **là một** trang web (`BasePage`). Hợp lý.
- `ChromeDriver` **là một** trình duyệt. Hợp lý.
- `Product` là một `LoginPage`? Vô lý. Đừng kế thừa chỉ để "mượn" method.

> Một class Java chỉ được `extends` **một** class cha. Nhưng một class cha có thể có rất nhiều class con.

## Đây chính là `BasePage` trong POM

Hầu như mọi dự án automation đều có một class `BasePage` chứa những việc chung: mở trang, đợi trang tải xong, đọc tiêu đề, chụp màn hình. Mỗi trang cụ thể kế thừa nó và chỉ viết những hành động riêng. Bạn sẽ tự xây cấu trúc này ở chương Page Object Model.

## Đến lượt bạn

`BasePage.java` đã có sẵn (chỉ đọc).

1. Cho `LoginPage` kế thừa `BasePage`, thêm method `public String login(String username, String password)` trả về `Đăng nhập với tài khoản ` + username.
2. Cho `ProductsPage` kế thừa `BasePage`, thêm method `public String search(String keyword)` trả về `Tìm kiếm: ` + keyword.
3. Trong `main`, in 4 dòng:

```
Mở trang http://localhost:4000/practice/login.html
Đăng nhập với tài khoản lan
Tiệm Trà Mộc
Tìm kiếm: trà sen
```

(dòng 1 và 2 dùng `loginPage`, dòng 3 và 4 dùng `productsPage`)
