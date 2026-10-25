---
title: "Chụp màn hình: TakesScreenshot"
type: code
minutes: 8
practice: login.html
seed: |
  import java.io.File;
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.nio.file.StandardCopyOption;
  import org.openqa.selenium.By;
  import org.openqa.selenium.OutputType;
  import org.openqa.selenium.TakesScreenshot;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) throws IOException {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/login.html");
              driver.findElement(By.id("login-btn")).click();   // bấm khi chưa nhập gì -> báo lỗi

              // 1. Chụp màn hình thành một File tạm

              // 2. Copy sang file "loi-dang-nhap.png"
              Path target = Path.of("loi-dang-nhap.png");

              // 3. In "Đã lưu: loi-dang-nhap.png" và "Ảnh có dữ liệu: true/false"

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import java.io.File;
  import java.io.IOException;
  import java.nio.file.Files;
  import java.nio.file.Path;
  import java.nio.file.StandardCopyOption;
  import org.openqa.selenium.By;
  import org.openqa.selenium.OutputType;
  import org.openqa.selenium.TakesScreenshot;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) throws IOException {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/login.html");
              driver.findElement(By.id("login-btn")).click();

              File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);

              Path target = Path.of("loi-dang-nhap.png");
              Files.copy(shot.toPath(), target, StandardCopyOption.REPLACE_EXISTING);

              System.out.println("Đã lưu: " + target.getFileName());
              System.out.println("Ảnh có dữ liệu: " + (Files.size(target) > 0));
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Ép kiểu sang `TakesScreenshot` và gọi `getScreenshotAs(OutputType.FILE)`'
    source: '\(\s*TakesScreenshot\s*\)\s*driver\s*\)\s*\.getScreenshotAs\(\s*OutputType\.FILE\s*\)'
  - text: 'Copy ảnh bằng `Files.copy(...)`'
    source: 'Files\.copy\('
  - text: 'Kiểm tra kích thước bằng `Files.size(...)`'
    source: 'Files\.size\('
  - text: 'Console in `Đã lưu: loi-dang-nhap.png` rồi `Ảnh có dữ liệu: true`'
    stdout: { equals: "Đã lưu: loi-dang-nhap.png\nẢnh có dữ liệu: true" }
hints:
  - '`File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);` (chú ý hai lớp ngoặc).'
  - '`Files.copy(shot.toPath(), target, StandardCopyOption.REPLACE_EXISTING);`'
  - '`Files.size(target)` trả về số byte của file. In `"Ảnh có dữ liệu: " + (Files.size(target) > 0)`.'
timeout: 90
---

Test fail lúc 2 giờ sáng trên máy chủ CI, không ai ngồi xem. Sáng hôm sau, thứ quý nhất để điều tra là gì? Một **bức ảnh chụp màn hình** đúng lúc lỗi xảy ra. Hầu hết framework automation đều tự chụp ảnh khi test fail và đính kèm vào báo cáo (bạn sẽ làm việc này với Allure ở chương 11).

## Chụp cả trang

```java
File shot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
Files.copy(shot.toPath(), Path.of("loi-dang-nhap.png"), StandardCopyOption.REPLACE_EXISTING);
```

- Cũng giống `JavascriptExecutor`, `ChromeDriver` còn đóng vai **`TakesScreenshot`**, nên ta ép kiểu để gọi `getScreenshotAs`.
- **`OutputType.FILE`** cho ra một file ảnh PNG **tạm thời** (sẽ bị xóa khi chương trình kết thúc). Vì vậy ta phải copy nó sang chỗ cố định.
- Muốn lấy ảnh dạng mảng byte (để đính kèm vào báo cáo) thì dùng **`OutputType.BYTES`**.
- `Files` và `Path` thuộc gói `java.nio.file`, là cách hiện đại để làm việc với file trong Java. Các thao tác file có thể ném `IOException`, nên `main` có thêm `throws IOException`.

## Chụp một phần tử

Selenium 4 cho phép chụp riêng một phần tử, rất tiện để lưu bằng chứng cho đúng chỗ bị lỗi:

```java
File errorShot = driver.findElement(By.id("error-message")).getScreenshotAs(OutputType.FILE);
```

## Đến lượt bạn

Code mẫu đã mở `login.html` và bấm "Đăng nhập" khi chưa nhập gì, nên trang đang hiện thông báo lỗi.

1. Chụp màn hình cả trang thành `File`.
2. Copy nó sang `loi-dang-nhap.png`.
3. In ra 2 dòng: `Đã lưu: loi-dang-nhap.png` và `Ảnh có dữ liệu: true` (kích thước file lớn hơn 0 byte).
