---
title: "Khi test fail: bạn vừa bắt được bug!"
type: code
mode: junit
minutes: 8
files:
  - name: ShippingFee.java
    readonly: true
    content: |
      public class ShippingFee {
          // Quy định của Tiệm Trà Mộc:
          //   - Đơn hàng từ 500.000₫ trở lên: miễn phí vận chuyển (0₫)
          //   - Đơn hàng dưới 500.000₫: phí vận chuyển 30.000₫
          public int calculate(int orderTotal) {
              if (orderTotal > 500000) {
                  return 0;
              }
              return 30000;
          }
      }
  - name: ShippingFeeTest.java
    content: |
      import org.junit.jupiter.api.Test;
      import static org.assertj.core.api.Assertions.assertThat;

      class ShippingFeeTest {
          ShippingFee shipping = new ShippingFee();

          @Test
          void smallOrderPays30k() {
              assertThat(shipping.calculate(370000)).isEqualTo(30000);
          }

          @Test
          void bigOrderShipsFree() {
              assertThat(shipping.calculate(840000)).isEqualTo(0);
          }

          // Viết test freeShippingAtExactly500k ở đây

      }
solution:
  ShippingFeeTest.java: |
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    class ShippingFeeTest {
        ShippingFee shipping = new ShippingFee();

        @Test
        void smallOrderPays30k() {
            assertThat(shipping.calculate(370000)).isEqualTo(30000);
        }

        @Test
        void bigOrderShipsFree() {
            assertThat(shipping.calculate(840000)).isEqualTo(0);
        }

        @Test
        void freeShippingAtExactly500k() {
            assertThat(shipping.calculate(500000)).isEqualTo(0);
        }
    }
tests:
  - text: 'Hai test có sẵn vẫn pass'
    junit: { passed: 2 }
  - text: 'Có test `freeShippingAtExactly500k` kiểm tra `calculate(500000)` bằng `0`'
    source: 'void\s+freeShippingAtExactly500k\s*\(\s*\)\s*\{[^}]*calculate\(\s*500000\s*\)\s*\)\s*\.isEqualTo\(\s*0\s*\)'
    file: ShippingFeeTest.java
  - text: 'Test `freeShippingAtExactly500k` **fail**: nó đã bắt được bug'
    junit: { name: freeShippingAtExactly500k, status: failed }
  - text: 'Chỉ đúng 1 test fail'
    junit: { failed: 1 }
hints:
  - 'Copy test `bigOrderShipsFree`, đổi tên thành `freeShippingAtExactly500k` và đổi số tiền thành `500000`.'
  - 'Kết quả mong đợi lấy từ **quy định** (chú thích trong `ShippingFee.java`), không lấy từ những gì code đang làm.'
---

Đến giờ, bạn luôn cố làm cho test **pass**. Trang này thì ngược lại: mục tiêu là viết một test **fail**. Nghe lạ, nhưng đây mới chính là công việc của tester!

## Test fail không phải lúc nào cũng là lỗi của bạn

Khi một test fail, có hai khả năng:

| Khả năng | Nghĩa là | Việc cần làm |
|---|---|---|
| Test viết sai | mong đợi sai, gõ nhầm số... | sửa test |
| **Code sản phẩm sai** | bạn vừa tìm ra một **bug** | báo cho dev, test **giữ nguyên** |

Vì vậy, **kết quả mong đợi phải đến từ yêu cầu** (tài liệu, quy định, người làm sản phẩm), không bao giờ đến từ việc "chạy thử xem code trả về gì rồi chép vào". Chép như vậy thì test sẽ luôn pass, kể cả khi code sai.

## Ranh giới là nơi bug trú ngụ

Quy định của Tiệm Trà Mộc: *"đơn hàng **từ 500.000₫ trở lên** được miễn phí vận chuyển"*. Hai test có sẵn kiểm tra 370.000₫ và 840.000₫, cả hai đều pass. Nhưng còn đúng **500.000₫** thì sao?

Đây là kỹ thuật **phân tích giá trị biên** (*boundary value analysis*): khi có một ngưỡng, hãy test ngay tại ngưỡng và hai bên sát nó (499.999₫, 500.000₫, 500.001₫). Dev rất hay nhầm giữa `>` và `>=`, giữa "từ" và "trên".

## Đến lượt bạn

1. Đọc kỹ `ShippingFee.java` và quy định trong chú thích.
2. Viết test `freeShippingAtExactly500k`: đơn hàng **500000** thì phí vận chuyển phải là **0**.
3. Chạy và xem tab **Kết quả test**. Test của bạn sẽ **đỏ** với thông báo:

```text
expected: 0
 but was: 30000
```

Thông báo này chính là nội dung của một **bug report** tốt: *"Đơn hàng 500.000₫ vẫn bị tính phí ship 30.000₫, theo quy định phải được miễn phí"*. Bạn thử đoán xem dòng nào trong `ShippingFee.java` gây ra bug?

> Trong project thật, bạn **không sửa** test cho nó pass. Bạn báo bug, dev sửa `>` thành `>=`, và test của bạn tự chuyển sang xanh. Từ đó về sau, nó canh giữ để bug này không bao giờ quay lại (gọi là **regression test**).
