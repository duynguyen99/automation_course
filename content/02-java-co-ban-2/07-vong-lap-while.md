---
title: "Vòng lặp while: thử lại đến khi được"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          int lanThu = 1;
          boolean thanhCong = false;

          // Viết vòng lặp while ở đây

          System.out.println("Tổng số lần thử: " + lanThu);
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          int lanThu = 1;
          boolean thanhCong = false;

          while (!thanhCong) {
              System.out.println("Thử kết nối lần " + lanThu);
              if (lanThu == 3) {
                  thanhCong = true;
              } else {
                  lanThu++;
              }
          }

          System.out.println("Tổng số lần thử: " + lanThu);
      }
  }
tests:
  - text: 'In ra `Thử kết nối lần 1`, `lần 2`, `lần 3`, mỗi lần một dòng'
    stdout: { includes: "Thử kết nối lần 1\nThử kết nối lần 2\nThử kết nối lần 3\n" }
  - text: 'Không thử thêm lần thứ 4'
    stdout: { notIncludes: "lần 4" }
  - text: 'Dòng cuối là `Tổng số lần thử: 3`'
    stdout: { regex: '\nTổng số lần thử: 3$' }
  - text: 'Dùng vòng lặp `while`'
    source: 'while\s*\('
hints:
  - 'Điều kiện của vòng lặp: `while (!thanhCong)`, tức là "khi chưa thành công thì còn thử".'
  - 'Trong vòng lặp: in dòng "Thử kết nối lần ...", rồi `if (lanThu == 3)` thì đặt `thanhCong = true;`, ngược lại thì tăng `lanThu++`.'
---

`for` hợp với trường hợp **biết trước** phải lặp mấy lần. Còn khi chỉ biết **điều kiện dừng**, ta dùng `while`:

```java
while (điều_kiện) {
    // lặp lại chừng nào điều kiện còn đúng
}
```

## Ứng dụng thật: thử lại (retry)

Trong automation, trang web đôi khi tải chậm hoặc mạng chập chờn. Test lúc pass lúc fail như vậy gọi là **flaky test**. Một cách xử lý phổ biến là **thử lại** vài lần:

```java
int lanThu = 1;
while (lanThu <= 3) {
    System.out.println("Thử lần " + lanThu);
    lanThu++;
}
```

> **Cẩn thận vòng lặp vô hạn!** Nếu điều kiện không bao giờ sai (ví dụ quên `lanThu++`), chương trình sẽ chạy mãi. Đừng lo, máy chấm sẽ tự dừng sau vài giây và báo "Chương trình chạy quá lâu".

## Đến lượt bạn

Giả lập việc kết nối tới máy chủ. Kết nối sẽ **thành công ở lần thử thứ 3**. Dùng vòng lặp `while` để:

1. Mỗi lần thử, in ra `Thử kết nối lần X`.
2. Nếu đang ở lần thứ 3 thì đánh dấu `thanhCong = true` để dừng vòng lặp.
3. Nếu chưa, tăng `lanThu` lên 1.

Console mong đợi:

```
Thử kết nối lần 1
Thử kết nối lần 2
Thử kết nối lần 3
Tổng số lần thử: 3
```
