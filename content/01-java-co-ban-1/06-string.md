---
title: "String: biến chứa chữ"
type: code
minutes: 5
seed: |
  public class Main {
      public static void main(String[] args) {
          String trinhDuyet = "Chrome";
          System.out.println(trinhDuyet);

          // Tạo biến tenTester và trangWeb ở đây

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String trinhDuyet = "Chrome";
          System.out.println(trinhDuyet);

          String tenTester = "Lan";
          String trangWeb = "https://shop.qa-academy.dev";
          System.out.println(tenTester);
          System.out.println(trangWeb);
      }
  }
tests:
  - text: 'Khai báo biến `tenTester` kiểu `String`'
    source: 'String\s+tenTester\s*=\s*"'
  - text: 'Khai báo biến `trangWeb` kiểu `String` có giá trị `https://shop.qa-academy.dev`'
    source: 'String\s+trangWeb\s*=\s*"https://shop\.qa-academy\.dev"\s*;'
  - text: 'In cả hai biến ra Console (dòng 2 là tên của bạn, dòng 3 là địa chỉ web)'
    stdout: { regex: '^Chrome\n.+\nhttps://shop\.qa-academy\.dev$' }
  - text: 'In bằng tên biến, không gõ lại chữ'
    source: 'println\s*\(\s*tenTester\s*\)[\s\S]*println\s*\(\s*trangWeb\s*\)'
hints:
  - '`String` viết hoa chữ S. `string` viết thường sẽ bị lỗi.'
---

Số nguyên thì dùng `int`. Còn **chữ** (một từ, một câu, một đường link...) thì dùng kiểu **String**:

```java
String trinhDuyet = "Chrome";
String loiChao = "Xin chào, Lan!";
```

Hai điều cần nhớ:

1. `String` **viết hoa chữ S** (khác với `int` viết thường, lý do sẽ rõ khi học về class).
2. Giá trị phải nằm trong **dấu ngoặc kép** `"..."`.

Trong automation test, String xuất hiện ở khắp nơi: địa chỉ trang web, tên đăng nhập, mật khẩu, nội dung thông báo cần kiểm tra...

## Đến lượt bạn

Tạo thêm hai biến `String`:

- `tenTester` chứa tên của bạn (tên gì cũng được).
- `trangWeb` chứa địa chỉ `https://shop.qa-academy.dev`

Sau đó in `tenTester` rồi in `trangWeb` ra Console, mỗi biến một dòng.
