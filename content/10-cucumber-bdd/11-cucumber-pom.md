---
title: "Cucumber + Page Object Model: step gọn, page lo phần khó"
type: code
mode: cucumber
minutes: 15
practice: login.html
timeout: 120
files:
  - name: features/dang_nhap.feature
    readonly: true
    content: |
      Feature: Đăng nhập (Page Object Model)

        Scenario: Đăng nhập thành công
          Given tôi mở trang đăng nhập
          When tôi đăng nhập với "lan" và "matkhau123"
          Then tôi thấy lời chào "Xin chào, Lan"

        Scenario: Đăng nhập sai mật khẩu
          Given tôi mở trang đăng nhập
          When tôi đăng nhập với "lan" và "sai123"
          Then tôi thấy thông báo lỗi "Sai tên đăng nhập hoặc mật khẩu"

        Scenario: Tài khoản bị khóa
          Given tôi mở trang đăng nhập
          When tôi đăng nhập với "khoa" và "matkhau123"
          Then tôi thấy thông báo lỗi "Tài khoản của bạn đã bị khóa"
  - name: steps/LoginSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import java.time.Duration;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;
      import static org.assertj.core.api.Assertions.assertThat;

      // Code này CHẠY ĐƯỢC, nhưng locator và wait nằm lẫn trong step.
      // Hãy viết lại để step chỉ gọi LoginPage và AccountPage.
      public class LoginSteps {
          private final TestContext context;

          public LoginSteps(TestContext context) {
              this.context = context;
          }

          @Given("tôi mở trang đăng nhập")
          public void openLoginPage() {
              context.getDriver().get("http://localhost:4000/practice/login.html");
          }

          @When("tôi đăng nhập với {string} và {string}")
          public void login(String username, String password) {
              WebDriver driver = context.getDriver();
              driver.findElement(By.id("username")).sendKeys(username);
              driver.findElement(By.id("password")).sendKeys(password);
              driver.findElement(By.id("login-btn")).click();
          }

          @Then("tôi thấy lời chào {string}")
          public void seeWelcome(String expected) {
              String text = new WebDriverWait(context.getDriver(), Duration.ofSeconds(5))
                  .until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome")))
                  .getText();
              assertThat(text).isEqualTo(expected);
          }

          @Then("tôi thấy thông báo lỗi {string}")
          public void seeError(String expected) {
              String text = new WebDriverWait(context.getDriver(), Duration.ofSeconds(5))
                  .until(ExpectedConditions.visibilityOfElementLocated(By.id("error-message")))
                  .getText();
              assertThat(text).isEqualTo(expected);
          }
      }
  - name: steps/LoginPage.java
    readonly: true
    content: |
      package steps;

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
              driver.get(BASE_URL + "login.html");
              return this;
          }

          public void loginAs(String username, String password) {
              type(usernameInput, username);
              type(passwordInput, password);
              click(loginButton);
          }

          public String getErrorMessage() {
              return visible(errorMessage).getText();
          }
      }
  - name: steps/AccountPage.java
    readonly: true
    content: |
      package steps;

      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class AccountPage extends BasePage {
          private final By welcomeHeading = By.id("welcome");

          public AccountPage(WebDriver driver) {
              super(driver);
          }

          public String getWelcomeText() {
              return visible(welcomeHeading).getText();
          }
      }
  - name: steps/BasePage.java
    readonly: true
    content: |
      package steps;

      import java.time.Duration;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;

      public abstract class BasePage {
          protected static final String BASE_URL = "http://localhost:4000/practice/";
          protected final WebDriver driver;
          protected final WebDriverWait wait;

          protected BasePage(WebDriver driver) {
              this.driver = driver;
              this.wait = new WebDriverWait(driver, Duration.ofSeconds(5));
          }

          protected WebElement visible(By locator) {
              return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
          }

          protected void type(By locator, String text) {
              WebElement input = visible(locator);
              input.clear();
              input.sendKeys(text);
          }

          protected void click(By locator) {
              wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
          }
      }
  - name: steps/Hooks.java
    readonly: true
    content: |
      package steps;

      import io.cucumber.java.After;
      import io.cucumber.java.Before;
      import org.openqa.selenium.chrome.ChromeDriver;

      public class Hooks {
          private final TestContext context;

          public Hooks(TestContext context) {
              this.context = context;
          }

          @Before
          public void openBrowser() {
              context.setDriver(new ChromeDriver());
          }

          @After
          public void closeBrowser() {
              if (context.getDriver() != null) {
                  context.getDriver().quit();
              }
          }
      }
  - name: steps/TestContext.java
    readonly: true
    content: |
      package steps;

      import org.openqa.selenium.WebDriver;

      public class TestContext {
          private WebDriver driver;

          public WebDriver getDriver() {
              return driver;
          }

          public void setDriver(WebDriver driver) {
              this.driver = driver;
          }
      }
solution:
  steps/LoginSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import static org.assertj.core.api.Assertions.assertThat;

    public class LoginSteps {
        private final TestContext context;
        private LoginPage loginPage;

        public LoginSteps(TestContext context) {
            this.context = context;
        }

        @Given("tôi mở trang đăng nhập")
        public void openLoginPage() {
            loginPage = new LoginPage(context.getDriver()).open();
        }

        @When("tôi đăng nhập với {string} và {string}")
        public void login(String username, String password) {
            loginPage.loginAs(username, password);
        }

        @Then("tôi thấy lời chào {string}")
        public void seeWelcome(String expected) {
            AccountPage accountPage = new AccountPage(context.getDriver());
            assertThat(accountPage.getWelcomeText()).isEqualTo(expected);
        }

        @Then("tôi thấy thông báo lỗi {string}")
        public void seeError(String expected) {
            assertThat(loginPage.getErrorMessage()).isEqualTo(expected);
        }
    }
tests:
  - text: 'Cả 3 Scenario pass'
    cucumber: { passed: 3 }
  - text: 'Step mở trang dùng `new LoginPage(...)` và `open()`'
    source: 'new LoginPage\(\s*context\.getDriver\(\)\s*\)[\s\S]*\.open\(\)'
    file: steps/LoginSteps.java
  - text: 'Step đăng nhập gọi `loginAs(username, password)`'
    source: '\.loginAs\(\s*\w+\s*,\s*\w+\s*\)'
    file: steps/LoginSteps.java
  - text: 'Step kiểm tra dùng `getWelcomeText()` và `getErrorMessage()` của page object'
    source: 'getWelcomeText\(\)[\s\S]*getErrorMessage\(\)|getErrorMessage\(\)[\s\S]*getWelcomeText\(\)'
    file: steps/LoginSteps.java
  - text: '`LoginSteps` không còn `By.`, `findElement` hay `WebDriverWait`'
    notSource: 'By\.|findElement|WebDriverWait'
    file: steps/LoginSteps.java
hints:
  - 'Thêm thuộc tính `private LoginPage loginPage;`. Trong step mở trang: `loginPage = new LoginPage(context.getDriver()).open();`.'
  - 'Step đăng nhập chỉ còn một dòng: `loginPage.loginAs(username, password);`.'
  - 'Lời chào nằm ở trang khác, nên tạo `new AccountPage(context.getDriver())` rồi gọi `getWelcomeText()`. Nhớ xóa các import `By`, `WebDriverWait`... không còn dùng.'
---

Ở chương Page Object Model, bạn đã thấy test JUnit gọn hẳn khi locator được giấu vào page object. Với Cucumber, lợi ích còn lớn hơn: step definition là **cây cầu** giữa câu tiếng Việt và trình duyệt, nên nó càng mỏng càng tốt.

```text
dang_nhap.feature    "When tôi đăng nhập với "lan" và "matkhau123""
       ↓
LoginSteps           loginPage.loginAs(username, password);     ← 1 dòng
       ↓
LoginPage            type(usernameInput, ...), click(loginButton)
       ↓
BasePage             WebDriverWait, ExpectedConditions...
```

Quy tắc chia việc:

- **Step definition**: dịch câu Gherkin thành lời gọi page object, và **assert**. Không có `By`, không có `findElement`.
- **Page object**: biết locator, biết chờ, biết thao tác trên **một** trang. Không assert.

Khi giao diện đổi (ví dụ id `login-btn` thành `submit`), bạn chỉ sửa **một** dòng trong `LoginPage`. Hàng chục kịch bản và step dùng nó vẫn giữ nguyên.

## Page object sống ở đâu?

Trong môi trường của sách, mọi class Cucumber cần nằm trong package **`steps`**, nên page object cũng đặt ở đó (`steps/LoginPage.java`). Dự án thật thường tách riêng, ví dụ:

```text
src/test/java/
├── pages/        BasePage, LoginPage, AccountPage
├── steps/        LoginSteps, Hooks, TestContext
└── runners/      RunCucumberTest
src/test/resources/
└── features/     dang_nhap.feature
```

> Vì sao tạo `LoginPage` trong step `Given` mà không tạo trong constructor của `LoginSteps`? Vì bạn không nên dựa vào **thứ tự** PicoContainer tạo các object. Nếu constructor chạy trước hook `@Before`, `context.getDriver()` vẫn là `null`. Lấy driver bên trong step thì chắc chắn trình duyệt đã được mở.

## Đến lượt bạn

`steps/LoginSteps.java` đang chạy được, nhưng locator và wait nằm lẫn trong step. Viết lại cho gọn:

1. Step mở trang: `new LoginPage(context.getDriver()).open()`, lưu vào thuộc tính `loginPage`.
2. Step đăng nhập: `loginPage.loginAs(username, password)`.
3. Step lời chào: dùng `AccountPage.getWelcomeText()`. Step lỗi: dùng `loginPage.getErrorMessage()`.
4. Trong `LoginSteps` không còn `By.`, `findElement` hay `WebDriverWait`.

Các class trong tab `BasePage`, `LoginPage`, `AccountPage`, `Hooks`, `TestContext` chỉ đọc. Hãy mở ra xem chúng được viết thế nào.
