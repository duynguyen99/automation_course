---
title: "Các assertion AssertJ hay dùng"
type: code
mode: junit
minutes: 10
files:
  - name: ProductCatalog.java
    readonly: true
    content: |
      import java.util.List;

      public class ProductCatalog {
          private final List<String> names = List.of(
              "Trà Shan Tuyết", "Trà Ô Long Lâm Đồng", "Trà Sen Tây Hồ",
              "Trà Nhài Thái Nguyên", "Hồng Trà Hà Giang", "Ấm Tử Sa Mini");
          private final int[] prices = {185000, 240000, 420000, 150000, 210000, 560000};
          private final int[] stocks = {12, 8, 3, 20, 0, 5};

          // Danh sách tên sản phẩm, theo thứ tự id 1 → 6
          public List<String> names() {
              return names;
          }

          // Giá của sản phẩm theo id (1 → 6)
          public int price(int id) {
              return prices[id - 1];
          }

          // Còn hàng hay không
          public boolean inStock(int id) {
              return stocks[id - 1] > 0;
          }

          // 185000 → "185.000₫"
          public String formatPrice(int price) {
              String digits = String.valueOf(price);
              StringBuilder sb = new StringBuilder();
              for (int i = 0; i < digits.length(); i++) {
                  if (i > 0 && (digits.length() - i) % 3 == 0) {
                      sb.append('.');
                  }
                  sb.append(digits.charAt(i));
              }
              return sb + "₫";
          }
      }
  - name: ProductCatalogTest.java
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class ProductCatalogTest {
          ProductCatalog catalog = new ProductCatalog();

          @Test
          void formatPriceAddsDotsAndCurrency() {
              String text = catalog.formatPrice(185000);
              // 1. text bằng đúng "185.000₫", bắt đầu bằng "185" và kết thúc bằng "₫"

          }

          @Test
          void catalogHasSixTeas() {
              // 2. names() có đúng 6 phần tử và chứa "Trà Sen Tây Hồ"

          }

          @Test
          void hongTraIsOutOfStock() {
              // 3. Sản phẩm 5 hết hàng, sản phẩm 1 còn hàng

          }

          @Test
          void teapotIsMoreExpensiveThanJasmineTea() {
              // 4. Giá sản phẩm 6 lớn hơn giá sản phẩm 4

          }
      }
solution:
  ProductCatalogTest.java: |
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    class ProductCatalogTest {
        ProductCatalog catalog = new ProductCatalog();

        @Test
        void formatPriceAddsDotsAndCurrency() {
            String text = catalog.formatPrice(185000);
            assertThat(text).isEqualTo("185.000₫");
            assertThat(text).startsWith("185").endsWith("₫");
        }

        @Test
        void catalogHasSixTeas() {
            assertThat(catalog.names()).hasSize(6).contains("Trà Sen Tây Hồ");
        }

        @Test
        void hongTraIsOutOfStock() {
            assertThat(catalog.inStock(5)).isFalse();
            assertThat(catalog.inStock(1)).isTrue();
        }

        @Test
        void teapotIsMoreExpensiveThanJasmineTea() {
            assertThat(catalog.price(6)).isGreaterThan(catalog.price(4));
        }
    }
tests:
  - text: 'Test 1 dùng `isEqualTo("185.000₫")`, `startsWith("185")` và `endsWith("₫")`'
    source: '^(?=[\s\S]*isEqualTo\(\s*"185\.000₫"\s*\))(?=[\s\S]*startsWith\(\s*"185"\s*\))(?=[\s\S]*endsWith\(\s*"₫"\s*\))'
    file: ProductCatalogTest.java
  - text: 'Test 2 dùng `hasSize(6)` và `contains("Trà Sen Tây Hồ")`'
    source: '^(?=[\s\S]*hasSize\(\s*6\s*\))(?=[\s\S]*contains\(\s*"Trà Sen Tây Hồ"\s*\))'
    file: ProductCatalogTest.java
  - text: 'Test 3 dùng `isFalse()` cho sản phẩm 5 và `isTrue()` cho sản phẩm 1'
    source: '^(?=[\s\S]*inStock\(\s*5\s*\)\s*\)\s*\.isFalse\(\))(?=[\s\S]*inStock\(\s*1\s*\)\s*\)\s*\.isTrue\(\))'
    file: ProductCatalogTest.java
  - text: 'Test 4 dùng `isGreaterThan`'
    source: 'price\(\s*6\s*\)\s*\)\s*\.isGreaterThan\(\s*catalog\.price\(\s*4\s*\)\s*\)'
    file: ProductCatalogTest.java
  - text: 'Cả 4 test đều pass'
    junit: { passed: 4, failed: 0 }
hints:
  - 'Có thể nối nhiều kiểm tra: `assertThat(text).startsWith("185").endsWith("₫");`'
  - 'Test 3: `assertThat(catalog.inStock(5)).isFalse();`'
  - 'Test 4: `assertThat(catalog.price(6)).isGreaterThan(catalog.price(4));`'
---

`isEqualTo` là assertion bạn dùng nhiều nhất, nhưng AssertJ còn hàng trăm assertion khác. Chọn đúng assertion giúp test **dễ đọc hơn** và khi fail thì **báo lỗi rõ hơn**.

## Bảng assertion "bỏ túi"

Mọi câu đều bắt đầu bằng `assertThat(giá trị thực tế)`, rồi gõ dấu chấm, IntelliJ sẽ gợi ý những assertion phù hợp với kiểu dữ liệu.

| Kiểu | Assertion | Ví dụ |
|---|---|---|
| mọi kiểu | `isEqualTo(x)`, `isNotEqualTo(x)` | `assertThat(total).isEqualTo(370000)` |
| | `isNull()`, `isNotNull()` | `assertThat(user).isNotNull()` |
| String | `contains("...")` | `assertThat(message).contains("thành công")` |
| | `startsWith("...")`, `endsWith("...")` | `assertThat(title).startsWith("Đăng nhập")` |
| | `isEmpty()`, `isNotBlank()` | `assertThat(error).isEmpty()` |
| | `isEqualToIgnoringCase("...")` | `assertThat(code).isEqualToIgnoringCase("tramoc10")` |
| boolean | `isTrue()`, `isFalse()` | `assertThat(button.isEnabled()).isTrue()` |
| số | `isGreaterThan(x)`, `isLessThanOrEqualTo(x)` | `assertThat(count).isGreaterThan(0)` |
| | `isBetween(a, b)` | `assertThat(price).isBetween(100000, 600000)` |
| List | `hasSize(n)`, `isEmpty()` | `assertThat(cartItems).hasSize(2)` |
| | `contains(a, b)` | có chứa a và b (thứ tự nào cũng được) |
| | `containsExactly(a, b, c)` | có **đúng** a, b, c, **đúng thứ tự**, không thừa |
| | `doesNotContain(x)` | `assertThat(names).doesNotContain("Cà phê")` |

`containsExactly` cực kỳ hữu ích khi test chức năng **sắp xếp**: "sắp xếp giá tăng dần thì thứ tự tên phải là..."

```java
assertThat(sortedNames).containsExactly("Trà Nhài Thái Nguyên", "Trà Shan Tuyết", "Hồng Trà Hà Giang");
```

## Nối nhiều kiểm tra trên cùng một giá trị

```java
assertThat(message)
    .isNotBlank()
    .startsWith("Đã thêm")
    .endsWith("giỏ hàng");
```

Mỗi assertion trả về lại chính đối tượng kiểm tra, nên bạn nối tiếp được. Nếu một mắt xích sai, test dừng và báo đúng mắt xích đó.

> **Đừng** viết `assertThat(text.equals("185.000₫")).isTrue()`. Khi fail, nó chỉ báo `expected: true but was: false`, chẳng ai biết sai ở đâu. Viết `assertThat(text).isEqualTo("185.000₫")` thì lỗi sẽ hiện rõ cả giá trị mong đợi và giá trị thực tế.

## Đến lượt bạn

Class `ProductCatalog` (chỉ đọc) chứa dữ liệu 6 sản phẩm của Tiệm Trà Mộc. Hoàn thành 4 test, mỗi test theo đúng chú thích:

1. `formatPriceAddsDotsAndCurrency`: `text` **bằng** `"185.000₫"`, **bắt đầu** bằng `"185"`, **kết thúc** bằng `"₫"`.
2. `catalogHasSixTeas`: `catalog.names()` có **đúng 6** phần tử và **chứa** `"Trà Sen Tây Hồ"`.
3. `hongTraIsOutOfStock`: `catalog.inStock(5)` là `false`, `catalog.inStock(1)` là `true`.
4. `teapotIsMoreExpensiveThanJasmineTea`: `catalog.price(6)` **lớn hơn** `catalog.price(4)`.

Để ý: một test **không có assertion nào** vẫn được JUnit báo là pass. Test như vậy vô dụng, vì nó không kiểm tra gì cả!
