---
title: "&&, || và !: kết hợp điều kiện"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(choPhepDangNhap(true, false, false));
      }

      static boolean choPhepDangNhap(boolean dungTaiKhoan, boolean dungMatKhau, boolean biKhoa) {
          // Sửa dòng return bên dưới
          return false;
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println(choPhepDangNhap(true, false, false));
      }

      static boolean choPhepDangNhap(boolean dungTaiKhoan, boolean dungMatKhau, boolean biKhoa) {
          return dungTaiKhoan && dungMatKhau && !biKhoa;
      }
  }
checks: |
  eq("t1", () -> call("choPhepDangNhap", true, true, false), true, "choPhepDangNhap(true, true, false)");
  eq("t2", () -> call("choPhepDangNhap", true, false, false), false, "choPhepDangNhap(true, false, false)");
  eq("t3", () -> call("choPhepDangNhap", false, true, false), false, "choPhepDangNhap(false, true, false)");
  eq("t4", () -> call("choPhepDangNhap", true, true, true), false, "choPhepDangNhap(true, true, true)");
tests:
  - text: 'Đúng tài khoản, đúng mật khẩu, không bị khóa → `true`'
    java: t1
  - text: 'Sai mật khẩu → `false`'
    java: t2
  - text: 'Sai tài khoản → `false`'
    java: t3
  - text: 'Tài khoản bị khóa thì dù đúng hết cũng → `false`'
    java: t4
  - text: 'Dùng toán tử `&&` và `!`'
    source: '&&[\s\S]*!|![\s\S]*&&'
hints:
  - 'Có thể viết hết trong một dòng: `return điều_kiện_1 && điều_kiện_2 && điều_kiện_3;`'
  - '"Không bị khóa" viết là `!biKhoa`.'
---

Nhiều khi một điều kiện thôi là chưa đủ. Java có ba toán tử để kết hợp các giá trị `boolean`:

| Toán tử | Đọc là | Đúng khi |
|---|---|---|
| `a && b` | a **và** b | **cả hai** đều đúng |
| `a \|\| b` | a **hoặc** b | **ít nhất một** cái đúng |
| `!a` | **không** a | a sai |

Ví dụ trong một trang thanh toán:

```java
boolean coHang = true;
boolean daDangNhap = false;

boolean duocThanhToan = coHang && daDangNhap;        // false
boolean hienBanner = !daDangNhap;                     // true
boolean canHoTro = !coHang || !daDangNhap;            // true
```

Vì kết quả cũng là `boolean`, bạn có thể đặt nó thẳng vào `if (...)` hoặc `return` nó luôn.

## Đến lượt bạn

Viết method `choPhepDangNhap` trả về `true` **chỉ khi**: tài khoản đúng **và** mật khẩu đúng **và** tài khoản **không** bị khóa.

> Bạn đang làm đúng công việc của tester: liệt kê các trường hợp (đúng hết, sai mật khẩu, sai tài khoản, bị khóa) rồi kiểm tra từng cái. Bốn bài kiểm tra bên dưới chính là bốn test case!
