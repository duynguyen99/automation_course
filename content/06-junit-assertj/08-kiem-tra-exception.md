---
title: "Kiểm tra exception: assertThatThrownBy"
type: code
mode: junit
minutes: 8
files:
  - name: OrderService.java
    readonly: true
    content: |
      public class OrderService {
          // Đặt hàng: số lượng phải lớn hơn 0 và không vượt quá tồn kho
          public int placeOrder(String product, int quantity, int stock) {
              if (quantity <= 0) {
                  throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
              }
              if (quantity > stock) {
                  throw new IllegalStateException("Không đủ hàng trong kho");
              }
              return stock - quantity;   // tồn kho còn lại
          }
      }
  - name: OrderServiceTest.java
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.*;
      import static org.junit.jupiter.api.Assertions.assertThrows;

      class OrderServiceTest {
          OrderService service = new OrderService();

          @Test
          void validOrder_reducesStock() {
              assertThat(service.placeOrder("Trà Sen Tây Hồ", 2, 3)).isEqualTo(1);
          }

          @Test
          void zeroQuantity_isRejected() {
              // 1. Dùng assertThatThrownBy: IllegalArgumentException, message "Số lượng phải lớn hơn 0"

          }

          @Test
          void notEnoughStock_isRejected() {
              // 2. Dùng assertThatThrownBy: IllegalStateException, message chứa "Không đủ hàng"

          }

          @Test
          void negativeQuantity_throwsWithAssertThrows() {
              // 3. Dùng assertThrows của JUnit với số lượng -1

          }
      }
solution:
  OrderServiceTest.java: |
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.*;
    import static org.junit.jupiter.api.Assertions.assertThrows;

    class OrderServiceTest {
        OrderService service = new OrderService();

        @Test
        void validOrder_reducesStock() {
            assertThat(service.placeOrder("Trà Sen Tây Hồ", 2, 3)).isEqualTo(1);
        }

        @Test
        void zeroQuantity_isRejected() {
            assertThatThrownBy(() -> service.placeOrder("Trà Sen Tây Hồ", 0, 3))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Số lượng phải lớn hơn 0");
        }

        @Test
        void notEnoughStock_isRejected() {
            assertThatThrownBy(() -> service.placeOrder("Trà Sen Tây Hồ", 5, 3))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Không đủ hàng");
        }

        @Test
        void negativeQuantity_throwsWithAssertThrows() {
            IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.placeOrder("Trà Sen Tây Hồ", -1, 3));
            assertThat(ex.getMessage()).isEqualTo("Số lượng phải lớn hơn 0");
        }
    }
tests:
  - text: '`zeroQuantity_isRejected` dùng `assertThatThrownBy` với `isInstanceOf(IllegalArgumentException.class)` và `hasMessage(...)`'
    source: 'void\s+zeroQuantity_isRejected[\s\S]*?assertThatThrownBy\([\s\S]*?isInstanceOf\(\s*IllegalArgumentException\.class\s*\)[\s\S]*?hasMessage\(\s*"Số lượng phải lớn hơn 0"\s*\)'
  - text: '`notEnoughStock_isRejected` kiểm tra `IllegalStateException` và `hasMessageContaining("Không đủ hàng")`'
    source: 'void\s+notEnoughStock_isRejected[\s\S]*?assertThatThrownBy\([\s\S]*?isInstanceOf\(\s*IllegalStateException\.class\s*\)[\s\S]*?hasMessageContaining\(\s*"Không đủ hàng"\s*\)'
  - text: '`negativeQuantity_throwsWithAssertThrows` dùng `assertThrows(IllegalArgumentException.class, ...)` với số lượng `-1`'
    source: 'void\s+negativeQuantity_throwsWithAssertThrows[\s\S]*?assertThrows\(\s*IllegalArgumentException\.class\s*,[\s\S]*?-\s*1'
  - text: '`zeroQuantity_isRejected` pass'
    junit: { name: zeroQuantity_isRejected }
  - text: '`notEnoughStock_isRejected` pass'
    junit: { name: notEnoughStock_isRejected }
  - text: 'Cả 4 test pass'
    junit: { passed: 4, failed: 0 }
hints:
  - 'Đoạn code gây lỗi phải nằm trong một lambda: `() -> service.placeOrder("Trà Sen Tây Hồ", 0, 3)`'
  - 'Đặt hàng 5 sản phẩm khi kho chỉ còn 3 sẽ gây `IllegalStateException`.'
  - '`IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> service.placeOrder("Trà Sen Tây Hồ", -1, 3));`'
---

Ở chương 4 bạn đã học **exception**: khi gặp dữ liệu không hợp lệ, code "ném" ra lỗi thay vì làm sai âm thầm. Với tester, câu hỏi là: **code có ném đúng lỗi, đúng lúc, đúng thông báo không?** Đặt hàng 0 sản phẩm mà hệ thống vẫn nhận đơn, đó là bug.

## Vì sao không gọi thẳng?

```java
@Test
void zeroQuantity_isRejected() {
    service.placeOrder("Trà Sen Tây Hồ", 0, 3);   // ném exception → test LỖI ngay tại đây
}
```

Exception bay ra khỏi test, JUnit coi đó là test hỏng. Ta cần cách nói: *"tôi **mong đợi** dòng này ném lỗi"*.

## Cách của AssertJ: assertThatThrownBy

```java
assertThatThrownBy(() -> service.placeOrder("Trà Sen Tây Hồ", 0, 3))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessage("Số lượng phải lớn hơn 0");
```

- Phần `() -> ...` là một **lambda** (chương 4): ta đưa cho AssertJ **đoạn code cần chạy**, chứ không tự chạy nó. AssertJ chạy giúp và bắt lấy exception.
- `isInstanceOf(...)`: đúng **loại** exception.
- `hasMessage("...")`: thông báo **bằng đúng**. `hasMessageContaining("...")`: thông báo **chứa** đoạn chữ.

Nếu đoạn code **không** ném exception, test fail với thông báo kiểu `Expecting code to raise a throwable.` Chính là bug "hệ thống vẫn nhận đơn số lượng 0".

## Cách của JUnit: assertThrows

Trong nhiều project bạn sẽ gặp cách viết của chính JUnit:

```java
IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
        () -> service.placeOrder("Trà Sen Tây Hồ", -1, 3));
assertThat(ex.getMessage()).isEqualTo("Số lượng phải lớn hơn 0");
```

`assertThrows` trả về exception bắt được, để bạn kiểm tra tiếp. Hai cách cho kết quả như nhau. Khóa học ưu tiên AssertJ vì đọc liền một mạch.

> Ngược lại, muốn khẳng định một đoạn code **không** ném lỗi: `assertThatCode(() -> service.placeOrder("Trà Sen Tây Hồ", 1, 3)).doesNotThrowAnyException();`

## Đến lượt bạn

Hoàn thành ba test (dùng sản phẩm `"Trà Sen Tây Hồ"`, tồn kho `3`):

1. `zeroQuantity_isRejected`: số lượng `0` → `assertThatThrownBy`, loại `IllegalArgumentException`, `hasMessage("Số lượng phải lớn hơn 0")`.
2. `notEnoughStock_isRejected`: số lượng `5` → `assertThatThrownBy`, loại `IllegalStateException`, `hasMessageContaining("Không đủ hàng")`.
3. `negativeQuantity_throwsWithAssertThrows`: số lượng `-1` → dùng `assertThrows(IllegalArgumentException.class, ...)`.
