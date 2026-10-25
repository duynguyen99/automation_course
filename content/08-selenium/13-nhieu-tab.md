---
title: "Nhiều tab và cửa sổ"
type: code
minutes: 9
practice: windows.html
seed: |
  import java.time.Duration;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/windows.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

              // 1. Ghi nhớ handle của tab hiện tại
              String original = "";

              // 2. Bấm #policy-link và chờ có 2 tab

              // 3. Chuyển sang tab mới, in tiêu đề trang và #policy-text

              // 4. Đóng tab mới, quay về tab cũ, in tiêu đề trang

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import java.time.Duration;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/windows.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

              String original = driver.getWindowHandle();

              driver.findElement(By.id("policy-link")).click();
              wait.until(ExpectedConditions.numberOfWindowsToBe(2));

              for (String handle : driver.getWindowHandles()) {
                  if (!handle.equals(original)) {
                      driver.switchTo().window(handle);
                  }
              }
              wait.until(ExpectedConditions.titleContains("Chính sách"));
              System.out.println(driver.getTitle());
              System.out.println(driver.findElement(By.id("policy-text")).getText());

              driver.close();
              driver.switchTo().window(original);
              System.out.println(driver.getTitle());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Ghi nhớ tab gốc bằng `driver.getWindowHandle()`'
    source: 'driver\.getWindowHandle\(\)'
  - text: 'Duyệt các tab bằng `driver.getWindowHandles()` và chuyển bằng `switchTo().window(...)`'
    source: 'getWindowHandles\(\)[\s\S]*switchTo\(\)\s*\.window\('
  - text: 'Chờ tab mới bằng `ExpectedConditions.numberOfWindowsToBe(2)`'
    source: 'numberOfWindowsToBe\(\s*2\s*\)'
  - text: 'Đóng tab mới bằng `driver.close()`'
    source: 'driver\.close\(\)'
  - text: 'Console in đúng 3 dòng theo đề bài'
    stdout: { equals: "Chính sách đổi trả - Tiệm Trà Mộc\nĐổi trả miễn phí trong vòng 7 ngày nếu sản phẩm còn nguyên tem.\nCửa sổ - Tiệm Trà Mộc" }
hints:
  - '`String original = driver.getWindowHandle();` phải chạy **trước** khi bấm link.'
  - 'Vòng lặp: `for (String handle : driver.getWindowHandles()) { if (!handle.equals(original)) { driver.switchTo().window(handle); } }`'
  - 'Sau `driver.close()`, Selenium không tự quay về tab cũ. Phải gọi `driver.switchTo().window(original);`'
timeout: 90
---

Nhiều website mở trang mới trong **tab mới**: link "Chính sách đổi trả", trang thanh toán của ngân hàng, link mạng xã hội... Bấm vào link xong, người dùng thấy ngay tab mới. Nhưng Selenium thì **không** tự đi theo: nó vẫn đứng ở tab cũ.

## Window handle: số căn cước của mỗi tab

Mỗi tab (hoặc cửa sổ) có một mã định danh duy nhất gọi là **window handle**, một chuỗi kiểu `"F1C3A9..."`.

```java
String original = driver.getWindowHandle();        // handle của tab đang đứng
Set<String> all = driver.getWindowHandles();        // handle của TẤT CẢ các tab
driver.switchTo().window(handle);                   // chuyển sang tab có handle đó
```

`getWindowHandles()` trả về một `Set` (tập hợp, không có thứ tự cố định). Vì vậy cách chắc chắn nhất để tìm tab mới là: **duyệt hết, tab nào khác tab gốc thì đó là tab mới**.

## close và quit khác nhau thế nào?

| Method | Làm gì |
|---|---|
| `driver.close()` | Đóng **tab đang đứng**. Selenium không tự chuyển sang tab khác |
| `driver.quit()` | Đóng **toàn bộ** trình duyệt và kết thúc phiên làm việc |

> Selenium 4 còn cho phép tự mở tab mới: `driver.switchTo().newWindow(WindowType.TAB);` rất tiện khi cần so sánh hai trang.

## Đến lượt bạn

Trên `windows.html`:

1. Ghi nhớ handle của tab hiện tại vào biến `original`.
2. Bấm `#policy-link`, chờ cho tới khi có đúng 2 tab.
3. Chuyển sang tab mới, in tiêu đề trang và chữ của `#policy-text`. Tab mới có thể chưa tải xong ngay, nên hãy chờ `ExpectedConditions.titleContains("Chính sách")` trước khi đọc.
4. Đóng tab mới, quay về tab gốc, in tiêu đề trang.

Kết quả mong đợi:

```
Chính sách đổi trả - Tiệm Trà Mộc
Đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm còn nguyên tem.
Cửa sổ - Tiệm Trà Mộc
```
