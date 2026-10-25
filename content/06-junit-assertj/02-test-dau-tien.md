---
title: "Viết test JUnit đầu tiên"
type: code
mode: junit
minutes: 8
files:
  - name: PriceCalculator.java
    readonly: true
    content: |
      public class PriceCalculator {
          // Tính tổng tiền = đơn giá × số lượng
          public int total(int unitPrice, int quantity) {
              return unitPrice * quantity;
          }
      }
  - name: PriceCalculatorTest.java
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class PriceCalculatorTest {

          @Test
          void totalOfTwoItems() {
              PriceCalculator calc = new PriceCalculator();
              int result = calc.total(150000, 2);
              assertThat(result).isEqualTo(300000);
          }

          // Viết test thứ hai ở đây: totalOfZeroItems

      }
solution:
  PriceCalculatorTest.java: |
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    class PriceCalculatorTest {

        @Test
        void totalOfTwoItems() {
            PriceCalculator calc = new PriceCalculator();
            int result = calc.total(150000, 2);
            assertThat(result).isEqualTo(300000);
        }

        @Test
        void totalOfZeroItems() {
            PriceCalculator calc = new PriceCalculator();
            assertThat(calc.total(99000, 0)).isEqualTo(0);
        }
    }
tests:
  - text: 'Test `totalOfTwoItems` vẫn pass'
    junit: { name: totalOfTwoItems }
  - text: 'Có test mới tên `totalOfZeroItems` và nó pass'
    junit: { name: totalOfZeroItems }
  - text: 'Test mới có annotation `@Test` và dùng `assertThat(...).isEqualTo(...)`'
    source: '@Test\s+void\s+totalOfZeroItems[\s\S]*assertThat\([\s\S]*\)\.isEqualTo\('
    file: PriceCalculatorTest.java
hints:
  - 'Copy nguyên method `totalOfTwoItems`, đổi tên thành `totalOfZeroItems` rồi sửa số liệu.'
  - 'Mua 0 sản phẩm thì tổng tiền phải bằng `0`.'
---

Đến lúc viết **test thật sự**! Bên phải có hai file (bấm vào tab để chuyển):

- `PriceCalculator.java`: code cần kiểm tra (*code under test*), chỉ đọc.
- `PriceCalculatorTest.java`: nơi bạn viết test.

## Giải phẫu một test JUnit

```java
@Test
void totalOfTwoItems() {
    PriceCalculator calc = new PriceCalculator();   // 1. Chuẩn bị (Arrange)
    int result = calc.total(150000, 2);             // 2. Thực hiện (Act)
    assertThat(result).isEqualTo(300000);           // 3. Kiểm tra (Assert)
}
```

- **`@Test`** là một *annotation*, đánh dấu cho JUnit biết "method này là một test, hãy chạy nó".
- Mỗi test có 3 bước: **Arrange, Act, Assert**. Đây là khuôn mẫu bạn sẽ dùng cả sự nghiệp.
- `assertThat(thựcTế).isEqualTo(mongĐợi)` đến từ thư viện **AssertJ**. Nếu hai giá trị khác nhau, test **fail** và báo rõ khác ở đâu.

Bấm **Chạy & kiểm tra**, rồi xem tab **Kết quả test** ở khung dưới: mỗi test là một dòng xanh (pass) hoặc đỏ (fail).

## Đến lượt bạn

Viết thêm test `totalOfZeroItems`: mua **0** sản phẩm giá `99000` thì tổng tiền phải là `0`.

> Đây chính là tư duy **boundary** (giá trị biên): số 0, số âm, rỗng... là nơi bug hay ẩn nấp nhất.
