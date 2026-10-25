---
title: "enum: danh sách lựa chọn cố định"
type: code
minutes: 8
files:
  - name: TestStatus.java
    content: |
      // Viết enum TestStatus ở đây

  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              // Duyệt TestStatus.values() và in mô tả của từng trạng thái

          }

          // Viết method moTa ở đây

      }
solution:
  TestStatus.java: |
    public enum TestStatus {
        PASSED, FAILED, SKIPPED
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            for (TestStatus s : TestStatus.values()) {
                System.out.println(s + " = " + moTa(s));
            }
        }

        static String moTa(TestStatus status) {
            if (status == TestStatus.PASSED) {
                return "Đạt";
            } else if (status == TestStatus.FAILED) {
                return "Không đạt";
            } else {
                return "Bỏ qua";
            }
        }
    }
checks: |
  ok("enum", () -> cls("TestStatus").isEnum(), "TestStatus phải là một enum (public enum TestStatus { ... })");
  eq("values", () -> java.util.Arrays.stream(cls("TestStatus").getEnumConstants()).map(String::valueOf).toList(), java.util.List.of("PASSED", "FAILED", "SKIPPED"), "Các giá trị của TestStatus");
  eq("passed", () -> call("moTa", Enum.valueOf((Class) cls("TestStatus"), "PASSED")), "Đạt", "moTa(TestStatus.PASSED)");
  eq("failed", () -> call("moTa", Enum.valueOf((Class) cls("TestStatus"), "FAILED")), "Không đạt", "moTa(TestStatus.FAILED)");
  eq("skipped", () -> call("moTa", Enum.valueOf((Class) cls("TestStatus"), "SKIPPED")), "Bỏ qua", "moTa(TestStatus.SKIPPED)");
tests:
  - text: '`TestStatus` là một `enum`'
    java: enum
  - text: 'Có đúng 3 giá trị theo thứ tự `PASSED`, `FAILED`, `SKIPPED`'
    java: values
  - text: '`moTa(TestStatus.PASSED)` trả về `Đạt`'
    java: passed
  - text: '`moTa(TestStatus.FAILED)` trả về `Không đạt`'
    java: failed
  - text: '`moTa(TestStatus.SKIPPED)` trả về `Bỏ qua`'
    java: skipped
  - text: 'Duyệt bằng `TestStatus.values()`'
    source: 'TestStatus\.values\(\)'
  - text: 'Console in đúng 3 dòng theo đề'
    stdout: { equals: "PASSED = Đạt\nFAILED = Không đạt\nSKIPPED = Bỏ qua" }
hints:
  - '`public enum TestStatus { PASSED, FAILED, SKIPPED }`'
  - '`static String moTa(TestStatus status) { if (status == TestStatus.PASSED) { return "Đạt"; } ... }`'
  - 'Trong `main`: `for (TestStatus s : TestStatus.values()) { System.out.println(s + " = " + moTa(s)); }`'
---

Kết quả của một test chỉ có thể là **Đạt**, **Không đạt** hoặc **Bỏ qua**. Nếu lưu bằng String, sớm muộn sẽ có người gõ `"Passed"`, `"PASS"`, `"pased"`... và mọi phép so sánh `equals` đều trật. Lỗi chính tả kiểu này Java không phát hiện được, vì String nào cũng hợp lệ.

## enum: chỉ những giá trị cho phép

```java
public enum TestStatus {
    PASSED, FAILED, SKIPPED
}
```

**enum** (*enumeration*, liệt kê) là một kiểu đặc biệt mà các giá trị đã được **định sẵn**. Biến kiểu `TestStatus` chỉ có thể là một trong ba giá trị đó:

```java
TestStatus kq = TestStatus.PASSED;    // hợp lệ
TestStatus sai = TestStatus.PASS;     // lỗi biên dịch: không có giá trị PASS
```

Gõ sai là Java báo ngay **trước khi chạy**. Đó là lý do enum an toàn hơn String rất nhiều.

> Quy ước: tên các giá trị enum viết **HOA TOÀN BỘ**, nối bằng dấu gạch dưới nếu nhiều từ: `NOT_STARTED`.

## Dùng enum

| Cách dùng | Ví dụ | Kết quả |
|---|---|---|
| So sánh bằng `==` | `kq == TestStatus.PASSED` | `true` |
| In ra | `System.out.println(kq)` | `PASSED` |
| Lấy tất cả giá trị | `TestStatus.values()` | mảng `[PASSED, FAILED, SKIPPED]` |
| Đổi từ String | `TestStatus.valueOf("FAILED")` | `TestStatus.FAILED` |

Với enum, so sánh bằng `==` là **đúng** (khác với String), vì mỗi giá trị enum chỉ tồn tại đúng một bản duy nhất.

`valueOf` rất hữu ích khi đọc dữ liệu dạng chữ (từ file, từ trang web). Nếu chữ không khớp giá trị nào, nó ném `IllegalArgumentException`, đúng tinh thần "fail fast" của trang trước.

## enum trong automation

- `BrowserType { CHROME, FIREFOX, EDGE }`: chọn trình duyệt để chạy test.
- `Environment { DEV, STAGING, PRODUCTION }`: chọn môi trường test.
- Selenium có sẵn enum `Keys` (`Keys.ENTER`, `Keys.TAB`...) để gửi phím đặc biệt vào ô nhập.

## Đến lượt bạn

1. Trong `TestStatus.java`, viết `public enum TestStatus` với 3 giá trị theo thứ tự: `PASSED`, `FAILED`, `SKIPPED`.
2. Trong `Main.java`, viết `static String moTa(TestStatus status)` trả về `Đạt`, `Không đạt`, `Bỏ qua` tương ứng.
3. Trong `main`, duyệt `TestStatus.values()` và in mỗi giá trị theo mẫu `PASSED = Đạt`:

```
PASSED = Đạt
FAILED = Không đạt
SKIPPED = Bỏ qua
```
