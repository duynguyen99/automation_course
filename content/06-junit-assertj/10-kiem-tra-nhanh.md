---
title: "Kiểm tra nhanh: JUnit & AssertJ"
type: quiz
minutes: 5
questions:
  - q: "Annotation nào đánh dấu một method là test để JUnit chạy?"
    options:
      - "`@Run`"
      - "`@Test`"
      - "`@Check`"
    answer: 1
    explain: "JUnit tự tìm và chạy mọi method có `@Test` (hoặc `@ParameterizedTest`)."
  - q: "Ba bước của một test theo khuôn mẫu AAA là gì?"
    options:
      - "Arrange, Act, Assert"
      - "Add, Apply, Accept"
      - "Assert, Act, Arrange"
    answer: 0
    explain: "Chuẩn bị dữ liệu, thực hiện hành động, rồi kiểm tra kết quả."
  - q: 'Muốn kiểm tra danh sách sau khi sắp xếp có **đúng** 3 tên **theo đúng thứ tự**, dùng assertion nào?'
    options:
      - "`contains(a, b, c)`"
      - "`containsExactly(a, b, c)`"
      - "`hasSize(3)`"
    answer: 1
    explain: "`contains` không quan tâm thứ tự và cho phép có thêm phần tử khác. `containsExactly` thì khắt khe cả hai."
  - q: "Quy định: đơn từ 500.000₫ được miễn phí ship. Giá trị nào **quan trọng nhất** để thêm vào test?"
    options:
      - "100.000₫"
      - "500.000₫"
      - "5.000.000₫"
    answer: 1
    explain: "Phân tích giá trị biên: bug hay nằm đúng ở ngưỡng, nơi dev dễ nhầm `>` với `>=`."
  - q: "Test của bạn fail với `expected: 0 but was: 30000`, và bạn đã đối chiếu: test đúng với yêu cầu. Bạn nên làm gì?"
    options:
      - "Sửa test thành `isEqualTo(30000)` cho xanh"
      - "Xóa test đi"
      - "Báo bug cho dev, giữ nguyên test"
    answer: 2
    explain: "Test fail đúng chỗ là test đang làm tốt việc của nó. Mong đợi phải lấy từ yêu cầu, không lấy từ code."
  - q: "Mỗi test Selenium cần một trình duyệt mới và phải đóng trình duyệt kể cả khi test fail. Dùng cặp annotation nào?"
    options:
      - "`@BeforeEach` mở, `@AfterEach` đóng"
      - "`@BeforeAll` mở, `@Test` đóng"
      - "`@Disabled` mở, `@Tag` đóng"
    answer: 0
    explain: "`@AfterEach` luôn chạy sau mỗi test, dù test pass hay fail."
  - q: "Điều gì đúng về `@BeforeAll`?"
    options:
      - "Chạy trước mỗi test"
      - "Chạy một lần trước tất cả test trong class, và method phải là `static`"
      - "Chỉ chạy khi có test fail"
    answer: 1
    explain: "Dùng cho việc tốn kém chỉ cần làm một lần."
  - q: 'Trong `@CsvSource({"lan, matkhau123, OK", "'''', matkhau123, Vui lòng nhập tên đăng nhập"})`, test sẽ chạy mấy lần?'
    options:
      - "1 lần"
      - "2 lần"
      - "3 lần"
    answer: 1
    explain: "Mỗi chuỗi là một bộ dữ liệu, tức là một lần chạy. Ở dòng thứ hai, `''` là chuỗi rỗng."
  - q: "Cách nào kiểm tra đúng rằng `placeOrder(..., 0, ...)` ném `IllegalArgumentException`?"
    options:
      - "`assertThat(service.placeOrder(\"Trà\", 0, 3)).isInstanceOf(IllegalArgumentException.class)`"
      - "`assertThatThrownBy(() -> service.placeOrder(\"Trà\", 0, 3)).isInstanceOf(IllegalArgumentException.class)`"
      - "`assertThat(true).isFalse()`"
    answer: 1
    explain: "Phải đưa đoạn code vào lambda `() -> ...` để AssertJ tự chạy và bắt exception. Cách thứ nhất ném lỗi trước khi kịp kiểm tra."
  - q: "Một test đang fail vì bug đã biết, dev hẹn tuần sau sửa. Cách xử lý tốt nhất?"
    options:
      - "`@Disabled(\"Bug #42: ...\")`, và xóa nó khi bug được sửa"
      - "Xóa test"
      - "Để nguyên cho bộ test đỏ mỗi đêm"
    answer: 0
    explain: "Bộ test đỏ thường trực khiến team không còn để ý đến bug mới. Luôn ghi lý do trong @Disabled."
---

Mười câu hỏi trước bài tổng hợp. Mọi thứ ở đây bạn sẽ dùng lại nguyên vẹn khi viết test Selenium.
