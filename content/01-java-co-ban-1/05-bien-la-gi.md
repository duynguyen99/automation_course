---
title: "Biến: chiếc hộp có dán nhãn"
type: code
minutes: 6
seed: |
  public class Main {
      public static void main(String[] args) {
          int soTestCase = 12;
          System.out.println(soTestCase);

          // Tạo biến soBug ở đây

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          int soTestCase = 12;
          System.out.println(soTestCase);

          int soBug = 3;
          System.out.println(soBug);
      }
  }
tests:
  - text: 'Khai báo biến `soBug` kiểu `int`'
    source: 'int\s+soBug\s*='
  - text: 'Gán cho `soBug` giá trị `3`'
    source: 'soBug\s*=\s*3\s*;'
  - text: 'In biến `soBug` ra (không phải in chữ "soBug")'
    source: 'println\s*\(\s*soBug\s*\)'
  - text: 'Console in ra `12` rồi `3`'
    stdout: { equals: "12\n3" }
hints:
  - 'Bắt chước dòng `int soTestCase = 12;` ở trên.'
  - 'Khi in biến, **không** đặt tên biến trong dấu ngoặc kép: `System.out.println(soBug);`'
---

Chương trình cần **ghi nhớ** dữ liệu: số test case, tên trình duyệt, kết quả pass/fail... Để làm được, ta dùng **biến** (*variable*).

Hãy tưởng tượng biến là **một chiếc hộp có dán nhãn**:

- **Nhãn** là tên biến, ví dụ `soTestCase`.
- **Đồ bên trong** là giá trị, ví dụ `12`.
- **Loại hộp** là kiểu dữ liệu. Hộp `int` chỉ đựng số nguyên.

```java
int soTestCase = 12;
```

Đọc là: *"tạo một hộp kiểu `int`, dán nhãn `soTestCase`, bỏ số `12` vào trong"*.

## In biến và in chữ khác nhau thế nào?

```java
System.out.println(soTestCase);    // in ra: 12   (giá trị trong hộp)
System.out.println("soTestCase");  // in ra: soTestCase   (chỉ là chữ)
```

Có dấu ngoặc kép là **chữ**, không có thì là **tên biến**.

## Quy tắc đặt tên biến

- Bắt đầu bằng chữ cái thường, viết liền, **chữ đầu của từ tiếp theo viết hoa**: `soTestCase`, `tenTrinhDuyet`. Kiểu viết này gọi là **camelCase** (giống những cái bướu lạc đà).
- Không dấu tiếng Việt, không dấu cách, không bắt đầu bằng số.
- Đặt tên có ý nghĩa: `soBug` dễ hiểu hơn nhiều so với `x`.

## Đến lượt bạn

Tạo một biến kiểu `int` tên là `soBug`, có giá trị `3`, rồi in nó ra Console.
