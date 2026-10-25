---
title: "static: của chung hay của riêng?"
type: code
minutes: 8
files:
  - name: TestCase.java
    content: |
      public class TestCase {
          private String name;
          // Thêm thuộc tính static count ở đây

          public TestCase(String name) {
              this.name = name;
              // Tăng count mỗi khi có test case mới
          }

          public String getName() {
              return name;
          }

          // Viết method static getCount() ở đây

      }
  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              TestCase t1 = new TestCase("Đăng nhập đúng mật khẩu");
              TestCase t2 = new TestCase("Đăng nhập sai mật khẩu");
              TestCase t3 = new TestCase("Tài khoản bị khóa");
              System.out.println(t3.getName());
              // In ra: Đã tạo 3 test case

          }
      }
solution:
  TestCase.java: |
    public class TestCase {
        private String name;
        private static int count = 0;

        public TestCase(String name) {
            this.name = name;
            count++;
        }

        public String getName() {
            return name;
        }

        public static int getCount() {
            return count;
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            TestCase t1 = new TestCase("Đăng nhập đúng mật khẩu");
            TestCase t2 = new TestCase("Đăng nhập sai mật khẩu");
            TestCase t3 = new TestCase("Tài khoản bị khóa");
            System.out.println(t3.getName());
            System.out.println("Đã tạo " + TestCase.getCount() + " test case");
        }
    }
checks: |
  ok("field", () -> java.util.Arrays.stream(cls("TestCase").getDeclaredFields()).anyMatch(f -> f.getName().equals("count") && java.lang.reflect.Modifier.isStatic(f.getModifiers())), "Cần thuộc tính static int count trong TestCase");
  ok("method", () -> { invokeStatic("TestCase", "getCount"); return true; }, "");
  eq("inc", () -> { int before = (Integer) invokeStatic("TestCase", "getCount"); newObj("TestCase", "Thêm vào giỏ hàng"); newObj("TestCase", "Thanh toán"); return (Integer) invokeStatic("TestCase", "getCount") - before; }, 2, "Số test case tăng thêm sau khi tạo 2 object mới");
  eq("name", () -> callOn(newObj("TestCase", "Tìm kiếm sản phẩm"), "getName"), "Tìm kiếm sản phẩm", "getName()");
tests:
  - text: '`TestCase` có thuộc tính `static` tên `count`'
    java: field
  - text: 'Có method `static` tên `getCount()`'
    java: method
  - text: 'Mỗi lần `new TestCase(...)`, `count` tăng thêm 1'
    java: inc
  - text: '`name` vẫn là của riêng từng object'
    java: name
  - text: 'Gọi `getCount()` qua tên class: `TestCase.getCount()`'
    source: 'TestCase\.getCount\s*\(\s*\)'
    file: Main.java
  - text: 'Console in ra `Tài khoản bị khóa` rồi `Đã tạo 3 test case`'
    stdout: { equals: "Tài khoản bị khóa\nĐã tạo 3 test case" }
hints:
  - 'Khai báo: `private static int count = 0;`. Trong constructor thêm `count++;`'
  - 'Method: `public static int getCount() { return count; }`'
  - 'Trong `main`: `System.out.println("Đã tạo " + TestCase.getCount() + " test case");`'
---

Mỗi `TestCase` có tên riêng. Nhưng nếu muốn biết **tổng cộng** đã tạo bao nhiêu test case thì sao? Con số đó không thuộc về test case nào cả, nó là của **chung**.

## Bảng tin chung của ký túc xá

Hãy tưởng tượng một ký túc xá:

- Mỗi phòng có **đồ riêng**: giường, tủ, tên người ở. Phòng nào cũng có, nhưng mỗi phòng một khác.
- Ở sảnh có **một tấm bảng tin chung**. Cả tòa nhà chỉ có đúng một tấm, ai sửa thì mọi người đều thấy.

Trong Java:

| | Không có `static` (instance) | Có `static` |
|---|---|---|
| Thuộc về | từng object | cả class |
| Có bao nhiêu bản | mỗi object một bản | đúng **một** bản |
| Gọi bằng | `t1.getName()` | `TestCase.getCount()` |

```java
public class TestCase {
    private String name;              // đồ riêng của từng test case
    private static int count = 0;     // bảng tin chung

    public TestCase(String name) {
        this.name = name;
        count++;                      // mỗi test case mới làm bảng tin tăng 1
    }

    public static int getCount() {
        return count;
    }
}
```

## Vì sao `main` có chữ `static`?

Khi chương trình bắt đầu, **chưa có object nào cả**. Java cần gọi `main` mà không phải `new` gì trước, nên `main` phải là `static`. Đó cũng là lý do các method ở chương 2 đều có `static`: chúng được gọi thẳng từ `main`.

> Một method `static` **không** dùng được thuộc tính riêng như `name`, vì nó không thuộc object nào: nếu `getCount()` viết `return name;`, Java sẽ hỏi lại "name của test case nào?" bằng một lỗi biên dịch.

## Static trong đời thực của tester

- `Math.max(3, 7)`, `String.valueOf(5)`: method static có sẵn, gọi qua tên class.
- Sau này bạn sẽ thấy `Assertions.assertThat(...)` của AssertJ và `By.id("username")` của Selenium, cũng là method static.

Quy tắc dễ nhớ: thứ gì **mỗi object một khác** thì không static; thứ gì **dùng chung** hoặc không cần object thì static.

## Đến lượt bạn

1. Trong `TestCase.java`, thêm thuộc tính `private static int count = 0;` và tăng nó trong constructor.
2. Viết `public static int getCount()` trả về `count`.
3. Trong `main`, in thêm dòng `Đã tạo 3 test case`, lấy số 3 bằng `TestCase.getCount()` chứ không viết cứng.
