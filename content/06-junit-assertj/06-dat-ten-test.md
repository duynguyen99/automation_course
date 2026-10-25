---
title: "Đặt tên test và @DisplayName"
type: code
mode: junit
minutes: 7
files:
  - name: Coupon.java
    readonly: true
    content: |
      public class Coupon {
          // Mã "TRAMOC10" (không phân biệt hoa thường) giảm 10%. Mã khác: 0%.
          public int discountPercent(String code) {
              if (code == null) {
                  return 0;
              }
              return code.trim().equalsIgnoreCase("TRAMOC10") ? 10 : 0;
          }
      }
  - name: CouponTest.java
    content: |
      import org.junit.jupiter.api.DisplayName;
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class CouponTest {
          Coupon coupon = new Coupon();

          @Test
          void test1() {
              assertThat(coupon.discountPercent("TRAMOC10")).isEqualTo(10);
          }

          @Test
          void test2() {
              assertThat(coupon.discountPercent("GIAMGIA50")).isEqualTo(0);
          }

          @Test
          void test3() {
              assertThat(coupon.discountPercent("tramoc10")).isEqualTo(10);
          }
      }
solution:
  CouponTest.java: |
    import org.junit.jupiter.api.DisplayName;
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    @DisplayName("Mã giảm giá")
    class CouponTest {
        Coupon coupon = new Coupon();

        @Test
        @DisplayName("Mã TRAMOC10 được giảm 10%")
        void validCode_gives10Percent() {
            assertThat(coupon.discountPercent("TRAMOC10")).isEqualTo(10);
        }

        @Test
        @DisplayName("Mã không tồn tại không được giảm")
        void unknownCode_givesNoDiscount() {
            assertThat(coupon.discountPercent("GIAMGIA50")).isEqualTo(0);
        }

        @Test
        @DisplayName("Mã viết thường vẫn được chấp nhận")
        void lowercaseCode_isAccepted() {
            assertThat(coupon.discountPercent("tramoc10")).isEqualTo(10);
        }
    }
tests:
  - text: 'Đổi `test1` thành `validCode_gives10Percent` và nó pass'
    junit: { name: validCode_gives10Percent }
  - text: 'Đổi `test2` thành `unknownCode_givesNoDiscount` và nó pass'
    junit: { name: unknownCode_givesNoDiscount }
  - text: 'Đổi `test3` thành `lowercaseCode_isAccepted` và nó pass'
    junit: { name: lowercaseCode_isAccepted }
  - text: 'Không còn method nào tên `test1`, `test2`, `test3`'
    notSource: 'void\s+test[123]\s*\('
  - text: 'Class có `@DisplayName("Mã giảm giá")`'
    source: '@DisplayName\(\s*"Mã giảm giá"\s*\)\s*(public\s+)?class\s+CouponTest'
  - text: 'Mỗi test có một `@DisplayName` tiếng Việt (ít nhất 3 cái trên các method)'
    source: '(@DisplayName\(\s*"[^"]+"\s*\)[\s\S]*){4}'
hints:
  - 'Đặt `@DisplayName("...")` ngay trên hoặc dưới `@Test`, trước chữ `void`.'
  - 'Với class: đặt `@DisplayName("Mã giảm giá")` ngay trên dòng `class CouponTest {`.'
---

Hãy tưởng tượng 7 giờ sáng, bạn mở báo cáo test của đêm qua và thấy:

```text
✗ test2
✗ test7
```

`test2` là test gì? Phải mở code ra đọc mới biết. Còn nếu báo cáo ghi:

```text
✗ Mã không tồn tại không được giảm
✗ Đơn hàng 500.000₫ được miễn phí vận chuyển
```

thì cả bạn, dev và quản lý đều hiểu ngay **chức năng nào đang hỏng**, không cần đọc dòng code nào.

## Cách đặt tên method test

Tên method test nên nói rõ **tình huống** và **kết quả mong đợi**. Một quy ước phổ biến: `tìnhHuống_kếtQuả`:

| Kém | Tốt |
|---|---|
| `test1` | `validCode_gives10Percent` |
| `testLogin` | `wrongPassword_showsErrorMessage` |
| `checkCart` | `removeLastItem_showsEmptyCart` |

Tên dài không sao cả, không ai phải gõ tên test khi gọi nó. Một số team thích kiểu `shouldShowError_whenPasswordIsWrong`. Kiểu nào cũng được, miễn là **cả team dùng thống nhất**.

> Tên method Java không được có dấu cách, và nên tránh chữ có dấu tiếng Việt. Muốn tên tiếng Việt đầy đủ, hãy dùng `@DisplayName`.

## @DisplayName: tên hiển thị đẹp

```java
@DisplayName("Mã giảm giá")
class CouponTest {

    @Test
    @DisplayName("Mã TRAMOC10 được giảm 10%")
    void validCode_gives10Percent() { ... }
}
```

`@DisplayName` cho phép viết bất kỳ câu nào, có dấu, có khoảng trắng, có ký tự đặc biệt. IntelliJ, Maven và báo cáo Allure (chương 11) sẽ hiển thị câu này thay cho tên method. Đặt nó trên **class** thì cả nhóm test có một tiêu đề chung.

## Đến lượt bạn

Ba test trong `CouponTest` đều chạy đúng, nhưng tên thì vô nghĩa. Hãy:

1. Đổi tên `test1` → `validCode_gives10Percent`, `test2` → `unknownCode_givesNoDiscount`, `test3` → `lowercaseCode_isAccepted`.
2. Thêm `@DisplayName("Mã giảm giá")` cho **class**.
3. Thêm một `@DisplayName` tiếng Việt mô tả cho **mỗi** test, ví dụ `"Mã TRAMOC10 được giảm 10%"`.
