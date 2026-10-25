---
title: "Phép tính số học"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          int tongTest = 20;
          int soPass = 17;

          int soFail = 0;      // sửa dòng này
          int phanTram = 0;    // sửa dòng này

          System.out.println(soFail);
          System.out.println(phanTram);
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          int tongTest = 20;
          int soPass = 17;

          int soFail = tongTest - soPass;
          int phanTram = soPass * 100 / tongTest;

          System.out.println(soFail);
          System.out.println(phanTram);
      }
  }
tests:
  - text: '`soFail` được tính bằng phép trừ từ `tongTest` và `soPass`'
    source: 'soFail\s*=\s*tongTest\s*-\s*soPass'
  - text: '`phanTram` được tính từ `soPass` và `tongTest` (không gõ thẳng số 85)'
    source: 'phanTram\s*=.*soPass.*tongTest'
  - text: 'Console in ra `3` rồi `85`'
    stdout: { equals: "3\n85" }
hints:
  - 'Phần trăm pass = số pass × 100 ÷ tổng số test.'
  - 'Nhân trước rồi mới chia: `soPass * 100 / tongTest`. Nếu viết `soPass / tongTest * 100` bạn sẽ được 0. Đọc lại phần "cái bẫy" để biết vì sao.'
---

Java tính toán được như một chiếc máy tính bỏ túi:

| Phép | Ký hiệu | Ví dụ | Kết quả |
|---|---|---|---|
| Cộng | `+` | `7 + 3` | `10` |
| Trừ | `-` | `7 - 3` | `4` |
| Nhân | `*` | `7 * 3` | `21` |
| Chia | `/` | `7 / 2` | `3` (!!) |
| Chia lấy dư | `%` | `7 % 2` | `1` |

Bạn có thể tính với biến và lưu kết quả vào biến khác:

```java
int a = 10;
int b = 4;
int tong = a + b;   // 14
```

## Cái bẫy của phép chia

`7 / 2` cho ra `3`, không phải `3.5`! Khi **cả hai số đều là `int`**, Java chia lấy phần nguyên và **bỏ hẳn phần thập phân**. Vì vậy `17 / 20` ra `0`.

Muốn có phần thập phân, ít nhất một số phải là `double`: `7.0 / 2` cho ra `3.5`.

## Đến lượt bạn

Một lần chạy test có 20 test case, 17 cái pass. Hãy tính:

- `soFail`: số test fail, bằng tổng trừ số pass.
- `phanTram`: tỷ lệ pass tính theo phần trăm (số nguyên).

Hãy dùng **tên biến** trong phép tính, đừng tính nhẩm rồi gõ thẳng kết quả. Lập trình viên giỏi để máy tính làm việc tính toán!
