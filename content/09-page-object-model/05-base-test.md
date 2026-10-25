---
title: "BaseTest: mở và đóng trình duyệt một chỗ"
type: code
mode: junit
minutes: 10
practice: login.html
files:
  - name: BaseTest.java
    content: |
      import org.junit.jupiter.api.AfterEach;
      import org.junit.jupiter.api.BeforeEach;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.chrome.ChromeDriver;
      import org.openqa.selenium.chrome.ChromeOptions;

      public abstract class BaseTest {
          protected WebDriver driver;

          @BeforeEach
          void startBrowser() {
              // TODO: tạo ChromeOptions với cửa sổ 1280x900, rồi tạo ChromeDriver với options đó

          }

          @AfterEach
          void stopBrowser() {
              // TODO: đóng trình duyệt (nhớ kiểm tra null)

          }
      }
  - name: LoginTest.java
    readonly: true
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class LoginTest extends BaseTest {

          @Test
          void loginAsLanShowsWelcome() {
              AccountPage account = new LoginPage(driver).open().loginAs("lan", "matkhau123");
              assertThat(account.welcomeText()).isEqualTo("Xin chào, Lan");
          }

          @Test
          void lockedAccountShowsError() {
              LoginPage page = new LoginPage(driver).open().loginExpectingError("khoa", "matkhau123");
              assertThat(page.errorText()).isEqualTo("Tài khoản của bạn đã bị khóa");
          }
      }
  - name: LoginPage.java
    readonly: true
    content: |
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class LoginPage extends BasePage {
          private final By usernameInput = By.id("username");
          private final By passwordInput = By.id("password");
          private final By loginButton = By.id("login-btn");
          private final By errorMessage = By.id("error-message");

          public LoginPage(WebDriver driver) {
              super(driver);
          }

          public LoginPage open() {
              driver.get("http://localhost:4000/practice/login.html");
              return this;
          }

          private void submit(String username, String password) {
              type(usernameInput, username);
              type(passwordInput, password);
              click(loginButton);
          }

          public AccountPage loginAs(String username, String password) {
              submit(username, password);
              return new AccountPage(driver);
          }

          public LoginPage loginExpectingError(String username, String password) {
              submit(username, password);
              return this;
          }

          public String errorText() {
              return text(errorMessage);
          }
      }
  - name: AccountPage.java
    readonly: true
    content: |
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class AccountPage extends BasePage {
          private final By welcomeHeading = By.id("welcome");

          public AccountPage(WebDriver driver) {
              super(driver);
          }

          public String welcomeText() {
              return text(welcomeHeading);
          }
      }
  - name: BasePage.java
    readonly: true
    content: |
      import java.time.Duration;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;

      public abstract class BasePage {
          protected final WebDriver driver;
          protected final WebDriverWait wait;

          protected BasePage(WebDriver driver) {
              this.driver = driver;
              this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
          }

          protected WebElement waitVisible(By locator) {
              return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
          }

          protected void click(By locator) {
              wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
          }

          protected void type(By locator, String text) {
              WebElement element = waitVisible(locator);
              element.clear();
              element.sendKeys(text);
          }

          protected String text(By locator) {
              return waitVisible(locator).getText();
          }
      }
solution:
  BaseTest.java: |
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.BeforeEach;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.chrome.ChromeOptions;

    public abstract class BaseTest {
        protected WebDriver driver;

        @BeforeEach
        void startBrowser() {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--window-size=1280,900");
            driver = new ChromeDriver(options);
        }

        @AfterEach
        void stopBrowser() {
            if (driver != null) {
                driver.quit();
            }
        }
    }
tests:
  - text: 'Tạo `ChromeOptions` và thêm `--window-size=1280,900`'
    source: 'new\s+ChromeOptions\(\)[\s\S]*addArguments\(\s*"--window-size=1280,900"\s*\)'
    file: BaseTest.java
  - text: 'Tạo driver bằng `new ChromeDriver(options)`'
    source: 'driver\s*=\s*new\s+ChromeDriver\(\s*\w+\s*\)'
    file: BaseTest.java
  - text: '`@AfterEach` gọi `driver.quit()`'
    source: '@AfterEach[\s\S]*?driver\.quit\(\)'
    file: BaseTest.java
  - text: 'Test `loginAsLanShowsWelcome` pass'
    junit: { name: loginAsLanShowsWelcome, status: passed }
  - text: 'Test `lockedAccountShowsError` pass'
    junit: { name: lockedAccountShowsError, status: passed }
hints:
  - '`ChromeOptions options = new ChromeOptions();` rồi `options.addArguments("--window-size=1280,900");`'
  - 'Gán cho field (không khai báo biến mới): `driver = new ChromeDriver(options);`'
  - '`if (driver != null) { driver.quit(); }`'
timeout: 120
---

Page Object đã gọn, nhưng nhìn lại các test class: class nào cũng có cặp `@BeforeEach` / `@AfterEach` y hệt nhau. Có 15 test class là 15 bản copy. Muốn đổi cách mở trình duyệt (thêm cấu hình, đổi sang Firefox), bạn lại phải sửa 15 chỗ.

Cách giải quyết quen thuộc: kế thừa, lần này cho **test class**.

## BaseTest

```java
public abstract class BaseTest {
    protected WebDriver driver;

    @BeforeEach
    void startBrowser() { ... }   // JUnit chạy cả @BeforeEach của class cha

    @AfterEach
    void stopBrowser() { ... }
}

class LoginTest extends BaseTest {
    @Test
    void loginAsLanShowsWelcome() {
        new LoginPage(driver)...   // driver đến từ BaseTest
    }
}
```

- JUnit **kế thừa** `@BeforeEach`/`@AfterEach` từ class cha: trước mỗi test của `LoginTest`, `startBrowser()` của `BaseTest` được chạy.
- `BaseTest` là `abstract` và không có `@Test` nào, nên JUnit không chạy nó như một test class.
- Test class giờ chỉ còn đúng thứ quan trọng: **kịch bản và assertion**.

## ChromeOptions: cấu hình trình duyệt

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--window-size=1280,900");   // kích thước cửa sổ cố định
driver = new ChromeDriver(options);
```

Vì sao cần kích thước cố định? Giao diện web thay đổi theo độ rộng màn hình (*responsive*): cửa sổ hẹp thì menu có thể bị thu gọn, nút bị đẩy xuống dưới. Cố định kích thước giúp test chạy **giống nhau** trên máy bạn, máy đồng nghiệp và máy chủ CI.

> Các tùy chọn hay gặp khác: `--headless=new` (chạy không hiện cửa sổ, thường dùng trên CI), `--incognito`, `--lang=vi`. Trong khóa học, đừng dùng `--headless` vì bạn sẽ không thấy gì ở tab Trình duyệt.

## Đến lượt bạn

Hoàn thiện `BaseTest.java`:

1. `startBrowser()`: tạo `ChromeOptions`, thêm `--window-size=1280,900`, rồi gán `driver = new ChromeDriver(options);`
2. `stopBrowser()`: nếu `driver` khác `null` thì `driver.quit()`.

`LoginTest` (chỉ đọc) kế thừa `BaseTest`; hai test của nó phải pass. Các page đã được viết sẵn bằng `BasePage` của bài trước.
