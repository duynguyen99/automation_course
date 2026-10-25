---
title: "Method: đặt tên cho một nhóm việc"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Mở trình duyệt");
          System.out.println("Vào trang đăng nhập");
          System.out.println("Test 1: đăng nhập đúng");

          System.out.println("Mở trình duyệt");
          System.out.println("Vào trang đăng nhập");
          System.out.println("Test 2: sai mật khẩu");
      }

      // Tạo method chuanBi ở đây

  }
solution: |
  public class Main {
      public static void main(String[] args) {
          chuanBi();
          System.out.println("Test 1: đăng nhập đúng");

          chuanBi();
          System.out.println("Test 2: sai mật khẩu");
      }

      static void chuanBi() {
          System.out.println("Mở trình duyệt");
          System.out.println("Vào trang đăng nhập");
      }
  }
tests:
  - text: 'Có method `static void chuanBi()`'
    source: 'static\s+void\s+chuanBi\s*\(\s*\)\s*\{'
  - text: 'Trong `main`, gọi `chuanBi();` hai lần'
    source: 'chuanBi\s*\(\s*\)\s*;[\s\S]*chuanBi\s*\(\s*\)\s*;'
  - text: 'Chữ `"Mở trình duyệt"` chỉ còn xuất hiện **một lần** trong code'
    notSource: 'Mở trình duyệt[\s\S]*Mở trình duyệt'
  - text: 'Console vẫn in ra đúng 6 dòng như ban đầu'
    stdout: { equals: "Mở trình duyệt\nVào trang đăng nhập\nTest 1: đăng nhập đúng\nMở trình duyệt\nVào trang đăng nhập\nTest 2: sai mật khẩu" }
hints:
  - 'Method mới phải nằm **trong** class Main nhưng **ngoài** method main, ngay chỗ có comment "Tạo method chuanBi ở đây".'
  - 'Gọi method bằng cách viết tên của nó kèm ngoặc tròn và dấu chấm phẩy: `chuanBi();`'
---

Nhìn code bên phải: hai dòng "Mở trình duyệt", "Vào trang đăng nhập" bị **lặp lại**. Nếu có 50 test case, chúng sẽ lặp 50 lần. Rồi một ngày trang đăng nhập đổi địa chỉ, bạn phải sửa 50 chỗ!

**Method** giải quyết việc đó: gom một nhóm câu lệnh lại, đặt cho nó một cái tên, rồi **gọi** tên đó bất cứ khi nào cần.

```java
public class Main {
    public static void main(String[] args) {
        chaoHoi();      // gọi method
        chaoHoi();      // gọi lần nữa
    }

    static void chaoHoi() {             // định nghĩa method
        System.out.println("Xin chào!");
        System.out.println("Chúc một ngày tốt lành");
    }
}
```

- `static void chaoHoi()` là phần đầu của method. Lúc này cứ hiểu `void` là "method này chỉ làm việc, không trả về gì".
- Phần trong `{ }` là những việc method làm.
- Method được viết **trong class, bên cạnh `main`**, không phải bên trong `main`.
- Gọi method: `chaoHoi();`

> Thật ra `main` cũng là một method, method đặc biệt mà Java gọi đầu tiên.

## Đến lượt bạn

Tạo method `chuanBi()` chứa hai dòng in lặp lại, rồi thay chúng trong `main` bằng lời gọi `chuanBi();`. Kết quả in ra phải **giữ nguyên**, chỉ có code là gọn hơn. Sửa code mà không làm thay đổi hành vi như vậy gọi là **refactor**.
