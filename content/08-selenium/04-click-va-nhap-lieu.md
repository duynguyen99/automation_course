---
title: "Click, gõ phím và xóa ô nhập"
type: code
minutes: 10
practice: login.html
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
              driver.get("http://localhost:4000/practice/login.html");

              // 1. Xóa rồi gõ "lan" vào ô #username

              // 2. Xóa rồi gõ "matkhau123" vào ô #password

              // 3. Click nút #login-btn

              // 4. Chờ trang tài khoản hiện ra, rồi in chữ của #welcome
              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

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
              driver.get("http://localhost:4000/practice/login.html");

              WebElement username = driver.findElement(By.id("username"));
              username.clear();
              username.sendKeys("lan");

              WebElement password = driver.findElement(By.id("password"));
              password.clear();
              password.sendKeys("matkhau123");

              driver.findElement(By.id("login-btn")).click();

              WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
              WebElement welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));
              System.out.println(welcome.getText());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Tìm ô tên đăng nhập bằng `By.id("username")` và gõ `lan` bằng `sendKeys`'
    source: 'By\.id\(\s*"username"\s*\)[\s\S]*sendKeys\(\s*"lan"\s*\)'
  - text: 'Gõ mật khẩu `matkhau123` vào ô `#password`'
    source: 'By\.id\(\s*"password"\s*\)[\s\S]*sendKeys\(\s*"matkhau123"\s*\)'
  - text: 'Gọi `clear()` trước khi gõ'
    source: '\.clear\(\)'
  - text: 'Click nút `#login-btn`'
    source: 'By\.id\(\s*"login-btn"\s*\)[\s\S]*\.click\(\)'
  - text: 'Dùng `wait.until(...)` để chờ trang tài khoản'
    source: 'wait\.until\('
  - text: 'Console in ra `Xin chào, Lan`'
    stdout: { equals: "Xin chào, Lan" }
hints:
  - 'Có thể lưu phần tử vào biến để dùng nhiều lần: `WebElement username = driver.findElement(By.id("username"));` rồi `username.clear();` và `username.sendKeys("lan");`'
  - 'Chờ và lấy phần tử cùng lúc: `WebElement welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));`'
  - 'Nhớ thêm `import org.openqa.selenium.WebElement;` nếu bạn dùng kiểu `WebElement`.'
timeout: 90
---

Tìm được phần tử rồi, giờ ta **thao tác** với nó, giống hệt cách người dùng thật làm: bấm chuột và gõ phím.

## Ba method thao tác cơ bản

```java
WebElement username = driver.findElement(By.id("username"));
username.clear();             // xóa chữ đang có trong ô
username.sendKeys("lan");     // gõ phím "l", "a", "n"
driver.findElement(By.id("login-btn")).click();   // bấm chuột
```

- **`sendKeys(...)`** gõ từng ký tự vào ô, giống bàn phím thật. Nó **gõ thêm** vào sau chữ đã có, chứ không thay thế.
- Vì vậy dân automation có thói quen **`clear()` trước khi `sendKeys()`**: trình duyệt có thể tự điền sẵn tên đăng nhập cũ, và bạn sẽ thành ra gõ `lanlan`.
- **`click()`** bấm vào phần tử. Nếu phần tử bị che hoặc chưa hiện, Selenium sẽ báo lỗi thay vì bấm bừa.

## Chờ trang mới hiện ra

Khi bấm Đăng nhập, Tiệm Trà Mộc giả lập một máy chủ thật: khoảng **0,6 giây** sau mới chuyển sang `account.html`. Nếu ngay sau `click()` bạn tìm `#welcome`, rất có thể trang mới **chưa kịp tải** và bạn nhận về `NoSuchElementException`.

Cách đúng là bảo Selenium **chờ** cho tới khi phần tử xuất hiện:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));
```

Đọc thành lời: *"Chờ tối đa 10 giây, cho tới khi phần tử có id `welcome` hiện ra trên màn hình, rồi đưa nó cho tôi"*. Nếu nó xuất hiện sau 0,6 giây, code chạy tiếp ngay sau 0,6 giây, không phí thời gian. Bạn sẽ học kỹ về chờ đợi ở một bài riêng, giờ cứ dùng công thức này đã.

## Đến lượt bạn

1. Mở `login.html`.
2. `clear()` rồi gõ `lan` vào ô `#username`, `clear()` rồi gõ `matkhau123` vào ô `#password`.
3. Click nút `#login-btn`.
4. Chờ phần tử `#welcome` hiện ra và in chữ của nó. Console phải ra đúng: `Xin chào, Lan`

Nhìn tab **Trình duyệt** để thấy chữ được gõ vào từng ô!
