---
title: "Tags và runner class: chọn kịch bản nào để chạy"
type: read
minutes: 8
---

Dự án thật có thể có 500 Scenario, chạy hết mất cả tiếng. Nhưng sáng nay dev vừa sửa trang đăng nhập và chỉ muốn biết "các chức năng chính còn sống không?" trong 5 phút. Làm sao chọn chạy **một phần**?

## Tags: dán nhãn cho kịch bản

**Tag** là một nhãn bắt đầu bằng `@`, đặt ngay trên `Feature`, `Scenario`, `Scenario Outline` hay `Examples`:

```gherkin
@dang-nhap
Feature: Đăng nhập

  @smoke
  Scenario: Đăng nhập thành công
    ...

  @regression
  Scenario: Tài khoản bị khóa
    ...

  @wip
  Scenario: Đăng nhập bằng Google
    ...
```

- Tag đặt trên `Feature` được **mọi** Scenario trong file thừa hưởng.
- Một Scenario có thể có nhiều tag: `@smoke @thanh-toan`.

Vài tag phổ biến ở các công ty:

| Tag | Ý nghĩa |
|---|---|
| `@smoke` | Bộ test nhanh, kiểm tra chức năng sống còn. Chạy sau mỗi lần deploy |
| `@regression` | Bộ test đầy đủ, thường chạy hằng đêm |
| `@wip` | *Work in progress*: đang viết dở, chưa muốn chạy |
| `@bug-1234` | Liên quan tới bug số 1234 trên Jira |

## Biểu thức tag

Cucumber hiểu các biểu thức với `and`, `or`, `not` và dấu ngoặc:

| Biểu thức | Chạy những Scenario... |
|---|---|
| `@smoke` | có tag `@smoke` |
| `@smoke or @regression` | có ít nhất một trong hai tag |
| `@dang-nhap and not @wip` | thuộc nhóm đăng nhập, trừ cái đang viết dở |
| `(@smoke or @regression) and not @wip` | kết hợp |

Khi chạy bằng Maven, bạn truyền biểu thức qua dòng lệnh:

```text
mvn test -Dcucumber.filter.tags="@smoke and not @wip"
```

## Runner class

Trong sách, hệ thống tự tìm file `.feature` và chạy giúp bạn. Trong dự án Maven thật, bạn viết một **runner class**: một class rỗng, chỉ chứa annotation để "cấu hình" cho JUnit Platform biết chạy Cucumber thế nào.

```java
package runners;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.IncludeTags;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@IncludeTags("smoke")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "steps")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME,
        value = "pretty, html:target/cucumber-report.html")
public class RunSmokeTest {
}
```

Đọc từng dòng:

| Annotation | Ý nghĩa |
|---|---|
| `@Suite` | Đây là một bộ test của JUnit Platform (cần dependency `junit-platform-suite`) |
| `@IncludeEngines("cucumber")` | Dùng engine Cucumber để chạy |
| `@SelectClasspathResource("features")` | Tìm file `.feature` trong thư mục `src/test/resources/features` |
| `@IncludeTags("smoke")` | Chỉ chạy Scenario có tag `@smoke`. Lưu ý: ở đây viết **không có** dấu `@` |
| `GLUE_PROPERTY_NAME` = `"steps"` | Package chứa step definition và hook (**glue** = "keo dán" nối Gherkin với Java) |
| `PLUGIN_PROPERTY_NAME` | Plugin báo cáo: `pretty` in đẹp ra console, `html:...` xuất báo cáo HTML |

Muốn dùng biểu thức tag đầy đủ của Cucumber thay cho `@IncludeTags`, dùng thêm:

```java
@ConfigurationParameter(key = FILTER_TAGS_PROPERTY_NAME, value = "@smoke and not @wip")
```

Một dự án hay có **vài runner**: `RunSmokeTest`, `RunRegressionTest`... Mỗi runner là một "nút bấm" chạy một nhóm kịch bản.

> Các cấu hình trên cũng có thể đặt trong file `src/test/resources/junit-platform.properties`, ví dụ dòng `cucumber.glue=steps`. Khi đọc dự án của công ty, nếu runner class trống trơn, hãy mở file đó ra xem.

## Ghi nhớ

- Tag dùng để **phân nhóm** và **chọn chạy** kịch bản.
- `@smoke` chạy nhanh và thường xuyên; `@regression` đầy đủ và chạy ít hơn.
- Runner class = `@Suite` + `@IncludeEngines("cucumber")` + nơi tìm feature + glue.
