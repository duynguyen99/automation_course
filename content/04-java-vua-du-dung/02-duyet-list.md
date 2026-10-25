---
title: "Duyệt List và tạo List mới"
type: code
minutes: 8
seed: |
  import java.util.ArrayList;
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          List<Integer> gia = List.of(185000, 240000, 420000, 150000, 210000, 560000);
          System.out.println("Tổng: " + tongTien(gia));
          System.out.println("Trên 200000: " + giaTren(gia, 200000));
      }

      static int tongTien(List<Integer> gia) {
          int tong = 0;
          // Cộng dồn từng giá

          return tong;
      }

      static List<Integer> giaTren(List<Integer> gia, int nguong) {
          List<Integer> ketQua = new ArrayList<>();
          // Thêm vào ketQua những giá lớn hơn nguong

          return ketQua;
      }
  }
solution: |
  import java.util.ArrayList;
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          List<Integer> gia = List.of(185000, 240000, 420000, 150000, 210000, 560000);
          System.out.println("Tổng: " + tongTien(gia));
          System.out.println("Trên 200000: " + giaTren(gia, 200000));
      }

      static int tongTien(List<Integer> gia) {
          int tong = 0;
          for (int g : gia) {
              tong += g;
          }
          return tong;
      }

      static List<Integer> giaTren(List<Integer> gia, int nguong) {
          List<Integer> ketQua = new ArrayList<>();
          for (int g : gia) {
              if (g > nguong) {
                  ketQua.add(g);
              }
          }
          return ketQua;
      }
  }
checks: |
  eq("sum", () -> call("tongTien", java.util.List.of(100, 250, 50)), 400, "tongTien([100, 250, 50])");
  eq("sum0", () -> call("tongTien", java.util.List.of()), 0, "tongTien([]) với list rỗng");
  eq("above", () -> call("giaTren", java.util.List.of(300, 100, 500, 200), 200), java.util.List.of(300, 500), "giaTren([300, 100, 500, 200], 200)");
  eq("none", () -> call("giaTren", java.util.List.of(100, 150), 200), java.util.List.of(), "giaTren([100, 150], 200)");
tests:
  - text: '`tongTien([100, 250, 50])` trả về `400`'
    java: sum
  - text: '`tongTien` với list rỗng trả về `0`'
    java: sum0
  - text: '`giaTren([300, 100, 500, 200], 200)` trả về `[300, 500]` (không lấy giá bằng ngưỡng)'
    java: above
  - text: 'Không có giá nào đủ lớn thì trả về list rỗng'
    java: none
  - text: 'Console in `Tổng: 1765000` và `Trên 200000: [240000, 420000, 210000, 560000]`'
    stdout: { equals: "Tổng: 1765000\nTrên 200000: [240000, 420000, 210000, 560000]" }
hints:
  - 'Duyệt List giống hệt duyệt mảng: `for (int g : gia) { tong += g; }`'
  - 'Trong `giaTren`: `if (g > nguong) { ketQua.add(g); }`'
---

Duyệt một `List` cũng giống duyệt mảng, nhưng dùng `size()` thay cho `length`, và `get(i)` thay cho `[i]`:

```java
List<String> ds = List.of("Chrome", "Firefox", "Edge");

for (int i = 0; i < ds.size(); i++) {
    System.out.println(i + ": " + ds.get(i));
}

for (String td : ds) {             // for-each: gọn hơn, dùng nhiều nhất
    System.out.println(td);
}
```

> `List.of(...)` tạo nhanh một list có sẵn phần tử. Nhưng list này **không sửa được**: gọi `add` hay `remove` sẽ báo lỗi. Muốn thêm bớt thì dùng `new ArrayList<>()`.

## Mẫu "lọc ra list mới"

Một việc tester làm rất thường xuyên: từ một danh sách, lọc ra những phần tử thỏa điều kiện. Cách làm: tạo list rỗng, duyệt list gốc, phần tử nào đạt thì `add` vào list mới.

```java
List<String> conHang = new ArrayList<>();
for (String sp : tatCaSanPham) {
    if (!sp.contains("Hết hàng")) {
        conHang.add(sp);
    }
}
```

List gốc giữ nguyên, ta có thêm một list mới. Đây là thói quen tốt: **không sửa dữ liệu gốc** khi chỉ cần đọc.

## Liên hệ với Selenium

Trong Selenium, `driver.findElements(...)` trả về một `List<WebElement>`, tức là danh sách các phần tử tìm thấy trên trang. Bạn sẽ duyệt nó y như bài này: đọc giá từng thẻ sản phẩm, cộng tổng, kiểm tra thứ tự sắp xếp...

## Đến lượt bạn

Danh sách `gia` là giá của 6 sản phẩm ở Tiệm Trà Mộc. Viết:

1. `tongTien(gia)`: trả về tổng tất cả các giá.
2. `giaTren(gia, nguong)`: trả về list **mới** gồm các giá **lớn hơn** `nguong`, giữ nguyên thứ tự.

```
Tổng: 1765000
Trên 200000: [240000, 420000, 210000, 560000]
```
