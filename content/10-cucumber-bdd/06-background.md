---
title: "Background: những bước lặp lại ở đầu mỗi Scenario"
type: code
mode: cucumber
minutes: 8
files:
  - name: features/gio_hang.feature
    content: |
      Feature: Giỏ hàng

        Scenario: Thêm một sản phẩm
          Given tôi đã đăng nhập với tài khoản "lan"
          And giỏ hàng đang trống
          When tôi thêm "Trà Shan Tuyết" vào giỏ
          Then giỏ hàng có 1 sản phẩm

        Scenario: Thêm hai sản phẩm khác nhau
          Given tôi đã đăng nhập với tài khoản "lan"
          And giỏ hàng đang trống
          When tôi thêm "Trà Shan Tuyết" vào giỏ
          And tôi thêm "Trà Sen Tây Hồ" vào giỏ
          Then giỏ hàng có 2 sản phẩm

        Scenario: Xóa sản phẩm khỏi giỏ
          Given tôi đã đăng nhập với tài khoản "lan"
          And giỏ hàng đang trống
          When tôi thêm "Trà Shan Tuyết" vào giỏ
          And tôi xóa "Trà Shan Tuyết" khỏi giỏ
          Then giỏ hàng có 0 sản phẩm
  - name: steps/CartSteps.java
    readonly: true
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import java.util.ArrayList;
      import java.util.List;
      import static org.assertj.core.api.Assertions.assertThat;

      public class CartSteps {
          private String user;
          private List<String> cart;

          @Given("tôi đã đăng nhập với tài khoản {string}")
          public void loggedInAs(String username) {
              user = username;
          }

          @Given("giỏ hàng đang trống")
          public void emptyCart() {
              cart = new ArrayList<>();
          }

          @When("tôi thêm {string} vào giỏ")
          public void add(String product) {
              assertThat(user).as("Phải đăng nhập trước").isNotNull();
              cart.add(product);
          }

          @When("tôi xóa {string} khỏi giỏ")
          public void remove(String product) {
              cart.remove(product);
          }

          @Then("giỏ hàng có {int} sản phẩm")
          public void cartHas(int expected) {
              assertThat(cart).hasSize(expected);
          }
      }
solution:
  features/gio_hang.feature: |
    Feature: Giỏ hàng

      Background:
        Given tôi đã đăng nhập với tài khoản "lan"
        And giỏ hàng đang trống

      Scenario: Thêm một sản phẩm
        When tôi thêm "Trà Shan Tuyết" vào giỏ
        Then giỏ hàng có 1 sản phẩm

      Scenario: Thêm hai sản phẩm khác nhau
        When tôi thêm "Trà Shan Tuyết" vào giỏ
        And tôi thêm "Trà Sen Tây Hồ" vào giỏ
        Then giỏ hàng có 2 sản phẩm

      Scenario: Xóa sản phẩm khỏi giỏ
        When tôi thêm "Trà Shan Tuyết" vào giỏ
        And tôi xóa "Trà Shan Tuyết" khỏi giỏ
        Then giỏ hàng có 0 sản phẩm
tests:
  - text: 'Có phần `Background:` đặt trước Scenario đầu tiên'
    source: '^\s*Background:[\s\S]*^\s*Scenario:'
    file: features/gio_hang.feature
  - text: 'Bước đăng nhập chỉ còn được viết **một lần**'
    notSource: 'tôi đã đăng nhập với tài khoản[\s\S]*tôi đã đăng nhập với tài khoản'
    file: features/gio_hang.feature
  - text: 'Bước "giỏ hàng đang trống" chỉ còn được viết **một lần**'
    notSource: 'giỏ hàng đang trống[\s\S]*giỏ hàng đang trống'
    file: features/gio_hang.feature
  - text: 'Cả 3 Scenario vẫn pass'
    cucumber: { passed: 3 }
hints:
  - '`Background:` nằm ngay dưới `Feature`, trước Scenario đầu tiên, thụt lề bằng Scenario.'
  - 'Chuyển hai dòng `Given ... "lan"` và `And giỏ hàng đang trống` vào Background, rồi xóa chúng khỏi cả ba Scenario.'
---

Nhìn file `gio_hang.feature`: cả ba Scenario đều mở đầu bằng **cùng hai bước**: đăng nhập và làm trống giỏ hàng. Người đọc phải lướt qua chúng ba lần, và nếu mai đổi tài khoản test, bạn phải sửa ba chỗ.

**Background** gom những bước chung đó lại, viết một lần ở đầu file:

```gherkin
Feature: Giỏ hàng

  Background:
    Given tôi đã đăng nhập với tài khoản "lan"
    And giỏ hàng đang trống

  Scenario: Thêm một sản phẩm
    When tôi thêm "Trà Shan Tuyết" vào giỏ
    Then giỏ hàng có 1 sản phẩm
```

Cucumber sẽ chạy các bước trong Background **trước mỗi Scenario** của file đó, giống `@BeforeEach` của JUnit.

Vài lưu ý:

- Mỗi file `.feature` chỉ có **một** Background, và nó phải đứng **trước** Scenario đầu tiên.
- Background chỉ nên chứa các bước `Given` (bối cảnh). Đừng nhét `When`/`Then` vào đó.
- Giữ Background **ngắn** (2–4 bước). Nếu dài hơn, người đọc Scenario sẽ quên mất bối cảnh là gì.
- Trong tab **Kịch bản**, các bước của Background không hiện trong danh sách bước của từng Scenario, nhưng chúng vẫn chạy. Nếu một bước Background lỗi, Scenario đó sẽ bị bỏ qua.

## Đến lượt bạn

Sửa `features/gio_hang.feature`: chuyển hai bước chung vào một `Background:`, xóa chúng khỏi cả ba Scenario. Kết quả phải như cũ: 3 Scenario pass.
