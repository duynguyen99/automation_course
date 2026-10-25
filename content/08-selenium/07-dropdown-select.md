---
title: "Dropdown: class Select"
type: code
minutes: 9
practice: products.html
seed: |
  import java.util.ArrayList;
  import java.util.List;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.Select;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              // 1. Tạo Select cho #sort và chọn giá trị "price-asc"

              // 2. In chữ của lựa chọn đang được chọn

              // 3. Lấy danh sách giá (.price) theo thứ tự trên trang, đổi sang số
              List<Integer> prices = new ArrayList<>();

              // 4. In "Đúng thứ tự: true/false" (so sánh với bản đã sắp xếp)

          } finally {
              driver.quit();
          }
      }

      static int parsePrice(String text) {
          return Integer.parseInt(text.replaceAll("[^0-9]", ""));
      }
  }
solution: |
  import java.util.ArrayList;
  import java.util.List;
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.support.ui.Select;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/products.html");

              Select sort = new Select(driver.findElement(By.id("sort")));
              sort.selectByValue("price-asc");
              System.out.println(sort.getFirstSelectedOption().getText());

              List<Integer> prices = new ArrayList<>();
              for (WebElement price : driver.findElements(By.cssSelector(".price"))) {
                  prices.add(parsePrice(price.getText()));
              }
              System.out.println(prices);

              List<Integer> sorted = prices.stream().sorted().toList();
              System.out.println("Đúng thứ tự: " + prices.equals(sorted));
          } finally {
              driver.quit();
          }
      }

      static int parsePrice(String text) {
          return Integer.parseInt(text.replaceAll("[^0-9]", ""));
      }
  }
tests:
  - text: 'Tạo `new Select(...)` từ phần tử `#sort`'
    source: 'new\s+Select\(\s*driver\.findElement\(\s*By\.id\(\s*"sort"\s*\)\s*\)\s*\)'
  - text: 'Chọn bằng `selectByValue("price-asc")`'
    source: 'selectByValue\(\s*"price-asc"\s*\)'
  - text: 'Dòng đầu in lựa chọn hiện tại: `Giá tăng dần`'
    stdout: { regex: '^Giá tăng dần\n' }
  - text: 'In danh sách giá `[150000, 185000, 210000, 240000, 420000, 560000]`'
    stdout: { includes: "[150000, 185000, 210000, 240000, 420000, 560000]" }
  - text: 'Dòng cuối là `Đúng thứ tự: true`'
    stdout: { regex: 'Đúng thứ tự: true$' }
hints:
  - '`Select sort = new Select(driver.findElement(By.id("sort")));` rồi `sort.selectByValue("price-asc");`'
  - 'Lựa chọn hiện tại: `sort.getFirstSelectedOption().getText()`. In cả list bằng `System.out.println(prices);`'
  - 'Bản sắp xếp: `List<Integer> sorted = prices.stream().sorted().toList();` rồi so sánh `prices.equals(sorted)`.'
timeout: 90
---

Thẻ `<select>` (dropdown) hơi đặc biệt: muốn chọn một mục, người dùng phải bấm mở danh sách rồi bấm vào mục đó. Selenium có sẵn class **`Select`** để làm việc này gọn gàng.

## Dùng class Select

```java
Select sort = new Select(driver.findElement(By.id("sort")));

sort.selectByValue("price-asc");            // theo thuộc tính value
sort.selectByVisibleText("Giá tăng dần");   // theo chữ hiển thị
sort.selectByIndex(1);                      // theo vị trí (bắt đầu từ 0)

String current = sort.getFirstSelectedOption().getText();  // mục đang chọn
List<WebElement> all = sort.getOptions();                   // tất cả các mục
```

Với dropdown sắp xếp của Tiệm Trà Mộc:

```html
<select id="sort">
  <option value="default">Mặc định</option>
  <option value="price-asc">Giá tăng dần</option>
  <option value="price-desc">Giá giảm dần</option>
  <option value="name">Tên A-Z</option>
</select>
```

> `selectByValue` thường bền hơn `selectByVisibleText`: chữ hiển thị có thể bị đổi (hoặc dịch sang tiếng Anh), còn `value` là thứ lập trình viên dùng trong code nên ít thay đổi.

## Kiểm tra sắp xếp như một tester

Chọn "Giá tăng dần" xong, làm sao biết trang sắp xếp **đúng**? Mẹo kinh điển: lấy danh sách giá theo thứ tự trên trang, tự sắp xếp một bản sao, rồi so sánh hai list. Nếu bằng nhau, trang đã sắp xếp đúng.

## Đến lượt bạn

1. Tạo `Select` cho `#sort`, chọn value `price-asc`.
2. In chữ của mục đang chọn: `Giá tăng dần`
3. Đọc tất cả `.price` theo thứ tự trên trang, đổi sang số, đưa vào `prices` và in cả list: `[150000, 185000, 210000, 240000, 420000, 560000]`
4. So sánh với bản đã sắp xếp, in `Đúng thứ tự: true`
