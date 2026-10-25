---
title: "In nhiều dòng"
type: code
minutes: 5
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Test case: Đăng nhập");
          // Viết thêm 2 dòng println ở dưới đây

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Test case: Đăng nhập");
          System.out.println("Bước 1: Mở trang đăng nhập");
          System.out.println("Bước 2: Nhập tài khoản");
      }
  }
tests:
  - text: 'Dòng 1 in ra `Test case: Đăng nhập`'
    stdout: { regex: '^Test case: Đăng nhập\n' }
  - text: 'Dòng 2 in ra `Bước 1: Mở trang đăng nhập`'
    stdout: { regex: '\nBước 1: Mở trang đăng nhập\n' }
  - text: 'Dòng 3 in ra `Bước 2: Nhập tài khoản`'
    stdout: { regex: '\nBước 2: Nhập tài khoản$' }
  - text: 'Console có đúng 3 dòng, không thừa không thiếu'
    stdout: { regex: '^[^\n]+\n[^\n]+\n[^\n]+$' }
hints:
  - 'Copy dòng `System.out.println("Test case: Đăng nhập");` rồi dán xuống dưới, sau đó sửa phần chữ.'
  - 'Thứ tự các dòng code chính là thứ tự các dòng in ra.'
---

Các câu lệnh trong `main` chạy **lần lượt từ trên xuống dưới**. Mỗi lần gọi `System.out.println`, Java in ra một dòng rồi xuống dòng mới.

```java
System.out.println("Một");
System.out.println("Hai");
```

Console sẽ hiện:

```
Một
Hai
```

## Đến lượt bạn

Trong editor, chương trình đang in dòng đầu tiên của một test case. Hãy viết thêm **2 câu lệnh** để Console hiện đúng 3 dòng:

```
Test case: Đăng nhập
Bước 1: Mở trang đăng nhập
Bước 2: Nhập tài khoản
```

> Dòng bắt đầu bằng `//` là một **comment** (ghi chú). Java bỏ qua nó khi chạy. Bạn sẽ học kỹ ở trang sau.
