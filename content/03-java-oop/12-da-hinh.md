---
title: "Đa hình: một lệnh, nhiều cách làm"
type: code
minutes: 9
files:
  - name: Browser.java
    readonly: true
    content: |
      public interface Browser {
          String getName();
          String open(String url);
      }
  - name: ChromeBrowser.java
    readonly: true
    content: |
      public class ChromeBrowser implements Browser {
          @Override
          public String getName() {
              return "Chrome";
          }

          @Override
          public String open(String url) {
              return "Chrome mở " + url;
          }
      }
  - name: FirefoxBrowser.java
    readonly: true
    content: |
      public class FirefoxBrowser implements Browser {
          @Override
          public String getName() {
              return "Firefox";
          }

          @Override
          public String open(String url) {
              return "Firefox mở " + url;
          }
      }
  - name: EdgeBrowser.java
    content: |
      // Viết class EdgeBrowser ở đây

  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              Browser[] browsers = { new ChromeBrowser(), new FirefoxBrowser() };
              smokeTest(browsers);
          }

          static int smokeTest(Browser[] browsers) {
              int count = 0;
              // Duyệt mảng, in kết quả open("login.html") của từng trình duyệt

              return count;
          }
      }
solution:
  EdgeBrowser.java: |
    public class EdgeBrowser implements Browser {
        @Override
        public String getName() {
            return "Edge";
        }

        @Override
        public String open(String url) {
            return "Edge mở " + url;
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            Browser[] browsers = { new ChromeBrowser(), new FirefoxBrowser(), new EdgeBrowser() };
            int total = smokeTest(browsers);
            System.out.println("Đã chạy trên " + total + " trình duyệt");
        }

        static int smokeTest(Browser[] browsers) {
            int count = 0;
            for (Browser b : browsers) {
                System.out.println(b.open("login.html"));
                count++;
            }
            return count;
        }
    }
checks: |
  ok("edge", () -> extendsClass("EdgeBrowser", "Browser") && "Edge mở a.html".equals(callOn(newObj("EdgeBrowser"), "open", "a.html")) && "Edge".equals(callOn(newObj("EdgeBrowser"), "getName")), "EdgeBrowser phải implements Browser, getName() trả về \"Edge\", open(url) trả về \"Edge mở \" + url");
  eq("count", () -> { Object arr = java.lang.reflect.Array.newInstance(cls("Browser"), 2); java.lang.reflect.Array.set(arr, 0, newObj("FirefoxBrowser")); java.lang.reflect.Array.set(arr, 1, newObj("ChromeBrowser")); return call("smokeTest", arr); }, 2, "smokeTest với mảng 2 trình duyệt");
tests:
  - text: '`EdgeBrowser` implements `Browser` đúng như hai class kia'
    java: edge
  - text: '`smokeTest` trả về số trình duyệt đã chạy'
    java: count
  - text: 'Duyệt bằng for-each với biến kiểu `Browser`'
    source: 'for\s*\(\s*Browser\s+\w+\s*:'
    file: Main.java
  - text: 'Console in đủ 3 trình duyệt rồi dòng `Đã chạy trên 3 trình duyệt`'
    stdout: { equals: "Chrome mở login.html\nFirefox mở login.html\nEdge mở login.html\nĐã chạy trên 3 trình duyệt" }
hints:
  - '`EdgeBrowser.java` giống hệt `ChromeBrowser.java`, chỉ đổi chữ Chrome thành Edge.'
  - 'Trong `smokeTest`: `for (Browser b : browsers) { System.out.println(b.open("login.html")); count++; }`'
  - 'Trong `main`: thêm `new EdgeBrowser()` vào mảng, rồi `int total = smokeTest(browsers);` và in `"Đã chạy trên " + total + " trình duyệt"`.'
---

Bạn nói "mở cửa ra" với ba người: một người mở cửa gỗ bằng tay nắm, một người bấm nút cửa kéo, một người quẹt thẻ. **Cùng một lệnh**, mỗi người làm theo cách riêng. Bạn không cần biết ai là ai, chỉ cần biết họ đều "mở được cửa".

## Đa hình (*polymorphism*)

Chữ này nghe to tát, nhưng bạn đã gặp nó rồi:

```java
Browser b = new ChromeBrowser();
b.open("login.html");    // chạy open() của ChromeBrowser
```

- **Kiểu của biến** (`Browser`) quyết định bạn **được gọi** method nào.
- **Object thật** (`ChromeBrowser`) quyết định method nào **thực sự chạy**.

Khi gom nhiều object khác loại vào một mảng có kiểu interface, sức mạnh mới lộ rõ:

```java
Browser[] browsers = { new ChromeBrowser(), new FirefoxBrowser() };

for (Browser b : browsers) {
    System.out.println(b.open("login.html"));
}
// Chrome mở login.html
// Firefox mở login.html
```

Vòng lặp không có một dòng `if` nào kiểu "nếu là Chrome thì..., nếu là Firefox thì...". Mỗi object tự biết cách làm của nó.

## Lợi ích cho tester

- **Thêm trình duyệt mới không phải sửa vòng lặp**: viết class `EdgeBrowser` rồi bỏ vào mảng là xong.
- Đây là nền tảng của **cross-browser testing** (chạy cùng bộ test trên nhiều trình duyệt). Trong Selenium, bạn viết test với kiểu `WebDriver`, còn object thật là `ChromeDriver` hay `FirefoxDriver` có thể chọn lúc chạy (ví dụ đọc từ file cấu hình, bạn sẽ học ở chương sau).
- Tương tự với abstract class: một mảng `BaseTest[]` có thể chứa `LoginTest`, `CartTest`... và gọi `run()` cho tất cả.

## Đến lượt bạn

1. Trong `EdgeBrowser.java`, viết class `EdgeBrowser implements Browser`: `getName()` trả về `Edge`, `open(url)` trả về `Edge mở ` + url.
2. Hoàn thành `smokeTest`: duyệt mảng bằng for-each với biến kiểu `Browser`, in `open("login.html")` của từng trình duyệt, đếm và trả về số trình duyệt đã chạy.
3. Trong `main`, thêm `new EdgeBrowser()` vào mảng, rồi in thêm dòng tổng kết:

```
Chrome mở login.html
Firefox mở login.html
Edge mở login.html
Đã chạy trên 3 trình duyệt
```
