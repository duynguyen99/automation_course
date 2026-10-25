---
title: "Step definition: nối Gherkin với Java"
type: code
mode: cucumber
minutes: 10
files:
  - name: features/gio_hang.feature
    readonly: true
    content: |
      Feature: Giỏ hàng

        Scenario: Thêm sản phẩm vào giỏ
          Given giỏ hàng đang trống
          When tôi thêm 2 sản phẩm vào giỏ
          Then giỏ hàng có 2 sản phẩm
  - name: steps/CartSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      public class CartSteps {
          private int itemCount;

          @Given("giỏ hàng đang trống")
          public void emptyCart() {
              itemCount = 0;
          }

          // Viết step @When và @Then ở đây

      }
solution:
  steps/CartSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import io.cucumber.java.en.When;
    import static org.assertj.core.api.Assertions.assertThat;

    public class CartSteps {
        private int itemCount;

        @Given("giỏ hàng đang trống")
        public void emptyCart() {
            itemCount = 0;
        }

        @When("tôi thêm {int} sản phẩm vào giỏ")
        public void addItems(int count) {
            itemCount += count;
        }

        @Then("giỏ hàng có {int} sản phẩm")
        public void cartHas(int expected) {
            assertThat(itemCount).isEqualTo(expected);
        }
    }
tests:
  - text: 'Scenario `Thêm sản phẩm vào giỏ` pass (cả 3 bước đều xanh)'
    cucumber: { scenario: "Thêm sản phẩm vào giỏ" }
  - text: 'Step `@When` dùng tham số `{int}` thay vì viết cứng số 2'
    source: '@When\("tôi thêm \{int\} sản phẩm vào giỏ"\)'
    file: steps/CartSteps.java
  - text: 'Step `@Then` dùng `assertThat` để kiểm tra'
    source: '@Then[\s\S]*assertThat\('
    file: steps/CartSteps.java
hints:
  - 'Câu trong annotation phải khớp **từng chữ** với câu trong file `.feature`, chỉ thay số bằng `{int}`.'
  - 'Method có `{int}` thì nhận một tham số kiểu `int`: `public void addItems(int count)`.'
---

File `.feature` mô tả **cái gì** cần kiểm tra bằng ngôn ngữ tự nhiên. Nhưng máy tính không hiểu tiếng Việt! Cần có **step definition**, tức là các method Java được "dán nhãn" bằng đúng câu trong kịch bản:

```java
@Given("giỏ hàng đang trống")
public void emptyCart() {
    itemCount = 0;
}
```

Khi Cucumber đọc dòng `Given giỏ hàng đang trống`, nó tìm method có annotation khớp câu đó và chạy method ấy.

## Tham số với `{int}` và `{string}`

```java
@When("tôi thêm {int} sản phẩm vào giỏ")
public void addItems(int count) { ... }
```

`{int}` khớp với bất kỳ số nguyên nào trong câu (2, 5, 100...) và truyền nó vào tham số `count`. Như vậy một step definition dùng được cho rất nhiều kịch bản. Tương tự, `{string}` khớp với chữ nằm trong ngoặc kép.

## Đến lượt bạn

Kịch bản đã có bước `Given`. Bấm chạy thử trước: bạn sẽ thấy tab **Kịch bản** báo hai bước cuối màu vàng, *chưa có step definition*. Hãy viết:

1. `@When("tôi thêm {int} sản phẩm vào giỏ")`: cộng thêm số sản phẩm.
2. `@Then("giỏ hàng có {int} sản phẩm")`: kiểm tra bằng `assertThat(...).isEqualTo(...)`.
