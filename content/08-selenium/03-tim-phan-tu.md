---
title: "Tìm phần tử: findElement và By"
type: code
minutes: 8
practice: products.html
seed: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              // 1. Tiêu đề h1 (dùng By.cssSelector)

              // 2. Số kết quả #result-count (dùng By.id)

              // 3. Tên sản phẩm có data-id="3" (dùng By.xpath)

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              WebElement title = driver.findElement(By.cssSelector("h1"));
              System.out.println(title.getText());

              WebElement count = driver.findElement(By.id("result-count"));
              System.out.println(count.getText());

              WebElement name = driver.findElement(By.xpath("//article[@data-id='3']//h3"));
              System.out.println(name.getText());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Dùng `By.cssSelector(...)` để tìm tiêu đề'
    source: 'By\.cssSelector\(\s*"[^"]+"\s*\)'
  - text: 'Dùng `By.id("result-count")`'
    source: 'By\.id\(\s*"result-count"\s*\)'
  - text: 'Dùng `By.xpath(...)` để tìm tên sản phẩm'
    source: 'By\.xpath\(\s*"[^"]+"\s*\)'
  - text: 'Đọc chữ bằng `getText()`'
    source: '\.getText\(\)'
  - text: 'Console in đúng 3 dòng: `Sản phẩm`, `6 sản phẩm`, `Trà Sen Tây Hồ`'
    stdout: { equals: "Sản phẩm\n6 sản phẩm\nTrà Sen Tây Hồ" }
hints:
  - 'Mẫu chung: `WebElement x = driver.findElement(By.???("..."));` rồi `System.out.println(x.getText());`'
  - 'CSS cho tiêu đề chỉ cần `"h1"`. XPath cho tên sản phẩm: `"//article[@data-id=''3'']//h3"` (dấu nháy đơn bên trong chuỗi Java).'
timeout: 90
---

Ở chương 7 bạn đã luyện viết CSS selector và XPath trong DevTools. Giờ là lúc đưa chúng vào code. Muốn bấm hay đọc một thứ gì trên trang, trước hết Selenium phải **tìm** được nó.

## findElement và By

```java
WebElement button = driver.findElement(By.id("login-btn"));
```

- **`By`** là cách bạn mô tả "phần tử nào". Đây chính là **locator** (bộ định vị).
- **`findElement(...)`** tìm phần tử **đầu tiên** khớp với locator và trả về một **`WebElement`**, tức một object đại diện cho phần tử đó trên trang.
- Nếu không tìm thấy, Selenium ném ra **`NoSuchElementException`**. Bạn sẽ gặp exception này rất nhiều, và nó thường có nghĩa là: locator sai, hoặc phần tử chưa kịp xuất hiện.

## Các loại By hay dùng

| Locator | Ví dụ | Khi nào dùng |
|---|---|---|
| `By.id` | `By.id("username")` | Ưu tiên số 1: nhanh, rõ, ít thay đổi |
| `By.name` | `By.name("password")` | Ô nhập trong form thường có `name` |
| `By.cssSelector` | `By.cssSelector(".product-card .price")` | Linh hoạt, dùng nhiều nhất trong thực tế |
| `By.xpath` | `By.xpath("//button[text()='Đăng nhập']")` | Khi cần tìm theo chữ, hoặc đi ngược lên phần tử cha |

> Thứ tự ưu tiên của dân chuyên: **id → name → CSS → XPath**. Càng đơn giản, test càng ít "gãy" khi giao diện thay đổi.

## getText: đọc chữ người dùng nhìn thấy

```java
String text = driver.findElement(By.id("result-count")).getText();
```

`getText()` trả về đúng phần chữ **hiển thị** trên màn hình (đã bỏ khoảng trắng thừa). Đây là cách bạn "đọc" trang web để sau này so sánh với kết quả mong đợi.

## Đến lượt bạn

Trên trang `products.html`, in ra **3 dòng**:

1. Chữ của tiêu đề `h1`, tìm bằng `By.cssSelector`. Kết quả: `Sản phẩm`
2. Chữ của phần tử có id `result-count`, tìm bằng `By.id`. Kết quả: `6 sản phẩm`
3. Tên sản phẩm (thẻ `h3`) nằm trong `article` có `data-id="3"`, tìm bằng `By.xpath`. Kết quả: `Trà Sen Tây Hồ`

Mẹo: bấm "Mở trang mẫu ↗", mở DevTools (F12) để xem cấu trúc HTML trước khi viết locator.
