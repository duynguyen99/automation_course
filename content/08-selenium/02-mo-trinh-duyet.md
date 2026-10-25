---
title: "Mở trình duyệt bằng code"
type: code
minutes: 8
practice: login.html
seed: |
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              // 1. Mở trang đăng nhập

              // 2. In ra tiêu đề trang

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/login.html");
              System.out.println(driver.getTitle());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Dùng `driver.get(...)` để mở `http://localhost:4000/practice/login.html`'
    source: 'driver\.get\(\s*"http://localhost:4000/practice/login\.html"\s*\)'
  - text: 'In ra tiêu đề trang bằng `driver.getTitle()`'
    source: 'println\(\s*driver\.getTitle\(\)\s*\)'
  - text: 'Console in ra `Đăng nhập - Tiệm Trà Mộc`'
    stdout: { equals: "Đăng nhập - Tiệm Trà Mộc" }
  - text: 'Luôn đóng trình duyệt bằng `driver.quit()` trong `finally`'
    source: 'finally\s*\{\s*driver\.quit\(\)'
hints:
  - 'Địa chỉ phải nằm trong dấu ngoặc kép: `driver.get("http://...");`'
  - '`getTitle()` trả về một String, bạn chỉ cần đưa nó vào `System.out.println(...)`.'
timeout: 90
---

Khoảnh khắc bạn chờ đợi đã đến: **điều khiển trình duyệt bằng code**!

```java
WebDriver driver = new ChromeDriver();   // mở một cửa sổ Chrome mới
driver.get("https://...");               // đi tới một địa chỉ
String title = driver.getTitle();        // lấy tiêu đề của tab
driver.quit();                           // đóng trình duyệt
```

- **`WebDriver`** là một *interface* (nhớ chương OOP chứ?), mô tả những việc một trình duyệt làm được. **`ChromeDriver`** là class cụ thể điều khiển Chrome. Muốn đổi sang Firefox chỉ cần `new FirefoxDriver()`, phần code còn lại giữ nguyên.
- Selenium 4 tự tải driver phù hợp với phiên bản Chrome (nhờ **Selenium Manager**), bạn không cần cài gì thêm.
- **`driver.quit()`** phải luôn được gọi, kể cả khi test bị lỗi giữa chừng. Vì vậy ta đặt nó trong `finally`. Quên `quit()` thì máy sẽ đầy những cửa sổ Chrome "mồ côi".

## Trang web để luyện tập

Từ chương này, bạn sẽ test website mẫu **Tiệm Trà Mộc** tại `http://localhost:4000/practice/`. Bấm "Mở trang mẫu ↗" ở khung Trình duyệt để xem nó trong tab mới.

## Đến lượt bạn

1. Mở trang `http://localhost:4000/practice/login.html`
2. In ra tiêu đề của trang.

Khi bấm chạy, hãy nhìn tab **Trình duyệt** ở khung dưới bên phải: bạn sẽ thấy Chrome được code của bạn điều khiển trực tiếp! Lần chạy đầu có thể mất 10–20 giây để Chrome khởi động.
