---
title: "Kiểm tra trạng thái: thuộc tính, hiển thị, bật/tắt"
type: code
minutes: 9
practice: login.html
seed: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/login.html");
              WebElement error = driver.findElement(By.id("error-message"));

              // 1. In placeholder của ô #username

              // 2. In: thông báo lỗi có đang hiện không?

              // 3. Đăng nhập sai: lan / sai123

              // 4. In lại: thông báo lỗi có đang hiện không?

              // 5. In nội dung thông báo lỗi

              // 6. In: nút #login-btn có bấm được không?

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
              driver.get("http://localhost:4000/practice/login.html");
              WebElement error = driver.findElement(By.id("error-message"));

              System.out.println(driver.findElement(By.id("username")).getDomAttribute("placeholder"));
              System.out.println(error.isDisplayed());

              driver.findElement(By.id("username")).sendKeys("lan");
              driver.findElement(By.id("password")).sendKeys("sai123");
              driver.findElement(By.id("login-btn")).click();

              System.out.println(error.isDisplayed());
              System.out.println(error.getText());
              System.out.println(driver.findElement(By.id("login-btn")).isEnabled());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Đọc placeholder bằng `getDomAttribute("placeholder")` hoặc `getAttribute("placeholder")`'
    source: '\.get(Dom)?Attribute\(\s*"placeholder"\s*\)'
  - text: 'Dùng `isDisplayed()` để xem thông báo lỗi có hiện không'
    source: '\.isDisplayed\(\)'
  - text: 'Dùng `isEnabled()` cho nút đăng nhập'
    source: '\.isEnabled\(\)'
  - text: 'Console in đúng 5 dòng theo thứ tự đề bài'
    stdout: { equals: "Nhập tên đăng nhập\nfalse\ntrue\nSai tên đăng nhập hoặc mật khẩu\ntrue" }
hints:
  - 'Hai lần in `error.isDisplayed()`: một lần trước khi click (ra `false`), một lần sau khi click (ra `true`).'
  - 'Thông báo lỗi hiện ngay khi bấm nút (không chuyển trang), nên ở bài này chưa cần chờ.'
timeout: 90
---

Một bài test không chỉ hỏi "chữ trên trang là gì", mà còn hỏi: ô này có **gợi ý** gì không? Thông báo lỗi có **hiện ra** không? Nút có **bấm được** không? `WebElement` có sẵn method cho từng câu hỏi.

## Đọc thuộc tính HTML

```html
<input type="text" id="username" placeholder="Nhập tên đăng nhập">
```

```java
WebElement username = driver.findElement(By.id("username"));
username.getDomAttribute("placeholder");   // "Nhập tên đăng nhập"
username.getAttribute("placeholder");      // cũng ra "Nhập tên đăng nhập"
```

- **`getAttribute(...)`** là cách cũ, bạn sẽ thấy nó ở khắp các dự án. Nó "thông minh" quá mức: lúc thì đọc thuộc tính trong HTML, lúc lại đọc giá trị hiện tại của phần tử.
- Selenium 4 tách ra hai method rõ nghĩa hơn: **`getDomAttribute`** đọc đúng thuộc tính viết trong HTML, còn **`getDomProperty`** đọc giá trị hiện tại (ví dụ `getDomProperty("value")` cho biết chữ đang nằm trong ô nhập).

## Hỏi về trạng thái

| Method | Câu hỏi | Ví dụ dùng trong test |
|---|---|---|
| `isDisplayed()` | Có đang hiện trên màn hình không? | Thông báo lỗi có hiện ra không |
| `isEnabled()` | Có bấm/gõ được không? | Nút "Hết hàng" phải bị khóa |
| `isSelected()` | Có đang được chọn không? | Checkbox "Ghi nhớ đăng nhập" (bài sau) |

Cả ba đều trả về `boolean`, rất hợp để đưa vào `assertThat(...).isTrue()` sau này.

> Lưu ý: `getText()` của một phần tử đang **ẩn** sẽ trả về chuỗi rỗng `""`, vì `getText` chỉ đọc chữ người dùng nhìn thấy được.

## Đến lượt bạn

Trên `login.html`, in ra **5 dòng** theo đúng thứ tự:

1. Placeholder của ô `#username`: `Nhập tên đăng nhập`
2. `error.isDisplayed()` lúc mới mở trang: `false`
3. Sau khi gõ `lan` / `sai123` và click `#login-btn`, in lại `error.isDisplayed()`: `true`
4. Nội dung thông báo lỗi: `Sai tên đăng nhập hoặc mật khẩu`
5. Nút `#login-btn` có bấm được không: `true`

Đây chính là một **negative test case**: cố tình nhập sai để kiểm tra hệ thống phản ứng đúng. Tester giỏi viết loại test này nhiều không kém test "đường đẹp".
