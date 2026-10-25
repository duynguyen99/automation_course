---
title: "Comment: ghi chú cho con người"
type: code
minutes: 4
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Bắt đầu chạy test");
          System.out.println("Bước này đang lỗi, tạm bỏ qua");
          System.out.println("Kết thúc");
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          // Test đăng nhập
          System.out.println("Bắt đầu chạy test");
          // System.out.println("Bước này đang lỗi, tạm bỏ qua");
          System.out.println("Kết thúc");
      }
  }
tests:
  - text: 'Console chỉ còn in `Bắt đầu chạy test` và `Kết thúc`'
    stdout: { equals: "Bắt đầu chạy test\nKết thúc" }
  - text: 'Dòng in `Bước này đang lỗi, tạm bỏ qua` vẫn còn trong code, nhưng đã bị biến thành comment'
    source: '//.*Bước này đang lỗi'
    raw: true
  - text: 'Có thêm comment `// Test đăng nhập`'
    source: '//\s*Test đăng nhập'
    raw: true
hints:
  - 'Chỉ cần gõ `//` vào đầu dòng muốn "tắt".'
---

**Comment** là những dòng ghi chú mà Java **bỏ qua hoàn toàn** khi chạy. Chúng được viết cho người đọc code (đồng nghiệp, hoặc chính bạn ba tháng sau).

Có hai kiểu comment:

```java
// Comment một dòng: mọi thứ sau dấu // đến hết dòng

/*
  Comment nhiều dòng:
  nằm giữa dấu mở và dấu đóng
*/
```

## Mẹo của dân trong nghề

Ngoài việc ghi chú, tester còn dùng comment để **tạm tắt** một dòng code mà không phải xóa nó:

```java
System.out.println("Bước 1");
// System.out.println("Bước 2");   ← tạm thời không chạy
System.out.println("Bước 3");
```

> Phím tắt trong hầu hết editor (kể cả editor bên phải): đặt con trỏ vào dòng rồi bấm `Ctrl + /`.

## Đến lượt bạn

1. **Tắt** dòng in `"Bước này đang lỗi, tạm bỏ qua"` bằng cách biến nó thành comment (đừng xóa).
2. Thêm comment `// Test đăng nhập` ở dòng đầu tiên bên trong `main`.
