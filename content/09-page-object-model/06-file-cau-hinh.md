---
title: "File cấu hình: config.properties"
type: code
mode: junit
minutes: 12
practice: login.html
files:
  - name: config.properties
    content: |
      # Cấu hình chung cho bộ test
      baseUrl=http://localhost:4000/practice/
      timeout=10
  - name: Config.java
    content: |
      import java.io.FileInputStream;
      import java.io.IOException;
      import java.io.InputStream;
      import java.util.Properties;

      public final class Config {
          private static final Properties PROPS = load();

          private Config() {
          }

          private static Properties load() {
              try (InputStream in = new FileInputStream("config.properties")) {
                  Properties props = new Properties();
                  props.load(in);
                  return props;
              } catch (IOException e) {
                  throw new IllegalStateException("Không đọc được file config.properties", e);
              }
          }

          public static String baseUrl() {
              // TODO: trả về giá trị của key "baseUrl"
              return null;
          }

          public static int timeoutSeconds() {
              // TODO: đọc key "timeout" và đổi sang int
              return 0;
          }
      }
  - name: LoginPage.java
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
              // TODO: dùng Config.baseUrl() thay cho địa chỉ viết cứng
              driver.get("http://localhost:4000/practice/login.html");
              return this;
          }

          public LoginPage loginExpectingError(String username, String password) {
              type(usernameInput, username);
              type(passwordInput, password);
              click(loginButton);
              return this;
          }

          public String errorText() {
              return text(errorMessage);
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
              this.wait = new WebDriverWait(driver, Duration.ofSeconds(Config.timeoutSeconds()));
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
  - name: BaseTest.java
    readonly: true
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
  - name: ConfigTest.java
    readonly: true
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class ConfigTest {

          @Test
          void readsBaseUrl() {
              assertThat(Config.baseUrl()).isEqualTo("http://localhost:4000/practice/");
          }

          @Test
          void readsTimeout() {
              assertThat(Config.timeoutSeconds()).isEqualTo(10);
          }
      }
  - name: LoginTest.java
    readonly: true
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class LoginTest extends BaseTest {

          @Test
          void lockedAccountShowsError() {
              LoginPage page = new LoginPage(driver).open().loginExpectingError("khoa", "matkhau123");
              assertThat(driver.getCurrentUrl()).startsWith(Config.baseUrl());
              assertThat(page.errorText()).isEqualTo("Tài khoản của bạn đã bị khóa");
          }
      }
solution:
  Config.java: |
    import java.io.FileInputStream;
    import java.io.IOException;
    import java.io.InputStream;
    import java.util.Properties;

    public final class Config {
        private static final Properties PROPS = load();

        private Config() {
        }

        private static Properties load() {
            try (InputStream in = new FileInputStream("config.properties")) {
                Properties props = new Properties();
                props.load(in);
                return props;
            } catch (IOException e) {
                throw new IllegalStateException("Không đọc được file config.properties", e);
            }
        }

        public static String baseUrl() {
            return PROPS.getProperty("baseUrl").trim();
        }

        public static int timeoutSeconds() {
            return Integer.parseInt(PROPS.getProperty("timeout").trim());
        }
    }
  LoginPage.java: |
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
            driver.get(Config.baseUrl() + "login.html");
            return this;
        }

        public LoginPage loginExpectingError(String username, String password) {
            type(usernameInput, username);
            type(passwordInput, password);
            click(loginButton);
            return this;
        }

        public String errorText() {
            return text(errorMessage);
        }
    }
tests:
  - text: '`baseUrl()` đọc key `baseUrl` bằng `getProperty`'
    source: 'getProperty\(\s*"baseUrl"\s*\)'
    file: Config.java
  - text: '`timeoutSeconds()` đổi chuỗi sang số bằng `Integer.parseInt`'
    source: 'Integer\.parseInt\([\s\S]*getProperty\(\s*"timeout"\s*\)'
    file: Config.java
  - text: '`LoginPage.open()` dùng `Config.baseUrl() + "login.html"`'
    source: 'driver\.get\(\s*Config\.baseUrl\(\)\s*\+\s*"login\.html"\s*\)'
    file: LoginPage.java
  - text: '`LoginPage` không còn địa chỉ `http://localhost...` viết cứng'
    notSource: 'http://localhost'
    file: LoginPage.java
  - text: 'Test `readsTimeout` pass'
    junit: { name: readsTimeout, status: passed }
  - text: 'Test `readsBaseUrl` pass'
    junit: { name: readsBaseUrl, status: passed }
  - text: 'Test `lockedAccountShowsError` pass'
    junit: { name: lockedAccountShowsError, status: passed }
hints:
  - '`return PROPS.getProperty("baseUrl").trim();` (`trim()` để bỏ dấu cách thừa nếu ai đó lỡ gõ vào file).'
  - '`return Integer.parseInt(PROPS.getProperty("timeout").trim());`'
  - 'Trong `open()`: `driver.get(Config.baseUrl() + "login.html");`'
timeout: 120
---

Địa chỉ `http://localhost:4000/practice/` đang được viết cứng trong từng page. Nhưng trong dự án thật, cùng một bộ test phải chạy trên nhiều **môi trường** (*environment*):

| Môi trường | Địa chỉ ví dụ | Ai dùng |
|---|---|---|
| Local | `http://localhost:4000/` | Lập trình viên, tester trên máy mình |
| Staging | `https://staging.tramoc.vn/` | Team QA test trước khi phát hành |
| Production | `https://tramoc.vn/` | Khách hàng thật (chỉ chạy vài test "khói") |

Không ai muốn sửa code mỗi lần đổi môi trường. Giải pháp: đưa những giá trị hay thay đổi ra một **file cấu hình**.

## File .properties

Bấm vào tab `config.properties`:

```properties
# Cấu hình chung cho bộ test
baseUrl=http://localhost:4000/practice/
timeout=10
```

Mỗi dòng là một cặp **key=value**. Dòng bắt đầu bằng `#` là comment. Đây là định dạng cấu hình truyền thống của Java, gặp ở gần như mọi dự án.

## Đọc file bằng class Properties

Class `Config` đã có sẵn method `load()`:

```java
try (InputStream in = new FileInputStream("config.properties")) {
    Properties props = new Properties();
    props.load(in);          // đọc tất cả các dòng key=value
    return props;
}
```

- **`Properties`** giống một `Map<String, String>`: `props.getProperty("baseUrl")` trả về `"http://localhost:4000/practice/"`.
- Giá trị luôn là **String**. Muốn số thì tự đổi: `Integer.parseInt(...)`.
- `try (...)` là **try-with-resources**: Java tự đóng file sau khi đọc xong, kể cả khi có lỗi.
- Field `PROPS` là `static final`, nên file chỉ được đọc **một lần** dù có bao nhiêu page dùng `Config`.

> Ở dự án thật, bạn có thể chọn môi trường lúc chạy, ví dụ `mvn test -Denv=staging`, và `Config` đọc file `staging.properties` tương ứng. Code test không đổi một dòng nào.

## Đến lượt bạn

1. Trong `Config.java`: viết `baseUrl()` (trả về giá trị của key `baseUrl`) và `timeoutSeconds()` (đọc key `timeout`, đổi sang `int`).
2. Trong `LoginPage.java`: sửa `open()` thành `driver.get(Config.baseUrl() + "login.html");`

`BasePage` (chỉ đọc) giờ lấy thời gian chờ từ `Config.timeoutSeconds()`. Cả ba test phải pass. Thử đổi `timeout=10` trong file cấu hình thành số khác để thấy test `readsTimeout` fail ngay!
