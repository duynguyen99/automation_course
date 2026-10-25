---
title: "Bài tổng hợp: Kịch bản cho trang thanh toán"
type: code
mode: cucumber
minutes: 25
practice: checkout.html
timeout: 150
files:
  - name: features/thanh_toan.feature
    content: |
      Feature: Thanh toán
        Là khách hàng của Tiệm Trà Mộc
        Tôi muốn được báo lỗi rõ ràng khi điền sai thông tin
        Để đặt hàng thành công ngay lần sau

        Background:
          Given tôi mở trang thanh toán

        # 1. Scenario Outline: Báo lỗi khi thông tin không hợp lệ (4 dòng Examples)

        # 2. Scenario: Đặt hàng thành công

  - name: steps/CheckoutSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      public class CheckoutSteps {
          private final TestContext context;
          private CheckoutPage checkoutPage;

          public CheckoutSteps(TestContext context) {
              this.context = context;
          }

          @Given("tôi mở trang thanh toán")
          public void openCheckout() {
              checkoutPage = new CheckoutPage(context.getDriver()).open();
          }

          // Viết các step còn lại ở đây, chỉ gọi method của checkoutPage

      }
  - name: steps/CheckoutPage.java
    readonly: true
    content: |
      package steps;

      import java.util.List;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;
      import org.openqa.selenium.support.ui.Select;

      public class CheckoutPage extends BasePage {
          private final By fullname = By.id("fullname");
          private final By phone = By.id("phone");
          private final By email = By.id("email");
          private final By city = By.id("city");
          private final By agree = By.id("agree");
          private final By placeOrderButton = By.id("place-order");
          private final By fieldErrors = By.cssSelector(".field-error");
          private final By orderSuccess = By.id("order-success");
          private final By orderCode = By.id("order-code");

          public CheckoutPage(WebDriver driver) {
              super(driver);
          }

          public CheckoutPage open() {
              driver.get(BASE_URL + "checkout.html");
              return this;
          }

          /** Điền họ tên, số điện thoại, email. Chuỗi rỗng = để trống ô đó. */
          public void fillContact(String name, String phoneNumber, String mail) {
              type(fullname, name);
              type(phone, phoneNumber);
              type(email, mail);
          }

          /** Chọn tỉnh/thành theo chữ hiển thị, ví dụ "Hà Nội". Chuỗi rỗng = không chọn. */
          public void selectCity(String visibleText) {
              if (!visibleText.isEmpty()) {
                  new Select(visible(city)).selectByVisibleText(visibleText);
              }
          }

          public void agreeToTerms() {
              WebElement box = visible(agree);
              if (!box.isSelected()) {
                  box.click();
              }
          }

          public void placeOrder() {
              click(placeOrderButton);
          }

          /** Các thông báo lỗi đang hiện (chờ tối đa 5 giây cho tới khi có ít nhất một lỗi). */
          public List<String> getErrorMessages() {
              return wait.until(d -> {
                  List<String> errors = d.findElements(fieldErrors).stream()
                      .map(WebElement::getText)
                      .filter(text -> !text.isBlank())
                      .toList();
                  return errors.isEmpty() ? null : errors;
              });
          }

          public String getSuccessMessage() {
              return visible(orderSuccess).getText();
          }

          public String getOrderCode() {
              return visible(orderCode).getText();
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
  features/thanh_toan.feature: |
    Feature: Thanh toán
      Là khách hàng của Tiệm Trà Mộc
      Tôi muốn được báo lỗi rõ ràng khi điền sai thông tin
      Để đặt hàng thành công ngay lần sau

      Background:
        Given tôi mở trang thanh toán

      Scenario Outline: Báo lỗi khi thông tin không hợp lệ
        When tôi điền họ tên "<hoTen>", số điện thoại "<soDienThoai>" và email "<email>"
        And tôi chọn thành phố "<tinhThanh>"
        And tôi đồng ý với điều khoản mua hàng
        And tôi bấm nút Đặt hàng
        Then tôi chỉ thấy một lỗi "<loi>"

        Examples:
          | hoTen          | soDienThoai | email         | tinhThanh | loi                        |
          |                | 0912345678  | lan@tramoc.vn | Hà Nội    | Vui lòng nhập họ tên       |
          | Nguyễn Thị Lan | 12345       | lan@tramoc.vn | Hà Nội    | Số điện thoại không hợp lệ |
          | Nguyễn Thị Lan | 0912345678  | lan.tramoc.vn | Hà Nội    | Email không hợp lệ         |
          | Nguyễn Thị Lan | 0912345678  | lan@tramoc.vn |           | Vui lòng chọn tỉnh/thành   |

      Scenario: Đặt hàng thành công
        When tôi điền họ tên "Nguyễn Thị Lan", số điện thoại "0912345678" và email "lan@tramoc.vn"
        And tôi chọn thành phố "Hà Nội"
        And tôi đồng ý với điều khoản mua hàng
        And tôi bấm nút Đặt hàng
        Then tôi thấy thông báo "Đặt hàng thành công!"
        And mã đơn hàng gồm "TM" và 6 chữ số
  steps/CheckoutSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import static org.assertj.core.api.Assertions.assertThat;

    public class CheckoutSteps {
        private final TestContext context;
        private CheckoutPage checkoutPage;

        public CheckoutSteps(TestContext context) {
            this.context = context;
        }

        @Given("tôi mở trang thanh toán")
        public void openCheckout() {
            checkoutPage = new CheckoutPage(context.getDriver()).open();
        }

        @When("tôi điền họ tên {string}, số điện thoại {string} và email {string}")
        public void fillContact(String name, String phone, String email) {
            checkoutPage.fillContact(name, phone, email);
        }

        @When("tôi chọn thành phố {string}")
        public void selectCity(String city) {
            checkoutPage.selectCity(city);
        }

        @When("tôi đồng ý với điều khoản mua hàng")
        public void agree() {
            checkoutPage.agreeToTerms();
        }

        @When("tôi bấm nút Đặt hàng")
        public void placeOrder() {
            checkoutPage.placeOrder();
        }

        @Then("tôi chỉ thấy một lỗi {string}")
        public void onlyOneError(String expected) {
            assertThat(checkoutPage.getErrorMessages()).containsExactly(expected);
        }

        @Then("tôi thấy thông báo {string}")
        public void seeMessage(String expected) {
            assertThat(checkoutPage.getSuccessMessage()).contains(expected);
        }

        @Then("mã đơn hàng gồm {string} và {int} chữ số")
        public void orderCodeFormat(String prefix, int digits) {
            assertThat(checkoutPage.getOrderCode()).matches(prefix + "\\d{" + digits + "}");
        }
    }
tests:
  - text: 'Có một `Scenario Outline` với bảng `Examples` gồm ít nhất 4 dòng dữ liệu'
    source: '^\s*Scenario Outline:[\s\S]*Examples:[ \t]*\n(?:[ \t]*\|[^\n]*\|[ \t]*(?:\n|$)){5}'
    file: features/thanh_toan.feature
  - text: 'Bảng `Examples` kiểm tra đủ 4 lỗi: họ tên, số điện thoại, email, tỉnh/thành'
    source: '(?=[\s\S]*Vui lòng nhập họ tên)(?=[\s\S]*Số điện thoại không hợp lệ)(?=[\s\S]*Email không hợp lệ)(?=[\s\S]*Vui lòng chọn tỉnh/thành)'
    file: features/thanh_toan.feature
  - text: 'Có Scenario `Đặt hàng thành công` và nó pass trên trình duyệt'
    cucumber: { scenario: "Đặt hàng thành công" }
  - text: 'Ít nhất 5 lần chạy pass (4 dòng Examples + 1 Scenario thành công)'
    cucumber: { passed: 5 }
  - text: 'Step definition chỉ gọi `checkoutPage`, không có `By.` hay `findElement`'
    notSource: 'By\.|findElement'
    file: steps/CheckoutSteps.java
  - text: 'Kiểm tra mã đơn hàng bằng `getOrderCode()`'
    source: 'getOrderCode\(\)'
    file: steps/CheckoutSteps.java
hints:
  - 'Viết feature trước. Mỗi dòng `Examples` để trống đúng **một** thông tin (hoặc điền sai), các ô còn lại hợp lệ: `0912345678`, `lan@tramoc.vn`, `Hà Nội`, luôn tích ô đồng ý. Như vậy mỗi lần chạy chỉ có đúng một lỗi.'
  - 'Mỗi câu `When`/`And`/`Then` trong feature cần một step trong `CheckoutSteps`, gọi đúng một method của `checkoutPage`. Ví dụ `@When("tôi chọn thành phố {string}")` gọi `checkoutPage.selectCity(city)`.'
  - 'Kiểm tra lỗi: `assertThat(checkoutPage.getErrorMessages()).containsExactly(expected);`. Kiểm tra mã đơn: `assertThat(checkoutPage.getOrderCode()).matches("TM\\d{6}");`.'
---

Bài cuối chương, và là bài giống công việc thật nhất từ trước tới giờ. BA vừa gửi yêu cầu cho trang **Thanh toán**, và bạn được giao viết bộ test BDD. Lần này bạn tự viết **cả hai tầng**: kịch bản Gherkin và step definition. Page object `CheckoutPage` đã có sẵn.

## Quy tắc của form (từ tài liệu yêu cầu)

| Ô | Hợp lệ khi | Thông báo lỗi |
|---|---|---|
| Họ và tên | không bỏ trống | `Vui lòng nhập họ tên` |
| Số điện thoại | 10 chữ số, bắt đầu bằng 0 | `Số điện thoại không hợp lệ` |
| Email | dạng `ten@mien.duoi` | `Email không hợp lệ` |
| Tỉnh/Thành phố | đã chọn | `Vui lòng chọn tỉnh/thành` |
| Đồng ý điều khoản | đã tích | `Bạn cần đồng ý với điều khoản` |

Khi mọi thứ hợp lệ, trang hiện `Đặt hàng thành công! Mã đơn: TM123456...` (TM và 6 chữ số).

## Những gì `CheckoutPage` cho bạn dùng

| Method | Việc nó làm |
|---|---|
| `open()` | Mở trang thanh toán, trả về chính page |
| `fillContact(name, phone, email)` | Điền 3 ô. Chuỗi rỗng = để trống |
| `selectCity("Hà Nội")` | Chọn tỉnh/thành. Chuỗi rỗng = không chọn |
| `agreeToTerms()` | Tích ô đồng ý |
| `placeOrder()` | Bấm nút Đặt hàng |
| `getErrorMessages()` | `List<String>` các lỗi đang hiện |
| `getSuccessMessage()`, `getOrderCode()` | Thông báo thành công và mã đơn |

## Đến lượt bạn

**1. Viết `features/thanh_toan.feature`** (Background mở trang đã có sẵn):

- Một **`Scenario Outline`** tên `Báo lỗi khi thông tin không hợp lệ`, với `Examples` ít nhất **4 dòng**, mỗi dòng gây ra đúng **một** lỗi: thiếu họ tên, số điện thoại sai, email sai, chưa chọn tỉnh/thành. Bước cuối kiểm tra chỉ có đúng lỗi đó.
- Một **`Scenario: Đặt hàng thành công`**: điền đúng hết, thấy `"Đặt hàng thành công!"`, và mã đơn gồm `TM` cùng 6 chữ số.

Gợi ý các câu bạn có thể dùng:

```gherkin
When tôi điền họ tên "<hoTen>", số điện thoại "<soDienThoai>" và email "<email>"
And tôi chọn thành phố "<tinhThanh>"
And tôi đồng ý với điều khoản mua hàng
And tôi bấm nút Đặt hàng
Then tôi chỉ thấy một lỗi "<loi>"
```

**2. Viết `steps/CheckoutSteps.java`**: mỗi câu một step, chỉ gọi method của `checkoutPage` rồi assert bằng AssertJ. Không dùng `By` hay `findElement` trong step.

> **Bẫy nhỏ:** trong annotation của step, dấu `/` có nghĩa "hoặc" (`tỉnh/thành` khớp chữ `tỉnh` *hoặc* chữ `thành`), còn `( )` nghĩa là "có thể có hoặc không". Vì vậy câu gợi ý dùng "thành phố" thay cho "tỉnh/thành". Dữ liệu nằm trong ngoặc kép như `"Vui lòng chọn tỉnh/thành"` thì không sao.

> Bài này mở Chrome 5 lần (mỗi lần chạy một trình duyệt sạch), nên mất khoảng nửa phút đến một phút. Trong lúc chờ, hãy nhìn tab **Trình duyệt** xem từng bộ dữ liệu được điền vào form. Xong bài này, bạn đã viết được một bộ test BDD hoàn chỉnh như ở công ty!
