---
title: "Viết class đầu tiên"
type: code
minutes: 8
files:
  - name: Product.java
    content: |
      public class Product {
          // Khai báo 2 thuộc tính ở đây: name (kiểu String) và price (kiểu int)

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              Product p1 = new Product();
              // Gán name và price cho p1, rồi in ra

              // Tạo thêm object p2

          }
      }
solution:
  Product.java: |
    public class Product {
        String name;
        int price;
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            Product p1 = new Product();
            p1.name = "Trà Sen Tây Hồ";
            p1.price = 420000;
            System.out.println(p1.name + " - " + p1.price);

            Product p2 = new Product();
            p2.name = "Trà Nhài Thái Nguyên";
            p2.price = 150000;
            System.out.println(p2.name + " - " + p2.price);
        }
    }
checks: |
  ok("fields", () -> { Object p = newObj("Product"); field(p, "name"); field(p, "price"); return true; }, "");
  ok("types", () -> cls("Product").getDeclaredField("name").getType() == String.class
      && cls("Product").getDeclaredField("price").getType() == int.class,
      "name phải có kiểu String, price phải có kiểu int");
tests:
  - text: 'Class `Product` có hai thuộc tính `name` và `price`'
    java: fields
  - text: '`name` kiểu `String`, `price` kiểu `int`'
    java: types
  - text: 'Tạo hai object bằng `new Product()`'
    source: 'new\s+Product\s*\(\s*\)[\s\S]*new\s+Product\s*\(\s*\)'
    file: Main.java
  - text: 'Console in đúng hai dòng: `Trà Sen Tây Hồ - 420000` và `Trà Nhài Thái Nguyên - 150000`'
    stdout: { equals: "Trà Sen Tây Hồ - 420000\nTrà Nhài Thái Nguyên - 150000" }
hints:
  - 'Trong `Product.java`, khai báo thuộc tính giống khai báo biến nhưng nằm **ngoài** method: `String name;` và `int price;`'
  - 'Trong `Main.java`, gán bằng dấu chấm: `p1.name = "Trà Sen Tây Hồ";`. In ra: `System.out.println(p1.name + " - " + p1.price);`'
  - 'Object thứ hai: `Product p2 = new Product();` rồi làm tương tự với tên và giá mới.'
---

Lần đầu tiên, bên phải có **hai file**. Bấm vào tab tên file để chuyển qua lại.

- `Product.java`: bản thiết kế, tức là class.
- `Main.java`: nơi chương trình bắt đầu chạy, dùng bản thiết kế để tạo object.

> Quy tắc của Java: mỗi file chỉ có **một** `public class`, và **tên file phải trùng tên class đó**. Class `Product` nằm trong `Product.java`.

## Bước 1: khai báo thuộc tính

```java
public class Product {
    String name;
    int price;
}
```

Thuộc tính (*field*) trông giống biến, nhưng nằm **trực tiếp trong class**, không nằm trong method nào. Nó nói rằng: *mọi* sản phẩm đều có một tên và một giá.

## Bước 2: tạo object bằng `new`

```java
Product p1 = new Product();
```

Đọc từ phải sang trái: `new Product()` đúc ra một chiếc bánh mới từ khuôn `Product`, rồi cất vào biến `p1`. Biến `p1` có **kiểu** là `Product`, giống như biến `ten` có kiểu `String`.

## Bước 3: đọc và ghi bằng dấu chấm

```java
p1.name = "Trà Sen Tây Hồ";    // ghi vào thuộc tính name của p1
p1.price = 420000;
System.out.println(p1.name);   // đọc ra: Trà Sen Tây Hồ
```

Mỗi object có **bộ thuộc tính riêng**. Sửa `p2.price` không hề ảnh hưởng tới `p1.price`, giống như cắn một miếng chiếc bánh này thì chiếc bánh kia vẫn nguyên.

> Thuộc tính chưa được gán sẽ có **giá trị mặc định**: `0` với số, `false` với `boolean`, và `null` (nghĩa là "chưa trỏ tới gì cả") với `String`.

## Đến lượt bạn

1. Trong `Product.java`, khai báo thuộc tính `name` kiểu `String` và `price` kiểu `int`.
2. Trong `Main.java`, gán cho `p1` tên `Trà Sen Tây Hồ`, giá `420000`.
3. Tạo object thứ hai `p2` bằng `new Product()`, tên `Trà Nhài Thái Nguyên`, giá `150000`.
4. In mỗi sản phẩm trên một dòng theo mẫu `tên - giá`:

```
Trà Sen Tây Hồ - 420000
Trà Nhài Thái Nguyên - 150000
```
