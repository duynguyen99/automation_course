---
title: "BasePage: method chờ dùng chung"
type: code
mode: junit
minutes: 12
practice: dynamic.html
files:
  - name: BasePage.java
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

          // Chờ phần tử hiện ra rồi trả về nó
          protected WebElement waitVisible(By locator) {
              return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
          }

          // Chờ phần tử bấm được rồi click
          protected void click(By locator) {
              // TODO
          }

          // Chờ phần tử hiện ra, xóa chữ cũ, gõ chữ mới
          protected void type(By locator, String text) {
              // TODO
          }

          // Chờ phần tử hiện ra rồi trả về chữ của nó
          protected String text(By locator) {
              // TODO
              return "";
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
  - name: DynamicPage.java
    readonly: true
    content: |
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class DynamicPage extends BasePage {
          private final By loadButton = By.id("load-btn");
          private final By result = By.id("result");
          private final By confirmButton = By.id("confirm-btn");
          private final By confirmMessage = By.id("confirm-message");

          public DynamicPage(WebDriver driver) {
              super(driver);
          }

          public DynamicPage open() {
              driver.get("http://localhost:4000/practice/dynamic.html");
              return this;
          }

          public String loadOrderStatus() {
              click(loadButton);
              return text(result);          // kết quả hiện sau 2-4 giây
          }

          public String confirmOrder() {
              click(confirmButton);         // nút bị khóa 3 giây đầu
              return text(confirmMessage);
          }
      }
  - name: PageTest.java
    readonly: true
    content: |
      import org.junit.jupiter.api.AfterEach;
      import org.junit.jupiter.api.BeforeEach;
      import org.junit.jupiter.api.Test;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.chrome.ChromeDriver;
      import static org.assertj.core.api.Assertions.assertThat;

      class PageTest {
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
          void wrongPasswordShowsError() {
              LoginPage page = new LoginPage(driver).open().loginExpectingError("lan", "sai123");
              assertThat(page.errorText()).isEqualTo("Sai tên đăng nhập hoặc mật khẩu");
          }

          @Test
          void loadOrderStatus() {
              String status = new DynamicPage(driver).open().loadOrderStatus();
              assertThat(status).isEqualTo("Đơn hàng TM2026 đang được giao");
          }

          @Test
          void confirmOrderWhenButtonEnabled() {
              String message = new DynamicPage(driver).open().confirmOrder();
              assertThat(message).isEqualTo("Đã xác nhận đơn hàng!");
          }
      }
solution:
  BasePage.java: |
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
tests:
  - text: '`click` chờ bằng `ExpectedConditions.elementToBeClickable`'
    source: 'void\s+click\(By\s+\w+\)\s*\{[\s\S]*?elementToBeClickable\('
    file: BasePage.java
  - text: '`type` chờ phần tử, gọi `clear()` rồi `sendKeys(...)`'
    source: 'void\s+type\([^)]*\)\s*\{[\s\S]*?\.clear\(\)[\s\S]*?\.sendKeys\('
    file: BasePage.java
  - text: '`text` dùng lại `waitVisible(...)`'
    source: 'String\s+text\(By\s+\w+\)\s*\{[\s\S]*?waitVisible\('
    file: BasePage.java
  - text: 'Test `wrongPasswordShowsError` pass'
    junit: { name: wrongPasswordShowsError, status: passed }
  - text: 'Test `loadOrderStatus` pass (chờ được kết quả trễ 2-4 giây)'
    junit: { name: loadOrderStatus, status: passed }
  - text: 'Test `confirmOrderWhenButtonEnabled` pass (chờ được nút hết bị khóa)'
    junit: { name: confirmOrderWhenButtonEnabled, status: passed }
hints:
  - '`click`: `wait.until(ExpectedConditions.elementToBeClickable(locator)).click();`'
  - '`type`: `WebElement element = waitVisible(locator);` rồi `element.clear();` và `element.sendKeys(text);`'
  - '`text`: `return waitVisible(locator).getText();`'
timeout: 120
---

Bài trước, `AccountPage` phải tự tạo `WebDriverWait`. Nếu có 20 page, bạn sẽ tạo `WebDriverWait` 20 lần và viết `wait.until(ExpectedConditions...)` hàng trăm lần. Lại trùng lặp! Giải pháp: gom phần chung vào một **class cha**.

## BasePage: cha của mọi page

```java
public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) { ... }

    protected void click(By locator) { ... }               // chờ bấm được rồi click
    protected void type(By locator, String text) { ... }   // chờ hiện, clear, gõ
    protected String text(By locator) { ... }              // chờ hiện rồi đọc chữ
}

public class LoginPage extends BasePage {
    public LoginPage(WebDriver driver) {
        super(driver);       // gọi constructor của BasePage
    }
}
```

Ôn lại kiến thức OOP:

- **`extends`** (*kế thừa*): `LoginPage` và `DynamicPage` tự động có `driver`, `wait`, `click`, `type`, `text` mà không phải viết lại.
- **`abstract`**: không ai được `new BasePage(...)`, vì nó không đại diện cho trang nào cả, chỉ là "khuôn" chung.
- **`protected`**: chỉ class con dùng được. Test không gọi `click(By...)` trực tiếp, mà gọi method nghiệp vụ như `loginExpectingError(...)`.

## Mỗi thao tác đều tự chờ

Đây là lợi ích lớn nhất: **mọi** click đều chờ phần tử bấm được, **mọi** lần đọc chữ đều chờ phần tử hiện ra. Nhìn `DynamicPage` (chỉ đọc): kết quả trễ 2 đến 4 giây, nút bị khóa 3 giây, nhưng code page không có một dòng `wait` nào. Toàn bộ sự "kiên nhẫn" nằm trong `BasePage`.

> Đây là lý do test viết theo POM + BasePage **ít flaky** hơn hẳn: không ai còn "quên chờ" nữa.

## Đến lượt bạn

Hoàn thiện ba method trong `BasePage.java`:

1. `click(locator)`: chờ `elementToBeClickable` rồi click.
2. `type(locator, text)`: chờ phần tử hiện ra (dùng `waitVisible`), `clear()`, rồi `sendKeys(text)`.
3. `text(locator)`: dùng `waitVisible` rồi trả về `getText()`.

Cả ba test trong `PageTest` phải pass, kể cả hai test trên trang tải chậm.
