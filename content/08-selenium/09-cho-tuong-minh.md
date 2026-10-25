---
title: "Chờ đúng cách: WebDriverWait"
type: code
minutes: 10
practice: dynamic.html
seed: |
  import java.time.Duration;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/dynamic.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

              // 1. Bấm #load-btn. Kết quả #result chỉ hiện sau 2-4 giây
              driver.findElement(By.id("load-btn")).click();
              System.out.println(driver.findElement(By.id("result")).getText());

              // 2. Chờ #confirm-btn bấm được, bấm nó, rồi in #confirm-message

              // 3. Chờ #status đổi thành "Hoàn tất", rồi in nó

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import java.time.Duration;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.ExpectedConditions;
  import org.openqa.selenium.support.ui.WebDriverWait;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/dynamic.html");
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

              driver.findElement(By.id("load-btn")).click();
              WebElement result = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));
              System.out.println(result.getText());

              wait.until(ExpectedConditions.elementToBeClickable(By.id("confirm-btn"))).click();
              System.out.println(driver.findElement(By.id("confirm-message")).getText());

              wait.until(ExpectedConditions.textToBe(By.id("status"), "Hoàn tất"));
              System.out.println(driver.findElement(By.id("status")).getText());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Chờ kết quả bằng `ExpectedConditions.visibilityOfElementLocated`'
    source: 'visibilityOfElementLocated\(\s*By\.id\(\s*"result"\s*\)\s*\)'
  - text: 'Chờ nút bằng `ExpectedConditions.elementToBeClickable`'
    source: 'elementToBeClickable\(\s*By\.id\(\s*"confirm-btn"\s*\)\s*\)'
  - text: 'Chờ chữ bằng `ExpectedConditions.textToBe`'
    source: 'textToBe\(\s*By\.id\(\s*"status"\s*\)\s*,\s*"Hoàn tất"\s*\)'
  - text: 'Không dùng `Thread.sleep`'
    notSource: 'Thread\.sleep'
  - text: 'Console in đúng 3 dòng theo đề bài'
    stdout: { equals: "Đơn hàng TM2026 đang được giao\nĐã xác nhận đơn hàng!\nHoàn tất" }
hints:
  - 'Lúc mới mở trang, `#result` có trong HTML nhưng đang **ẩn** và rỗng, nên phải chờ nó **hiện ra** (visibility).'
  - '`wait.until(...)` với `visibilityOfElementLocated` và `elementToBeClickable` trả về luôn `WebElement`, bạn có thể `.getText()` hay `.click()` ngay.'
  - '`wait.until(ExpectedConditions.textToBe(By.id("status"), "Hoàn tất"));` rồi mới đọc chữ.'
timeout: 90
---

Bấm chạy code mẫu thử xem. Console in ra... **một dòng trống**! Vì sao? Vì `#result` chỉ hiện ra sau 2 đến 4 giây, mà Selenium đọc chữ **ngay lập tức**, lúc phần tử còn rỗng và đang ẩn.

Đây là nguyên nhân số 1 khiến test web **chập chờn** (*flaky*): lúc pass lúc fail mà code không hề đổi. Trang web thật luôn có độ trễ: gọi máy chủ, chạy hiệu ứng, tải ảnh. Code test phải biết **chờ**.

## WebDriverWait: chờ có điều kiện

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement result = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));
```

Đây gọi là **explicit wait** (chờ tường minh): bạn nói rõ **chờ điều gì** và **tối đa bao lâu**.

- Selenium kiểm tra điều kiện liên tục (mặc định mỗi 0,5 giây).
- Điều kiện đúng lúc nào, code chạy tiếp lúc đó. Phần tử hiện sau 2,3 giây thì chỉ chờ 2,3 giây.
- Hết 10 giây mà vẫn chưa đúng, Selenium ném **`TimeoutException`** và test fail với thông báo rõ ràng.

## Các điều kiện hay dùng

| `ExpectedConditions.` | Chờ cho tới khi... |
|---|---|
| `visibilityOfElementLocated(by)` | phần tử có trên trang **và** đang hiện |
| `elementToBeClickable(by)` | phần tử hiện **và** đang bật (bấm được) |
| `textToBe(by, "...")` | chữ của phần tử đúng bằng giá trị mong đợi |
| `invisibilityOfElementLocated(by)` | phần tử biến mất (ví dụ spinner "Đang tải...") |
| `urlContains("...")` | địa chỉ trang chứa đoạn chữ |

> Thời gian chờ tối đa 10 giây không có nghĩa là test chậm 10 giây. Nó chỉ là "trần" an toàn. Trang `dynamic.html` trễ ngẫu nhiên 2 đến 4 giây, nên 10 giây là thoải mái.

## Đến lượt bạn

Sửa code để in ra đúng **3 dòng**:

1. Sau khi bấm `#load-btn`, chờ `#result` hiện ra rồi in: `Đơn hàng TM2026 đang được giao`
2. Chờ `#confirm-btn` bấm được (nó bị khóa 3 giây đầu), bấm nó, in chữ của `#confirm-message`: `Đã xác nhận đơn hàng!`
3. Chờ chữ của `#status` thành `Hoàn tất`, rồi in nó: `Hoàn tất`

Không được dùng `Thread.sleep`, bài sau sẽ giải thích vì sao.
