---
title: "Hộp thoại alert, confirm, prompt"
type: code
minutes: 9
practice: alerts.html
seed: |
  import java.time.Duration;
  import org.openqa.selenium.Alert;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/alerts.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

              // 1. Alert: bấm #alert-btn, in nội dung hộp thoại, bấm OK, in #alert-result

              // 2. Confirm: bấm #confirm-btn, bấm Hủy, in #alert-result

              // 3. Prompt: bấm #prompt-btn, gõ TRAMOC10, bấm OK, in #alert-result

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import java.time.Duration;
  import org.openqa.selenium.Alert;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/alerts.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));

              driver.findElement(By.id("alert-btn")).click();
              Alert alert = wait.until(ExpectedConditions.alertIsPresent());
              System.out.println(alert.getText());
              alert.accept();
              System.out.println(driver.findElement(By.id("alert-result")).getText());

              driver.findElement(By.id("confirm-btn")).click();
              Alert confirm = wait.until(ExpectedConditions.alertIsPresent());
              confirm.dismiss();
              System.out.println(driver.findElement(By.id("alert-result")).getText());

              driver.findElement(By.id("prompt-btn")).click();
              Alert prompt = wait.until(ExpectedConditions.alertIsPresent());
              prompt.sendKeys("TRAMOC10");
              prompt.accept();
              System.out.println(driver.findElement(By.id("alert-result")).getText());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Chờ hộp thoại bằng `ExpectedConditions.alertIsPresent()`'
    source: 'alertIsPresent\(\)'
  - text: 'Dùng `accept()` để bấm OK và `dismiss()` để bấm Hủy'
    source: '\.dismiss\(\)[\s\S]*\.accept\(\)|\.accept\(\)[\s\S]*\.dismiss\(\)'
  - text: 'Gõ mã vào prompt bằng `sendKeys("TRAMOC10")`'
    source: 'sendKeys\(\s*"TRAMOC10"\s*\)'
  - text: 'Console in đúng 4 dòng theo đề bài'
    stdout: { equals: "Chào mừng bạn đến Tiệm Trà Mộc!\nĐã đóng thông báo\nĐã hủy\nÁp dụng mã thành công: giảm 10%" }
hints:
  - '`Alert alert = wait.until(ExpectedConditions.alertIsPresent());` vừa chờ vừa chuyển sang hộp thoại.'
  - 'Trình tự cho alert: click nút → chờ alert → `getText()` → `accept()` → đọc `#alert-result`.'
  - 'Prompt: `prompt.sendKeys("TRAMOC10");` rồi `prompt.accept();`'
timeout: 90
---

Bạn đã từng thấy những hộp thoại nhỏ bật lên giữa màn hình kiểu *"Bạn có chắc muốn xóa giỏ hàng?"* chưa? Đó là hộp thoại **JavaScript** của trình duyệt. Chúng **không phải** HTML, nên `findElement` không tìm được. Thử bấm "Mở trang mẫu ↗" và bấm ba nút để xem tận mắt.

## Ba loại hộp thoại

| Loại | Trông như thế nào | Ví dụ |
|---|---|---|
| **alert** | Thông báo + nút OK | "Chào mừng bạn đến Tiệm Trà Mộc!" |
| **confirm** | Câu hỏi + OK / Hủy | "Bạn có chắc muốn xóa giỏ hàng?" |
| **prompt** | Ô nhập chữ + OK / Hủy | "Nhập mã giảm giá:" |

## Làm việc với Alert

```java
driver.findElement(By.id("confirm-btn")).click();
Alert confirm = wait.until(ExpectedConditions.alertIsPresent());

confirm.getText();          // đọc nội dung hộp thoại
confirm.accept();           // bấm OK
confirm.dismiss();          // bấm Hủy
confirm.sendKeys("...");    // gõ chữ (chỉ với prompt)
```

- `ExpectedConditions.alertIsPresent()` chờ hộp thoại xuất hiện **và** chuyển Selenium sang làm việc với nó. Bạn cũng có thể viết `driver.switchTo().alert()` nếu chắc chắn hộp thoại đã hiện.
- Khi hộp thoại đang mở, trang web phía sau bị "đóng băng". Nếu quên `accept()` hoặc `dismiss()`, lệnh Selenium tiếp theo sẽ gặp lỗi **`UnhandledAlertException`**.

## Đến lượt bạn

Trên `alerts.html`, in ra **4 dòng**:

1. Bấm `#alert-btn`, chờ alert, in nội dung: `Chào mừng bạn đến Tiệm Trà Mộc!`
2. Bấm OK, rồi in chữ của `#alert-result`: `Đã đóng thông báo`
3. Bấm `#confirm-btn`, chọn **Hủy**, in `#alert-result`: `Đã hủy`
4. Bấm `#prompt-btn`, gõ `TRAMOC10`, bấm OK, in `#alert-result`: `Áp dụng mã thành công: giảm 10%`

> Lưu ý: tab Trình duyệt có thể không vẽ được hộp thoại (vì nó là cửa sổ của hệ thống), nhưng Selenium vẫn thấy và điều khiển được nó.
