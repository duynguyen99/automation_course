---
title: "print và println"
type: code
minutes: 4
seed: |
  public class Main {
      public static void main(String[] args) {
          System.out.println("Kết quả: ");
          System.out.println("PASS");
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          System.out.print("Kết quả: ");
          System.out.println("PASS");
      }
  }
tests:
  - text: 'Console in ra đúng một dòng: `Kết quả: PASS`'
    stdout: { equals: "Kết quả: PASS" }
  - text: 'Có dùng `System.out.print(` (không có "ln")'
    source: 'System\.out\.print\s*\('
---

Java có hai cách in ra màn hình, chỉ khác nhau hai chữ cái:

| Câu lệnh | In xong thì... |
|---|---|
| `System.out.println("...")` | **xuống dòng** (`ln` = *line*) |
| `System.out.print("...")` | **ở lại** dòng hiện tại, nội dung tiếp theo in nối vào ngay sau |

Ví dụ:

```java
System.out.print("Chrome ");
System.out.print("Firefox ");
System.out.println("Edge");
System.out.println("Xong!");
```

Console:

```
Chrome Firefox Edge
Xong!
```

## Đến lượt bạn

Chương trình hiện đang in ra hai dòng:

```
Kết quả: 
PASS
```

Hãy sửa **một chỗ** để nó in trên cùng một dòng:

```
Kết quả: PASS
```
