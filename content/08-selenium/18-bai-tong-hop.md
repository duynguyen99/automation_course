---
title: "Bài tổng hợp: Test đặt hàng từ đầu đến cuối"
type: code
mode: junit
minutes: 20
practice: products.html
files:
  - name: OrderTest.java
    content: |
      import java.time.Duration;
      import org.junit.jupiter.api.AfterEach;
      import org.junit.jupiter.api.BeforeEach;
      import org.junit.jupiter.api.Test;
      import org.openqa.selenium.By;
      import org.openqa.selenium.WebDriver;
      import org.openqa.selenium.WebElement;
      import org.openqa.selenium.chrome.ChromeDriver;
      import org.openqa.selenium.support.ui.ExpectedConditions;
      import org.openqa.selenium.support.ui.Select;
      import org.openqa.selenium.support.ui.WebDriverWait;
      import static org.assertj.core.api.Assertions.assertThat;

      class OrderTest {
          private static final String BASE_URL = "http://localhost:4000/practice/";
          private WebDriver driver;
          private WebDriverWait wait;

          @BeforeEach
          void openBrowser() {
              driver = new ChromeDriver();
              wait = new WebDriverWait(driver, Duration.ofSeconds(10));
          }

          @AfterEach
          void closeBrowser() {
              if (driver != null) {
                  driver.quit();
              }
          }

          @Test
          void placeOrderWithTwoProducts() {
              driver.get(BASE_URL + "products.html");

              // Bước 1: thêm "Trà Sen Tây Hồ" (data-id 3) và "Trà Nhài Thái Nguyên" (data-id 4)

              // Bước 2: chờ #cart-count thành "2", rồi bấm #cart-link

              // Bước 3: giỏ hàng có 2 dòng, tổng 570.000₫. In "Tổng giỏ hàng: ..."

              // Bước 4: bấm #checkout-btn, điền form, chọn Hà Nội, đồng ý, đặt hàng

              // Bước 5: chờ #order-success, kiểm tra nội dung và mã đơn. In "Mã đơn: ..."

          }
      }
solution:
  OrderTest.java: |
    import java.time.Duration;
    import org.junit.jupiter.api.AfterEach;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.Test;
    import org.openqa.selenium.By;
    import org.openqa.selenium.WebDriver;
    import org.openqa.selenium.WebElement;
    import org.openqa.selenium.chrome.ChromeDriver;
    import org.openqa.selenium.support.ui.ExpectedConditions;
    import org.openqa.selenium.support.ui.Select;
    import org.openqa.selenium.support.ui.WebDriverWait;
    import static org.assertj.core.api.Assertions.assertThat;

    class OrderTest {
        private static final String BASE_URL = "http://localhost:4000/practice/";
        private WebDriver driver;
        private WebDriverWait wait;

        @BeforeEach
        void openBrowser() {
            driver = new ChromeDriver();
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        }

        @AfterEach
        void closeBrowser() {
            if (driver != null) {
                driver.quit();
            }
        }

        @Test
        void placeOrderWithTwoProducts() {
            driver.get(BASE_URL + "products.html");

            // Bước 1
            driver.findElement(By.cssSelector(".add-to-cart[data-id='3']")).click();
            driver.findElement(By.cssSelector(".add-to-cart[data-id='4']")).click();

            // Bước 2
            wait.until(ExpectedConditions.textToBe(By.id("cart-count"), "2"));
            driver.findElement(By.id("cart-link")).click();

            // Bước 3
            WebElement total = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("cart-total")));
            assertThat(driver.findElements(By.cssSelector("tr.cart-row"))).hasSize(2);
            assertThat(total.getText()).isEqualTo("570.000₫");
            System.out.println("Tổng giỏ hàng: " + total.getText());

            // Bước 4
            driver.findElement(By.id("checkout-btn")).click();
            wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("fullname"))).sendKeys("Nguyễn Thị Lan");
            driver.findElement(By.id("phone")).sendKeys("0912345678");
            driver.findElement(By.id("email")).sendKeys("lan@tramoc.vn");
            new Select(driver.findElement(By.id("city"))).selectByValue("HN");
            driver.findElement(By.id("address")).sendKeys("12 Hàng Bạc, Hoàn Kiếm");
            WebElement agree = driver.findElement(By.id("agree"));
            if (!agree.isSelected()) {
                agree.click();
            }
            driver.findElement(By.id("place-order")).click();

            // Bước 5
            WebElement success = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("order-success")));
            assertThat(success.getText()).contains("Đặt hàng thành công!");
            String orderCode = driver.findElement(By.id("order-code")).getText();
            assertThat(orderCode).matches("TM\\d{6}");
            System.out.println("Mã đơn: " + orderCode);
        }
    }
tests:
  - text: 'Test `placeOrderWithTwoProducts` pass'
    junit: { name: placeOrderWithTwoProducts, status: passed }
  - text: 'Khẳng định tổng giỏ hàng bằng `assertThat(...).isEqualTo("570.000₫")`'
    source: 'isEqualTo\(\s*"570\.000₫"\s*\)'
  - text: 'Chọn tỉnh/thành bằng class `Select`'
    source: 'new\s+Select\(\s*driver\.findElement\(\s*By\.id\(\s*"city"\s*\)\s*\)\s*\)'
  - text: 'Chờ thông báo `#order-success` bằng `wait.until(...)`'
    source: 'wait\.until\([\s\S]*"order-success"'
  - text: 'Console in `Tổng giỏ hàng: 570.000₫` và `Mã đơn: TM` + 6 chữ số'
    stdout: { regex: 'Tổng giỏ hàng: 570\.000₫\s+Mã đơn: TM\d{6}' }
  - text: 'Không dùng `Thread.sleep`'
    notSource: 'Thread\.sleep'
hints:
  - 'Nút thêm vào giỏ của sản phẩm 3: `By.cssSelector(".add-to-cart[data-id=''3'']")`.'
  - 'Mỗi lần chuyển trang (bấm `#cart-link`, bấm `#checkout-btn`) hãy chờ một phần tử của trang mới hiện ra, ví dụ `#cart-total` hay `#fullname`.'
  - 'Mã đơn có dạng `TM` + 6 chữ số: `assertThat(orderCode).matches("TM\\d{6}");`'
timeout: 120
---

Chúc mừng bạn đã đi tới bài cuối của chương Selenium! Bài này là một **E2E test** (*end-to-end*, từ đầu đến cuối): đi đúng hành trình của một khách hàng thật, từ lúc chọn trà cho tới lúc nhận mã đơn hàng. Trong dự án thật, những test kiểu này bảo vệ luồng **quan trọng nhất** của website: luồng làm ra tiền.

## Kịch bản

| Bước | Trang | Việc cần làm | Kiểm tra |
|---|---|---|---|
| 1 | `products.html` | Bấm "Thêm vào giỏ" của sản phẩm `data-id` **3** (Trà Sen Tây Hồ) và **4** (Trà Nhài Thái Nguyên) | |
| 2 | | Chờ `#cart-count` thành `2`, bấm `#cart-link` | |
| 3 | `cart.html` | Chờ `#cart-total` hiện ra | Có đúng **2** dòng `tr.cart-row`; tổng `570.000₫`. In `Tổng giỏ hàng: 570.000₫` |
| 4 | `checkout.html` | Bấm `#checkout-btn`. Điền `#fullname` `Nguyễn Thị Lan`, `#phone` `0912345678`, `#email` `lan@tramoc.vn`, chọn `#city` = `HN`, `#address` tùy bạn, tick `#agree`, bấm `#place-order` | |
| 5 | | Chờ `#order-success` hiện ra | Chứa `Đặt hàng thành công!`; `#order-code` khớp `TM\d{6}`. In `Mã đơn: ...` |

## Ghi nhớ khi viết

- Giỏ hàng được lưu trong **localStorage** của trình duyệt, nên cả hành trình phải diễn ra trong **cùng một** driver. Test sau mở Chrome mới sẽ có giỏ hàng trống, đúng tinh thần test độc lập.
- Sau mỗi lần **chuyển trang**, hãy chờ một phần tử đặc trưng của trang mới trước khi thao tác.
- Kiểm tra số dòng của giỏ: `assertThat(driver.findElements(By.cssSelector("tr.cart-row"))).hasSize(2);`
- Mã đơn mỗi lần một khác, nên đừng so sánh bằng `isEqualTo`. Hãy kiểm tra **định dạng** bằng `matches("TM\\d{6}")` (biểu thức chính quy: chữ `TM` theo sau là đúng 6 chữ số).

## Đến lượt bạn

Viết toàn bộ test `placeOrderWithTwoProducts` theo bảng kịch bản ở trên. Console cần in ra:

```
Tổng giỏ hàng: 570.000₫
Mã đơn: TM123456
```

(mã đơn của bạn sẽ khác). Bạn sẽ thấy code này khá dài, và nếu viết thêm 20 test như vậy, locator sẽ lặp lại khắp nơi. Chương sau, bạn sẽ học cách tổ chức nó thật gọn gàng bằng **Page Object Model**.
