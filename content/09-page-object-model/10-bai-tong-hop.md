---
title: "Bài tổng hợp: POM cho trang sản phẩm và giỏ hàng"
type: code
mode: junit
minutes: 20
practice: products.html
files:
  - name: ProductsPage.java
    content: |
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;

      public class ProductsPage extends BasePage {
          private final By cartCount = By.id("cart-count");
          private final By cartLink = By.id("cart-link");

          public ProductsPage(WebDriver driver) {
              super(driver);
          }

          // Locator động: nút "Thêm vào giỏ" của sản phẩm có data-id = productId
          private By addButton(int productId) {
              return By.cssSelector(".add-to-cart[data-id='" + productId + "']");
          }

          public ProductsPage open() {
              // TODO: mở Config.baseUrl() + "products.html"
              return this;
          }

          public ProductsPage addToCart(int productId) {
              // TODO
              return this;
          }

          public int cartCount() {
              // TODO: đọc chữ của #cart-count và đổi sang int
              return 0;
          }

          public boolean isAddToCartEnabled(int productId) {
              // TODO
              return true;
          }

          public CartPage goToCart() {
              // TODO
              return null;
          }
      }
  - name: CartPage.java
    content: |
      import java.util.List;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;

      public class CartPage extends BasePage {
          private final By itemName = By.cssSelector("tr.cart-row .item-name");
          private final By cartTotal = By.id("cart-total");

          public CartPage(WebDriver driver) {
              super(driver);
          }

          public List<String> itemNames() {
              // TODO: chờ #cart-total hiện ra, rồi lấy chữ của tất cả .item-name
              return List.of();
          }

          public String total() {
              // TODO
              return "";
          }
      }
  - name: CartTest.java
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class CartTest extends BaseTest {

          @Test
          void addTwoProductsShowsTotal() {
              ProductsPage products = new ProductsPage(driver).open()
                      .addToCart(3)
                      .addToCart(4);
              assertThat(products.cartCount()).isEqualTo(2);

              CartPage cart = products.goToCart();
              assertThat(cart.itemNames()).containsExactly("Trà Sen Tây Hồ", "Trà Nhài Thái Nguyên");
              assertThat(cart.total()).isEqualTo("570.000₫");
          }

          // TODO: test outOfStockCannotBeAdded

          // TODO: test sameProductTwiceDoublesTotal

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
  ProductsPage.java: |
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;

    public class ProductsPage extends BasePage {
        private final By cartCount = By.id("cart-count");
        private final By cartLink = By.id("cart-link");

        public ProductsPage(WebDriver driver) {
            super(driver);
        }

        private By addButton(int productId) {
            return By.cssSelector(".add-to-cart[data-id='" + productId + "']");
        }

        public ProductsPage open() {
            driver.get(Config.baseUrl() + "products.html");
            return this;
        }

        public ProductsPage addToCart(int productId) {
            click(addButton(productId));
            return this;
        }

        public int cartCount() {
            return Integer.parseInt(text(cartCount));
        }

        public boolean isAddToCartEnabled(int productId) {
            return waitVisible(addButton(productId)).isEnabled();
        }

        public CartPage goToCart() {
            click(cartLink);
            return new CartPage(driver);
        }
    }
  CartPage.java: |
    import java.util.List;
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.WebElement;

    public class CartPage extends BasePage {
        private final By itemName = By.cssSelector("tr.cart-row .item-name");
        private final By cartTotal = By.id("cart-total");

        public CartPage(WebDriver driver) {
            super(driver);
        }

        public List<String> itemNames() {
            waitVisible(cartTotal);
            return driver.findElements(itemName).stream()
                    .map(WebElement::getText)
                    .toList();
        }

        public String total() {
            return text(cartTotal);
        }
    }
  CartTest.java: |
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    class CartTest extends BaseTest {

        @Test
        void addTwoProductsShowsTotal() {
            ProductsPage products = new ProductsPage(driver).open()
                    .addToCart(3)
                    .addToCart(4);
            assertThat(products.cartCount()).isEqualTo(2);

            CartPage cart = products.goToCart();
            assertThat(cart.itemNames()).containsExactly("Trà Sen Tây Hồ", "Trà Nhài Thái Nguyên");
            assertThat(cart.total()).isEqualTo("570.000₫");
        }

        @Test
        void outOfStockCannotBeAdded() {
            ProductsPage products = new ProductsPage(driver).open();
            assertThat(products.isAddToCartEnabled(5)).isFalse();
        }

        @Test
        void sameProductTwiceDoublesTotal() {
            CartPage cart = new ProductsPage(driver).open()
                    .addToCart(1)
                    .addToCart(1)
                    .goToCart();
            assertThat(cart.itemNames()).containsExactly("Trà Shan Tuyết");
            assertThat(cart.total()).isEqualTo("370.000₫");
        }
    }
tests:
  - text: '`ProductsPage` và `CartPage` kế thừa `BasePage`'
    source: 'class\s+ProductsPage\s+extends\s+BasePage[\s\S]*class\s+CartPage\s+extends\s+BasePage|class\s+CartPage\s+extends\s+BasePage[\s\S]*class\s+ProductsPage\s+extends\s+BasePage'
  - text: '`goToCart()` trả về `new CartPage(driver)`'
    source: 'return\s+new\s+CartPage\(\s*driver\s*\)'
    file: ProductsPage.java
  - text: 'Test `addTwoProductsShowsTotal` pass'
    junit: { name: addTwoProductsShowsTotal, status: passed }
  - text: 'Có test `outOfStockCannotBeAdded` (sản phẩm 5 hết hàng, nút bị khóa) và nó pass'
    junit: { name: outOfStockCannotBeAdded, status: passed }
  - text: 'Có test `sameProductTwiceDoublesTotal` (thêm sản phẩm 1 hai lần, tổng `370.000₫`) và nó pass'
    junit: { name: sameProductTwiceDoublesTotal, status: passed }
  - text: '`CartTest` không chứa `By` hay `findElement`, chỉ dùng Page Object'
    notSource: '\bBy\.|findElement'
    file: CartTest.java
hints:
  - '`addToCart`: `click(addButton(productId)); return this;`. `goToCart`: `click(cartLink); return new CartPage(driver);`'
  - '`cartCount`: `return Integer.parseInt(text(cartCount));`. `isAddToCartEnabled`: `return waitVisible(addButton(productId)).isEnabled();`'
  - '`itemNames`: gọi `waitVisible(cartTotal);` trước (chờ trang giỏ hàng tải xong), rồi `driver.findElements(itemName).stream().map(WebElement::getText).toList()`.'
timeout: 120
---

Bài cuối chương! Bạn sẽ dựng Page Object cho hai trang quan trọng nhất của một cửa hàng online, rồi viết test chỉ bằng "ngôn ngữ nghiệp vụ".

## Cấu trúc framework

| File | Vai trò | Ai viết |
|---|---|---|
| `ProductsPage.java` | Trang sản phẩm: mở trang, thêm vào giỏ, đọc số lượng, sang giỏ hàng | **Bạn** |
| `CartPage.java` | Trang giỏ hàng: danh sách tên sản phẩm, tổng tiền | **Bạn** |
| `CartTest.java` | Các kịch bản test | **Bạn** (1 test có sẵn) |
| `BasePage`, `BaseTest`, `Config`, `config.properties` | Nền móng từ các bài trước | Có sẵn |

## Locator động

Mỗi sản phẩm có một nút "Thêm vào giỏ" riêng, phân biệt bằng `data-id`. Thay vì viết 6 field locator, ta viết một **method trả về `By`**:

```java
private By addButton(int productId) {
    return By.cssSelector(".add-to-cart[data-id='" + productId + "']");
}
```

`addButton(3)` cho ra locator `.add-to-cart[data-id='3']`. Đây là điều `@FindBy` không làm được, và là một lý do nữa để chọn `By`.

## Yêu cầu

**`ProductsPage`**

- `open()`: mở `Config.baseUrl() + "products.html"`, trả về `this`.
- `addToCart(id)`: click nút của sản phẩm, trả về `this` (để nối chuỗi `.addToCart(3).addToCart(4)`).
- `cartCount()`: đọc chữ của `#cart-count`, đổi sang `int`.
- `isAddToCartEnabled(id)`: nút của sản phẩm đó có bấm được không.
- `goToCart()`: click `#cart-link`, trả về `new CartPage(driver)`.

**`CartPage`**

- `itemNames()`: chờ `#cart-total` hiện ra, rồi trả về `List<String>` tên các sản phẩm trong giỏ.
- `total()`: chữ của `#cart-total`, ví dụ `570.000₫`.

**`CartTest`**: giữ test có sẵn, viết thêm hai test:

1. **`outOfStockCannotBeAdded`**: sản phẩm `5` (Hồng Trà Hà Giang, hết hàng) có nút bị khóa: `isAddToCartEnabled(5)` là `false`.
2. **`sameProductTwiceDoublesTotal`**: thêm sản phẩm `1` (Trà Shan Tuyết, 185.000₫) **hai lần**, sang giỏ hàng: chỉ có **một** dòng `Trà Shan Tuyết` và tổng là `370.000₫`.

Trong `CartTest` không được có `By` hay `findElement`. Nếu bạn thấy cần, nghĩa là còn thiếu một method trong Page Object!

> Hoàn thành bài này, bạn đã có một framework automation đúng chuẩn công nghiệp: Page Object, BasePage, BaseTest, file cấu hình, data-driven test. Chương sau, bạn sẽ đặt nó dưới những kịch bản **Cucumber** mà cả người không biết code cũng đọc được.
