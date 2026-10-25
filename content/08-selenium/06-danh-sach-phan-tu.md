---
title: "findElements: làm việc với danh sách"
type: code
minutes: 10
practice: products.html
seed: |
  import java.util.List;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              // 1. Lấy tất cả thẻ sản phẩm và in "Số sản phẩm: ..."

              // 2. In tên từng sản phẩm (.product-name), mỗi tên một dòng

              // 3. Tính tổng giá (.price) bằng stream và in "Tổng giá: ..."

          } finally {
              driver.quit();
          }
      }

      // "185.000₫" -> 185000
      static int parsePrice(String text) {
          return Integer.parseInt(text.replaceAll("[^0-9]", ""));
      }
  }
solution: |
  import java.util.List;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              List<WebElement> cards = driver.findElements(By.cssSelector(".product-card"));
              System.out.println("Số sản phẩm: " + cards.size());

              List<WebElement> names = driver.findElements(By.cssSelector(".product-name"));
              for (WebElement name : names) {
                  System.out.println(name.getText());
              }

              int total = driver.findElements(By.cssSelector(".price")).stream()
                      .map(WebElement::getText)
                      .mapToInt(Main::parsePrice)
                      .sum();
              System.out.println("Tổng giá: " + total);
          } finally {
              driver.quit();
          }
      }

      // "185.000₫" -> 185000
      static int parsePrice(String text) {
          return Integer.parseInt(text.replaceAll("[^0-9]", ""));
      }
  }
tests:
  - text: 'Dùng `driver.findElements(...)` (có chữ **s**)'
    source: 'driver\.findElements\('
  - text: 'Dòng đầu tiên là `Số sản phẩm: 6`'
    stdout: { regex: '^Số sản phẩm: 6\n' }
  - text: 'In đủ 6 tên sản phẩm theo thứ tự trên trang'
    stdout: { includes: "Trà Shan Tuyết\nTrà Ô Long Lâm Đồng\nTrà Sen Tây Hồ\nTrà Nhài Thái Nguyên\nHồng Trà Hà Giang\nẤm Tử Sa Mini" }
  - text: 'Tính tổng bằng stream (`.stream()` ... `.sum()`)'
    source: '\.stream\(\)[\s\S]*\.sum\(\)'
  - text: 'Dòng cuối là `Tổng giá: 1765000`'
    stdout: { regex: 'Tổng giá: 1765000$' }
hints:
  - '`List<WebElement> cards = driver.findElements(By.cssSelector(".product-card"));` rồi dùng `cards.size()`.'
  - 'Duyệt danh sách tên bằng vòng lặp `for (WebElement name : names)` và in `name.getText()`.'
  - 'Stream: `driver.findElements(By.cssSelector(".price")).stream().map(WebElement::getText).mapToInt(Main::parsePrice).sum()`'
timeout: 90
---

Trang sản phẩm có 6 thẻ sản phẩm giống hệt nhau về cấu trúc. Tester hay phải hỏi những câu như: *"Có đủ 6 sản phẩm không? Tên có đúng không? Giá có hợp lý không?"*. Lúc này ta cần lấy **tất cả** phần tử khớp với locator, không chỉ cái đầu tiên.

## findElement và findElements

```java
WebElement first = driver.findElement(By.cssSelector(".product-card"));      // 1 phần tử
List<WebElement> all = driver.findElements(By.cssSelector(".product-card")); // tất cả
```

| | `findElement` | `findElements` |
|---|---|---|
| Trả về | Một `WebElement` | Một `List<WebElement>` |
| Không tìm thấy | Ném `NoSuchElementException` | Trả về list **rỗng**, không lỗi |

Nhờ điểm khác biệt thứ hai, `findElements(...).isEmpty()` là cách gọn để kiểm tra "phần tử này **không** có trên trang".

## Kết hợp với Stream

Danh sách `WebElement` chỉ là một `List` bình thường, nên mọi thứ bạn học ở chương "Java vừa đủ dùng" đều áp dụng được:

```java
List<String> names = driver.findElements(By.cssSelector(".product-name")).stream()
        .map(WebElement::getText)
        .toList();
```

Giá trên trang có dạng `"185.000₫"`, là chữ chứ không phải số. Method `parsePrice` có sẵn trong code sẽ bỏ hết ký tự không phải chữ số (dấu chấm, chữ ₫) rồi đổi sang `int`.

## Đến lượt bạn

Trên `products.html`:

1. Lấy tất cả `.product-card`, in `Số sản phẩm: 6`
2. In tên từng sản phẩm (class `product-name`), mỗi tên một dòng, theo thứ tự trên trang.
3. Lấy tất cả `.price`, dùng **stream** để đổi sang số và cộng lại, in `Tổng giá: 1765000`
