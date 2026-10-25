---
title: "finally: việc luôn phải làm"
type: code
minutes: 8
files:
  - name: FakeBrowser.java
    readonly: true
    content: |
      import java.util.NoSuchElementException;

      // Trình duyệt "giả" để luyện tập, bắt chước cách WebDriver hoạt động
      public class FakeBrowser {
          private boolean open = false;

          public void open(String url) {
              open = true;
              System.out.println("Mở trình duyệt: " + url);
          }

          public void click(String locator) {
              if (!locator.equals("#login-btn") && !locator.equals("#username")) {
                  throw new NoSuchElementException("Không tìm thấy phần tử " + locator);
              }
              System.out.println("Bấm " + locator);
          }

          public void quit() {
              open = false;
              System.out.println("Đóng trình duyệt");
          }

          public boolean isOpen() {
              return open;
          }
      }
  - name: Main.java
    content: |
      import java.util.NoSuchElementException;

      public class Main {
          public static void main(String[] args) {
              chayTest(new FakeBrowser(), "#login-btn");
              chayTest(new FakeBrowser(), "#nut-khong-ton-tai");
          }

          static void chayTest(FakeBrowser browser, String locator) {
              browser.open("login.html");
              browser.click(locator);
              System.out.println("PASS");
              browser.quit();
          }
      }
solution:
  Main.java: |
    import java.util.NoSuchElementException;

    public class Main {
        public static void main(String[] args) {
            chayTest(new FakeBrowser(), "#login-btn");
            chayTest(new FakeBrowser(), "#nut-khong-ton-tai");
        }

        static void chayTest(FakeBrowser browser, String locator) {
            try {
                browser.open("login.html");
                browser.click(locator);
                System.out.println("PASS");
            } catch (NoSuchElementException e) {
                System.out.println("FAIL: " + e.getMessage());
            } finally {
                browser.quit();
            }
        }
    }
checks: |
  ok("closedOk", () -> { Object b = newObj("FakeBrowser"); call("chayTest", b, "#username"); return !((Boolean) callOn(b, "isOpen")); }, "Test pass xong mà trình duyệt vẫn còn mở");
  ok("closedFail", () -> { Object b = newObj("FakeBrowser"); call("chayTest", b, "#khong-co"); return !((Boolean) callOn(b, "isOpen")); }, "Test fail xong mà trình duyệt vẫn còn mở (hoặc exception chưa được bắt)");
tests:
  - text: 'Test pass: trình duyệt được đóng'
    java: closedOk
  - text: 'Test fail: exception được bắt và trình duyệt vẫn được đóng'
    java: closedFail
  - text: 'Dùng `finally` để gọi `browser.quit()`'
    source: 'finally\s*\{\s*browser\.quit\(\)\s*;\s*\}'
  - text: 'Console in đúng như đề'
    stdout: { equals: "Mở trình duyệt: login.html\nBấm #login-btn\nPASS\nĐóng trình duyệt\nMở trình duyệt: login.html\nFAIL: Không tìm thấy phần tử #nut-khong-ton-tai\nĐóng trình duyệt" }
hints:
  - 'Chạy thử code ban đầu: lần thứ hai bị lỗi ở `click`, dòng `quit()` không bao giờ chạy. Trình duyệt bị bỏ mở!'
  - 'Cấu trúc: `try { open, click, in PASS } catch (NoSuchElementException e) { in "FAIL: " + e.getMessage() } finally { browser.quit(); }`'
---

Chạy thử code ban đầu và để ý: lần test thứ hai bị lỗi ở `click`, nên dòng `browser.quit()` **không bao giờ chạy**. Với Selenium thật, mỗi lần như vậy là một cửa sổ Chrome bị bỏ mở. Chạy 200 test qua đêm, sáng ra máy tính có thể treo vì hàng trăm cửa sổ Chrome "mồ côi".

## Khối `finally`

```java
try {
    // làm các bước test
} catch (NoSuchElementException e) {
    // ghi nhận test fail
} finally {
    // LUÔN chạy, dù có lỗi hay không
}
```

`finally` chạy trong **mọi** trường hợp:

| Tình huống | `try` | `catch` | `finally` |
|---|---|---|---|
| Không có sự cố | chạy hết | bỏ qua | **chạy** |
| Có sự cố và bị bắt | dừng giữa chừng | chạy | **chạy** |
| Có sự cố không ai bắt | dừng giữa chừng | không có | **chạy**, rồi exception mới bay tiếp ra ngoài |

Kể cả khi trong `try` có `return`, `finally` vẫn chạy trước khi method kết thúc.

## Đây là mẫu code bạn sẽ viết trong mọi bài Selenium

```java
WebDriver driver = new ChromeDriver();
try {
    driver.get("http://localhost:4000/practice/login.html");
    // ... các bước test ...
} finally {
    driver.quit();    // dọn dẹp: luôn đóng trình duyệt
}
```

Để ý: mẫu này **không có `catch`**. `try / finally` là hợp lệ. Lỗi vẫn bay ra ngoài để test được ghi nhận là fail, nhưng trước đó trình duyệt đã được đóng gọn gàng. Ở chương JUnit, `@AfterEach` sẽ làm đúng vai trò của `finally` này.

> `NoSuchElementException` ở bài này đến từ `java.util`. Selenium có một exception **cùng tên** (trong `org.openqa.selenium`), ném ra khi không tìm thấy phần tử trên trang. Cùng ý nghĩa, khác "ngăn" (package).

## Đến lượt bạn

`FakeBrowser.java` là trình duyệt giả (chỉ đọc): `click` sẽ ném `NoSuchElementException` nếu locator không phải `#login-btn` hay `#username`.

Sửa `chayTest` trong `Main.java`:

1. Đặt `open`, `click` và dòng in `PASS` trong `try`.
2. `catch (NoSuchElementException e)`: in `FAIL: ` + message.
3. `finally`: gọi `browser.quit();`

```
Mở trình duyệt: login.html
Bấm #login-btn
PASS
Đóng trình duyệt
Mở trình duyệt: login.html
FAIL: Không tìm thấy phần tử #nut-khong-ton-tai
Đóng trình duyệt
```
