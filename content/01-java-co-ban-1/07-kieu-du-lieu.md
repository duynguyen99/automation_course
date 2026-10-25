---
title: "Bốn kiểu dữ liệu hay dùng nhất"
type: code
minutes: 6
seed: |
  public class Main {
      public static void main(String[] args) {
          // Khai báo 3 biến ở đây

          System.out.println(thoiGianCho);
          System.out.println(daDangNhap);
          System.out.println(kyTuPhanCach);
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          double thoiGianCho = 2.5;
          boolean daDangNhap = false;
          char kyTuPhanCach = '-';
          System.out.println(thoiGianCho);
          System.out.println(daDangNhap);
          System.out.println(kyTuPhanCach);
      }
  }
tests:
  - text: '`thoiGianCho` là `double` có giá trị `2.5`'
    source: 'double\s+thoiGianCho\s*=\s*2\.5\s*;'
  - text: '`daDangNhap` là `boolean` có giá trị `false`'
    source: 'boolean\s+daDangNhap\s*=\s*false\s*;'
  - text: '`kyTuPhanCach` là `char` có giá trị `''-''`'
    source: "char\\s+kyTuPhanCach\\s*=\\s*'-'\\s*;"
  - text: 'Console in ra `2.5`, `false`, `-`'
    stdout: { equals: "2.5\nfalse\n-" }
hints:
  - 'Số thập phân dùng **dấu chấm**: `2.5`, không phải `2,5`.'
  - '`char` dùng dấu nháy **đơn** `''-''`, còn String dùng nháy **kép** `"-"`.'
---

Đây là những kiểu dữ liệu bạn sẽ dùng 95% thời gian:

| Kiểu | Đựng gì | Ví dụ |
|---|---|---|
| `int` | Số nguyên | `int soLanThu = 3;` |
| `double` | Số thập phân | `double giaTien = 199.99;` |
| `boolean` | Đúng hoặc sai | `boolean daPass = true;` |
| `String` | Chữ, câu | `String url = "https://...";` |

Thêm một kiểu ít gặp hơn: `char` chứa **đúng một ký tự**, viết trong dấu nháy đơn: `char hang = 'A';`.

## boolean: kiểu dữ liệu của tester

`boolean` chỉ có hai giá trị: `true` (đúng) và `false` (sai). Mọi bài test cuối cùng đều trả lời một câu hỏi có/không: *nút có hiện không? thông báo có đúng không? test pass hay fail?* Vì vậy bạn sẽ gặp `boolean` rất nhiều.

## Đến lượt bạn

Phía dưới đã có sẵn các dòng in, nhưng chương trình **đang lỗi** vì chưa có biến nào. Hãy khai báo:

- `thoiGianCho` kiểu `double`, giá trị `2.5`
- `daDangNhap` kiểu `boolean`, giá trị `false`
- `kyTuPhanCach` kiểu `char`, giá trị `'-'`

> Thử bấm Chạy trước khi sửa để xem lỗi `cannot find symbol` trông như thế nào. Bạn sẽ gặp nó thường xuyên!
