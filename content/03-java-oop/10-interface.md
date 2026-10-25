---
title: "Interface: bản hợp đồng"
type: code
minutes: 9
files:
  - name: Browser.java
    content: |
      public interface Browser {
          String getName();
          // Thêm method open ở đây

      }
  - name: ChromeBrowser.java
    content: |
      public class ChromeBrowser implements Browser {
          @Override
          public String getName() {
              return "Chrome";
          }
      }
  - name: FirefoxBrowser.java
    content: |
      // Viết class FirefoxBrowser ở đây

  - name: Main.java
    content: |
      public class Main {
          public static void main(String[] args) {
              Browser chrome = new ChromeBrowser();
              System.out.println(chrome.getName());
          }
      }
solution:
  Browser.java: |
    public interface Browser {
        String getName();
        String open(String url);
    }
  ChromeBrowser.java: |
    public class ChromeBrowser implements Browser {
        @Override
        public String getName() {
            return "Chrome";
        }

        @Override
        public String open(String url) {
            return "Chrome: mở " + url;
        }
    }
  FirefoxBrowser.java: |
    public class FirefoxBrowser implements Browser {
        @Override
        public String getName() {
            return "Firefox";
        }

        @Override
        public String open(String url) {
            return "Firefox: mở " + url;
        }
    }
  Main.java: |
    public class Main {
        public static void main(String[] args) {
            Browser chrome = new ChromeBrowser();
            Browser firefox = new FirefoxBrowser();
            System.out.println(chrome.open("login.html"));
            System.out.println(firefox.open("login.html"));
        }
    }
checks: |
  ok("iface", () -> isInterface("Browser") && java.util.Arrays.stream(cls("Browser").getDeclaredMethods()).anyMatch(m -> m.getName().equals("open") && m.getParameterCount() == 1), "Interface Browser chưa có method open(String url)");
  eq("chrome", () -> callOn(newObj("ChromeBrowser"), "open", "cart.html"), "Chrome: mở cart.html", "ChromeBrowser.open(\"cart.html\")");
  ok("impl", () -> extendsClass("FirefoxBrowser", "Browser"), "FirefoxBrowser chưa implements Browser");
  eq("ffname", () -> callOn(newObj("FirefoxBrowser"), "getName"), "Firefox", "FirefoxBrowser.getName()");
  eq("ffopen", () -> callOn(newObj("FirefoxBrowser"), "open", "cart.html"), "Firefox: mở cart.html", "FirefoxBrowser.open(\"cart.html\")");
tests:
  - text: 'Interface `Browser` có thêm `String open(String url)`'
    java: iface
  - text: '`ChromeBrowser.open("cart.html")` trả về `Chrome: mở cart.html`'
    java: chrome
  - text: '`FirefoxBrowser` implements `Browser`'
    java: impl
  - text: '`FirefoxBrowser.getName()` trả về `Firefox`'
    java: ffname
  - text: '`FirefoxBrowser.open("cart.html")` trả về `Firefox: mở cart.html`'
    java: ffopen
  - text: 'Console in ra `Chrome: mở login.html` rồi `Firefox: mở login.html`'
    stdout: { equals: "Chrome: mở login.html\nFirefox: mở login.html" }
hints:
  - 'Trong interface chỉ viết phần đầu method, kết thúc bằng dấu chấm phẩy: `String open(String url);`'
  - 'Thêm `open` vào interface thì `ChromeBrowser` báo lỗi "does not override abstract method open". Đó là hợp đồng đang nhắc bạn: hãy viết `public String open(String url) { return "Chrome: mở " + url; }`'
  - '`FirefoxBrowser.java` viết giống hệt `ChromeBrowser.java`, đổi chữ Chrome thành Firefox. Trong `main`, tạo `Browser firefox = new FirefoxBrowser();`'
---

Ổ cắm điện trong nhà bạn có quy chuẩn: hai chân, điện áp 220V. Nồi cơm, quạt, sạc điện thoại của **bất kỳ hãng nào**, miễn đúng quy chuẩn là cắm vừa. Ổ cắm không cần biết bên trong quạt hoạt động ra sao.

## Interface là một bản hợp đồng

**Interface** chỉ nói *"phải làm được những gì"*, không nói *"làm như thế nào"*:

```java
public interface Browser {
    String getName();
    String open(String url);
}
```

Mỗi method chỉ có phần đầu và dấu `;`, **không có thân** `{ ... }`. Class nào muốn làm "trình duyệt" thì ký hợp đồng bằng từ khóa `implements` và phải viết đầy đủ **mọi** method trong đó:

```java
public class ChromeBrowser implements Browser {
    @Override
    public String getName() {
        return "Chrome";
    }

    @Override
    public String open(String url) {
        return "Chrome: mở " + url;
    }
}
```

Thiếu một method thôi, Java sẽ báo lỗi biên dịch. Hợp đồng là hợp đồng!

> Method trong interface mặc định là `public`, nên khi viết thân method trong class bạn cũng phải ghi `public`.

## Biến có kiểu interface

```java
Browser chrome = new ChromeBrowser();
```

Bên trái là **kiểu interface** `Browser`, bên phải là object thật `ChromeBrowser`. Qua biến `chrome`, bạn chỉ dùng được những gì hợp đồng `Browser` hứa: `getName()` và `open(...)`. Không thể `new Browser()` được, vì hợp đồng không phải là một món đồ thật.

## Đây chính là `WebDriver`

Trong Selenium, `WebDriver` là một interface. `ChromeDriver`, `FirefoxDriver`, `EdgeDriver` là các class implements nó. Vì thế dòng code Selenium kinh điển là:

```java
WebDriver driver = new ChromeDriver();
```

Toàn bộ test của bạn chỉ nói chuyện với `WebDriver`. Muốn chạy trên Firefox? Chỉ cần đổi `new ChromeDriver()` thành `new FirefoxDriver()`, phần còn lại giữ nguyên. Bài này bạn sẽ tự làm phiên bản "giả" của đúng ý tưởng đó.

## Đến lượt bạn

1. Thêm vào interface `Browser` method `String open(String url);`
2. Viết `open` cho `ChromeBrowser`: trả về `Chrome: mở ` + url.
3. Trong `FirefoxBrowser.java`, viết class `FirefoxBrowser implements Browser`: `getName()` trả về `Firefox`, `open(url)` trả về `Firefox: mở ` + url.
4. Sửa `main` để in:

```
Chrome: mở login.html
Firefox: mở login.html
```
