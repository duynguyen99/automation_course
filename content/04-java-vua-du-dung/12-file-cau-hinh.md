---
title: "File cấu hình: không viết cứng vào code"
type: code
minutes: 9
files:
  - name: config.properties
    content: |
      # Cau hinh chay test
      browser=chrome
      baseUrl=http://localhost:4000/practice/
      timeout=10
  - name: Main.java
    content: |
      import java.io.FileInputStream;
      import java.io.IOException;
      import java.util.Properties;

      public class Main {
          public static void main(String[] args) throws IOException {
              Properties config = docCauHinh("config.properties");
              System.out.println("Trình duyệt: " + config.getProperty("browser"));
              // In thêm 3 dòng theo đề bài

          }

          static Properties docCauHinh(String tenFile) throws IOException {
              Properties props = new Properties();
              // Mở file và nạp vào props

              return props;
          }
      }
solution:
  config.properties: |
    # Cau hinh chay test
    browser=chrome
    baseUrl=http://localhost:4000/practice/
    timeout=10
    username=lan
  Main.java: |
    import java.io.FileInputStream;
    import java.io.IOException;
    import java.util.Properties;

    public class Main {
        public static void main(String[] args) throws IOException {
            Properties config = docCauHinh("config.properties");
            System.out.println("Trình duyệt: " + config.getProperty("browser"));
            System.out.println("Trang chủ: " + config.getProperty("baseUrl"));
            int timeout = Integer.parseInt(config.getProperty("timeout"));
            System.out.println("Timeout: " + timeout * 1000 + " ms");
            System.out.println("Tài khoản: " + config.getProperty("username"));
        }

        static Properties docCauHinh(String tenFile) throws IOException {
            Properties props = new Properties();
            try (FileInputStream in = new FileInputStream(tenFile)) {
                props.load(in);
            }
            return props;
        }
    }
checks: |
  eq("load", () -> ((java.util.Properties) call("docCauHinh", "config.properties")).getProperty("browser"), "chrome", "docCauHinh(\"config.properties\").getProperty(\"browser\")");
  eq("user", () -> ((java.util.Properties) call("docCauHinh", "config.properties")).getProperty("username"), "lan", "getProperty(\"username\") (đã thêm vào config.properties chưa?)");
  throwsEx("missing", () -> call("docCauHinh", "khong-co-file-nay.properties"), "IOException", "docCauHinh(\"khong-co-file-nay.properties\")");
tests:
  - text: '`docCauHinh` nạp được file: `browser` là `chrome`'
    java: load
  - text: 'Đã thêm dòng `username=lan` vào `config.properties`'
    java: user
  - text: 'File không tồn tại thì báo lỗi (`IOException`), không lặng lẽ trả về cấu hình rỗng'
    java: missing
  - text: 'Đổi `timeout` thành số bằng `Integer.parseInt`'
    source: 'Integer\.parseInt\s*\('
    file: Main.java
  - text: 'Console in đúng 4 dòng theo đề'
    stdout: { equals: "Trình duyệt: chrome\nTrang chủ: http://localhost:4000/practice/\nTimeout: 10000 ms\nTài khoản: lan" }
hints:
  - 'Trong `docCauHinh`: `try (FileInputStream in = new FileInputStream(tenFile)) { props.load(in); }`'
  - '`getProperty` luôn trả về String. Đổi sang số: `int timeout = Integer.parseInt(config.getProperty("timeout"));` rồi in `timeout * 1000`.'
  - 'Thêm vào cuối `config.properties` một dòng mới: `username=lan`'
---

Giả sử địa chỉ website `http://localhost:4000/practice/` được viết thẳng trong 50 file test. Tuần sau, công ty muốn chạy cùng bộ test đó trên máy chủ staging với địa chỉ khác. Bạn sẽ phải sửa 50 chỗ, và chắc chắn sót vài chỗ.

Giải pháp: gom mọi thứ **có thể thay đổi** (trình duyệt, địa chỉ web, thời gian chờ, tài khoản test) vào **một file cấu hình** nằm ngoài code.

## File `.properties`

```ini
# Dòng bắt đầu bằng # là chú thích
browser=chrome
baseUrl=http://localhost:4000/practice/
timeout=10
```

Mỗi dòng là một cặp `khóa=giá trị`. Rất giống `HashMap<String, String>`, chỉ khác là nằm trong file.

## Đọc file bằng `Properties`

```java
Properties props = new Properties();
try (FileInputStream in = new FileInputStream("config.properties")) {
    props.load(in);
}
String browser = props.getProperty("browser");          // "chrome"
String env = props.getProperty("env", "dev");           // không có khóa env thì lấy "dev"
```

- `FileInputStream`: mở file để đọc.
- `props.load(in)`: đọc toàn bộ các cặp `khóa=giá trị` trong file.
- `getProperty(khóa)`: lấy giá trị, **luôn là String**, không có thì trả về `null`. Bản hai tham số cho phép đưa giá trị mặc định.

### `try (...)` có ngoặc tròn là gì?

Đây là **try-with-resources**: thứ được mở trong ngoặc tròn (ở đây là file) sẽ được Java **tự động đóng** khi khối `try` kết thúc, dù có lỗi hay không. Giống hệt `finally { in.close(); }` nhưng Java viết hộ bạn.

### Vì sao có `throws IOException`?

Đọc file có thể thất bại: file không tồn tại, không có quyền đọc... Đây là exception nhóm **checked**, Java **bắt buộc** bạn phải xử lý. Viết `throws IOException` ở phần đầu method nghĩa là: *"method này có thể ném IOException, người gọi tự lo"*. Vì `main` gọi `docCauHinh`, `main` cũng khai báo `throws IOException`.

> File `.properties` nên chỉ chứa ký tự không dấu. `props.load(...)` với `FileInputStream` đọc theo bảng mã cũ (ISO-8859-1), nên chữ tiếng Việt có dấu sẽ bị lỗi font. Khóa và giá trị cấu hình thường không cần dấu nên chuyện này hiếm khi là vấn đề.

## Trong dự án thật

Ở chương Selenium và POM, bạn sẽ đọc `browser` từ file này để quyết định `new ChromeDriver()` hay `new FirefoxDriver()` (nhớ trang Đa hình chứ?), đọc `baseUrl` để mở trang, và đọc `timeout` cho các lệnh chờ.

## Đến lượt bạn

1. Thêm vào **cuối** `config.properties` dòng `username=lan`.
2. Hoàn thành `docCauHinh(tenFile)`: mở file bằng try-with-resources và `load` vào `props`.
3. Trong `main`, in thêm 3 dòng. `timeout` phải được đổi sang số bằng `Integer.parseInt` rồi nhân 1000 để ra mili giây:

```
Trình duyệt: chrome
Trang chủ: http://localhost:4000/practice/
Timeout: 10000 ms
Tài khoản: lan
```
