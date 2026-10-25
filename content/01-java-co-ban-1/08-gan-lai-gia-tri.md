---
title: "Thay đổi giá trị của biến"
type: code
minutes: 4
seed: |
  public class Main {
      public static void main(String[] args) {
          String trangThai = "Đang chạy";
          System.out.println(trangThai);

          // Đổi trangThai thành "Hoàn thành" rồi in lại

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String trangThai = "Đang chạy";
          System.out.println(trangThai);

          trangThai = "Hoàn thành";
          System.out.println(trangThai);
      }
  }
tests:
  - text: 'Gán lại `trangThai = "Hoàn thành";` mà **không** khai báo lại kiểu `String`'
    source: '^\s*trangThai\s*=\s*"Hoàn thành"\s*;'
  - text: 'Chỉ khai báo `String trangThai` một lần'
    notSource: 'String\s+trangThai[\s\S]*String\s+trangThai'
  - text: 'Console in ra `Đang chạy` rồi `Hoàn thành`'
    stdout: { equals: "Đang chạy\nHoàn thành" }
---

Biến được gọi là "biến" vì giá trị của nó **có thể thay đổi**. Để bỏ giá trị mới vào hộp, ta viết tên biến, dấu `=`, rồi giá trị mới. **Không** ghi lại kiểu dữ liệu:

```java
int soLanThu = 1;     // khai báo: tạo hộp mới
soLanThu = 2;         // gán lại: thay đồ trong hộp
soLanThu = 3;
System.out.println(soLanThu);   // 3
```

Nếu viết `int soLanThu = 2;` lần thứ hai, Java sẽ báo lỗi *variable soLanThu is already defined*, vì bạn đang cố tạo một hộp mới trùng nhãn với hộp cũ.

> Trong Java, dấu `=` nghĩa là **gán** ("bỏ vào"), không phải "bằng nhau" như trong toán. Phép so sánh bằng nhau là `==`, bạn sẽ học ở chương sau.

## Đến lượt bạn

Gán lại `trangThai` thành `"Hoàn thành"`, rồi in nó ra một lần nữa.
