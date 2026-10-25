---
title: "List chứa object"
type: code
minutes: 9
files:
  - name: Product.java
    readonly: true
    content: |
      public class Product {
          private String name;
          private int price;
          private int stock;

          public Product(String name, int price, int stock) {
              this.name = name;
              this.price = price;
              this.stock = stock;
          }

          public String getName() { return name; }
          public int getPrice() { return price; }
          public int getStock() { return stock; }
      }
  - name: Main.java
    content: |
      import java.util.ArrayList;
      import java.util.List;

      public class Main {
          public static void main(String[] args) {
              List<Product> ds = new ArrayList<>();
              ds.add(new Product("Trà Shan Tuyết", 185000, 12));
              ds.add(new Product("Trà Ô Long Lâm Đồng", 240000, 8));
              ds.add(new Product("Trà Sen Tây Hồ", 420000, 3));
              ds.add(new Product("Trà Nhài Thái Nguyên", 150000, 20));
              ds.add(new Product("Hồng Trà Hà Giang", 210000, 0));
              ds.add(new Product("Ấm Tử Sa Mini", 560000, 5));

              System.out.println("Còn hàng: " + conHang(ds));
              System.out.println("Rẻ nhất: " + reNhat(ds).getName());
          }

          static List<String> conHang(List<Product> ds) {
              List<String> ten = new ArrayList<>();
              // Thêm tên những sản phẩm có stock > 0

              return ten;
          }

          static Product reNhat(List<Product> ds) {
              Product best = ds.get(0);
              // Tìm sản phẩm có giá thấp nhất

              return best;
          }
      }
solution:
  Main.java: |
    import java.util.ArrayList;
    import java.util.List;

    public class Main {
        public static void main(String[] args) {
            List<Product> ds = new ArrayList<>();
            ds.add(new Product("Trà Shan Tuyết", 185000, 12));
            ds.add(new Product("Trà Ô Long Lâm Đồng", 240000, 8));
            ds.add(new Product("Trà Sen Tây Hồ", 420000, 3));
            ds.add(new Product("Trà Nhài Thái Nguyên", 150000, 20));
            ds.add(new Product("Hồng Trà Hà Giang", 210000, 0));
            ds.add(new Product("Ấm Tử Sa Mini", 560000, 5));

            System.out.println("Còn hàng: " + conHang(ds));
            System.out.println("Rẻ nhất: " + reNhat(ds).getName());
        }

        static List<String> conHang(List<Product> ds) {
            List<String> ten = new ArrayList<>();
            for (Product p : ds) {
                if (p.getStock() > 0) {
                    ten.add(p.getName());
                }
            }
            return ten;
        }

        static Product reNhat(List<Product> ds) {
            Product best = ds.get(0);
            for (Product p : ds) {
                if (p.getPrice() < best.getPrice()) {
                    best = p;
                }
            }
            return best;
        }
    }
checks: |
  eq("stock", () -> call("conHang", java.util.List.of(newObj("Product", "A", 100, 0), newObj("Product", "B", 200, 4), newObj("Product", "C", 300, 1))), java.util.List.of("B", "C"), "conHang([A hết hàng, B còn 4, C còn 1])");
  eq("cheap", () -> callOn(call("reNhat", java.util.List.of(newObj("Product", "A", 300, 1), newObj("Product", "B", 90, 1), newObj("Product", "C", 120, 1))), "getName"), "B", "reNhat([A 300, B 90, C 120]).getName()");
  eq("last", () -> callOn(call("reNhat", java.util.List.of(newObj("Product", "A", 300, 1), newObj("Product", "B", 200, 1), newObj("Product", "C", 50, 1))), "getName"), "C", "reNhat([A 300, B 200, C 50]).getName() (rẻ nhất nằm cuối)");
tests:
  - text: '`conHang` trả về tên các sản phẩm có `stock > 0`, giữ thứ tự'
    java: stock
  - text: '`reNhat` tìm đúng sản phẩm rẻ nhất ở giữa list'
    java: cheap
  - text: '`reNhat` tìm đúng khi sản phẩm rẻ nhất nằm cuối list'
    java: last
  - text: 'Console in đúng 2 dòng theo đề'
    stdout: { equals: "Còn hàng: [Trà Shan Tuyết, Trà Ô Long Lâm Đồng, Trà Sen Tây Hồ, Trà Nhài Thái Nguyên, Ấm Tử Sa Mini]\nRẻ nhất: Trà Nhài Thái Nguyên" }
hints:
  - 'Duyệt: `for (Product p : ds) { ... }`. Bên trong dùng getter: `p.getStock()`, `p.getName()`.'
  - 'Tìm nhỏ nhất: giả sử phần tử đầu là rẻ nhất (`best = ds.get(0)`), gặp sản phẩm nào rẻ hơn `best` thì cập nhật `best = p;`'
---

List không chỉ chứa String hay số. Nó chứa được **object của bất kỳ class nào**, kể cả class bạn tự viết. Đây là chỗ chương 3 và chương 4 gặp nhau.

```java
List<Product> ds = new ArrayList<>();
ds.add(new Product("Trà Sen Tây Hồ", 420000, 3));

for (Product p : ds) {
    System.out.println(p.getName() + ": " + p.getPrice());
}
```

Mỗi phần tử `p` là một object `Product` đầy đủ, nên bạn gọi được mọi method của nó.

## Mẫu "tìm phần tử tốt nhất"

Tìm sản phẩm rẻ nhất, test chạy lâu nhất, đơn hàng lớn nhất... đều cùng một mẫu:

1. Giả sử phần tử **đầu tiên** là tốt nhất.
2. Duyệt cả list, gặp phần tử nào tốt hơn thì **thay** vào.
3. Hết vòng lặp, thứ còn lại chính là đáp án.

```java
Product best = ds.get(0);
for (Product p : ds) {
    if (p.getPrice() < best.getPrice()) {
        best = p;
    }
}
```

> Tại sao không bắt đầu `best` bằng một con số như `0`? Vì giá rẻ nhất sẽ không bao giờ nhỏ hơn 0, so sánh sẽ sai. Lấy chính phần tử đầu tiên là cách an toàn.

## Liên hệ với test thật

Trong một dự án thật, bạn thường đọc các thẻ sản phẩm trên trang thành `List<Product>`, rồi kiểm tra: tất cả sản phẩm "Hết hàng" đều có nút bị khóa không? Sau khi chọn "Giá tăng dần", sản phẩm đầu tiên có phải rẻ nhất không? Bài này chính là phần logic đó.

## Đến lượt bạn

`Product.java` có sẵn (chỉ đọc) với ba getter. Trong `Main.java`, viết:

1. `conHang(ds)`: trả về `List<String>` gồm **tên** các sản phẩm còn hàng (`stock > 0`), giữ nguyên thứ tự.
2. `reNhat(ds)`: trả về **object** `Product` có giá thấp nhất.

```
Còn hàng: [Trà Shan Tuyết, Trà Ô Long Lâm Đồng, Trà Sen Tây Hồ, Trà Nhài Thái Nguyên, Ấm Tử Sa Mini]
Rẻ nhất: Trà Nhài Thái Nguyên
```
