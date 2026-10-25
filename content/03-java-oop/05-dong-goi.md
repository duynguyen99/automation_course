---
title: "Đóng gói: private, getter và setter"
type: code
minutes: 9
files:
  - name: Product.java
    content: |
      public class Product {
          String name;
          int price;

          public Product(String name, int price) {
              this.name = name;
              this.price = price;
          }

          // 1. Đổi 2 thuộc tính ở trên thành private
          // 2. Viết getName(), getPrice() và setPrice(int price)

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              Product p = new Product("Trà Sen Tây Hồ", 420000);
              p.price = -100;   // Ối! Ai cũng sửa được giá thành số âm
              System.out.println(p.name + ": " + p.price);
          }
      }
solution:
  Product.java: |
    public class Product {
        private String name;
        private int price;

        public Product(String name, int price) {
            this.name = name;
            this.price = price;
        }

        public String getName() {
            return name;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            if (price >= 0) {
                this.price = price;
            }
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            Product p = new Product("Trà Sen Tây Hồ", 420000);
            p.setPrice(-100);
            System.out.println(p.getName() + ": " + p.getPrice());
            p.setPrice(399000);
            System.out.println(p.getName() + ": " + p.getPrice());
        }
    }
checks: |
  ok("priv", () -> fieldIsPrivate("Product", "name") && fieldIsPrivate("Product", "price"), "Cả name và price đều phải là private");
  eq("get", () -> { Object p = newObj("Product", "Trà Ô Long Lâm Đồng", 240000); return callOn(p, "getName") + " / " + callOn(p, "getPrice"); }, "Trà Ô Long Lâm Đồng / 240000", "getName() + \" / \" + getPrice()");
  eq("set", () -> { Object p = newObj("Product", "Trà Ô Long Lâm Đồng", 240000); callOn(p, "setPrice", 199000); return callOn(p, "getPrice"); }, 199000, "getPrice() sau khi setPrice(199000)");
  eq("neg", () -> { Object p = newObj("Product", "Trà Ô Long Lâm Đồng", 240000); callOn(p, "setPrice", -1); return callOn(p, "getPrice"); }, 240000, "getPrice() sau khi setPrice(-1)");
  eq("zero", () -> { Object p = newObj("Product", "Quà tặng", 50000); callOn(p, "setPrice", 0); return callOn(p, "getPrice"); }, 0, "getPrice() sau khi setPrice(0)");
tests:
  - text: '`name` và `price` là `private`'
    java: priv
  - text: '`getName()` và `getPrice()` trả về đúng giá trị'
    java: get
  - text: '`setPrice(199000)` đổi giá thành `199000`'
    java: set
  - text: '`setPrice(-1)` bị từ chối, giá giữ nguyên'
    java: neg
  - text: '`setPrice(0)` vẫn hợp lệ (hàng tặng miễn phí)'
    java: zero
  - text: 'Console in ra `Trà Sen Tây Hồ: 420000` rồi `Trà Sen Tây Hồ: 399000`'
    stdout: { equals: "Trà Sen Tây Hồ: 420000\nTrà Sen Tây Hồ: 399000" }
hints:
  - 'Thêm chữ `private` trước kiểu: `private int price;`. Lúc đó `Main` sẽ báo lỗi `price has private access`, đúng như mong đợi: hãy sửa `Main` để dùng getter/setter.'
  - 'Getter: `public int getPrice() { return price; }`. Setter: `public void setPrice(int price) { ... }`'
  - 'Trong setter, chỉ gán khi hợp lệ: `if (price >= 0) { this.price = price; }`. Trong `main`: gọi `p.setPrice(-100)`, in, gọi `p.setPrice(399000)`, in lại.'
---

Ở trang trước, ai cũng có thể viết `p.price = -100;`. Java không cản, nhưng cửa hàng thì "toang": sản phẩm có giá âm! Đây là kiểu bug mà tester rất hay tìm thấy.

## Ví dụ cây ATM

Bạn không thể thò tay vào trong cây ATM để lấy tiền hay sửa số dư. Bạn chỉ được dùng **các nút bấm** máy cho phép, và máy sẽ **kiểm tra** trước khi làm (đủ số dư không, đúng mã PIN không).

Đó chính là **đóng gói** (*encapsulation*): giấu dữ liệu bên trong, chỉ mở ra vài "nút bấm" an toàn.

## `private` và `public`

| Từ khóa | Ai được dùng |
|---|---|
| `private` | chỉ code **bên trong class đó** |
| `public` | mọi class khác |

```java
public class Product {
    private int price;      // giấu đi

    public int getPrice() { // nút "xem giá"
        return price;
    }

    public void setPrice(int price) {   // nút "đổi giá", có kiểm tra
        if (price >= 0) {
            this.price = price;
        }
    }
}
```

- **Getter** (`getPrice`): trả về giá trị. Đặt tên `get` + tên thuộc tính viết hoa chữ đầu.
- **Setter** (`setPrice`): nhận giá trị mới, **kiểm tra**, rồi mới gán.

Bây giờ nếu `Main` viết `p.price = -100;`, Java báo **lỗi biên dịch**: `price has private access in Product`. Muốn đổi giá phải đi qua `setPrice`, và setter sẽ từ chối số âm.

> Không phải thuộc tính nào cũng cần setter. `name` ở bài này chỉ có getter, nghĩa là tên sản phẩm được đặt một lần trong constructor rồi không ai đổi được nữa.

## Liên hệ với Page Object Model

Trong POM, locator (cách tìm một nút trên trang) được để `private`, còn các hành động như `login(user, pass)` là `public`. Test chỉ thấy "nút bấm" `login`, không cần biết bên trong tìm ô nhập thế nào. Khi giao diện đổi, bạn sửa đúng một chỗ trong class trang, không phải sửa hàng trăm test.

## Đến lượt bạn

**Trong `Product.java`:**

1. Đổi `name` và `price` thành `private`.
2. Viết `getName()` và `getPrice()`.
3. Viết `setPrice(int price)`: chỉ đổi giá khi giá mới **lớn hơn hoặc bằng 0**. Giá âm thì bỏ qua, giữ giá cũ.

**Trong `Main.java`** (sẽ báo lỗi sau bước 1, đó là chuyện bình thường): xóa dòng `p.price = -100;`, thay bằng:

1. Gọi `p.setPrice(-100)` rồi in `tên: giá` (dùng getter).
2. Gọi `p.setPrice(399000)` rồi in lại.

```
Trà Sen Tây Hồ: 420000
Trà Sen Tây Hồ: 399000
```
