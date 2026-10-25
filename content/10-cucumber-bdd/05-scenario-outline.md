---
title: "Scenario Outline: một khuôn, nhiều bộ dữ liệu"
type: code
mode: cucumber
minutes: 10
files:
  - name: features/dang_nhap.feature
    content: |
      Feature: Kiểm tra form đăng nhập

        Scenario: Đăng nhập thành công
          Given tôi đang ở trang đăng nhập
          When tôi đăng nhập với "lan" và "matkhau123"
          Then tôi thấy thông báo "Xin chào, Lan"

        Scenario: Bỏ trống tên đăng nhập
          Given tôi đang ở trang đăng nhập
          When tôi đăng nhập với "" và "matkhau123"
          Then tôi thấy thông báo "Vui lòng nhập tên đăng nhập"

        # ... và còn 3 Scenario nữa, gần như y hệt.
        # Hãy gộp tất cả thành MỘT Scenario Outline.
  - name: steps/LoginSteps.java
    readonly: true
    content: |
      package steps;

      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      // Giả lập đúng quy tắc của trang login.html (chưa mở trình duyệt).
      public class LoginSteps {
          private String message = "";

          @Given("tôi đang ở trang đăng nhập")
          public void openLoginPage() {
              message = "";
          }

          @When("tôi đăng nhập với {string} và {string}")
          public void login(String username, String password) {
              if (username.isBlank()) {
                  message = "Vui lòng nhập tên đăng nhập";
              } else if (password.isEmpty()) {
                  message = "Vui lòng nhập mật khẩu";
              } else if (!password.equals("matkhau123") || !(username.equals("lan") || username.equals("khoa"))) {
                  message = "Sai tên đăng nhập hoặc mật khẩu";
              } else if (username.equals("khoa")) {
                  message = "Tài khoản của bạn đã bị khóa";
              } else {
                  message = "Xin chào, Lan";
              }
          }

          @Then("tôi thấy thông báo {string}")
          public void seeMessage(String expected) {
              assertThat(message).isEqualTo(expected);
          }
      }
solution:
  features/dang_nhap.feature: |
    Feature: Kiểm tra form đăng nhập

      Scenario Outline: Đăng nhập với nhiều bộ dữ liệu
        Given tôi đang ở trang đăng nhập
        When tôi đăng nhập với "<username>" và "<password>"
        Then tôi thấy thông báo "<message>"

        Examples:
          | username | password   | message                         |
          | lan      | matkhau123 | Xin chào, Lan                   |
          |          | matkhau123 | Vui lòng nhập tên đăng nhập     |
          | lan      |            | Vui lòng nhập mật khẩu          |
          | lan      | sai123     | Sai tên đăng nhập hoặc mật khẩu |
          | khoa     | matkhau123 | Tài khoản của bạn đã bị khóa    |
tests:
  - text: 'Dùng `Scenario Outline` kèm bảng `Examples`'
    source: '^\s*Scenario Outline:[\s\S]*^\s*Examples:'
    file: features/dang_nhap.feature
  - text: 'Các bước dùng chỗ trống `<username>`, `<password>`, `<message>`'
    source: '"<username>"[\s\S]*"<password>"[\s\S]*"<message>"'
    file: features/dang_nhap.feature
  - text: 'Bảng `Examples` có dòng tiêu đề và ít nhất 5 dòng dữ liệu'
    source: 'Examples:[ \t]*\n(?:[ \t]*\|[^\n]*\|[ \t]*(?:\n|$)){6}'
    file: features/dang_nhap.feature
  - text: 'Không còn Scenario viết lặp lại: chỉ còn một Scenario Outline'
    notSource: '^\s*Scenario:'
    file: features/dang_nhap.feature
  - text: 'Cả 5 bộ dữ liệu đều pass (5 dòng xanh trong tab Kịch bản)'
    cucumber: { passed: 5 }
hints:
  - 'Đổi `Scenario:` thành `Scenario Outline:`, thay dữ liệu bằng chỗ trống có tên: `"<username>"`.'
  - 'Bên dưới các bước, thêm `Examples:` và một bảng. Dòng đầu là tên cột (trùng tên chỗ trống), mỗi dòng sau là một lần chạy. Ô để trống nghĩa là chuỗi rỗng.'
  - 'Năm dòng dữ liệu: `lan/matkhau123` → Xin chào, Lan; trống/matkhau123; lan/trống; lan/sai123; khoa/matkhau123 → Tài khoản của bạn đã bị khóa.'
---

Form đăng nhập của Tiệm Trà Mộc có ít nhất 5 trường hợp cần test. Viết 5 Scenario gần như giống hệt nhau, chỉ khác dữ liệu? Copy-paste như vậy rất khó bảo trì: mai đổi câu chữ một bước là phải sửa 5 chỗ.

**Scenario Outline** giải quyết việc này: viết **một khuôn** kịch bản với các **chỗ trống** `<tên>`, rồi liệt kê dữ liệu trong bảng **Examples**:

```gherkin
Scenario Outline: Đăng nhập với nhiều bộ dữ liệu
  Given tôi đang ở trang đăng nhập
  When tôi đăng nhập với "<username>" và "<password>"
  Then tôi thấy thông báo "<message>"

  Examples:
    | username | password   | message                     |
    | lan      | matkhau123 | Xin chào, Lan               |
    |          | matkhau123 | Vui lòng nhập tên đăng nhập |
```

- Dòng đầu của bảng là **tên cột**, phải trùng với tên trong `< >`.
- Mỗi dòng sau đó là **một lần chạy**: Cucumber thay `<username>` bằng giá trị trong ô, rồi chạy như một Scenario bình thường.
- Ô để trống thành chuỗi rỗng `""`, rất tiện để test "bỏ trống ô nhập".
- Các cột không cần thẳng hàng, nhưng căn thẳng thì dễ đọc hơn nhiều.

Step definition **không cần thay đổi gì**: với Java, mỗi dòng Examples chỉ là một Scenario có dữ liệu khác.

> Đây chính là **data-driven testing** (kiểm thử hướng dữ liệu), giống `@ParameterizedTest` của JUnit. Cái hay là bảng dữ liệu nằm ngay trong kịch bản, khách hàng nhìn vào là biết đã test những trường hợp nào, và tự thêm dòng nếu muốn.

## Đến lượt bạn

Gộp các Scenario trong `features/dang_nhap.feature` thành **một** `Scenario Outline` với bảng `Examples` gồm 5 dòng:

| username | password | message |
|---|---|---|
| `lan` | `matkhau123` | Xin chào, Lan |
| *(trống)* | `matkhau123` | Vui lòng nhập tên đăng nhập |
| `lan` | *(trống)* | Vui lòng nhập mật khẩu |
| `lan` | `sai123` | Sai tên đăng nhập hoặc mật khẩu |
| `khoa` | `matkhau123` | Tài khoản của bạn đã bị khóa |

Xóa các `Scenario:` cũ đi. Tab **Kịch bản** sẽ hiện 5 lần chạy của cùng một khuôn.
