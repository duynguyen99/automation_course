---
title: "Chụp ảnh màn hình bằng Selenium"
type: code
minutes: 8
practice: products.html
timeout: 90
seed: |
  import java.nio.file.Files;
  import java.nio.file.Path;
  import org.openqa.selenium.OutputType;
  import org.openqa.selenium.TakesScreenshot;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) throws Exception {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              byte[] png = chupManHinh(driver);
              // Lưu ảnh vào screenshots/products.png rồi in thông báo

          } finally {
              driver.quit();
          }
      }

      static byte[] chupManHinh(WebDriver driver) {
          // Ép kiểu driver sang TakesScreenshot và lấy ảnh dạng byte[]
          return new byte[0];
      }
  }
solution: |
  import java.nio.file.Files;
  import java.nio.file.Path;
  import org.openqa.selenium.OutputType;
  import org.openqa.selenium.TakesScreenshot;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) throws Exception {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              byte[] png = chupManHinh(driver);
              Path file = Path.of("screenshots", "products.png");
              Files.createDirectories(file.getParent());
              Files.write(file, png);
              System.out.println("Đã lưu ảnh: screenshots/products.png");
          } finally {
              driver.quit();
          }
      }

      static byte[] chupManHinh(WebDriver driver) {
          return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
      }
  }
checks: |
  java.nio.file.Path p = java.nio.file.Path.of("screenshots", "products.png");
  ok("exists", () -> java.nio.file.Files.exists(p), "Chưa thấy file screenshots/products.png");
  ok("png", () -> {
      if (!java.nio.file.Files.exists(p)) return false;
      byte[] b = java.nio.file.Files.readAllBytes(p);
      return b.length > 1000 && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G';
  }, "File chưa phải ảnh PNG thật. Bạn đã ghi đúng mảng byte từ getScreenshotAs chưa?");
tests:
  - text: 'Ép kiểu sang `TakesScreenshot` và gọi `getScreenshotAs(OutputType.BYTES)`'
    source: '\(\s*\(\s*TakesScreenshot\s*\)\s*driver\s*\)\s*\.getScreenshotAs\(\s*OutputType\.BYTES\s*\)'
  - text: 'Tạo được file `screenshots/products.png`'
    java: exists
  - text: 'File đó là một ảnh PNG thật (không rỗng)'
    java: png
  - text: 'Console in `Đã lưu ảnh: screenshots/products.png`'
    stdout: { includes: "Đã lưu ảnh: screenshots/products.png" }
hints:
  - 'Trong `chupManHinh`: `return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);`. Hai cặp ngoặc: một cho ép kiểu, một bao quanh để gọi method.'
  - 'Thư mục phải có trước khi ghi file: `Path file = Path.of("screenshots", "products.png"); Files.createDirectories(file.getParent());`.'
  - 'Ghi file bằng `Files.write(file, png);` rồi `System.out.println("Đã lưu ảnh: screenshots/products.png");`.'
---

"Test fail ở bước kiểm tra giá" là một thông tin. "Test fail, và đây là **ảnh** trang web lúc đó: giá hiện `0₫`" là một thông tin **tốt hơn nhiều**. Ảnh chụp màn hình giúp developer hiểu lỗi mà không cần chạy lại test.

## `TakesScreenshot`

Selenium có interface **`TakesScreenshot`** với một method duy nhất: `getScreenshotAs(...)`. `ChromeDriver` có cài đặt interface này, nhưng biến của bạn có kiểu `WebDriver`, nên cần **ép kiểu** (*cast*):

```java
byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
```

`OutputType` quyết định bạn nhận ảnh ở dạng nào:

| `OutputType` | Nhận được | Dùng khi |
|---|---|---|
| `BYTES` | `byte[]` | Đính kèm vào báo cáo (Allure, Cucumber `scenario.attach`) |
| `FILE` | `File` tạm | Muốn copy ra thư mục |
| `BASE64` | `String` | Nhúng thẳng vào HTML |

Muốn chụp **một phần tử** thay vì cả trang? `WebElement` cũng có `getScreenshotAs`: `driver.findElement(By.id("product-list")).getScreenshotAs(OutputType.BYTES)`.

## Lưu ra file

```java
Path file = Path.of("screenshots", "products.png");
Files.createDirectories(file.getParent());   // tạo thư mục nếu chưa có
Files.write(file, png);
```

Trong dự án thật, tên file thường gồm tên test và thời gian, ví dụ `loginSuccess_2026-10-18_09-30.png`, để không ghi đè lên nhau.

## Đến lượt bạn

1. Viết method `chupManHinh(driver)` trả về ảnh dạng `byte[]`.
2. Trong `main`, lưu ảnh vào `screenshots/products.png` (tạo thư mục trước).
3. In ra đúng dòng `Đã lưu ảnh: screenshots/products.png`.
