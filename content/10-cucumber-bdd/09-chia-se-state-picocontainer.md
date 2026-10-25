---
title: "Chia sẻ dữ liệu giữa các class step với PicoContainer"
type: code
mode: cucumber
minutes: 12
files:
  - name: features/thanh_toan.feature
    readonly: true
    content: |
      Feature: Từ giỏ hàng sang thanh toán

        Scenario: Tổng tiền được chuyển sang trang thanh toán
          Given tôi thêm "Trà Sen Tây Hồ" giá 420000 đồng vào giỏ
          And tôi thêm "Trà Nhài Thái Nguyên" giá 150000 đồng vào giỏ
          When tôi chuyển sang trang thanh toán
          Then trang thanh toán hiển thị tổng tiền 570000 đồng
  - name: steps/TestContext.java
    content: |
      package steps;

      // "Hộp chung" mà các class step cùng dùng trong MỘT Scenario.
      public class TestContext {
          // Thêm thuộc tính cartTotal (kiểu int) cùng getter/setter

      }
  - name: steps/CartSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;

      public class CartSteps {
          private int cartTotal = 0;   // dữ liệu bị "nhốt" trong class này

          @Given("tôi thêm {string} giá {int} đồng vào giỏ")
          public void addToCart(String product, int price) {
              cartTotal += price;
          }
      }
  - name: steps/CheckoutSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      public class CheckoutSteps {
          private int shownTotal = 0;
          private int cartTotal = 0;   // không phải cartTotal của CartSteps!

          @When("tôi chuyển sang trang thanh toán")
          public void goToCheckout() {
              shownTotal = cartTotal;
          }

          @Then("trang thanh toán hiển thị tổng tiền {int} đồng")
          public void checkoutShowsTotal(int expected) {
              assertThat(shownTotal).isEqualTo(expected);
          }
      }
solution:
  steps/TestContext.java: |
    package steps;

    public class TestContext {
        private int cartTotal = 0;

        public int getCartTotal() {
            return cartTotal;
        }

        public void setCartTotal(int cartTotal) {
            this.cartTotal = cartTotal;
        }
    }
  steps/CartSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;

    public class CartSteps {
        private final TestContext context;

        public CartSteps(TestContext context) {
            this.context = context;
        }

        @Given("tôi thêm {string} giá {int} đồng vào giỏ")
        public void addToCart(String product, int price) {
            context.setCartTotal(context.getCartTotal() + price);
        }
    }
  steps/CheckoutSteps.java: |
    package steps;

    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import static org.assertj.core.api.Assertions.assertThat;

    public class CheckoutSteps {
        private final TestContext context;
        private int shownTotal = 0;

        public CheckoutSteps(TestContext context) {
            this.context = context;
        }

        @When("tôi chuyển sang trang thanh toán")
        public void goToCheckout() {
            shownTotal = context.getCartTotal();
        }

        @Then("trang thanh toán hiển thị tổng tiền {int} đồng")
        public void checkoutShowsTotal(int expected) {
            assertThat(shownTotal).isEqualTo(expected);
        }
    }
tests:
  - text: 'Scenario `Tổng tiền được chuyển sang trang thanh toán` pass'
    cucumber: { scenario: "Tổng tiền được chuyển sang trang thanh toán" }
  - text: '`TestContext` có `getCartTotal()` và `setCartTotal(...)`'
    source: 'public int getCartTotal\(\)[\s\S]*public void setCartTotal\(\s*int \w+\s*\)|public void setCartTotal\(\s*int \w+\s*\)[\s\S]*public int getCartTotal\(\)'
    file: steps/TestContext.java
  - text: '`CartSteps` nhận `TestContext` qua constructor'
    source: 'public CartSteps\(\s*TestContext \w+\s*\)'
    file: steps/CartSteps.java
  - text: '`CheckoutSteps` nhận `TestContext` qua constructor'
    source: 'public CheckoutSteps\(\s*TestContext \w+\s*\)'
    file: steps/CheckoutSteps.java
  - text: 'Không dùng biến `static` để "lách" (dữ liệu static sẽ rò sang Scenario khác)'
    notSource: '\bstatic\s+(?!org\.)[\w<>]+\s+\w+\s*[=;]'
hints:
  - 'Trong `TestContext`: `private int cartTotal = 0;` cùng `getCartTotal()` và `setCartTotal(int cartTotal)`.'
  - 'Mỗi class step: thêm `private final TestContext context;` và constructor `public CartSteps(TestContext context) { this.context = context; }`.'
  - 'Bỏ biến `cartTotal` riêng trong hai class step. `CartSteps` cộng vào `context`, `CheckoutSteps` đọc từ `context.getCartTotal()`.'
---

Dự án thật có hàng trăm step, không ai nhét hết vào một class. Người ta chia theo trang hoặc tính năng: `LoginSteps`, `CartSteps`, `CheckoutSteps`... Nhưng ngay lập tức gặp vấn đề: Scenario dưới đây dùng step của **hai** class, và `CheckoutSteps` cần biết tổng tiền mà `CartSteps` đã tính.

```gherkin
Given tôi thêm "Trà Sen Tây Hồ" giá 420000 đồng vào giỏ   ← CartSteps
When tôi chuyển sang trang thanh toán                     ← CheckoutSteps
```

Bấm chạy thử code ban đầu: Scenario **fail**, vì mỗi class có biến `cartTotal` **riêng**. `CartSteps` cộng tiền vào biến của nó, còn `CheckoutSteps` đọc biến của chính mình, vẫn bằng 0.

## Giải pháp: một "hộp chung" và PicoContainer

Ý tưởng rất đời thường: hai người cần dùng chung tài liệu thì để nó vào **một chiếc hộp chung**, ai cần thì lấy.

1. Tạo class `TestContext` chứa dữ liệu dùng chung.
2. Mỗi class step **xin** `TestContext` qua constructor:

```java
public class CartSteps {
    private final TestContext context;

    public CartSteps(TestContext context) {   // "Tôi cần một TestContext"
        this.context = context;
    }
}
```

3. Thư viện **PicoContainer** (gói `cucumber-picocontainer`) thấy constructor đó, tự tạo **một** object `TestContext` cho Scenario, rồi đưa **cùng object ấy** cho mọi class step. Bạn không bao giờ phải tự viết `new TestContext()`.

Kỹ thuật "xin qua constructor, có người khác đưa cho" gọi là **dependency injection** (tiêm phụ thuộc). Từ này rất hay xuất hiện trong phỏng vấn!

> Mỗi Scenario mới, PicoContainer tạo **mới toàn bộ**: `TestContext` mới, các class step mới. Dữ liệu không rò từ Scenario này sang Scenario khác. Ngược lại, nếu bạn "lách" bằng biến `static`, dữ liệu sẽ dính lại giữa các Scenario và gây ra những lỗi rất khó tìm.

Trong Maven, chỉ cần thêm dependency (môi trường ở đây đã có sẵn):

```xml
<dependency>
  <groupId>io.cucumber</groupId>
  <artifactId>cucumber-picocontainer</artifactId>
  <version>${cucumber.version}</version>
  <scope>test</scope>
</dependency>
```

## Đến lượt bạn

1. Trong `steps/TestContext.java`: thêm `private int cartTotal` cùng `getCartTotal()` và `setCartTotal(int)`.
2. `CartSteps` và `CheckoutSteps` nhận `TestContext` qua **constructor**, bỏ biến `cartTotal` riêng của từng class.
3. `CartSteps` cộng giá vào `context`; `CheckoutSteps` đọc tổng từ `context`.
