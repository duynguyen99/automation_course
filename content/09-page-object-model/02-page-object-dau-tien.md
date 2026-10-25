---
title: "Page Object đầu tiên: LoginPage"
type: code
mode: junit
minutes: 12
practice: login.html
files:
  - name: LoginPage.java
    content: |
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class LoginPage {
          private final WebDriver driver;

          // Locator: mỗi phần tử một field
          private final By usernameInput = By.id("username");
          // TODO: passwordInput, loginButton, errorMessage

          public LoginPage(WebDriver driver) {
              this.driver = driver;
          }

          public void open() {
              driver.get("http://localhost:4000/practice/login.html");
          }

          public void enterUsername(String username) {
              driver.findElement(usernameInput).clear();
              driver.findElement(usernameInput).sendKeys(username);
          }

          public void enterPassword(String password) {
              // TODO
          }

          public void clickLogin() {
              // TODO
          }

          public String errorText() {
              // TODO
              return "";
          }
      }
  - name: LoginTest.java
    readonly: true
    content: |
      import org.junit.jupiter.api.AfterEach;
      import org.junit.jupiter.api.BeforeEach;
      import org.junit.jupiter.api.Test;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.chrome.ChromeDriver;
      import static org.assertj.core.api.Assertions.assertThat;

      class LoginTest {
          private WebDriver driver;
          private LoginPage loginPage;

          @BeforeEach
          void setUp() {
              driver = new ChromeDriver();
              loginPage = new LoginPage(driver);
              loginPage.open();
          }

          @AfterEach
          void tearDown() {
              if (driver != null) {
                  driver.quit();
              }
          }

          @Test
          void wrongPasswordShowsError() {
              loginPage.enterUsername("lan");
              loginPage.enterPassword("sai123");
              loginPage.clickLogin();
              assertThat(loginPage.errorText()).isEqualTo("Sai tên đăng nhập hoặc mật khẩu");
          }

          @Test
          void emptyPasswordShowsError() {
              loginPage.enterUsername("lan");
              loginPage.clickLogin();
              assertThat(loginPage.errorText()).isEqualTo("Vui lòng nhập mật khẩu");
          }
      }
solution:
  LoginPage.java: |
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;

    public class LoginPage {
        private final WebDriver driver;

        private final By usernameInput = By.id("username");
        private final By passwordInput = By.id("password");
        private final By loginButton = By.id("login-btn");
        private final By errorMessage = By.id("error-message");

        public LoginPage(WebDriver driver) {
            this.driver = driver;
        }

        public void open() {
            driver.get("http://localhost:4000/practice/login.html");
        }

        public void enterUsername(String username) {
            driver.findElement(usernameInput).clear();
            driver.findElement(usernameInput).sendKeys(username);
        }

        public void enterPassword(String password) {
            driver.findElement(passwordInput).clear();
            driver.findElement(passwordInput).sendKeys(password);
        }

        public void clickLogin() {
            driver.findElement(loginButton).click();
        }

        public String errorText() {
            return driver.findElement(errorMessage).getText();
        }
    }
tests:
  - text: 'Có field `private final By` cho `#password`, `#login-btn` và `#error-message`'
    source: 'private\s+final\s+By\s+\w+\s*=\s*By\.id\(\s*"password"\s*\)[\s\S]*private\s+final\s+By\s+\w+\s*=\s*By\.id\(\s*"login-btn"\s*\)[\s\S]*private\s+final\s+By\s+\w+\s*=\s*By\.id\(\s*"error-message"\s*\)'
    file: LoginPage.java
  - text: 'Các method dùng field locator, không viết lại `By.id(...)` bên trong method'
    notSource: 'findElement\(\s*By\.'
    file: LoginPage.java
  - text: 'Test `wrongPasswordShowsError` pass'
    junit: { name: wrongPasswordShowsError, status: passed }
  - text: 'Test `emptyPasswordShowsError` pass'
    junit: { name: emptyPasswordShowsError, status: passed }
hints:
  - 'Khai báo theo mẫu có sẵn: `private final By passwordInput = By.id("password");`'
  - '`enterPassword` làm giống hệt `enterUsername`, chỉ đổi locator. `clickLogin`: `driver.findElement(loginButton).click();`'
  - '`errorText()`: `return driver.findElement(errorMessage).getText();`'
timeout: 120
---

Bắt tay xây Page Object đầu tiên cho trang đăng nhập! Bên phải có hai file:

- `LoginPage.java`: **Page Object**, nơi bạn viết.
- `LoginTest.java`: test **dùng** Page Object (chỉ đọc). Hãy để ý: trong file test **không có** một `By` hay `findElement` nào.

## Giải phẫu một Page Object

```java
public class LoginPage {
    private final WebDriver driver;                          // 1. driver được truyền vào

    private final By loginButton = By.id("login-btn");       // 2. locator là field private

    public LoginPage(WebDriver driver) {                     // 3. constructor nhận driver
        this.driver = driver;
    }

    public void clickLogin() {                               // 4. method = hành động của người dùng
        driver.findElement(loginButton).click();
    }
}
```

1. Page Object **không tự tạo** trình duyệt. Test tạo driver rồi đưa cho nó qua constructor, nên nhiều page dùng chung một trình duyệt.
2. Mỗi locator là một field **`private final By`**. `private` vì bên ngoài không cần biết trang được cấu tạo thế nào. `final` vì locator không đổi khi đang chạy. Tất cả locator nằm **gọn một chỗ** ở đầu class: giao diện đổi, bạn biết ngay phải sửa ở đâu.
3. Method được đặt tên theo **việc người dùng làm** (`enterPassword`, `clickLogin`), không theo kỹ thuật (`findPasswordAndSendKeys`).
4. Method trả về dữ liệu (`errorText()`) để **test** tự quyết định đúng sai. Page Object chỉ thao tác và đọc, **không chứa assertion**.

> Quy tắc vàng: **locator và Selenium nằm trong page, assertion nằm trong test.**

## Đến lượt bạn

Hoàn thiện `LoginPage.java`:

1. Thêm 3 field locator: `passwordInput` (`#password`), `loginButton` (`#login-btn`), `errorMessage` (`#error-message`).
2. Viết `enterPassword` (clear rồi gõ), `clickLogin` (click), `errorText` (trả về chữ của thông báo lỗi).
3. Bên trong các method, dùng field locator, không viết lại `By.id(...)`.

Hai test trong `LoginTest` phải pass.
