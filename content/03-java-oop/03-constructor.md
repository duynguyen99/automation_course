---
title: "Constructor: tạo object gọn trong một dòng"
type: code
minutes: 8
files:
  - name: Account.java
    content: |
      public class Account {
          String username;
          String password;
          boolean locked;

          // Viết constructor ở đây

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              // Viết xong constructor thì xóa dấu // ở 4 dòng dưới
              // Account lan = new Account("lan", "matkhau123", false);
              // Account khoa = new Account("khoa", "matkhau123", true);
              // System.out.println(lan.username + " bị khóa? " + lan.locked);
              // System.out.println(khoa.username + " bị khóa? " + khoa.locked);
          }
      }
solution:
  Account.java: |
    public class Account {
        String username;
        String password;
        boolean locked;

        public Account(String username, String password, boolean locked) {
            this.username = username;
            this.password = password;
            this.locked = locked;
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            Account lan = new Account("lan", "matkhau123", false);
            Account khoa = new Account("khoa", "matkhau123", true);
            System.out.println(lan.username + " bị khóa? " + lan.locked);
            System.out.println(khoa.username + " bị khóa? " + khoa.locked);
        }
    }
checks: |
  ok("ctor", () -> { newObj("Account", "lan", "matkhau123", false); return true; }, "");
  eq("user", () -> field(newObj("Account", "mai", "abc123", false), "username"), "mai", "username của new Account(\"mai\", \"abc123\", false)");
  eq("pass", () -> field(newObj("Account", "mai", "abc123", false), "password"), "abc123", "password của new Account(\"mai\", \"abc123\", false)");
  eq("locked", () -> field(newObj("Account", "khoa", "matkhau123", true), "locked"), true, "locked của new Account(\"khoa\", \"matkhau123\", true)");
tests:
  - text: '`Account` có constructor nhận 3 tham số'
    java: ctor
  - text: 'Constructor gán đúng `username`'
    java: user
  - text: 'Constructor gán đúng `password`'
    java: pass
  - text: 'Constructor gán đúng `locked`'
    java: locked
  - text: 'Console in ra `lan bị khóa? false` rồi `khoa bị khóa? true`'
    stdout: { equals: "lan bị khóa? false\nkhoa bị khóa? true" }
hints:
  - 'Constructor trùng tên class và không có kiểu trả về: `public Account(String username, String password, boolean locked) { ... }`'
  - 'Bên trong, mỗi dòng gán một thuộc tính: `this.username = username;`'
  - 'Nếu test báo giá trị là `null` hoặc `false`, có thể bạn viết `username = username;` mà quên `this.` ở đầu.'
---

Ở trang trước, tạo một sản phẩm tốn tới ba dòng: `new`, gán tên, gán giá. Lỡ quên một dòng là object bị "thiếu nhân". **Constructor** (hàm khởi tạo) giải quyết chuyện đó: nó là đoạn code chạy **ngay lúc `new`**, nhận dữ liệu vào và điền sẵn cho object.

```java
public class Product {
    String name;
    int price;

    public Product(String name, int price) {
        this.name = name;
        this.price = price;
    }
}
```

Giờ tạo sản phẩm chỉ cần một dòng:

```java
Product sen = new Product("Trà Sen Tây Hồ", 420000);
```

## Nhận diện constructor

- **Tên trùng với tên class**: `Product(...)` nằm trong class `Product`.
- **Không có kiểu trả về**, kể cả `void`. Nếu bạn lỡ viết `public void Product(...)`, Java sẽ coi đó là một method bình thường chứ không phải constructor nữa.
- `public` ở đầu nghĩa là class khác (như `Main`) được phép gọi nó. Trang "Đóng gói" sẽ nói thêm về chữ này.

## `this.name = name` nghĩa là gì?

Trong constructor có **hai** thứ cùng tên `name`:

- `name` đứng một mình: **tham số**, tức giá trị vừa được truyền vào (`"Trà Sen Tây Hồ"`).
- `this.name`: **thuộc tính** `name` của chính object đang được tạo.

`this` nghĩa là *"chính object này"*. Dòng `this.name = name;` đọc là: *"lấy giá trị được truyền vào, cất vào thuộc tính name của tôi"*. Trang "Từ khóa this" sẽ đào sâu hơn.

> Khi bạn chưa viết constructor nào, Java tự tặng một constructor rỗng, vì vậy `new Product()` ở trang trước chạy được. Nhưng **ngay khi bạn tự viết một constructor**, món quà đó biến mất: `new Product()` sẽ báo lỗi biên dịch nếu class chỉ có `Product(String name, int price)`.

## Liên hệ với test

Trang đăng nhập của Tiệm Trà Mộc có hai tài khoản mẫu: `lan` (bình thường) và `khoa` (đã bị khóa). Tester thường gom dữ liệu test thành object như vậy, để mỗi test case chỉ cần một dòng `new Account(...)`.

## Đến lượt bạn

1. Trong `Account.java`, viết constructor nhận **3 tham số** theo đúng thứ tự `(String username, String password, boolean locked)` và gán vào 3 thuộc tính.
2. Trong `Main.java`, xóa dấu `//` ở 4 dòng đã viết sẵn rồi chạy thử. Console phải in:

```
lan bị khóa? false
khoa bị khóa? true
```
