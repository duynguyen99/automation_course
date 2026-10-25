---
title: "Allure Report: báo cáo đẹp cho cả đội"
type: read
minutes: 10
---

**Allure Report** là công cụ mã nguồn mở biến kết quả test thành một trang web: biểu đồ tổng quan, danh sách test theo tính năng, từng bước đã chạy, ảnh chụp màn hình khi fail, thời gian chạy... Allure dùng được với JUnit, TestNG, Cucumber và cả các ngôn ngữ khác.

Allure hoạt động theo hai bước:

```text
1. Chạy test   →  thư viện Allure ghi kết quả vào thư mục allure-results (các file JSON)
2. Lệnh allure  →  đọc allure-results, tạo trang web báo cáo
```

## Bước 1: thêm Allure vào `pom.xml`

Với JUnit, thêm thư viện `allure-junit5`. Dùng **BOM** (*bill of materials*) để mọi gói Allure cùng một phiên bản:

```xml
<properties>
  <!-- Xem số phiên bản mới nhất trên Maven Central hoặc allurereport.org -->
  <allure.version>2.x.y</allure.version>
</properties>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>io.qameta.allure</groupId>
      <artifactId>allure-bom</artifactId>
      <version>${allure.version}</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-junit5</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

Với **Cucumber**, Allure có gói plugin riêng theo phiên bản Cucumber (ví dụ `allure-cucumber7-jvm` cho Cucumber 7), được bật qua cấu hình `cucumber.plugin`. Tên gói và tên class plugin thay đổi theo phiên bản, nên hãy mở tài liệu chính thức tại **allurereport.org** và chọn đúng gói cho Cucumber dự án bạn đang dùng.

Để kết quả nằm gọn trong `target`, tạo file `src/test/resources/allure.properties`:

```text
allure.results.directory=target/allure-results
```

## Bước 2: làm báo cáo dễ đọc hơn bằng annotation

```java
import io.qameta.allure.Description;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Step;

@Feature("Đăng nhập")
class LoginTest extends BaseTest {

    @Test
    @Description("Khách hàng đăng nhập bằng tài khoản hợp lệ và thấy lời chào")
    @Severity(SeverityLevel.CRITICAL)
    void loginSuccess() {
        LoginPage loginPage = new LoginPage(driver).open();
        loginPage.loginAs("lan", "matkhau123");
        assertThat(new AccountPage(driver).getWelcomeText()).isEqualTo("Xin chào, Lan");
    }
}
```

Và trong page object:

```java
@Step("Đăng nhập với tài khoản {username}")
public void loginAs(String username, String password) {
    type(usernameInput, username);
    type(passwordInput, password);
    click(loginButton);
}
```

| Annotation | Hiện trong báo cáo |
|---|---|
| `@Description` | Đoạn mô tả test bằng lời |
| `@Feature`, `@Story` | Nhóm test theo tính năng ở tab *Behaviors* |
| `@Severity` | Mức độ nghiêm trọng: `BLOCKER`, `CRITICAL`, `NORMAL`, `MINOR`, `TRIVIAL` |
| `@Step("...")` | Mỗi lần method được gọi là một bước trong báo cáo; `{username}` được thay bằng giá trị tham số |

> `@Step` và `@Attachment` cần **AspectJ** "chen" vào code lúc chạy: phải cấu hình `aspectjweaver` làm `-javaagent` trong plugin `maven-surefire-plugin` (tài liệu Allure có đoạn cấu hình mẫu để copy). Nếu không muốn cấu hình AspectJ, dùng cách viết lambda: `Allure.step("Đăng nhập", () -> loginPage.loginAs("lan", "matkhau123"));`. Với Cucumber, mỗi bước Gherkin **tự động** là một step trong báo cáo.

## Đính kèm ảnh chụp màn hình khi test fail

Đây là tính năng developer thích nhất. Với Cucumber, làm trong hook `@After`, **trước khi** đóng trình duyệt:

```java
@After
public void tearDown(Scenario scenario) {
    WebDriver driver = context.getDriver();
    if (scenario.isFailed()) {
        byte[] png = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        scenario.attach(png, "image/png", "Màn hình lúc fail");
    }
    driver.quit();
}
```

`scenario.attach(...)` là API của Cucumber, nên ảnh xuất hiện cả trong báo cáo HTML của Cucumber lẫn Allure. Với JUnit, bạn gọi `Allure.addAttachment("Màn hình lúc fail", "image/png", new ByteArrayInputStream(png), "png");` trong một extension chạy ngay sau khi test fail. Trang sau bạn sẽ tự tay chụp màn hình bằng Selenium.

## Bước 3: xem báo cáo

Sau `mvn test`, cài **Allure command line** (xem hướng dẫn cài trên allurereport.org) rồi chạy:

```text
allure serve target/allure-results
```

Lệnh này tạo báo cáo và mở ngay trên trình duyệt. Muốn tạo file HTML để gửi cho người khác hoặc đưa lên CI:

```text
allure generate target/allure-results -o target/allure-report --clean
```

> Allure có thế hệ mới là **Allure 3** (cài qua npm), với lệnh và giao diện hơi khác. Các khái niệm (`allure-results`, step, attachment, severity) vẫn giữ nguyên, nên học Allure 2 hay 3 đều dùng được ngay.

## Ghi nhớ

- Allure = thư viện ghi `allure-results` khi chạy test + lệnh `allure` tạo trang báo cáo.
- `@Description`, `@Feature`, `@Severity`, `@Step` làm báo cáo dễ đọc cho cả người không biết code.
- Luôn **đính kèm ảnh chụp màn hình khi fail**, và làm việc đó **trước** `driver.quit()`.
