---
title: "Iframe: trang web lồng trong trang web"
type: code
minutes: 9
practice: frames.html
seed: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/frames.html");

              // 1. Chuyển vào iframe #newsletter-frame

              // 2. Gõ email, bấm đăng ký, in #subscribe-message
              driver.findElement(By.id("newsletter-email")).sendKeys("lan@tramoc.vn");

              // 3. Quay về trang chính, in #outside-text

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/frames.html");

              driver.switchTo().frame("newsletter-frame");

              driver.findElement(By.id("newsletter-email")).sendKeys("lan@tramoc.vn");
              driver.findElement(By.id("subscribe-btn")).click();
              System.out.println(driver.findElement(By.id("subscribe-message")).getText());

              driver.switchTo().defaultContent();
              System.out.println(driver.findElement(By.id("outside-text")).getText());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Chuyển vào iframe bằng `driver.switchTo().frame(...)`'
    source: 'switchTo\(\)\s*\.frame\('
  - text: 'Quay về trang chính bằng `driver.switchTo().defaultContent()`'
    source: 'switchTo\(\)\s*\.defaultContent\(\)'
  - text: 'Dòng 1: `Đã đăng ký: lan@tramoc.vn`'
    stdout: { regex: '^Đã đăng ký: lan@tramoc\.vn\n' }
  - text: 'Dòng 2: `Cảm ơn bạn đã ghé thăm`'
    stdout: { regex: '\nCảm ơn bạn đã ghé thăm$' }
hints:
  - 'Chạy code mẫu sẽ gặp `NoSuchElementException`: ô email nằm trong iframe, phải `switchTo().frame(...)` trước.'
  - '`frame(...)` nhận id hoặc name của iframe: `driver.switchTo().frame("newsletter-frame");`'
  - 'Đang ở trong iframe thì không thấy `#outside-text`. Gọi `driver.switchTo().defaultContent();` trước khi tìm nó.'
timeout: 90
---

Chạy thử code mẫu: bạn sẽ gặp `NoSuchElementException`, dù mở DevTools ra vẫn thấy rõ ràng có `<input id="newsletter-email">`. Chuyện gì vậy?

## Iframe là gì?

**Iframe** là một trang web **lồng bên trong** một trang web khác, giống như một khung tranh treo trên tường: bức tường là trang chính, bức tranh là một trang riêng biệt. Form đăng ký nhận tin của Tiệm Trà Mộc nằm trong iframe:

```html
<iframe id="newsletter-frame" name="newsletter" src="/practice/frame-inner.html"></iframe>
<p>... <strong id="outside-text">Cảm ơn bạn đã ghé thăm</strong></p>
```

Trong thực tế bạn sẽ gặp iframe ở form thanh toán (cổng thanh toán của ngân hàng), video YouTube nhúng, khung chat hỗ trợ, quảng cáo...

Selenium tại một thời điểm chỉ "nhìn" vào **một** tài liệu. Mặc định nó nhìn trang chính, nên không thấy gì bên trong iframe.

## Chuyển vào và ra

```java
driver.switchTo().frame("newsletter-frame");   // vào iframe (theo id hoặc name)
// ... làm việc với phần tử bên trong iframe ...
driver.switchTo().defaultContent();            // về lại trang chính
```

Ngoài id/name, `frame(...)` còn nhận số thứ tự (`frame(0)`) hoặc một `WebElement` (`frame(driver.findElement(By.cssSelector("iframe")))`). Với iframe tải chậm, bạn có thể chờ và chuyển vào cùng lúc: `wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt("newsletter-frame"))`.

> Quên `defaultContent()` là lỗi rất hay gặp: bạn vẫn đang "đứng" trong iframe nên không tìm thấy gì ở trang chính.

## Đến lượt bạn

1. Chuyển vào iframe `newsletter-frame`.
2. Gõ `lan@tramoc.vn` vào `#newsletter-email`, bấm `#subscribe-btn`, in chữ của `#subscribe-message`: `Đã đăng ký: lan@tramoc.vn`
3. Quay về trang chính và in chữ của `#outside-text`: `Cảm ơn bạn đã ghé thăm`
