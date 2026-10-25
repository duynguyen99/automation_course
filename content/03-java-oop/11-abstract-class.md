---
title: "Abstract class: khung sườn có sẵn một nửa"
type: code
minutes: 9
files:
  - name: BaseTest.java
    content: |
      public class BaseTest {
          public String setUp() {
              return "Mở trình duyệt";
          }

          public String tearDown() {
              return "Đóng trình duyệt";
          }

          // Biến method này thành abstract (không có thân)
          public String testBody() {
              return "(chưa có nội dung test)";
          }

          public String run() {
              return setUp() + " | " + testBody() + " | " + tearDown();
          }
      }
  - name: LoginTest.java
    content: |
      // Viết class LoginTest kế thừa BaseTest ở đây

  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              BaseTest test = new BaseTest();
              System.out.println(test.run());
          }
      }
solution:
  BaseTest.java: |
    public abstract class BaseTest {
        public String setUp() {
            return "Mở trình duyệt";
        }

        public String tearDown() {
            return "Đóng trình duyệt";
        }

        public abstract String testBody();

        public String run() {
            return setUp() + " | " + testBody() + " | " + tearDown();
        }
    }
  LoginTest.java: |
    public class LoginTest extends BaseTest {
        @Override
        public String testBody() {
            return "Đăng nhập với lan";
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            BaseTest test = new LoginTest();
            System.out.println(test.run());
        }
    }
checks: |
  ok("abs", () -> isAbstract("BaseTest"), "BaseTest chưa phải abstract class");
  ok("absm", () -> java.util.Arrays.stream(cls("BaseTest").getDeclaredMethods()).anyMatch(m -> m.getName().equals("testBody") && java.lang.reflect.Modifier.isAbstract(m.getModifiers())), "Method testBody() trong BaseTest phải là abstract (không có thân)");
  ok("ext", () -> extendsClass("LoginTest", "BaseTest"), "LoginTest chưa extends BaseTest");
  eq("run", () -> callOn(newObj("LoginTest"), "run"), "Mở trình duyệt | Đăng nhập với lan | Đóng trình duyệt", "new LoginTest().run()");
tests:
  - text: '`BaseTest` là `abstract class`'
    java: abs
  - text: '`testBody()` trong `BaseTest` là method `abstract`'
    java: absm
  - text: '`LoginTest` kế thừa `BaseTest`'
    java: ext
  - text: '`new LoginTest().run()` trả về `Mở trình duyệt | Đăng nhập với lan | Đóng trình duyệt`'
    java: run
  - text: 'Console in ra đúng dòng đó'
    stdout: { equals: "Mở trình duyệt | Đăng nhập với lan | Đóng trình duyệt" }
hints:
  - 'Thêm `abstract` vào hai chỗ: `public abstract class BaseTest` và `public abstract String testBody();` (bỏ thân `{ ... }`, kết thúc bằng `;`).'
  - 'Lúc đó `new BaseTest()` trong `main` sẽ báo lỗi "BaseTest is abstract; cannot be instantiated". Hãy đổi thành `new LoginTest()`.'
  - '`public class LoginTest extends BaseTest { @Override public String testBody() { return "Đăng nhập với lan"; } }`'
---

Mọi test giao diện web đều theo cùng một nhịp: **mở trình duyệt → làm các bước test → đóng trình duyệt**. Bước đầu và bước cuối lúc nào cũng giống nhau, chỉ có phần giữa là khác.

## Interface hay class thường đều chưa vừa

- Class thường: phải viết sẵn `testBody()` cho cha, nhưng cha thì biết test gì đâu?
- Interface: chỉ có hợp đồng, không chứa được phần code chung "mở/đóng trình duyệt".

**Abstract class** (lớp trừu tượng) nằm ở giữa: nó có **cả** method viết sẵn **lẫn** method bỏ trống để con điền vào.

```java
public abstract class BaseTest {
    public String setUp() {
        return "Mở trình duyệt";          // viết sẵn, dùng chung
    }

    public abstract String testBody();   // bỏ trống: con BẮT BUỘC phải viết

    public String run() {
        return setUp() + " | " + testBody() + " | tearDown...";
    }
}
```

Hai luật quan trọng:

1. Method `abstract` không có thân, kết thúc bằng `;`. Class con **bắt buộc** override nó (nếu không thì con cũng phải là abstract).
2. **Không thể** `new BaseTest()`. Một khung sườn còn thiếu thì chưa dùng được, giống như mẫu đơn chưa điền thì chưa nộp được.

## Mẫu "khung có sẵn, chỗ trống để điền"

Để ý `run()`: nó gọi `testBody()` dù cha không biết phần thân là gì. Khi chạy `new LoginTest().run()`, Java tự gọi đúng `testBody()` của `LoginTest`. Cha lo **thứ tự**, con lo **nội dung**.

## Đây chính là `BaseTest` của các dự án thật

Ở chương JUnit và Cucumber, bạn sẽ thấy các annotation như `@BeforeEach` / `@AfterEach` (hay `@Before` / `@After` trong Cucumber) đánh dấu bước mở và đóng trình duyệt. Nhiều đội đặt chúng trong một `abstract class BaseTest`, rồi mọi class test chỉ việc `extends BaseTest` và tập trung vào nội dung test.

## Đến lượt bạn

1. Biến `BaseTest` thành `abstract class`, và biến `testBody()` thành method `abstract` (xóa thân).
2. Trong `LoginTest.java`, viết `LoginTest extends BaseTest`, override `testBody()` trả về `Đăng nhập với lan`.
3. Trong `main`, đổi `new BaseTest()` thành `new LoginTest()` (giữ nguyên kiểu biến `BaseTest`). Console phải in:

```
Mở trình duyệt | Đăng nhập với lan | Đóng trình duyệt
```
