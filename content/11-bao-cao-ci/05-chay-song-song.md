---
title: "Chạy song song: 4 trình duyệt cùng lúc"
type: read
minutes: 9
---

Bộ test của bạn có 200 test, mỗi test mất 15 giây. Chạy lần lượt: **50 phút**. Nếu chạy 4 test cùng lúc trên 4 trình duyệt: khoảng **13 phút**. Giống như siêu thị mở 4 quầy thu ngân thay vì 1.

Đó là **chạy song song** (*parallel execution*). Nghe thì đơn giản, nhưng có một cái bẫy lớn mà bạn phải hiểu.

## Bật song song trong JUnit

Tạo file `src/test/resources/junit-platform.properties`:

```text
junit.jupiter.execution.parallel.enabled = true
junit.jupiter.execution.parallel.mode.default = concurrent
junit.jupiter.execution.parallel.config.strategy = fixed
junit.jupiter.execution.parallel.config.fixed.parallelism = 4
```

| Dòng | Ý nghĩa |
|---|---|
| `parallel.enabled = true` | Cho phép chạy song song |
| `mode.default = concurrent` | Các test **trong cùng class** được chạy cùng lúc (mặc định là `same_thread`, tức lần lượt) |
| `strategy = fixed` + `parallelism = 4` | Dùng đúng 4 luồng (*thread*) |

> Còn một dòng nữa là `junit.jupiter.execution.parallel.mode.classes.default`, quyết định các **class** khác nhau có chạy cùng lúc không. Muốn an toàn hơn khi mới bắt đầu: để các class chạy song song, còn test trong một class chạy lần lượt.

Với Cucumber, dòng tương ứng là `cucumber.execution.parallel.enabled = true`.

## Cái bẫy: dùng chung `WebDriver`

Giả sử `BaseTest` của bạn viết thế này:

```java
public class BaseTest {
    protected static WebDriver driver;   // ⚠ static: MỌI test dùng chung MỘT biến
}
```

Khi chạy lần lượt thì không sao. Khi 4 test chạy cùng lúc: test A mở trình duyệt, gán vào `driver`; một phần giây sau test B cũng gán trình duyệt **của nó** vào cùng biến `driver`. Giờ test A đang điều khiển trình duyệt của B! Kết quả là những lỗi ngẫu nhiên, lúc pass lúc fail, rất khó tìm.

Quy tắc vàng: **mỗi test (mỗi luồng) phải có trình duyệt riêng**.

## Giải pháp: `ThreadLocal<WebDriver>`

**`ThreadLocal`** là một "chiếc tủ có nhiều ngăn", mỗi luồng chỉ thấy **ngăn của chính mình**. Cùng gọi `get()`, nhưng mỗi luồng nhận về object riêng.

```java
public class DriverManager {
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    public static void start() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new", "--window-size=1280,800");
        DRIVER.set(new ChromeDriver(options));     // cất vào ngăn của luồng hiện tại
    }

    public static WebDriver get() {
        return DRIVER.get();                        // lấy từ ngăn của luồng hiện tại
    }

    public static void quit() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            driver.quit();
            DRIVER.remove();                        // dọn ngăn tủ, tránh rò bộ nhớ
        }
    }
}
```

`BaseTest` gọi `DriverManager.start()` trong `@BeforeEach`, `DriverManager.quit()` trong `@AfterEach`, còn page object nhận `DriverManager.get()`.

> **Tin vui cho Cucumber:** nếu bạn đã làm đúng như chương trước (driver nằm trong `TestContext`, PicoContainer tạo `TestContext` mới cho **mỗi Scenario**), thì mỗi Scenario vốn đã có trình duyệt riêng. Chỉ cần đừng dùng biến `static` cho driver.

## Những thứ khác cũng phải "riêng"

Song song không chỉ đụng tới trình duyệt:

- **Dữ liệu test**: hai test cùng đăng nhập tài khoản `lan` rồi cùng xóa giỏ hàng sẽ giẫm chân nhau. Mỗi test nên dùng dữ liệu riêng (ví dụ email `test+<thời gian>@tramoc.vn`).
- **Thứ tự**: đừng viết test B phụ thuộc vào kết quả test A. Chạy song song thì không ai đảm bảo A chạy trước.
- **Tài nguyên máy**: mỗi Chrome tốn vài trăm MB RAM. Máy CI 2 nhân thì để 2–4 luồng là hợp lý.

## Ghi nhớ

- Song song giúp giảm thời gian chạy đáng kể, bật bằng `junit-platform.properties`.
- **Không bao giờ** dùng `static WebDriver` khi chạy song song. Dùng `ThreadLocal<WebDriver>` (JUnit/TestNG) hoặc context theo Scenario (Cucumber + PicoContainer).
- Test phải **độc lập**: dữ liệu riêng, không phụ thuộc thứ tự.
