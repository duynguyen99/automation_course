---
title: "Một test, nhiều bộ dữ liệu: @ParameterizedTest"
type: code
mode: junit
minutes: 10
files:
  - name: PhoneValidator.java
    readonly: true
    content: |
      public class PhoneValidator {
          // Số hợp lệ: đúng 10 chữ số và bắt đầu bằng 0 (giống ô Số điện thoại ở trang Thanh toán)
          public boolean isValid(String phone) {
              if (phone == null) {
                  return false;
              }
              return phone.matches("0\\d{9}");
          }
      }
  - name: PhoneValidatorTest.java
    content: |
      import org.junit.jupiter.params.ParameterizedTest;
      import org.junit.jupiter.params.provider.CsvSource;
      import static org.assertj.core.api.Assertions.assertThat;

      class PhoneValidatorTest {
          PhoneValidator validator = new PhoneValidator();

          @ParameterizedTest
          @CsvSource({
              "0912345678, true",
              // Thêm các dòng dữ liệu ở đây
          })
          void checkPhone(String phone, boolean expected) {
              assertThat(validator.isValid(phone)).isEqualTo(expected);
          }
      }
solution:
  PhoneValidatorTest.java: |
    import org.junit.jupiter.params.ParameterizedTest;
    import org.junit.jupiter.params.provider.CsvSource;
    import static org.assertj.core.api.Assertions.assertThat;

    class PhoneValidatorTest {
        PhoneValidator validator = new PhoneValidator();

        @ParameterizedTest(name = "[{index}] \"{0}\" hợp lệ? {1}")
        @CsvSource({
            "0912345678, true",
            "0387654321, true",
            "091234567, false",
            "09123456789, false",
            "1912345678, false",
            "09123abc78, false",
            "'', false"
        })
        void checkPhone(String phone, boolean expected) {
            assertThat(validator.isValid(phone)).isEqualTo(expected);
        }
    }
tests:
  - text: 'Có ít nhất 7 bộ dữ liệu và tất cả đều pass'
    junit: { passed: 7, failed: 0 }
  - text: 'Có số thiếu 1 chữ số `091234567` → `false`'
    source: '"091234567\s*,\s*false"'
  - text: 'Có số thừa 1 chữ số `09123456789` → `false`'
    source: '"09123456789\s*,\s*false"'
  - text: 'Có số không bắt đầu bằng 0 `1912345678` → `false`'
    source: '"1912345678\s*,\s*false"'
  - text: 'Có số chứa chữ cái `09123abc78` → `false`'
    source: '"09123abc78\s*,\s*false"'
  - text: 'Có chuỗi rỗng `''''` → `false`'
    source: '"''''\s*,\s*false"'
hints:
  - 'Mỗi bộ dữ liệu là một chuỗi trong ngoặc kép, các chuỗi cách nhau bằng dấu phẩy: `"091234567, false",`'
  - 'Chuỗi rỗng viết bằng hai dấu nháy đơn: `"'''', false"`'
---

Để kiểm tra ô **Số điện thoại** ở trang Thanh toán, một tester giỏi sẽ thử ít nhất: số đúng, số thiếu chữ số, số thừa chữ số, số không bắt đầu bằng 0, số có chữ cái, ô để trống... Viết mỗi trường hợp một method `@Test` thì 7 method gần như giống hệt nhau, chỉ khác dữ liệu. Copy-paste kiểu đó vừa dài vừa dễ sai.

## Data-driven testing

**Data-driven testing** (kiểm thử hướng dữ liệu) là viết logic test **một lần**, rồi cho nó chạy với **nhiều bộ dữ liệu**. JUnit hỗ trợ việc này bằng `@ParameterizedTest`:

```java
@ParameterizedTest
@CsvSource({
    "0912345678, true",
    "091234567, false"
})
void checkPhone(String phone, boolean expected) {
    assertThat(validator.isValid(phone)).isEqualTo(expected);
}
```

- **`@ParameterizedTest`** thay cho `@Test`: "test này chạy nhiều lần".
- **`@CsvSource`** chứa các bộ dữ liệu. Mỗi chuỗi là một dòng, các giá trị trong dòng ngăn cách bằng **dấu phẩy** (*CSV* = *Comma-Separated Values*, giống một bảng Excel).
- Giá trị thứ nhất đi vào tham số thứ nhất (`phone`), giá trị thứ hai vào tham số thứ hai (`expected`). JUnit tự đổi chữ `true` thành kiểu `boolean`, chữ `150000` thành `int`...

Mỗi dòng dữ liệu thành **một test riêng** trong báo cáo. Dòng nào sai thì chỉ dòng đó đỏ, các dòng khác vẫn chạy.

## Những chi tiết nhỏ cần nhớ

| Viết trong `@CsvSource` | JUnit hiểu là |
|---|---|
| `"lan, matkhau123"` | hai giá trị `"lan"` và `"matkhau123"` (khoảng trắng hai đầu bị bỏ) |
| `"'', false"` | chuỗi **rỗng** `""` và `false` |
| `", false"` | `null` và `false` (ô bỏ trống hoàn toàn là `null`) |
| `"'Hà Nội, Việt Nam', true"` | dấu nháy đơn bọc một giá trị **có chứa dấu phẩy** |

Muốn báo cáo dễ đọc, đặt tên cho từng lần chạy: `@ParameterizedTest(name = "[{index}] \"{0}\" hợp lệ? {1}")`, trong đó `{0}`, `{1}` là giá trị của từng tham số.

> Với Selenium, đây là cách test form đăng nhập với 10 cặp tài khoản/mật khẩu sai chỉ bằng **một** method. Nhà tuyển dụng rất thích nghe bạn nói về data-driven testing.

## Đến lượt bạn

Thêm vào `@CsvSource` để có **ít nhất 7** bộ dữ liệu, trong đó bắt buộc có:

| Số điện thoại | Mong đợi | Lý do |
|---|---|---|
| `0912345678` | `true` | đã có sẵn |
| một số đúng khác tùy bạn, ví dụ `0387654321` | `true` | |
| `091234567` | `false` | thiếu 1 chữ số |
| `09123456789` | `false` | thừa 1 chữ số |
| `1912345678` | `false` | không bắt đầu bằng 0 |
| `09123abc78` | `false` | có chữ cái |
| `''` (chuỗi rỗng) | `false` | ô để trống |

Mỗi dòng viết dạng `"091234567, false",`. Dòng cuối cùng không cần dấu phẩy phía sau (có cũng không sao).
