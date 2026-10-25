---
title: "Hooks @Before và @After: chuẩn bị và dọn dẹp"
type: code
mode: cucumber
minutes: 10
files:
  - name: features/dat_hang.feature
    readonly: true
    content: |
      Feature: Đặt hàng

        Scenario: Đặt một hộp trà
          When tôi đặt 1 hộp "Trà Sen Tây Hồ"
          Then đơn hàng có 1 sản phẩm

        Scenario: Đặt ba hộp trà
          When tôi đặt 3 hộp "Trà Nhài Thái Nguyên"
          Then đơn hàng có 3 sản phẩm
  - name: steps/OrderSteps.java
    readonly: true
    content: |
      package steps;

      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      public class OrderSteps {
          private int items = 0;

          @When("tôi đặt {int} hộp {string}")
          public void order(int quantity, String product) {
              System.out.println("   (đặt " + quantity + " hộp " + product + ")");
              items += quantity;
          }

          @Then("đơn hàng có {int} sản phẩm")
          public void orderHas(int expected) {
              assertThat(items).isEqualTo(expected);
          }
      }
  - name: steps/Hooks.java
    content: |
      package steps;

      import io.cucumber.java.After;
      import io.cucumber.java.Before;
      import io.cucumber.java.Scenario;

      public class Hooks {

          // 1. @Before(order = 1): in "[Hook] Mở kết nối"

          // 2. @Before(order = 2): in "[Hook] Chuẩn bị dữ liệu"

          // 3. @After: in "[Hook] Dọn dẹp sau: " + tên scenario

      }
solution:
  steps/Hooks.java: |
    package steps;

    import io.cucumber.java.After;
    import io.cucumber.java.Before;
    import io.cucumber.java.Scenario;

    public class Hooks {

        @Before(order = 1)
        public void openConnection() {
            System.out.println("[Hook] Mở kết nối");
        }

        @Before(order = 2)
        public void prepareData() {
            System.out.println("[Hook] Chuẩn bị dữ liệu");
        }

        @After
        public void cleanUp(Scenario scenario) {
            System.out.println("[Hook] Dọn dẹp sau: " + scenario.getName());
        }
    }
tests:
  - text: 'Hai Scenario vẫn pass'
    cucumber: { passed: 2 }
  - text: 'Dùng `@Before` và `@After` của gói `io.cucumber.java` (không phải của JUnit)'
    source: '@Before\(\s*order\s*=\s*1\s*\)[\s\S]*@Before\(\s*order\s*=\s*2\s*\)[\s\S]*@After'
    file: steps/Hooks.java
  - text: 'Trước **mỗi** Scenario: in `[Hook] Mở kết nối` rồi mới tới `[Hook] Chuẩn bị dữ liệu`'
    stdout: { regex: '\[Hook\] Mở kết nối\s+\[Hook\] Chuẩn bị dữ liệu[\s\S]*\[Hook\] Mở kết nối\s+\[Hook\] Chuẩn bị dữ liệu' }
  - text: 'Sau mỗi Scenario in `[Hook] Dọn dẹp sau: <tên scenario>`'
    stdout: { regex: '\[Hook\] Dọn dẹp sau: Đặt một hộp trà[\s\S]*\[Hook\] Dọn dẹp sau: Đặt ba hộp trà' }
hints:
  - 'Mỗi hook là một method `public void` bình thường, đặt annotation lên trên: `@Before(order = 1)`.'
  - 'Muốn biết tên Scenario, cho method `@After` nhận tham số `Scenario scenario` rồi gọi `scenario.getName()`.'
---

Mỗi Scenario thường cần **chuẩn bị** trước khi chạy (mở trình duyệt, tạo dữ liệu test) và **dọn dẹp** sau khi chạy (đóng trình duyệt, xóa dữ liệu). Đó là việc của **hooks**:

```java
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

public class Hooks {
    @Before
    public void setUp() {
        System.out.println("Chạy TRƯỚC mỗi Scenario");
    }

    @After
    public void tearDown(Scenario scenario) {
        System.out.println("Chạy SAU mỗi Scenario: " + scenario.getName());
    }
}
```

- Hook đặt trong package **`steps`** như step definition, thường gom vào một class riêng tên `Hooks`.
- `@After` **luôn chạy**, kể cả khi Scenario fail. Đây là chỗ lý tưởng để `driver.quit()`.
- Method `@After` có thể nhận tham số **`Scenario`** để biết tên (`getName()`), trạng thái (`isFailed()`), hay đính kèm ảnh chụp màn hình vào báo cáo (`attach(...)`, bạn sẽ gặp ở chương sau).

> **Cẩn thận nhầm lẫn!** JUnit 4 cũng có annotation tên `@Before`/`@After`. Trong Cucumber phải import từ **`io.cucumber.java`**. Import nhầm thì hook không bao giờ chạy, và bạn sẽ mất cả buổi để tìm lý do.

## Thứ tự chạy với `order`

Khi có nhiều `@Before`, dùng `order` để quyết định ai chạy trước:

| Hook | Quy tắc |
|---|---|
| `@Before(order = 1)`, `@Before(order = 2)` | Số **nhỏ chạy trước** |
| `@After(order = 1)`, `@After(order = 2)` | Ngược lại: số **lớn chạy trước** |

Vì sao `@After` ngược lại? Hãy nghĩ như xếp chồng bát: thứ mở **đầu tiên** (kết nối, trình duyệt) phải được đóng **cuối cùng**. Không ghi `order` thì mặc định là `10000`.

Toàn bộ vòng đời một Scenario:

```text
@Before (order 1) → @Before (order 2) → [Background] → Given → When → Then → @After
```

> Hook còn có thể chỉ chạy cho Scenario có **tag** nhất định, ví dụ `@Before("@can-dang-nhap")`. Bạn sẽ học tag ở vài trang nữa.

## Đến lượt bạn

Trong `steps/Hooks.java`, viết ba hook:

1. `@Before(order = 1)`: in `[Hook] Mở kết nối`
2. `@Before(order = 2)`: in `[Hook] Chuẩn bị dữ liệu`
3. `@After`: in `[Hook] Dọn dẹp sau: ` nối với tên Scenario

Chạy xong, xem khung **Console**: các dòng `[Hook]` xen giữa các bước của từng Scenario.
