---
title: "So sánh: câu hỏi đúng hay sai"
type: code
minutes: 6
seed: |
  public class Main {
      public static void main(String[] args) {
          int giaMongDoi = 250000;
          int giaHienThi = 250000;
          int thoiGianTai = 4;

          // Tạo 2 biến boolean ở đây

          System.out.println(dungGia);
          System.out.println(taiNhanh);
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          int giaMongDoi = 250000;
          int giaHienThi = 250000;
          int thoiGianTai = 4;

          boolean dungGia = giaHienThi == giaMongDoi;
          boolean taiNhanh = thoiGianTai <= 3;

          System.out.println(dungGia);
          System.out.println(taiNhanh);
      }
  }
tests:
  - text: '`dungGia` là `boolean`, so sánh `giaHienThi` với `giaMongDoi` bằng `==`'
    source: 'boolean\s+dungGia\s*=\s*(giaHienThi\s*==\s*giaMongDoi|giaMongDoi\s*==\s*giaHienThi)\s*;'
  - text: '`taiNhanh` là `boolean`, kiểm tra `thoiGianTai <= 3`'
    source: 'boolean\s+taiNhanh\s*=\s*thoiGianTai\s*<=\s*3\s*;'
  - text: 'Console in ra `true` rồi `false`'
    stdout: { equals: "true\nfalse" }
hints:
  - 'So sánh bằng là **hai** dấu bằng `==`. Một dấu `=` là phép gán.'
---

Công việc cốt lõi của tester là **so sánh**: kết quả thực tế có giống kết quả mong đợi không? Trong Java, mỗi phép so sánh cho ra một giá trị `boolean`, tức là `true` hoặc `false`.

| Phép so sánh | Ý nghĩa | Ví dụ | Kết quả |
|---|---|---|---|
| `==` | bằng | `5 == 5` | `true` |
| `!=` | khác | `5 != 3` | `true` |
| `>` | lớn hơn | `5 > 7` | `false` |
| `<` | nhỏ hơn | `5 < 7` | `true` |
| `>=` | lớn hơn hoặc bằng | `5 >= 5` | `true` |
| `<=` | nhỏ hơn hoặc bằng | `8 <= 5` | `false` |

Kết quả so sánh có thể lưu vào biến:

```java
int soLoi = 0;
boolean khongCoLoi = soLoi == 0;    // true
```

> **Nhớ kỹ:** `=` là **gán** (bỏ giá trị vào hộp), `==` là **so sánh bằng**. Nhầm hai cái này là lỗi kinh điển.

## Đến lượt bạn

Một trang sản phẩm cần kiểm tra hai điều. Hãy tạo hai biến `boolean`:

- `dungGia`: giá hiển thị có **bằng** giá mong đợi không?
- `taiNhanh`: thời gian tải trang có **nhỏ hơn hoặc bằng 3** giây không?
