---
title: "Cucumber + Selenium: kịch bản chạy trên trình duyệt thật"
type: code
mode: cucumber
minutes: 15
practice: login.html
timeout: 120
files:
  - name: features/dang_nhap.feature
    readonly: true
    content: |
      Feature: Đăng nhập trên trình duyệt

        Scenario: Đăng nhập thành công
          Given tôi mở trang đăng nhập
          When tôi đăng nhập với "lan" và "matkhau123"
          Then tôi thấy lời chào "Xin chào, Lan"

        Scenario: Đăng nhập sai mật khẩu
          Given tôi mở trang đăng nhập
          When tôi đăng nhập với "lan" và "sai123"
          Then tôi thấy thông báo lỗi "Sai tên đăng nhập hoặc mật khẩu"
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
  - name: steps/Hooks.java
    content: |
      package steps;

      import io.cucumber.java.After;
      import io.cucumber.java.Before;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.chrome.ChromeDriver;

      public class Hooks {
          private final TestContext context;

          public Hooks(TestContext context) {
              this.context = context;
          }

          // @Before: tạo ChromeDriver và cất vào context

          // @After: đóng trình duyệt

      }
  - name: steps/LoginSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import java.time.Duration;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.WebDriverWait;
      import static org.assertj.core.api.Assertions.assertThat;

      public class LoginSteps {
          private static final String BASE_URL = "http://localhost:4000/practice/";
          private final TestContext context;

          public LoginSteps(TestContext context) {
              this.context = context;
          }

          private WebDriver driver() {
              return context.getDriver();
          }

          private WebDriverWait waitUpTo(int seconds) {
              return new WebDriverWait(driver(), Duration.ofSeconds(seconds));
          }

          @Given("tôi mở trang đăng nhập")
          public void openLoginPage() {
              driver().get(BASE_URL + "login.html");
          }

          @When("tôi đăng nhập với {string} và {string}")
          public void login(String username, String password) {
              driver().findElement(By.id("username")).sendKeys(username);
              driver().findElement(By.id("password")).sendKeys(password);
              driver().findElement(By.id("login-btn")).click();
          }

          @Then("tôi thấy lời chào {string}")
          public void seeWelcome(String expected) {
              WebElement welcome = waitUpTo(5).until(
                  ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));
              assertThat(welcome.getText()).isEqualTo(expected);
          }

          // Viết step @Then("tôi thấy thông báo lỗi {string}") ở đây

      }
solution:
  steps/Hooks.java: |
    package steps;

    import io.cucumber.java.After;
    import io.cucumber.java.Before;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.chrome.ChromeDriver;

    public class Hooks {
        private final TestContext context;

        public Hooks(TestContext context) {
            this.context = context;
        }

        @Before
        public void openBrowser() {
            WebDriver driver = new ChromeDriver();
            context.setDriver(driver);
        }

        @After
        public void closeBrowser() {
            if (context.getDriver() != null) {
                context.getDriver().quit();
            }
        }
    }
  steps/LoginSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import java.time.Duration;
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.WebElement;
    import org.openqa.selenium.support.ui.ExpectedConditions;
    import org.openqa.selenium.support.ui.WebDriverWait;
    import static org.assertj.core.api.Assertions.assertThat;

    public class LoginSteps {
        private static final String BASE_URL = "http://localhost:4000/practice/";
        private final TestContext context;

        public LoginSteps(TestContext context) {
            this.context = context;
        }

        private WebDriver driver() {
            return context.getDriver();
        }

        private WebDriverWait waitUpTo(int seconds) {
            return new WebDriverWait(driver(), Duration.ofSeconds(seconds));
        }

        @Given("tôi mở trang đăng nhập")
        public void openLoginPage() {
            driver().get(BASE_URL + "login.html");
        }

        @When("tôi đăng nhập với {string} và {string}")
        public void login(String username, String password) {
            driver().findElement(By.id("username")).sendKeys(username);
            driver().findElement(By.id("password")).sendKeys(password);
            driver().findElement(By.id("login-btn")).click();
        }

        @Then("tôi thấy lời chào {string}")
        public void seeWelcome(String expected) {
            WebElement welcome = waitUpTo(5).until(
                ExpectedConditions.visibilityOfElementLocated(By.id("welcome")));
            assertThat(welcome.getText()).isEqualTo(expected);
        }

        @Then("tôi thấy thông báo lỗi {string}")
        public void seeError(String expected) {
            WebElement error = waitUpTo(5).until(
                ExpectedConditions.visibilityOfElementLocated(By.id("error-message")));
            assertThat(error.getText()).isEqualTo(expected);
        }
    }
tests:
  - text: '`@Before` tạo `new ChromeDriver()` và cất vào `context.setDriver(...)`'
    source: '@Before[\s\S]*new ChromeDriver\(\)[\s\S]*context\.setDriver\('
    file: steps/Hooks.java
  - text: '`@After` gọi `quit()` để đóng trình duyệt'
    source: '@After[\s\S]*\.quit\(\)'
    file: steps/Hooks.java
  - text: 'Scenario `Đăng nhập thành công` pass trên trình duyệt thật'
    cucumber: { scenario: "Đăng nhập thành công" }
  - text: 'Scenario `Đăng nhập sai mật khẩu` pass'
    cucumber: { scenario: "Đăng nhập sai mật khẩu" }
  - text: 'Step kiểm tra lỗi dùng explicit wait với `#error-message`'
    source: 'WebDriverWait[\s\S]*error-message|error-message[\s\S]*waitUpTo\('
    file: steps/LoginSteps.java
hints:
  - 'Trong `Hooks`: `@Before public void openBrowser() { context.setDriver(new ChromeDriver()); }`.'
  - '`@After public void closeBrowser() { context.getDriver().quit(); }`. `@After` luôn chạy, kể cả khi Scenario fail.'
  - 'Step lỗi làm giống `seeWelcome`, chỉ đổi `By.id("welcome")` thành `By.id("error-message")`.'
---

Đến lúc ghép mọi thứ lại: kịch bản Gherkin điều khiển **Chrome thật**. Bạn đã có đủ "đồ nghề":

| Mảnh ghép | Vai trò trong dự án |
|---|---|
| `features/dang_nhap.feature` | Kịch bản bằng lời |
| `TestContext` | Hộp chung chứa `WebDriver` |
| `Hooks` | `@Before` mở trình duyệt, `@After` đóng trình duyệt |
| `LoginSteps` | Step definition dùng `driver` lấy từ context |

## Ai giữ `WebDriver`?

Trình duyệt phải được **mở trước** Scenario và **đóng sau** Scenario, việc đó thuộc về hook. Nhưng step definition mới là nơi dùng `driver`. Đây đúng là bài toán chia sẻ dữ liệu trang trước, và lời giải giống hệt: `Hooks` và `LoginSteps` cùng nhận **một** `TestContext` qua constructor.

```java
@Before
public void openBrowser() {
    context.setDriver(new ChromeDriver());   // cất trình duyệt vào hộp chung
}
```

```java
@Given("tôi mở trang đăng nhập")
public void openLoginPage() {
    context.getDriver().get(BASE_URL + "login.html");   // lấy ra dùng
}
```

Nhờ vậy:

- Mỗi Scenario có **trình duyệt riêng**, sạch sẽ (không dính cookie, giỏ hàng của Scenario trước).
- `@After` luôn chạy, nên trình duyệt **luôn** được đóng, kể cả khi bước `Then` fail. Không còn cửa sổ Chrome "mồ côi".

> Sau khi đăng nhập đúng, trang chờ khoảng 0,6 giây rồi mới chuyển sang `account.html`. Vì vậy step `seeWelcome` dùng **explicit wait** (`WebDriverWait`) chứ không tìm `#welcome` ngay. Bạn đã học điều này ở chương Selenium: không bao giờ dùng `Thread.sleep`!

## Đến lượt bạn

1. Trong `steps/Hooks.java`: viết `@Before` tạo `new ChromeDriver()` rồi `context.setDriver(...)`, và `@After` gọi `quit()`.
2. Trong `steps/LoginSteps.java`: viết step `@Then("tôi thấy thông báo lỗi {string}")`, chờ `#error-message` hiện ra rồi kiểm tra chữ bên trong.

Bấm chạy và nhìn tab **Trình duyệt**: Chrome sẽ mở hai lần, mỗi lần cho một Scenario.
