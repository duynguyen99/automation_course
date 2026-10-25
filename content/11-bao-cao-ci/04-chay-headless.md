---
title: "Chạy headless: trình duyệt không cần màn hình"
type: code
minutes: 8
practice: products.html
timeout: 90
seed: |
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.chrome.ChromeOptions;

  public class Main {
      public static void main(String[] args) {
          ChromeOptions options = new ChromeOptions();
          // 1. Thêm tham số chạy headless
          // 2. Đặt kích thước cửa sổ 1280x800

          WebDriver driver = new ChromeDriver(options);
          try {
              driver.get("http://localhost:4000/practice/products.html");
              System.out.println(driver.getTitle());
              // 3. In kích thước cửa sổ dạng: Kích thước: 1280x800

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.Dimension;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.chrome.ChromeDriver;
  import org.openqa.selenium.chrome.ChromeOptions;

  public class Main {
      public static void main(String[] args) {
          ChromeOptions options = new ChromeOptions();
          options.addArguments("--headless=new");
          options.addArguments("--window-size=1280,800");

          WebDriver driver = new ChromeDriver(options);
          try {
              driver.get("http://localhost:4000/practice/products.html");
              System.out.println(driver.getTitle());
              Dimension size = driver.manage().window().getSize();
              System.out.println("Kích thước: " + size.getWidth() + "x" + size.getHeight());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Thêm tham số `--headless=new` vào `ChromeOptions`'
    source: 'addArguments\([^)]*"--headless=new"'
  - text: 'Đặt kích thước cửa sổ bằng `--window-size=1280,800`'
    source: 'addArguments\([^)]*"--window-size=1280,800"'
  - text: 'Truyền `options` vào `new ChromeDriver(options)`'
    source: 'new ChromeDriver\(\s*options\s*\)'
  - text: 'Console in tiêu đề trang rồi `Kích thước: 1280x800`'
    stdout: { regex: '^Sản phẩm - Tiệm Trà Mộc\nKích thước: 1280x800$' }
hints:
  - '`options.addArguments("--headless=new");` và `options.addArguments("--window-size=1280,800");`'
  - 'Lấy kích thước: `Dimension size = driver.manage().window().getSize();` (nhớ `import org.openqa.selenium.Dimension;`).'
  - 'In: `System.out.println("Kích thước: " + size.getWidth() + "x" + size.getHeight());`'
---

Khi test chạy trên **máy chủ CI** (trang sau bạn sẽ gặp GitHub Actions), máy đó không có màn hình, không có ai ngồi nhìn. Chrome vẫn chạy được ở chế độ **headless** (*không đầu*): nó tải trang, chạy JavaScript, tính toán bố cục y như bình thường, chỉ là **không vẽ cửa sổ** ra màn hình.

Lợi ích:

- Chạy được trên máy chủ Linux không có giao diện đồ họa.
- Thường nhanh và nhẹ hơn một chút.
- Không "giật" cửa sổ lên làm phiền khi bạn đang làm việc khác.

## Bật headless bằng `ChromeOptions`

```java
ChromeOptions options = new ChromeOptions();
options.addArguments("--headless=new");
options.addArguments("--window-size=1280,800");

WebDriver driver = new ChromeDriver(options);
```

- **`--headless=new`** là chế độ headless thế hệ mới của Chrome, hoạt động gần như giống hệt Chrome có giao diện. (Bạn có thể thấy `--headless` không kèm `=new` trong code cũ.)
- **`--window-size=1280,800`**: rất quan trọng! Không có màn hình nên Chrome headless dùng kích thước mặc định khá nhỏ. Trang web có thể chuyển sang giao diện điện thoại, menu bị ẩn, và test fail một cách khó hiểu. Luôn đặt kích thước cố định.

> **Mẹo dự án thật:** đừng viết cứng headless trong code. Đọc từ cấu hình, ví dụ trong `BaseTest`:
> `if (Boolean.parseBoolean(System.getProperty("headless", "false"))) options.addArguments("--headless=new");`
> Khi viết test ở máy: chạy có giao diện để quan sát. Trên CI: `mvn test -Dheadless=true`.

## Còn tab Trình duyệt thì sao?

Bạn sẽ ngạc nhiên: dù Chrome chạy headless, tab **Trình duyệt** của sách **vẫn hiện hình**! Lý do là sách không "quay màn hình" máy bạn, mà xin Chrome gửi từng khung hình trang web qua giao thức DevTools (*screencast*). Chrome headless vẫn vẽ trang trong bộ nhớ, nên vẫn gửi được khung hình. Chỉ là không có cửa sổ Chrome nào bật lên trên màn hình của bạn.

## Đến lượt bạn

1. Thêm hai tham số `--headless=new` và `--window-size=1280,800` vào `options`.
2. Mở trang sản phẩm, in tiêu đề trang (đã có sẵn).
3. In kích thước cửa sổ đúng dạng `Kích thước: 1280x800`, dùng `driver.manage().window().getSize()`.
