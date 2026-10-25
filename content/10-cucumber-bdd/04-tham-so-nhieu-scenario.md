---
title: "Tham số {string}, {int}, {double}: một step, nhiều scenario"
type: code
mode: cucumber
minutes: 12
files:
  - name: features/tinh_tien.feature
    readonly: true
    content: |
      Feature: Tính tiền giỏ hàng

        Scenario: Mua một loại trà
          Given sản phẩm "Trà Shan Tuyết" có giá 185000 đồng
          When tôi mua 2 sản phẩm "Trà Shan Tuyết"
          Then tổng tiền là 370000 đồng

        Scenario: Mua hai loại trà
          Given sản phẩm "Trà Shan Tuyết" có giá 185000 đồng
          And sản phẩm "Trà Sen Tây Hồ" có giá 420000 đồng
          When tôi mua 1 sản phẩm "Trà Shan Tuyết"
          And tôi mua 1 sản phẩm "Trà Sen Tây Hồ"
          Then tổng tiền là 605000 đồng

        Scenario: Áp dụng mã giảm giá
          Given sản phẩm "Trà Nhài Thái Nguyên" có giá 150000 đồng
          When tôi mua 2 sản phẩm "Trà Nhài Thái Nguyên"
          And tôi được giảm 10.5 phần trăm
          Then tổng tiền là 268500 đồng
  - name: steps/PriceSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import java.util.HashMap;
      import java.util.Map;
      import static org.assertj.core.api.Assertions.assertThat;

      public class PriceSteps {
          private final Map<String, Integer> prices = new HashMap<>();
          private double total = 0;

          @Given("sản phẩm {string} có giá {int} đồng")
          public void productHasPrice(String name, int price) {
              prices.put(name, price);
          }

          // 1. @When: tôi mua {int} sản phẩm {string}

          // 2. @When: tôi được giảm {double} phần trăm

          // 3. @Then: tổng tiền là {int} đồng

      }
solution:
  steps/PriceSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import java.util.HashMap;
    import java.util.Map;
    import static org.assertj.core.api.Assertions.assertThat;

    public class PriceSteps {
        private final Map<String, Integer> prices = new HashMap<>();
        private double total = 0;

        @Given("sản phẩm {string} có giá {int} đồng")
        public void productHasPrice(String name, int price) {
            prices.put(name, price);
        }

        @When("tôi mua {int} sản phẩm {string}")
        public void buy(int quantity, String name) {
            total += prices.get(name) * quantity;
        }

        @When("tôi được giảm {double} phần trăm")
        public void discount(double percent) {
            total = total * (100 - percent) / 100;
        }

        @Then("tổng tiền là {int} đồng")
        public void totalIs(int expected) {
            assertThat(Math.round(total)).isEqualTo(expected);
        }
    }
tests:
  - text: 'Scenario `Mua một loại trà` pass'
    cucumber: { scenario: "Mua một loại trà" }
  - text: 'Scenario `Mua hai loại trà` pass (cùng step definition, dữ liệu khác)'
    cucumber: { scenario: "Mua hai loại trà" }
  - text: 'Scenario `Áp dụng mã giảm giá` pass'
    cucumber: { scenario: "Áp dụng mã giảm giá" }
  - text: 'Step mua hàng dùng cả `{int}` và `{string}`'
    source: '@When\("tôi mua \{int\} sản phẩm \{string\}"\)'
    file: steps/PriceSteps.java
  - text: 'Step giảm giá dùng `{double}` và method nhận tham số `double`'
    source: '@When\("tôi được giảm \{double\} phần trăm"\)\s*public void \w+\(\s*double \w+\s*\)'
    file: steps/PriceSteps.java
hints:
  - 'Tham số của method xếp **đúng thứ tự** xuất hiện trong câu: `{int}` trước `{string}` nên viết `buy(int quantity, String name)`.'
  - 'Lấy giá bằng `prices.get(name)`, nhân với số lượng rồi cộng vào `total`. Giảm 10.5% nghĩa là `total = total * (100 - percent) / 100`.'
  - '`total` là `double`, còn số mong đợi là `int`. So sánh bằng `assertThat(Math.round(total)).isEqualTo(expected)`.'
---

Trang trước bạn đã gặp `{int}`. Đây là ba **tham số** (*parameter type*) bạn sẽ dùng nhiều nhất:

| Trong annotation | Khớp với chữ nào trong kịch bản | Kiểu Java nhận được |
|---|---|---|
| `{string}` | Chữ trong ngoặc kép: `"Trà Sen Tây Hồ"` | `String` (không kèm dấu ngoặc kép) |
| `{int}` | Số nguyên: `2`, `185000` | `int` |
| `{double}` | Số thập phân, dùng **dấu chấm**: `10.5` | `double` |

Một câu có thể có nhiều tham số. Cucumber truyền chúng vào method **theo thứ tự xuất hiện**:

```java
@When("tôi mua {int} sản phẩm {string}")
public void buy(int quantity, String name) { ... }
//              ↑ {int}       ↑ {string}
```

## Viết một lần, dùng nhiều lần

Nhìn file `tinh_tien.feature`: ba Scenario, nhưng chỉ cần **bốn** step definition. Câu `Given sản phẩm "..." có giá ... đồng` xuất hiện bốn lần với bốn bộ dữ liệu khác nhau, mà Java chỉ viết **một** method. Đây là sức mạnh lớn nhất của Cucumber: khi đã có một "kho" step tốt, BA hay tester khác có thể viết thêm Scenario mới **mà không cần viết thêm dòng Java nào**.

Một điều quan trọng nữa: mỗi Scenario chạy với một **object mới** của class `PriceSteps`. Vì vậy `prices` và `total` luôn bắt đầu từ trống, Scenario này không ảnh hưởng Scenario kia. Giống như JUnit tạo object mới cho mỗi `@Test`.

> `And` trong kịch bản không cần annotation riêng. `And tôi mua 1 sản phẩm "Trà Sen Tây Hồ"` được nối với step `@When("tôi mua {int} sản phẩm {string}")`. Cucumber chỉ so khớp **câu chữ**, không quan tâm từ khóa đứng đầu.

## Đến lượt bạn

File `.feature` đã có sẵn (chỉ đọc). Trong `steps/PriceSteps.java`, viết thêm ba step:

1. `@When("tôi mua {int} sản phẩm {string}")`: cộng `giá × số lượng` vào `total`.
2. `@When("tôi được giảm {double} phần trăm")`: giảm `total` theo phần trăm.
3. `@Then("tổng tiền là {int} đồng")`: kiểm tra `Math.round(total)` bằng số mong đợi.

Cả ba Scenario phải xanh.
