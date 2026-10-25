---
title: "Vòng đời test: @BeforeEach, @AfterEach, @BeforeAll"
type: code
mode: junit
minutes: 9
files:
  - name: Cart.java
    readonly: true
    content: |
      import java.util.ArrayList;
      import java.util.List;

      public class Cart {
          private final List<Integer> prices = new ArrayList<>();

          public void add(String name, int price) {
              prices.add(price);
          }

          public int count() {
              return prices.size();
          }

          public int total() {
              int sum = 0;
              for (int p : prices) {
                  sum += p;
              }
              return sum;
          }
      }
  - name: CartTest.java
    content: |
      import org.junit.jupiter.api.*;
      import static org.assertj.core.api.Assertions.assertThat;

      class CartTest {
          Cart cart;

          // 1. @BeforeAll: in "Bắt đầu bộ test giỏ hàng"

          // 2. @BeforeEach: tạo giỏ hàng mới và in "Tạo giỏ hàng mới"

          // 3. @AfterEach: in "Dọn dẹp sau test"

          @Test
          void addOneItem() {
              cart.add("Trà Sen Tây Hồ", 420000);
              assertThat(cart.count()).isEqualTo(1);
          }

          @Test
          void addTwoItemsSumsTotal() {
              cart.add("Trà Shan Tuyết", 185000);
              cart.add("Trà Nhài Thái Nguyên", 150000);
              assertThat(cart.total()).isEqualTo(335000);
          }
      }
solution:
  CartTest.java: |
    import org.junit.jupiter.api.*;
    import static org.assertj.core.api.Assertions.assertThat;

    class CartTest {
        Cart cart;

        @BeforeAll
        static void startSuite() {
            System.out.println("Bắt đầu bộ test giỏ hàng");
        }

        @BeforeEach
        void setUp() {
            cart = new Cart();
            System.out.println("Tạo giỏ hàng mới");
        }

        @AfterEach
        void tearDown() {
            System.out.println("Dọn dẹp sau test");
        }

        @Test
        void addOneItem() {
            cart.add("Trà Sen Tây Hồ", 420000);
            assertThat(cart.count()).isEqualTo(1);
        }

        @Test
        void addTwoItemsSumsTotal() {
            cart.add("Trà Shan Tuyết", 185000);
            cart.add("Trà Nhài Thái Nguyên", 150000);
            assertThat(cart.total()).isEqualTo(335000);
        }
    }
tests:
  - text: 'Cả hai test pass (giỏ hàng đã được tạo trước mỗi test)'
    junit: { passed: 2, failed: 0 }
  - text: 'Có method `@BeforeAll` là `static`'
    source: '@BeforeAll\s+static\s+void\s+\w+\s*\('
  - text: 'Có method `@BeforeEach` tạo `cart = new Cart()`'
    source: '@BeforeEach\s+(public\s+)?void\s+\w+\s*\(\s*\)\s*\{[^}]*cart\s*=\s*new\s+Cart\(\s*\)'
  - text: 'Có method `@AfterEach`'
    source: '@AfterEach\s+(public\s+)?void\s+\w+\s*\('
  - text: 'Console in đúng thứ tự: "Bắt đầu" một lần, rồi mỗi test là "Tạo giỏ hàng mới" → "Dọn dẹp sau test"'
    stdout: { equals: "Bắt đầu bộ test giỏ hàng\nTạo giỏ hàng mới\nDọn dẹp sau test\nTạo giỏ hàng mới\nDọn dẹp sau test" }
hints:
  - 'Đọc bảng ở phần bài học: mỗi annotation đặt ngay trên một method `void`.'
  - '`@BeforeAll` bắt buộc là `static`: `@BeforeAll static void startSuite() { ... }`'
  - '`@BeforeEach void setUp() { cart = new Cart(); System.out.println("Tạo giỏ hàng mới"); }`'
---

Bấm chạy thử code có sẵn: cả hai test đều **lỗi** với `NullPointerException`, vì biến `cart` chưa bao giờ được tạo. Ta có thể thêm `cart = new Cart();` vào đầu mỗi test, nhưng nếu có 30 test thì sao? Và sau này với Selenium, mỗi test phải **mở trình duyệt** ở đầu và **đóng trình duyệt** ở cuối. Lặp lại 30 lần thì quá cực.

## Các "móc" (hook) của JUnit

JUnit cho phép bạn đánh dấu những method chạy **tự động** trước hoặc sau test:

| Annotation | Chạy khi nào | Dùng để |
|---|---|---|
| `@BeforeAll` | **1 lần** trước tất cả test trong class. Phải là `static` | việc tốn kém làm một lần: đọc file cấu hình, kết nối database |
| `@BeforeEach` | trước **mỗi** test | chuẩn bị dữ liệu mới: tạo giỏ hàng, **mở trình duyệt** |
| `@AfterEach` | sau **mỗi** test, **kể cả khi test fail** | dọn dẹp: **đóng trình duyệt**, xóa dữ liệu test |
| `@AfterAll` | **1 lần** sau tất cả test. Phải là `static` | dọn dẹp cuối cùng |

Với 2 test `A` và `B`, thứ tự chạy là:

```text
@BeforeAll
  @BeforeEach → A → @AfterEach
  @BeforeEach → B → @AfterEach
@AfterAll
```

> Mỗi test được chạy trên một **object mới** của class test, và có một giỏ hàng **mới tinh**. Test A thêm sản phẩm thì test B không bị ảnh hưởng. Nguyên tắc vàng: **các test phải độc lập với nhau**, chạy theo thứ tự nào cũng phải ra cùng kết quả. JUnit cũng không hứa chạy các test theo thứ tự bạn viết.

## Nhìn trước chương 8

Đây là khung của gần như mọi class test Selenium bạn sẽ viết:

```java
class LoginTest {
    WebDriver driver;

    @BeforeEach
    void openBrowser() {
        driver = new ChromeDriver();
    }

    @AfterEach
    void closeBrowser() {
        driver.quit();          // luôn chạy, kể cả khi test fail
    }

    @Test
    void loginSuccess() { ... }
}
```

## Đến lượt bạn

Thêm vào `CartTest` ba method:

1. `@BeforeAll static void startSuite()`: in ra `Bắt đầu bộ test giỏ hàng`
2. `@BeforeEach void setUp()`: gán `cart = new Cart();` rồi in ra `Tạo giỏ hàng mới`
3. `@AfterEach void tearDown()`: in ra `Dọn dẹp sau test`

Không in gì trong các method `@Test`. Sau khi chạy, xem khung **Console** để thấy thứ tự JUnit gọi các method của bạn.
