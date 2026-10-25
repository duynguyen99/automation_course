---
title: "Kiểm tra nhanh: Page Object Model"
type: quiz
minutes: 5
questions:
  - q: "Lợi ích lớn nhất của Page Object Model là gì?"
    options:
      - "Test chạy nhanh hơn gấp đôi"
      - "Locator và thao tác của mỗi trang nằm một chỗ: giao diện đổi thì chỉ sửa một nơi, test dễ đọc hơn"
      - "Không cần dùng JUnit nữa"
    answer: 1
    explain: "POM giảm trùng lặp và giúp bảo trì dễ dàng. Tốc độ chạy thì gần như không đổi."
  - q: "Assertion (`assertThat(...)`) nên đặt ở đâu?"
    options:
      - "Trong Page Object"
      - "Trong test class"
      - "Trong BasePage"
    answer: 1
    explain: "Page Object chỉ thao tác và trả dữ liệu. Test mới quyết định đúng hay sai."
  - q: "Method `loginAs(\"lan\", \"matkhau123\")` của `LoginPage` nên trả về gì?"
    options:
      - "`void`"
      - "`AccountPage`, trang mà người dùng được đưa tới sau khi đăng nhập thành công"
      - "`boolean` cho biết đăng nhập thành công hay không"
    answer: 1
    explain: "Method dẫn sang trang khác thì trả về Page Object của trang đó, giúp viết test dạng chuỗi rất tự nhiên."
  - q: "Vì sao locator trong Page Object nên là `private final By`?"
    options:
      - "Vì test không cần biết cấu tạo của trang, và locator không thay đổi khi chạy"
      - "Vì Java bắt buộc"
      - "Vì `By` không thể là `public`"
    answer: 0
    explain: "Đóng gói: bên ngoài chỉ thấy hành động (`clickLogin`), không thấy chi tiết (`By.id(\"login-btn\")`)."
  - q: "`BasePage` chứa những gì?"
    options:
      - "Tất cả locator của mọi trang"
      - "Phần dùng chung cho mọi page: driver, `WebDriverWait`, các method click/type/text có chờ"
      - "Các `@Test` dùng chung"
    answer: 1
    explain: "Mỗi page `extends BasePage` để dùng lại các method chờ, không phải tự viết `wait.until` nữa."
  - q: "Muốn chạy cùng bộ test trên môi trường staging thay vì localhost, cách tốt nhất là?"
    options:
      - "Tìm và thay địa chỉ trong mọi Page Object"
      - "Đổi giá trị `baseUrl` trong file cấu hình"
      - "Copy cả dự án ra một thư mục mới"
    answer: 1
    explain: "Giá trị hay thay đổi (địa chỉ, thời gian chờ, trình duyệt) nên nằm trong file cấu hình."
  - q: "Trong `@CsvSource`, muốn truyền một chuỗi rỗng vào tham số thì viết thế nào?"
    options:
      - "Bỏ trống ô đó"
      - "`''` (hai dấu nháy đơn)"
      - "`null`"
    answer: 1
    explain: "Bỏ trống thì JUnit truyền `null`. `''` mới là chuỗi rỗng."
  - q: "Hạn chế chính của PageFactory / `@FindBy` là gì?"
    options:
      - "Không tự chờ phần tử sẵn sàng và khó dùng locator động"
      - "Không chạy được trên Chrome"
      - "Bắt buộc phải dùng XPath"
    answer: 0
    explain: "Vì vậy các team hiện đại chọn `By` + explicit wait trong `BasePage`."
---

Tám câu hỏi về cách tổ chức framework. Đây cũng là những câu rất hay gặp trong phỏng vấn Automation Tester, nên hãy đọc kỹ phần giải thích của từng câu nhé!
