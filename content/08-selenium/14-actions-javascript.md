---
title: "Actions và JavascriptExecutor"
type: code
minutes: 9
practice: products.html
seed: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.JavascriptExecutor;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.interactions.Actions;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");
              WebElement card = driver.findElement(By.cssSelector("article[data-id='6']"));
              WebElement button = card.findElement(By.cssSelector(".add-to-cart"));

              // 1. Cuộn tới thẻ sản phẩm bằng JavascriptExecutor, in "Đã cuộn tới: <tên>"

              // 2. Dùng Actions: rê chuột lên nút rồi click

              // 3. Dùng JavascriptExecutor đọc số trong #cart-count, in "Số món trong giỏ: ..."

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.JavascriptExecutor;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.interactions.Actions;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");
              WebElement card = driver.findElement(By.cssSelector("article[data-id='6']"));
              WebElement button = card.findElement(By.cssSelector(".add-to-cart"));

              JavascriptExecutor js = (JavascriptExecutor) driver;
              js.executeScript("arguments[0].scrollIntoView({block: 'center'});", card);
              System.out.println("Đã cuộn tới: " + card.findElement(By.cssSelector(".product-name")).getText());

              new Actions(driver).moveToElement(button).click().perform();

              Object count = js.executeScript("return document.getElementById('cart-count').textContent;");
              System.out.println("Số món trong giỏ: " + count);
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Ép kiểu driver sang `JavascriptExecutor` và gọi `executeScript`'
    source: '\(\s*JavascriptExecutor\s*\)\s*driver[\s\S]*executeScript\('
  - text: 'Cuộn bằng `scrollIntoView`'
    source: 'scrollIntoView'
  - text: 'Dùng `new Actions(driver)` ... `.perform()` với `moveToElement`'
    source: 'new\s+Actions\(\s*driver\s*\)[\s\S]*moveToElement\([\s\S]*\.perform\(\)'
  - text: 'Đọc `#cart-count` bằng JavaScript (`return ...`)'
    source: 'executeScript\(\s*"return [^"]*cart-count'
  - text: 'Console in `Đã cuộn tới: Ấm Tử Sa Mini` rồi `Số món trong giỏ: 1`'
    stdout: { equals: "Đã cuộn tới: Ấm Tử Sa Mini\nSố món trong giỏ: 1" }
hints:
  - '`JavascriptExecutor js = (JavascriptExecutor) driver;` rồi `js.executeScript("arguments[0].scrollIntoView({block: ''center''});", card);`'
  - '`new Actions(driver).moveToElement(button).click().perform();` (nhớ `perform()` ở cuối, không có nó thì chẳng có gì xảy ra).'
  - 'Muốn JavaScript trả kết quả về Java thì phải có chữ `return`: `js.executeScript("return document.getElementById(''cart-count'').textContent;")`'
timeout: 90
---

`click()` và `sendKeys()` đủ cho 90% công việc. 10% còn lại cần hai "công cụ đặc biệt": **Actions** cho những thao tác chuột/bàn phím phức tạp, và **JavascriptExecutor** khi muốn chạy thẳng JavaScript trong trang.

## Actions: chuỗi thao tác như người thật

```java
new Actions(driver)
        .moveToElement(menu)    // rê chuột lên (hover)
        .click()                // bấm vào chỗ chuột đang đứng
        .perform();             // THỰC HIỆN cả chuỗi
```

Bạn "xâu chuỗi" các bước rồi gọi **`perform()`** để chạy. Một số thao tác hay dùng:

| Method | Ý nghĩa |
|---|---|
| `moveToElement(el)` | Rê chuột lên phần tử (menu xổ xuống khi hover) |
| `doubleClick(el)` | Nhấp đúp |
| `contextClick(el)` | Bấm chuột phải |
| `dragAndDrop(a, b)` | Kéo thả từ a sang b |
| `scrollToElement(el)` | Cuộn tới phần tử |

## JavascriptExecutor: chạy JavaScript trong trang

```java
JavascriptExecutor js = (JavascriptExecutor) driver;
js.executeScript("arguments[0].scrollIntoView({block: 'center'});", card);
Object title = js.executeScript("return document.title;");
```

- `ChromeDriver` cũng là một `JavascriptExecutor`, nên ta **ép kiểu** (*cast*) để dùng được method `executeScript`. Nhớ chương OOP: một object có thể "đóng nhiều vai" qua nhiều interface.
- `arguments[0]` trong đoạn JavaScript chính là tham số thứ hai bạn truyền vào (ở đây là `card`).
- Có chữ `return` thì kết quả được gửi về Java.

> JavascriptExecutor rất mạnh, nhưng đừng lạm dụng. Nếu bạn "click bằng JavaScript", bạn đã bỏ qua cách người dùng thật tương tác, và có thể bỏ sót bug (ví dụ nút bị che mất). Chỉ dùng khi không còn cách nào khác.

## Đến lượt bạn

Trên `products.html`, với sản phẩm `data-id='6'` (nằm cuối trang):

1. Dùng `JavascriptExecutor` cuộn thẻ sản phẩm vào giữa màn hình bằng `scrollIntoView`, rồi in `Đã cuộn tới: Ấm Tử Sa Mini`
2. Dùng `Actions` rê chuột lên nút "Thêm vào giỏ" rồi click.
3. Dùng `executeScript("return ...")` đọc `textContent` của `#cart-count` và in `Số món trong giỏ: 1`
