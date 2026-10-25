---
title: "Selenium + JUnit: test thật sự"
type: code
mode: junit
minutes: 12
practice: login.html
files:
  - name: LoginTest.java
    content: |
      import java.time.Duration;
      import org.junit.jupiter.api.AfterEach;
      import org.junit.jupiter.api.BeforeEach;
      import org.junit.jupiter.api.Test;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.chrome.ChromeDriver;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;
      import static org.assertj.core.api.Assertions.assertThat;

      class LoginTest {
          private WebDriver driver;
          private WebDriverWait wait;

          @BeforeEach
          void openBrowser() {
              // Tạo driver, tạo wait (10 giây), mở trang login.html

          }

          @AfterEach
          void closeBrowser() {
              // Đóng trình duyệt

          }

          @Test
          void loginSuccess() {
              driver.findElement(By.id("username")).sendKeys("lan");
              driver.findElement(By.id("password")).sendKeys("matkhau123");
              driver.findElement(By.id("login-btn")).click();

              String welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome"))).getText();
              assertThat(welcome).isEqualTo("Xin chào, Lan");
          }

          // Viết test wrongPasswordShowsError ở đây

      }
solution:
  LoginTest.java: |
    import java.time.Duration;
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.WebElement;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.ExpectedConditions;
    import org.openqa.selenium.support.ui.WebDriverWait;
    import static org.assertj.core.api.Assertions.assertThat;

    class LoginTest {
        private WebDriver driver;
        private WebDriverWait wait;

        @BeforeEach
        void openBrowser() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            driver.get("http://localhost:4000/practice/login.html");
        }

        @AfterEach
        void closeBrowser() {
            if (driver != null) {
                driver.quit();
            }
        }

        @Test
        void loginSuccess() {
            driver.findElement(By.id("username")).sendKeys("lan");
            driver.findElement(By.id("password")).sendKeys("matkhau123");
            driver.findElement(By.id("login-btn")).click();

            String welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome"))).getText();
            assertThat(welcome).isEqualTo("Xin chào, Lan");
        }

        @Test
        void wrongPasswordShowsError() {
            driver.findElement(By.id("username")).sendKeys("lan");
            driver.findElement(By.id("password")).sendKeys("sai123");
            driver.findElement(By.id("login-btn")).click();

            WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("error-message")));
            assertThat(error.getText()).isEqualTo("Sai tên đăng nhập hoặc mật khẩu");
            assertThat(driver.getCurrentUrl()).contains("login.html");
        }
    }
tests:
  - text: '`@BeforeEach` tạo `new ChromeDriver()`'
    source: '@BeforeEach[\s\S]*?\{[\s\S]*?new\s+ChromeDriver\(\)'
  - text: '`@AfterEach` gọi `driver.quit()`'
    source: '@AfterEach[\s\S]*?\{[\s\S]*?driver\.quit\(\)'
  - text: 'Test `loginSuccess` pass'
    junit: { name: loginSuccess, status: passed }
  - text: 'Có test `wrongPasswordShowsError` và nó pass'
    junit: { name: wrongPasswordShowsError, status: passed }
  - text: 'Test mới kiểm tra thông báo lỗi bằng `assertThat(...).isEqualTo("Sai tên đăng nhập hoặc mật khẩu")`'
    source: 'assertThat\([\s\S]*\)\s*\.isEqualTo\(\s*"Sai tên đăng nhập hoặc mật khẩu"\s*\)'
hints:
  - 'Trong `openBrowser()`: `driver = new ChromeDriver();` (không viết `WebDriver driver = ...`, vì như vậy là tạo biến mới, field vẫn là `null`).'
  - 'Trong `closeBrowser()`: `if (driver != null) { driver.quit(); }`'
  - 'Test mới giống `loginSuccess`, chỉ đổi mật khẩu thành `sai123` rồi chờ `#error-message` hiện ra.'
timeout: 120
---

Đến giờ, chương trình của bạn chỉ **in** ra những gì đọc được, còn bạn tự nhìn Console để biết đúng hay sai. Một bài **test tự động** thật sự phải tự kết luận PASS hay FAIL. Đó là việc của JUnit và AssertJ, thứ bạn đã học ở chương 6!

## Khung của một test Selenium

```java
class LoginTest {
    private WebDriver driver;

    @BeforeEach
    void openBrowser() {               // chạy TRƯỚC mỗi test
        driver = new ChromeDriver();
        driver.get("http://localhost:4000/practice/login.html");
    }

    @AfterEach
    void closeBrowser() {              // chạy SAU mỗi test, kể cả khi test fail
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    void loginSuccess() { ... }
}
```

- **Mỗi test có trình duyệt riêng**: `@BeforeEach` mở Chrome mới, `@AfterEach` đóng nó. Test này không bị ảnh hưởng bởi cookie hay giỏ hàng mà test kia để lại. Đây gọi là **test độc lập** (*test isolation*), một nguyên tắc vàng.
- `@AfterEach` thay thế cho khối `finally` bạn vẫn viết: JUnit đảm bảo nó luôn chạy, kể cả khi assertion fail.
- `driver` là **field** của class, để cả ba method dùng chung được.

## Thay println bằng assertThat

```java
String welcome = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome"))).getText();
assertThat(welcome).isEqualTo("Xin chào, Lan");
```

Nếu trang hiện sai chữ, JUnit đánh dấu test **đỏ** và báo rõ: *mong đợi "Xin chào, Lan" nhưng thực tế là...*. Không cần ai ngồi đọc Console nữa.

## Đến lượt bạn

1. Hoàn thiện `openBrowser()`: tạo `ChromeDriver`, tạo `WebDriverWait` 10 giây, mở `http://localhost:4000/practice/login.html`.
2. Hoàn thiện `closeBrowser()`: gọi `driver.quit()` (kiểm tra `driver != null` trước).
3. Viết test **`wrongPasswordShowsError`**: đăng nhập `lan` / `sai123`, chờ `#error-message` hiện ra và khẳng định chữ của nó là `Sai tên đăng nhập hoặc mật khẩu`.

Xem tab **Kết quả test**: mỗi test là một dòng, và bạn sẽ thấy Chrome mở ra rồi đóng lại **hai lần**, mỗi lần cho một test.
