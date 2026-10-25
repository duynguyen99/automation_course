---
title: "Method trả về trang tiếp theo"
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
          private final By usernameInput = By.id("username");
          private final By passwordInput = By.id("password");
          private final By loginButton = By.id("login-btn");
          private final By errorMessage = By.id("error-message");

          public LoginPage(WebDriver driver) {
              this.driver = driver;
          }

          public LoginPage open() {
              driver.get("http://localhost:4000/practice/login.html");
              return this;
          }

          private void submit(String username, String password) {
              driver.findElement(usernameInput).clear();
              driver.findElement(usernameInput).sendKeys(username);
              driver.findElement(passwordInput).clear();
              driver.findElement(passwordInput).sendKeys(password);
              driver.findElement(loginButton).click();
          }

          // Đăng nhập thành công -> sang trang tài khoản
          public AccountPage loginAs(String username, String password) {
              // TODO
              return null;
          }

          // Đăng nhập thất bại -> vẫn ở trang đăng nhập
          public LoginPage loginExpectingError(String username, String password) {
              // TODO
              return null;
          }

          public String errorText() {
              return driver.findElement(errorMessage).getText();
          }
      }
  - name: AccountPage.java
    content: |
      import java.time.Duration;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;

      public class AccountPage {
          private final WebDriver driver;
          private final WebDriverWait wait;
          private final By welcomeHeading = By.id("welcome");

          public AccountPage(WebDriver driver) {
              this.driver = driver;
              this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
          }

          public String welcomeText() {
              // TODO: chờ #welcome hiện ra rồi trả về chữ của nó
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

          @BeforeEach
          void setUp() {
              driver = new ChromeDriver();
          }

          @AfterEach
          void tearDown() {
              if (driver != null) {
                  driver.quit();
              }
          }

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

        public LoginPage open() {
            driver.get("http://localhost:4000/practice/login.html");
            return this;
        }

        private void submit(String username, String password) {
            driver.findElement(usernameInput).clear();
            driver.findElement(usernameInput).sendKeys(username);
            driver.findElement(passwordInput).clear();
            driver.findElement(passwordInput).sendKeys(password);
            driver.findElement(loginButton).click();
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
            return driver.findElement(errorMessage).getText();
        }
    }
  AccountPage.java: |
    import java.time.Duration;
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.support.ui.ExpectedConditions;
    import org.openqa.selenium.support.ui.WebDriverWait;

    public class AccountPage {
        private final WebDriver driver;
        private final WebDriverWait wait;
        private final By welcomeHeading = By.id("welcome");

        public AccountPage(WebDriver driver) {
            this.driver = driver;
            this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        }

        public String welcomeText() {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeHeading)).getText();
        }
    }
tests:
  - text: '`loginAs` trả về `new AccountPage(driver)`'
    source: 'AccountPage\s+loginAs\([^)]*\)\s*\{[\s\S]*?return\s+new\s+AccountPage\(\s*driver\s*\)'
    file: LoginPage.java
  - text: '`loginExpectingError` trả về chính trang hiện tại (`return this;`)'
    source: 'LoginPage\s+loginExpectingError\([^)]*\)\s*\{[\s\S]*?return\s+this\s*;'
    file: LoginPage.java
  - text: '`welcomeText()` chờ bằng `wait.until(...)`'
    source: 'wait\.until\('
    file: AccountPage.java
  - text: 'Test `loginAsLanShowsWelcome` pass'
    junit: { name: loginAsLanShowsWelcome, status: passed }
  - text: 'Test `lockedAccountShowsError` pass'
    junit: { name: lockedAccountShowsError, status: passed }
hints:
  - 'Cả hai method đều gọi `submit(username, password);` trước, chỉ khác nhau ở dòng `return`.'
  - '`loginAs`: `return new AccountPage(driver);`. `loginExpectingError`: `return this;`'
  - '`welcomeText()`: `return wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeHeading)).getText();`'
timeout: 120
---

Người dùng bấm "Đăng nhập" thành công thì được đưa sang trang tài khoản. Page Object có thể mô tả đúng hành trình đó: **method nào dẫn sang trang khác thì trả về Page Object của trang đó**.

## Chuỗi method mượt như câu văn

```java
AccountPage account = new LoginPage(driver).open().loginAs("lan", "matkhau123");
assertThat(account.welcomeText()).isEqualTo("Xin chào, Lan");
```

- `open()` trả về **`this`** (chính `LoginPage`), nên viết tiếp `.loginAs(...)` được ngay. Cách viết nối liền này gọi là **method chaining**.
- `loginAs(...)` trả về **`AccountPage`**, vì sau khi đăng nhập thành công ta đang đứng ở trang tài khoản. Test không cần biết URL hay locator của trang mới.
- Kiểu trả về giúp **trình soạn thảo gợi ý đúng**: gõ `account.` thì chỉ thấy method của trang tài khoản. Bạn khó mà gọi nhầm `errorText()` trên trang không có thông báo lỗi.

## Thành công và thất bại là hai method khác nhau

Cùng là "điền form rồi bấm nút", nhưng kết quả khác nhau thì kiểu trả về khác nhau:

| Method | Khi nào dùng | Trả về |
|---|---|---|
| `loginAs(u, p)` | Mong đợi đăng nhập **thành công** | `AccountPage` |
| `loginExpectingError(u, p)` | Mong đợi bị **báo lỗi** | `LoginPage` (`this`) |

Phần lặp lại (gõ hai ô và bấm nút) được gom vào method **`private void submit(...)`**. `private` vì nó chỉ là chi tiết bên trong, test không cần gọi.

## Chờ ở đâu?

Trang tài khoản chỉ hiện ra sau khoảng 0,6 giây. Việc chờ thuộc về **Page Object**, không phải test: `AccountPage.welcomeText()` tự chờ `#welcome` hiện ra rồi mới đọc. Test vẫn gọn gàng như câu văn.

## Đến lượt bạn

1. Trong `LoginPage`: viết `loginAs` (gọi `submit`, trả về `new AccountPage(driver)`) và `loginExpectingError` (gọi `submit`, trả về `this`).
2. Trong `AccountPage`: viết `welcomeText()`, chờ `welcomeHeading` hiện ra rồi trả về chữ của nó.

Hai test trong `LoginTest` phải pass.
