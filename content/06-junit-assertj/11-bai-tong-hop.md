---
title: "Bài tổng hợp: Bộ test cho LoginValidator"
type: code
mode: junit
minutes: 20
files:
  - name: LoginValidator.java
    readonly: true
    content: |
      public class LoginValidator {
          // Quy tắc của trang Đăng nhập, Tiệm Trà Mộc:
          //   - Tên đăng nhập trống (hoặc chỉ có dấu cách) → "Vui lòng nhập tên đăng nhập"
          //   - Mật khẩu trống                           → "Vui lòng nhập mật khẩu"
          //   - Sai tên hoặc mật khẩu                    → "Sai tên đăng nhập hoặc mật khẩu"
          //   - Tài khoản "khoa" (đúng mật khẩu)          → "Tài khoản của bạn đã bị khóa"
          //   - Tài khoản "lan" / "matkhau123"           → "OK"
          public String validate(String username, String password) {
              if (username == null || username.isBlank()) {
                  return "Vui lòng nhập tên đăng nhập";
              }
              if (password == null || password.isEmpty()) {
                  return "Vui lòng nhập mật khẩu";
              }
              String user = username.trim();
              boolean knownUser = user.equals("lan") || user.equals("khoa");
              if (!knownUser || !password.equals("matkhau123")) {
                  return "Sai tên đăng nhập hoặc mật khẩu";
              }
              if (user.equals("khoa")) {
                  return "Tài khoản của bạn đã bị khóa";
              }
              return "OK";
          }

          // Đăng nhập: trả về lời chào, hoặc ném IllegalArgumentException kèm thông báo lỗi
          public String login(String username, String password) {
              String result = validate(username, password);
              if (!result.equals("OK")) {
                  throw new IllegalArgumentException(result);
              }
              String user = username.trim();
              return "Xin chào, " + Character.toUpperCase(user.charAt(0)) + user.substring(1);
          }
      }
  - name: LoginValidatorTest.java
    content: |
      import org.junit.jupiter.api.*;
      import org.junit.jupiter.params.ParameterizedTest;
      import org.junit.jupiter.params.provider.CsvSource;
      import static org.assertj.core.api.Assertions.*;

      class LoginValidatorTest {
          LoginValidator validator;

          // Viết bộ test của bạn ở đây

      }
solution:
  LoginValidatorTest.java: |
    import org.junit.jupiter.api.*;
    import org.junit.jupiter.params.ParameterizedTest;
    import org.junit.jupiter.params.provider.CsvSource;
    import static org.assertj.core.api.Assertions.*;

    @DisplayName("Đăng nhập")
    class LoginValidatorTest {
        LoginValidator validator;

        @BeforeEach
        void setUp() {
            validator = new LoginValidator();
        }

        @Test
        @DisplayName("Tài khoản lan với mật khẩu đúng được chấp nhận")
        void validLogin_returnsOk() {
            assertThat(validator.validate("lan", "matkhau123")).isEqualTo("OK");
        }

        @ParameterizedTest(name = "[{index}] \"{0}\" / \"{1}\" → {2}")
        @CsvSource({
            "'', matkhau123, Vui lòng nhập tên đăng nhập",
            "'   ', matkhau123, Vui lòng nhập tên đăng nhập",
            "lan, '', Vui lòng nhập mật khẩu",
            "lan, sai123, Sai tên đăng nhập hoặc mật khẩu",
            "minh, matkhau123, Sai tên đăng nhập hoặc mật khẩu",
            "khoa, matkhau123, Tài khoản của bạn đã bị khóa"
        })
        @DisplayName("Dữ liệu không hợp lệ hiện đúng thông báo lỗi")
        void invalidLogin_showsErrorMessage(String username, String password, String expectedMessage) {
            assertThat(validator.validate(username, password)).isEqualTo(expectedMessage);
        }

        @Test
        @DisplayName("Đăng nhập thành công hiện lời chào")
        void login_returnsGreeting() {
            assertThat(validator.login("lan", "matkhau123")).isEqualTo("Xin chào, Lan");
        }

        @Test
        @DisplayName("Đăng nhập sai mật khẩu ném exception kèm thông báo")
        void loginWithWrongPassword_throws() {
            assertThatThrownBy(() -> validator.login("lan", "sai123"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Sai tên đăng nhập hoặc mật khẩu");
        }
    }
tests:
  - text: 'Có `@BeforeEach` tạo `validator = new LoginValidator()`'
    source: '@BeforeEach\s+(public\s+)?void\s+\w+\s*\(\s*\)\s*\{[^}]*validator\s*=\s*new\s+LoginValidator\(\s*\)'
    file: LoginValidatorTest.java
  - text: '`validLogin_returnsOk` pass: `lan` / `matkhau123` → `"OK"`'
    junit: { name: validLogin_returnsOk }
  - text: 'Có `@ParameterizedTest` với `@CsvSource` có đủ 4 thông báo lỗi'
    source: '^(?=[\s\S]*@ParameterizedTest)(?=[\s\S]*@CsvSource)(?=[\s\S]*Vui lòng nhập tên đăng nhập)(?=[\s\S]*Vui lòng nhập mật khẩu)(?=[\s\S]*Sai tên đăng nhập hoặc mật khẩu)(?=[\s\S]*Tài khoản của bạn đã bị khóa)'
    file: LoginValidatorTest.java
  - text: '`login_returnsGreeting` pass: `login("lan", "matkhau123")` → `"Xin chào, Lan"`'
    junit: { name: login_returnsGreeting }
  - text: '`loginWithWrongPassword_throws` pass'
    junit: { name: loginWithWrongPassword_throws }
  - text: '`loginWithWrongPassword_throws` dùng `assertThatThrownBy` gọi `login(...)`'
    source: 'void\s+loginWithWrongPassword_throws[\s\S]*?assertThatThrownBy\([\s\S]*?\.login\('
    file: LoginValidatorTest.java
  - text: 'Phần kiểm tra exception có `isInstanceOf(IllegalArgumentException.class)` và `hasMessage(...)`'
    source: 'assertThatThrownBy\([\s\S]*?isInstanceOf\(\s*IllegalArgumentException\.class\s*\)[\s\S]*?hasMessage(Containing)?\('
    file: LoginValidatorTest.java
  - text: 'Có `@DisplayName` cho class và cho các test'
    source: '^(?=[\s\S]*@DisplayName\(\s*"[^"]+"\s*\)\s*(public\s+)?class\s+LoginValidatorTest)(?=(?:[\s\S]*?@DisplayName\(\s*"[^"]+"\s*\)){4})'
    file: LoginValidatorTest.java
  - text: 'Ít nhất 8 test pass (tính cả từng dòng dữ liệu), không test nào fail'
    junit: { passed: 8, failed: 0 }
hints:
  - 'Bắt đầu từ khung: `@BeforeEach`, rồi từng `@Test` một. Chạy sau mỗi test để chắc nó xanh.'
  - 'Dòng dữ liệu với tên đăng nhập rỗng: `"'''', matkhau123, Vui lòng nhập tên đăng nhập"`. Tham số thứ ba là thông báo mong đợi.'
  - 'Test exception: `assertThatThrownBy(() -> validator.login("lan", "sai123")).isInstanceOf(IllegalArgumentException.class).hasMessage("Sai tên đăng nhập hoặc mật khẩu");`'
---

Đây là bài kiểm tra "tốt nghiệp" chương JUnit. `LoginValidator` là phần logic đứng sau trang **Đăng nhập** của Tiệm Trà Mộc, với đúng các tài khoản và thông báo lỗi mà bạn sẽ gặp lại khi test bằng Selenium ở chương 8. Nhiệm vụ của bạn: viết một **bộ test hoàn chỉnh**, như khi được giao một tính năng ở công ty.

## Trước khi viết code: liệt kê test case

Tester giỏi luôn nghĩ test case **trước**, code sau. Đọc quy tắc trong `LoginValidator.java`, ta có:

| # | Tên đăng nhập | Mật khẩu | Mong đợi |
|---|---|---|---|
| 1 | `lan` | `matkhau123` | `OK` |
| 2 | (rỗng) | `matkhau123` | Vui lòng nhập tên đăng nhập |
| 3 | `lan` | (rỗng) | Vui lòng nhập mật khẩu |
| 4 | `lan` | `sai123` | Sai tên đăng nhập hoặc mật khẩu |
| 5 | `khoa` | `matkhau123` | Tài khoản của bạn đã bị khóa |

Bạn còn nghĩ thêm được trường hợp nào không? Tên đăng nhập chỉ toàn dấu cách? Một tài khoản không tồn tại?

## Đến lượt bạn

Viết trong `LoginValidatorTest`:

1. **`@BeforeEach`**: gán `validator = new LoginValidator();`
2. **`validLogin_returnsOk`** (`@Test`): `validate("lan", "matkhau123")` bằng `"OK"`.
3. **Một `@ParameterizedTest` với `@CsvSource`** (đặt tên tùy bạn, ví dụ `invalidLogin_showsErrorMessage(String username, String password, String expectedMessage)`), có **ít nhất 5 dòng** dữ liệu và chứa **đủ 4** thông báo lỗi: tên trống, mật khẩu trống, sai mật khẩu, tài khoản bị khóa.
4. **`login_returnsGreeting`** (`@Test`): `login("lan", "matkhau123")` bằng `"Xin chào, Lan"`.
5. **`loginWithWrongPassword_throws`** (`@Test`): dùng `assertThatThrownBy` kiểm tra `login("lan", "sai123")` ném `IllegalArgumentException` với message `"Sai tên đăng nhập hoặc mật khẩu"`.
6. **`@DisplayName`** tiếng Việt cho class và cho các test.

Tổng cộng phải có **ít nhất 8** lần chạy pass (mỗi dòng `@CsvSource` tính là một), không test nào fail.

> Làm xong, hãy chép bộ test này vào project `tramoc-autotest` trên máy bạn (nhớ thêm dòng `package`), chạy `mvn clean test` và commit lên GitHub. Đó là sản phẩm đầu tiên trong hồ sơ của bạn!
