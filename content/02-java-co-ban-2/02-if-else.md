---
title: "if / else: ra quyết định"
type: code
minutes: 6
seed: |
  public class Main {
      public static void main(String[] args) {
          int tyLePass = 92;

          // Viết if / else ở đây

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          int tyLePass = 92;

          if (tyLePass >= 90) {
              System.out.println("Bản build ổn định, được phép release");
          } else {
              System.out.println("Chưa đủ điều kiện release");
          }
      }
  }
tests:
  - text: 'Dùng câu lệnh `if` với điều kiện `tyLePass >= 90`'
    source: 'if\s*\(\s*tyLePass\s*>=\s*90\s*\)'
  - text: 'Có nhánh `else`'
    source: '\}\s*else\s*\{'
  - text: 'Với `tyLePass = 92`, Console in ra `Bản build ổn định, được phép release`'
    stdout: { equals: "Bản build ổn định, được phép release" }
hints:
  - 'Cấu trúc: `if (điều kiện) { ... } else { ... }`. Đếm kỹ các dấu ngoặc nhọn.'
  - 'Thử đổi `tyLePass` thành `80` rồi chạy lại để xem nhánh `else` hoạt động. Nhớ đổi lại `92` trước khi nộp.'
---

Chương trình cần **ra quyết định**: nếu test pass thì làm việc này, nếu fail thì làm việc khác. Đó là việc của `if` / `else`:

```java
int soBug = 0;

if (soBug == 0) {
    System.out.println("Không có bug, tuyệt vời!");
} else {
    System.out.println("Còn bug, cần sửa tiếp");
}
```

Đọc như tiếng Việt: **nếu** (`if`) số bug bằng 0 **thì** in câu đầu, **ngược lại** (`else`) in câu sau.

- Điều kiện nằm trong ngoặc tròn `( )` và phải cho ra `true` / `false`.
- Code của mỗi nhánh nằm trong ngoặc nhọn `{ }`.
- Chỉ **một** trong hai nhánh được chạy, không bao giờ cả hai.
- Nhánh `else` không bắt buộc. Nếu không cần làm gì khi sai thì bỏ đi.

## Đến lượt bạn

Một bản build (phiên bản phần mềm) chỉ được phép **release** (phát hành) khi tỷ lệ test pass **từ 90 trở lên**.

- Nếu `tyLePass >= 90`: in `Bản build ổn định, được phép release`
- Ngược lại: in `Chưa đủ điều kiện release`
