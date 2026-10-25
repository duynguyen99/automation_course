---
title: "@Disabled và @Tag: bỏ qua và phân nhóm test"
type: code
mode: junit
minutes: 7
files:
  - name: ShippingFee.java
    readonly: true
    content: |
      public class ShippingFee {
          // Từ 500.000₫ trở lên: miễn phí. Dưới 500.000₫: 30.000₫.
          // (Bug #42 đã được báo, dev chưa sửa)
          public int calculate(int orderTotal) {
              if (orderTotal > 500000) {
                  return 0;
              }
              return 30000;
          }
      }
  - name: ShippingFeeTest.java
    content: |
      import org.junit.jupiter.api.Disabled;
      import org.junit.jupiter.api.Tag;
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
solution:
  ShippingFeeTest.java: |
    import org.junit.jupiter.api.Disabled;
    import org.junit.jupiter.api.Tag;
    import org.junit.jupiter.api.Test;
    import static org.assertj.core.api.Assertions.assertThat;

    class ShippingFeeTest {
        ShippingFee shipping = new ShippingFee();

        @Test
        @Tag("smoke")
        void smallOrderPays30k() {
            assertThat(shipping.calculate(370000)).isEqualTo(30000);
        }

        @Test
        @Tag("smoke")
        void bigOrderShipsFree() {
            assertThat(shipping.calculate(840000)).isEqualTo(0);
        }

        @Test
        @Disabled("Bug #42: đơn đúng 500.000₫ vẫn bị tính phí ship")
        void freeShippingAtExactly500k() {
            assertThat(shipping.calculate(500000)).isEqualTo(0);
        }
    }
tests:
  - text: '`freeShippingAtExactly500k` có `@Disabled("...")` kèm lý do có chữ `Bug #42`'
    source: '@Disabled\(\s*"[^"]*Bug #42[^"]*"\s*\)\s*(@Test\s*)?void\s+freeShippingAtExactly500k'
  - text: '`freeShippingAtExactly500k` bị bỏ qua (*skipped*)'
    junit: { name: freeShippingAtExactly500k, status: skipped }
  - text: 'Hai test còn lại có `@Tag("smoke")`'
    source: '^(?=[\s\S]*@Tag\(\s*"smoke"\s*\)\s*(@Test\s*)?void\s+smallOrderPays30k)(?=[\s\S]*@Tag\(\s*"smoke"\s*\)\s*(@Test\s*)?void\s+bigOrderShipsFree)'
  - text: 'Không còn test nào fail, 2 test pass'
    junit: { passed: 2, failed: 0 }
hints:
  - 'Đặt `@Disabled("Bug #42: ...")` ngay trên `void freeShippingAtExactly500k()`.'
  - 'Đặt `@Tag("smoke")` ngay dưới `@Test` của hai test kia (trước chữ `void`).'
---

Nhớ test `freeShippingAtExactly500k` đã bắt được bug ở bài trước chứ? Bạn đã báo bug, được đặt mã **#42**, nhưng dev hẹn tuần sau mới sửa. Trong lúc chờ, mỗi đêm bộ test đều **đỏ** vì một lỗi mà ai cũng đã biết. Dần dần cả team quen với màu đỏ, và đến khi có **bug mới** thật sự thì không ai để ý nữa. Đó là điều tệ nhất có thể xảy ra với một bộ test.

## @Disabled: tạm bỏ qua, có ghi lý do

```java
@Test
@Disabled("Bug #42: đơn đúng 500.000₫ vẫn bị tính phí ship")
void freeShippingAtExactly500k() { ... }
```

JUnit sẽ **không chạy** test này và đánh dấu nó là **skipped** (bị bỏ qua). Báo cáo vẫn hiện nó kèm lý do, nên không ai quên.

> **Luôn ghi lý do** và mã bug trong `@Disabled`. Khi bug được sửa, nhớ **xóa** `@Disabled` để test hoạt động trở lại. Một test bị tắt mãi mãi thì cũng như không có test.

## @Tag: dán nhãn để chạy theo nhóm

Bộ test thật có thể có hàng trăm test, chạy mất cả tiếng. Không phải lúc nào cũng cần chạy hết. Ta dán **nhãn** (*tag*) cho test:

```java
@Test
@Tag("smoke")
void loginSuccess() { ... }
```

Các nhãn hay gặp trong team automation:

| Nhãn | Ý nghĩa |
|---|---|
| `smoke` | vài chục test quan trọng nhất (đăng nhập, thêm vào giỏ, đặt hàng), chạy nhanh sau **mỗi** lần deploy để biết hệ thống "còn sống" |
| `regression` | toàn bộ test, chạy mỗi đêm |
| `slow`, `checkout`, `api`... | nhóm theo tốc độ hoặc chức năng |

Rồi chọn nhóm khi chạy bằng Maven:

```bash
mvn test -Dgroups=smoke            # chỉ chạy test có nhãn smoke
mvn test -DexcludedGroups=slow     # chạy tất cả trừ nhãn slow
```

Một test có thể mang nhiều nhãn, và `@Tag` đặt trên class thì mọi test trong class đều mang nhãn đó. Ở chương 10, Cucumber cũng có khái niệm nhãn y hệt (`@smoke`).

## Đến lượt bạn

1. Thêm `@Disabled` cho `freeShippingAtExactly500k`, lý do phải có chữ `Bug #42`, ví dụ `"Bug #42: đơn đúng 500.000₫ vẫn bị tính phí ship"`.
2. Thêm `@Tag("smoke")` cho `smallOrderPays30k` và `bigOrderShipsFree`.

Chạy lại: tab **Kết quả test** sẽ có 2 test xanh và 1 test **bị bỏ qua**.
