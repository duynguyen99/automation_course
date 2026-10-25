---
title: "Tham số và return"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(tinhTongTien(150000, 2));
          System.out.println(apDungGiamGia(500000, 10));
      }

      // Viết method tinhTongTien ở đây

      // Viết method apDungGiamGia ở đây

  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(tinhTongTien(150000, 2));
          System.out.println(apDungGiamGia(500000, 10));
      }

      static int tinhTongTien(int donGia, int soLuong) {
          return donGia * soLuong;
      }

      static int apDungGiamGia(int tongTien, int phanTramGiam) {
          return tongTien - tongTien * phanTramGiam / 100;
      }
  }
checks: |
  eq("t1", () -> call("tinhTongTien", 150000, 2), 300000, "tinhTongTien(150000, 2)");
  eq("t2", () -> call("tinhTongTien", 99000, 0), 0, "tinhTongTien(99000, 0)");
  eq("t3", () -> call("apDungGiamGia", 500000, 10), 450000, "apDungGiamGia(500000, 10)");
  eq("t4", () -> call("apDungGiamGia", 200000, 0), 200000, "apDungGiamGia(200000, 0)");
  eq("t5", () -> call("apDungGiamGia", 80000, 100), 0, "apDungGiamGia(80000, 100)");
tests:
  - text: '`tinhTongTien(150000, 2)` trả về `300000`'
    java: t1
  - text: '`tinhTongTien(99000, 0)` trả về `0`'
    java: t2
  - text: '`apDungGiamGia(500000, 10)` trả về `450000`'
    java: t3
  - text: 'Giảm `0%` thì giữ nguyên giá'
    java: t4
  - text: 'Giảm `100%` thì về `0`'
    java: t5
hints:
  - 'Phần đầu method: `static int tinhTongTien(int donGia, int soLuong) { ... }`'
  - 'Số tiền được giảm = `tongTien * phanTramGiam / 100`. Lấy tổng tiền trừ đi số đó.'
---

Method ở trang trước chỉ làm một việc cố định. Method mạnh hơn nhiều khi nó **nhận dữ liệu vào** và **trả kết quả ra**, giống như một chiếc máy xay sinh tố: cho trái cây vào, nhận ly sinh tố ra.

```java
static int binhPhuong(int so) {
    return so * so;
}
```

- `int so` trong ngoặc là **tham số** (*parameter*): dữ liệu đưa vào method.
- `int` đứng trước tên method là **kiểu trả về**: method này sẽ trả về một số nguyên.
- `return` **trả kết quả** về cho nơi gọi và kết thúc method ngay lập tức.

Cách dùng:

```java
int ketQua = binhPhuong(4);          // ketQua = 16
System.out.println(binhPhuong(5));   // 25
```

Method có thể nhận nhiều tham số, ngăn cách bằng dấu phẩy:

```java
static String chaoNguoiDung(String ten, int tuoi) {
    return "Chào " + ten + ", " + tuoi + " tuổi";
}
```

> Bạn đã gặp method có `return` ở các trang trước (`xepLoai`, `demPass`...). Giờ bạn đã biết chính xác chúng hoạt động thế nào!

## Đến lượt bạn

Một trang bán hàng cần hai phép tính. Hãy viết hai method:

1. `tinhTongTien(int donGia, int soLuong)`: trả về đơn giá × số lượng.
2. `apDungGiamGia(int tongTien, int phanTramGiam)`: trả về số tiền sau khi giảm. Ví dụ 500000 giảm 10% còn 450000.

Cả hai đều trả về `int` và có từ khóa `static`.
