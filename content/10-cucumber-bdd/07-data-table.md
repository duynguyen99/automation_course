---
title: "Data Table: truyền cả một bảng vào step"
type: code
mode: cucumber
minutes: 10
files:
  - name: features/tong_tien.feature
    readonly: true
    content: |
      Feature: Tổng tiền giỏ hàng

        Scenario: Giỏ hàng có nhiều sản phẩm
          Given giỏ hàng có các sản phẩm sau:
            | tên                  | giá    | số lượng |
            | Trà Shan Tuyết       | 185000 | 2        |
            | Trà Sen Tây Hồ       | 420000 | 1        |
            | Trà Nhài Thái Nguyên | 150000 | 3        |
          Then tổng số lượng là 6
          And tổng tiền là 1240000 đồng

        Scenario: Giỏ hàng chỉ có một ấm trà
          Given giỏ hàng có các sản phẩm sau:
            | tên           | giá    | số lượng |
            | Ấm Tử Sa Mini | 560000 | 1        |
          Then tổng số lượng là 1
          And tổng tiền là 560000 đồng
  - name: steps/CartTotalSteps.java
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import java.util.List;
      import java.util.Map;
      import static org.assertj.core.api.Assertions.assertThat;

      public class CartTotalSteps {
          private int totalQuantity = 0;
          private int totalPrice = 0;

          // Viết step @Given("giỏ hàng có các sản phẩm sau:") ở đây


          @Then("tổng số lượng là {int}")
          public void totalQuantityIs(int expected) {
              assertThat(totalQuantity).isEqualTo(expected);
          }

          @Then("tổng tiền là {int} đồng")
          public void totalPriceIs(int expected) {
              assertThat(totalPrice).isEqualTo(expected);
          }
      }
solution:
  steps/CartTotalSteps.java: |
    package steps;

    import io.cucumber.java.en.Given;
    import io.cucumber.java.en.Then;
    import java.util.List;
    import java.util.Map;
    import static org.assertj.core.api.Assertions.assertThat;

    public class CartTotalSteps {
        private int totalQuantity = 0;
        private int totalPrice = 0;

        @Given("giỏ hàng có các sản phẩm sau:")
        public void cartHasProducts(List<Map<String, String>> rows) {
            for (Map<String, String> row : rows) {
                int price = Integer.parseInt(row.get("giá"));
                int quantity = Integer.parseInt(row.get("số lượng"));
                totalQuantity += quantity;
                totalPrice += price * quantity;
            }
        }

        @Then("tổng số lượng là {int}")
        public void totalQuantityIs(int expected) {
            assertThat(totalQuantity).isEqualTo(expected);
        }

        @Then("tổng tiền là {int} đồng")
        public void totalPriceIs(int expected) {
            assertThat(totalPrice).isEqualTo(expected);
        }
    }
tests:
  - text: 'Scenario `Giỏ hàng có nhiều sản phẩm` pass'
    cucumber: { scenario: "Giỏ hàng có nhiều sản phẩm" }
  - text: 'Scenario `Giỏ hàng chỉ có một ấm trà` pass'
    cucumber: { scenario: "Giỏ hàng chỉ có một ấm trà" }
  - text: 'Step nhận bảng dưới dạng `List<Map<String, String>>`'
    source: '@Given\("giỏ hàng có các sản phẩm sau:"\)\s*public void \w+\(\s*List<Map<String,\s*String>>\s+\w+\s*\)'
    file: steps/CartTotalSteps.java
  - text: 'Đổi chữ thành số bằng `Integer.parseInt`'
    source: 'Integer\.parseInt\('
    file: steps/CartTotalSteps.java
hints:
  - 'Khai báo method: `public void cartHasProducts(List<Map<String, String>> rows)`. Câu trong annotation có cả dấu hai chấm ở cuối.'
  - 'Duyệt bằng `for (Map<String, String> row : rows)`. Lấy ô bằng tên cột: `row.get("giá")`, `row.get("số lượng")`.'
  - 'Mọi ô trong bảng đều là `String`, nên cần `Integer.parseInt(row.get("giá"))` trước khi nhân.'
---

Đôi khi một bước cần **nhiều dữ liệu** cùng lúc: cả một danh sách sản phẩm, hay một form có năm ô. Viết thành năm bước `And` thì dài dòng. Gherkin cho phép đặt một **bảng** (*Data Table*) ngay dưới bước:

```gherkin
Given giỏ hàng có các sản phẩm sau:
  | tên            | giá    | số lượng |
  | Trà Shan Tuyết | 185000 | 2        |
  | Trà Sen Tây Hồ | 420000 | 1        |
```

Khác với `Examples` của Scenario Outline (mỗi dòng là **một lần chạy**), Data Table là **dữ liệu của một bước**: cả bảng được truyền vào **một** lần gọi method.

## Nhận bảng trong Java

Cách dễ dùng nhất: mỗi dòng là một `Map`, với **tên cột làm key**. Cả bảng là một `List` các `Map` đó:

```java
@Given("giỏ hàng có các sản phẩm sau:")
public void cartHasProducts(List<Map<String, String>> rows) {
    for (Map<String, String> row : rows) {
        String name = row.get("tên");                    // "Trà Shan Tuyết"
        int price = Integer.parseInt(row.get("giá"));    // 185000
    }
}
```

Dòng tiêu đề không nằm trong `rows`: `rows.get(0)` là dòng **dữ liệu** đầu tiên. Lưu ý mọi ô đều là **`String`**, nên số phải được đổi bằng `Integer.parseInt(...)`.

> Bạn cũng có thể nhận kiểu `io.cucumber.datatable.DataTable` rồi gọi `table.asMaps()` (ra đúng `List<Map<String, String>>`), `table.asLists()` (danh sách các dòng), hay `table.asList()` (bảng chỉ một cột). Trong dự án thật bạn sẽ gặp cả hai cách viết.

## Đến lượt bạn

Viết step `@Given("giỏ hàng có các sản phẩm sau:")` nhận `List<Map<String, String>> rows`. Với mỗi dòng:

- cộng `số lượng` vào `totalQuantity`;
- cộng `giá × số lượng` vào `totalPrice`.

Hai step `@Then` đã có sẵn. Cả hai Scenario phải xanh.
