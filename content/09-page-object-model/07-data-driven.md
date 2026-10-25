---
title: "Data-driven test với @ParameterizedTest"
type: code
mode: junit
minutes: 12
practice: login.html
files:
  - name: LoginErrorTest.java
    content: |
      import org.junit.jupiter.params.ParameterizedTest;
      import org.junit.jupiter.params.provider.CsvSource;
      import static org.assertj.core.api.Assertions.assertThat;

      class LoginErrorTest extends BaseTest {

          @ParameterizedTest(name = "[{index}] ''{0}'' / ''{1}'' -> {2}")
          @CsvSource({
              "lan, sai123, Sai tên đăng nhập hoặc mật khẩu",
              // TODO: thêm 3 dòng dữ liệu
          })
          void showsErrorMessage(String username, String password, String expectedError) {
              // TODO: mở trang đăng nhập, đăng nhập (mong đợi lỗi), kiểm tra thông báo lỗi

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
  - name: Config.java
    readonly: true
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
              return PROPS.getProperty("baseUrl").trim();
          }

          public static int timeoutSeconds() {
              return Integer.parseInt(PROPS.getProperty("timeout").trim());
          }
      }
  - name: config.properties
    readonly: true
    content: |
      baseUrl=http://localhost:4000/practice/
      timeout=10
solution:
  LoginErrorTest.java: |
    import org.junit.jupiter.params.ParameterizedTest;
    import org.junit.jupiter.params.provider.CsvSource;
    import static org.assertj.core.api.Assertions.assertThat;

    class LoginErrorTest extends BaseTest {

        @ParameterizedTest(name = "[{index}] ''{0}'' / ''{1}'' -> {2}")
        @CsvSource({
            "lan, sai123, Sai tên đăng nhập hoặc mật khẩu",
            "'', matkhau123, Vui lòng nhập tên đăng nhập",
            "lan, '', Vui lòng nhập mật khẩu",
            "khoa, matkhau123, Tài khoản của bạn đã bị khóa",
        })
        void showsErrorMessage(String username, String password, String expectedError) {
            LoginPage page = new LoginPage(driver).open().loginExpectingError(username, password);
            assertThat(page.errorText()).isEqualTo(expectedError);
        }
    }
tests:
  - text: 'Bảng dữ liệu có dòng tên đăng nhập rỗng (`''''`) → `Vui lòng nhập tên đăng nhập`'
    source: '"\s*''''\s*,\s*matkhau123\s*,\s*Vui lòng nhập tên đăng nhập\s*"'
  - text: 'Có dòng mật khẩu rỗng → `Vui lòng nhập mật khẩu`'
    source: '"\s*lan\s*,\s*''''\s*,\s*Vui lòng nhập mật khẩu\s*"'
  - text: 'Có dòng tài khoản bị khóa `khoa` → `Tài khoản của bạn đã bị khóa`'
    source: '"\s*khoa\s*,\s*matkhau123\s*,\s*Tài khoản của bạn đã bị khóa\s*"'
  - text: 'Test dùng `LoginPage` và `assertThat(...).isEqualTo(expectedError)`'
    source: 'new\s+LoginPage\(\s*driver\s*\)[\s\S]*assertThat\([\s\S]*\)\s*\.isEqualTo\(\s*expectedError\s*\)'
    file: LoginErrorTest.java
  - text: 'Cả 4 bộ dữ liệu đều pass'
    junit: { passed: 4, failed: 0 }
hints:
  - 'Chuỗi rỗng trong `@CsvSource` viết là hai dấu nháy đơn: `"'''', matkhau123, Vui lòng nhập tên đăng nhập"`. Bỏ trống hẳn thì JUnit truyền vào `null`.'
  - 'Thân test chỉ cần 2 dòng: `LoginPage page = new LoginPage(driver).open().loginExpectingError(username, password);` rồi `assertThat(page.errorText()).isEqualTo(expectedError);`'
timeout: 120
---

Form đăng nhập có ít nhất 4 trường hợp lỗi. Viết 4 test method giống hệt nhau, chỉ khác dữ liệu? Không cần! Bạn đã biết `@ParameterizedTest` từ chương 6, giờ kết hợp nó với Page Object để có một **data-driven test** (test hướng dữ liệu): **một** kịch bản, **nhiều** bộ dữ liệu.

## Bảng dữ liệu

| Tên đăng nhập | Mật khẩu | Thông báo lỗi mong đợi |
|---|---|---|
| `lan` | `sai123` | `Sai tên đăng nhập hoặc mật khẩu` |
| *(rỗng)* | `matkhau123` | `Vui lòng nhập tên đăng nhập` |
| `lan` | *(rỗng)* | `Vui lòng nhập mật khẩu` |
| `khoa` | `matkhau123` | `Tài khoản của bạn đã bị khóa` |

Nhìn bảng này, bạn có thấy quen không? Đó chính là bảng test case mà tester vẫn viết trong Excel! Với `@CsvSource`, bảng ấy nằm ngay trong code:

```java
@ParameterizedTest(name = "[{index}] ''{0}'' / ''{1}'' -> {2}")
@CsvSource({
    "lan, sai123, Sai tên đăng nhập hoặc mật khẩu",
    "'', matkhau123, Vui lòng nhập tên đăng nhập",
})
void showsErrorMessage(String username, String password, String expectedError) { ... }
```

- Mỗi chuỗi là một dòng, các cột cách nhau bằng dấu phẩy, lần lượt đổ vào tham số của method.
- **Chuỗi rỗng** viết là `''` (hai dấu nháy đơn). Nếu bỏ trống hẳn, JUnit truyền vào `null`, và `sendKeys(null)` sẽ ném exception.
- `name = ...` đặt tên hiển thị cho từng lần chạy: `{index}` là số thứ tự, `{0}`, `{1}`, `{2}` là giá trị từng cột (trong `name`, `''` hiển thị thành một dấu nháy). Xem tab **Kết quả test** để thấy tên dễ đọc thế nào.

## POM + data-driven = cặp đôi hoàn hảo

Thân test chỉ còn hai dòng, vì mọi chi tiết đã nằm trong `LoginPage`. Muốn thêm trường hợp mới (ví dụ tên đăng nhập toàn dấu cách)? Chỉ cần thêm **một dòng dữ liệu**, không viết thêm code.

> Mỗi bộ dữ liệu là một test riêng, có trình duyệt riêng (nhờ `@BeforeEach` trong `BaseTest`). Một dòng fail không kéo theo các dòng khác.

## Đến lượt bạn

1. Thêm 3 dòng còn lại của bảng vào `@CsvSource` (nhớ dùng `''` cho ô rỗng).
2. Viết thân test: mở `LoginPage`, gọi `loginExpectingError(username, password)`, rồi khẳng định `errorText()` bằng `expectedError`.

Cả 4 lần chạy phải pass. Chrome sẽ mở và đóng 4 lần, hãy kiên nhẫn một chút nhé.
