---
title: "Method của object: object biết làm việc"
type: code
minutes: 8
files:
  - name: CartItem.java
    content: |
      public class CartItem {
          String name;
          int price;
          int quantity;

          public CartItem(String name, int price, int quantity) {
              this.name = name;
              this.price = price;
              this.quantity = quantity;
          }

          // 1. Viết method subtotal()

          // 2. Viết method addOne()

          // 3. Viết method describe()

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              CartItem item = new CartItem("Trà Shan Tuyết", 185000, 2);
              // Gọi các method của item ở đây

          }
      }
solution:
  CartItem.java: |
    public class CartItem {
        String name;
        int price;
        int quantity;

        public CartItem(String name, int price, int quantity) {
            this.name = name;
            this.price = price;
            this.quantity = quantity;
        }

        public int subtotal() {
            return price * quantity;
        }

        public void addOne() {
            quantity++;
        }

        public String describe() {
            return name + " x" + quantity + " = " + subtotal();
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            CartItem item = new CartItem("Trà Shan Tuyết", 185000, 2);
            System.out.println(item.describe());
            item.addOne();
            System.out.println(item.describe());
        }
    }
checks: |
  eq("sub", () -> callOn(newObj("CartItem", "Trà Sen Tây Hồ", 420000, 3), "subtotal"), 1260000, "subtotal() của Trà Sen Tây Hồ, giá 420000, số lượng 3");
  ok("inst", () -> !java.lang.reflect.Modifier.isStatic(cls("CartItem").getDeclaredMethod("subtotal").getModifiers()), "subtotal() là method của object, không viết static");
  eq("add", () -> { Object it = newObj("CartItem", "Ấm Tử Sa Mini", 560000, 1); callOn(it, "addOne"); callOn(it, "addOne"); return field(it, "quantity"); }, 3, "quantity sau khi gọi addOne() hai lần (bắt đầu từ 1)");
  eq("desc", () -> callOn(newObj("CartItem", "Trà Nhài Thái Nguyên", 150000, 4), "describe"), "Trà Nhài Thái Nguyên x4 = 600000", "describe()");
tests:
  - text: '`subtotal()` trả về giá × số lượng'
    java: sub
  - text: '`subtotal()` không có chữ `static`'
    java: inst
  - text: '`addOne()` tăng số lượng thêm 1'
    java: add
  - text: '`describe()` trả về dạng `Trà Nhài Thái Nguyên x4 = 600000`'
    java: desc
  - text: 'Console in ra `Trà Shan Tuyết x2 = 370000` rồi `Trà Shan Tuyết x3 = 555000`'
    stdout: { equals: "Trà Shan Tuyết x2 = 370000\nTrà Shan Tuyết x3 = 555000" }
hints:
  - 'Method của object viết giống chương 2 nhưng **bỏ chữ `static`**: `public int subtotal() { return price * quantity; }`'
  - '`addOne()` không trả về gì nên dùng `void`, bên trong chỉ cần `quantity++;`'
  - 'Trong `describe()` bạn có thể gọi luôn `subtotal()`: `return name + " x" + quantity + " = " + subtotal();`. Trong `main`: in `describe()`, gọi `addOne()`, rồi in `describe()` lần nữa.'
---

Object không chỉ **biết** (thuộc tính) mà còn **làm được** việc (method). Một món hàng trong giỏ thì biết tự tính tiền của nó.

```java
public class CartItem {
    String name;
    int price;
    int quantity;

    // constructor...

    public int subtotal() {
        return price * quantity;
    }
}
```

Gọi method bằng dấu chấm, giống `ten.length()` của String:

```java
CartItem item = new CartItem("Trà Shan Tuyết", 185000, 2);
System.out.println(item.subtotal());   // 370000
```

## Khác gì method ở chương 2?

Ở chương 2, method có chữ `static` và mọi dữ liệu phải truyền qua tham số: `tinhTongTien(donGia, soLuong)`.

Method của object **không có `static`**. Nó dùng luôn thuộc tính của chính object đã gọi nó. Khi bạn gọi `item.subtotal()`, chữ `price` bên trong method chính là `item.price`. Gọi trên object khác thì dùng giá của object khác.

## Method có thể thay đổi object

```java
public void addOne() {
    quantity++;
}
```

Gọi `item.addOne()` thì số lượng của `item` tăng lên. Trạng thái của object thay đổi theo thời gian, giống như giỏ hàng thật khi bạn bấm nút "+".

## Liên hệ với Selenium

Sau này bạn sẽ làm việc với các object như thế này hằng ngày:

```java
driver.get("http://localhost:4000/practice/login.html");   // trình duyệt tự mở trang
loginButton.click();                                       // nút tự bấm
String msg = errorMessage.getText();                       // ô thông báo tự đọc chữ
```

`driver`, `loginButton`, `errorMessage` đều là object, và `get`, `click`, `getText` đều là method của chúng.

## Đến lượt bạn

Trong `CartItem.java`, viết 3 method (đều `public`, **không** `static`):

1. `int subtotal()`: trả về `price * quantity`.
2. `void addOne()`: tăng `quantity` thêm 1.
3. `String describe()`: trả về chữ theo mẫu `tên xSốLượng = thànhTiền`, ví dụ `Trà Shan Tuyết x2 = 370000`.

Trong `Main.java`: in `item.describe()`, gọi `item.addOne()`, rồi in `item.describe()` lần nữa:

```
Trà Shan Tuyết x2 = 370000
Trà Shan Tuyết x3 = 555000
```
