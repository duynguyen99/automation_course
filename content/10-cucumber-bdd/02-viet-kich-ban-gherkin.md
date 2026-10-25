---
title: "Gherkin: viết kịch bản bằng lời"
type: code
mode: cucumber
minutes: 10
files:
  - name: features/dang_nhap.feature
    content: |
      Feature: Đăng nhập
        Là khách hàng của Tiệm Trà Mộc
        Tôi muốn đăng nhập vào tài khoản
        Để xem lại đơn hàng của mình

        # Viết 2 Scenario ở đây

  - name: steps/LoginSteps.java
    readonly: true
    content: |
      package steps;

      import io.cucumber.java.en.But;
      import io.cucumber.java.en.Given;
      import io.cucumber.java.en.Then;
      import io.cucumber.java.en.When;
      import static org.assertj.core.api.Assertions.assertThat;

      // Bài này chưa mở trình duyệt: ta "giả lập" form đăng nhập bằng Java
      // để tập trung vào việc viết Gherkin.
      public class LoginSteps {
          private String username = "";
          private String password = "";
          private String currentPage = "";
          private String message = "";

          @Given("tôi đang ở trang đăng nhập")
          public void openLoginPage() {
              currentPage = "login";
          }

          @When("tôi nhập tên đăng nhập {string}")
          public void enterUsername(String value) {
              username = value;
          }

          @When("tôi nhập mật khẩu {string}")
          public void enterPassword(String value) {
              password = value;
          }

          @When("tôi bấm nút Đăng nhập")
          public void clickLogin() {
              if (username.equals("lan") && password.equals("matkhau123")) {
                  currentPage = "account";
                  message = "Xin chào, Lan";
              } else {
                  message = "Sai tên đăng nhập hoặc mật khẩu";
              }
          }

          @Then("tôi thấy lời chào {string}")
          public void seeWelcome(String expected) {
              assertThat(currentPage).isEqualTo("account");
              assertThat(message).isEqualTo(expected);
          }

          @Then("tôi thấy thông báo lỗi {string}")
          public void seeError(String expected) {
              assertThat(message).isEqualTo(expected);
          }

          @But("tôi vẫn ở trang đăng nhập")
          public void stillOnLoginPage() {
              assertThat(currentPage).isEqualTo("login");
          }
      }
solution:
  features/dang_nhap.feature: |
    Feature: Đăng nhập
      Là khách hàng của Tiệm Trà Mộc
      Tôi muốn đăng nhập vào tài khoản
      Để xem lại đơn hàng của mình

      Scenario: Đăng nhập thành công
        Given tôi đang ở trang đăng nhập
        When tôi nhập tên đăng nhập "lan"
        And tôi nhập mật khẩu "matkhau123"
        And tôi bấm nút Đăng nhập
        Then tôi thấy lời chào "Xin chào, Lan"

      Scenario: Đăng nhập sai mật khẩu
        Given tôi đang ở trang đăng nhập
        When tôi nhập tên đăng nhập "lan"
        And tôi nhập mật khẩu "sai123"
        And tôi bấm nút Đăng nhập
        Then tôi thấy thông báo lỗi "Sai tên đăng nhập hoặc mật khẩu"
        But tôi vẫn ở trang đăng nhập
tests:
  - text: 'Scenario `Đăng nhập thành công` pass, có ít nhất 5 bước'
    cucumber: { scenario: "Đăng nhập thành công", steps: 5 }
  - text: 'Scenario `Đăng nhập sai mật khẩu` pass, có ít nhất 6 bước'
    cucumber: { scenario: "Đăng nhập sai mật khẩu", steps: 6 }
  - text: 'Dùng `And` để nối các bước cùng loại'
    source: '^\s*And\s'
    file: features/dang_nhap.feature
  - text: 'Dùng `But` cho bước "tôi vẫn ở trang đăng nhập"'
    source: '^\s*But\s+tôi vẫn ở trang đăng nhập'
    file: features/dang_nhap.feature
hints:
  - 'Mở tab `steps/LoginSteps.java` để xem có những câu nào. Câu trong file `.feature` phải giống **từng chữ**, chỉ khác phần trong ngoặc kép là dữ liệu bạn tự điền.'
  - 'Mỗi bước nằm trên một dòng, bắt đầu bằng từ khóa: `Given tôi đang ở trang đăng nhập`, rồi `When tôi nhập tên đăng nhập "lan"`, `And tôi nhập mật khẩu "matkhau123"`...'
  - 'Scenario thứ hai kết thúc bằng `Then tôi thấy thông báo lỗi "Sai tên đăng nhập hoặc mật khẩu"` và `But tôi vẫn ở trang đăng nhập`.'
---

Kịch bản Cucumber nằm trong file có đuôi **`.feature`**, viết bằng **Gherkin**. Gherkin chỉ có vài từ khóa, mỗi dòng một bước:

```gherkin
Feature: Đăng nhập
  Là khách hàng của Tiệm Trà Mộc
  Tôi muốn đăng nhập vào tài khoản
  Để xem lại đơn hàng của mình

  Scenario: Đăng nhập thành công
    Given tôi đang ở trang đăng nhập
    When tôi nhập tên đăng nhập "lan"
    And tôi nhập mật khẩu "matkhau123"
    And tôi bấm nút Đăng nhập
    Then tôi thấy lời chào "Xin chào, Lan"
```

| Từ khóa | Ý nghĩa | Giống phần nào trong test JUnit? |
|---|---|---|
| `Feature` | Tên tính năng, kèm vài dòng mô tả tự do | Tên class test |
| `Scenario` | Một tình huống cụ thể, tức là một test case | Một method `@Test` |
| `Given` | **Cho trước**: bối cảnh ban đầu | Arrange |
| `When` | **Khi**: hành động người dùng làm | Act |
| `Then` | **Thì**: kết quả mong đợi | Assert |
| `And`, `But` | **Và**, **Nhưng**: nối thêm bước cùng loại với bước phía trên | |

Vài quy tắc nhỏ:

- Ba dòng dưới `Feature` là mô tả tự do theo mẫu "Là... Tôi muốn... Để...". Cucumber không chạy chúng, chúng dành cho người đọc.
- Thụt lề bằng dấu cách cho dễ đọc. Dòng bắt đầu bằng `#` là chú thích.
- Chữ trong **ngoặc kép** là dữ liệu (tên đăng nhập, câu thông báo...). Trang sau bạn sẽ thấy Java nhận dữ liệu đó thế nào.
- Viết bước từ góc nhìn **người dùng** ("tôi bấm nút Đăng nhập"), không viết chi tiết kỹ thuật ("tôi click vào `#login-btn`"). Khách hàng phải đọc hiểu được!

> `And` và `But` không có nghĩa gì đặc biệt với máy, chúng chỉ giúp kịch bản đọc tự nhiên hơn. `But` thường dùng cho một kết quả "ngược chiều": *thấy lỗi*, **nhưng** *vẫn ở trang đăng nhập*.

## Đến lượt bạn

Lần này đề bài đảo ngược: **step definition (Java) đã có sẵn** trong tab `steps/LoginSteps.java` (chỉ đọc). Bạn viết file `features/dang_nhap.feature` với hai Scenario:

1. **`Đăng nhập thành công`**: ở trang đăng nhập, nhập tên `lan`, mật khẩu `matkhau123`, bấm nút Đăng nhập, thấy lời chào `"Xin chào, Lan"`.
2. **`Đăng nhập sai mật khẩu`**: như trên nhưng mật khẩu `sai123`; thấy thông báo lỗi `"Sai tên đăng nhập hoặc mật khẩu"`, **nhưng** vẫn ở trang đăng nhập (dùng `But`).

Dùng `And` cho các bước `When` liên tiếp. Sau khi chạy, mở tab **Kịch bản** để xem từng bước được tô màu.
