---
title: "Dòng code đầu tiên"
type: code
minutes: 5
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello World");
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Xin chào, mình là tester tương lai!");
      }
  }
tests:
  - text: 'Chương trình in ra đúng dòng chữ `Xin chào, mình là tester tương lai!`'
    stdout: { equals: "Xin chào, mình là tester tương lai!" }
  - text: 'Vẫn dùng `System.out.println` để in'
    source: 'System\.out\.println\s*\('
hints:
  - 'Chỉ cần sửa phần chữ nằm **giữa hai dấu ngoặc kép** `"..."`. Đừng xóa dấu ngoặc kép nhé.'
  - 'Chữ phải giống hệt từng ký tự, kể cả dấu phẩy và dấu chấm than ở cuối.'
---

Nhìn sang khung tối màu bên phải. Đó là một chương trình Java hoàn chỉnh. Bạn chưa cần hiểu hết, hãy chú ý vào dòng ở giữa:

```java
System.out.println("Hello World");
```

Dòng này ra lệnh cho máy tính: **in ra màn hình** dòng chữ nằm giữa hai dấu ngoặc kép. Màn hình ở đây chính là khung **Console** phía dưới editor.

Thử ngay: bấm nút **▶ Chạy & kiểm tra** màu vàng. Bạn sẽ thấy `Hello World` hiện ra trong Console.

## Đến lượt bạn

Hãy sửa chương trình để nó in ra câu:

```
Xin chào, mình là tester tương lai!
```

Chỉ cần thay chữ `Hello World` bằng câu trên. Giữ nguyên dấu ngoặc kép `"` ở hai đầu, và dấu chấm phẩy `;` ở cuối dòng.

> **Lưu ý:** máy chấm rất "khó tính". Thiếu một dấu phẩy hay sai một dấu thanh là không đạt. Tester giỏi cũng cần đúng con mắt tỉ mỉ ấy!
