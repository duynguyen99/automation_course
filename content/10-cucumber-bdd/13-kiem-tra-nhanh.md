---
title: "Kiểm tra nhanh: Cucumber & BDD"
type: quiz
minutes: 6
questions:
  - q: "Mục tiêu chính của BDD là gì?"
    options:
      - "Viết test nhanh hơn bằng cách không cần code Java"
      - "Giúp business, developer và tester hiểu giống nhau về hành vi phần mềm qua các ví dụ cụ thể"
      - "Thay thế hoàn toàn việc test bằng tay"
    answer: 1
    explain: "BDD là cách làm việc để cả đội thống nhất yêu cầu. Cucumber chỉ là công cụ biến các ví dụ đó thành test tự động."
  - q: "Trong Gherkin, bước nào mô tả **hành động** của người dùng?"
    options:
      - "`Given`"
      - "`When`"
      - "`Then`"
    answer: 1
    explain: "`Given` là bối cảnh, `When` là hành động, `Then` là kết quả mong đợi."
  - q: 'Kịch bản có bước `When tôi mua 3 sản phẩm "Trà Sen Tây Hồ"`. Step definition nào khớp?'
    options:
      - '`@When("tôi mua {string} sản phẩm {int}")`'
      - '`@When("tôi mua {int} sản phẩm {string}")`'
      - '`@When("tôi mua 3 sản phẩm Trà Sen Tây Hồ")`'
    answer: 1
    explain: "`3` là số nguyên nên khớp `{int}`, chữ trong ngoặc kép khớp `{string}`, theo đúng thứ tự trong câu."
  - q: "Khác nhau giữa `Examples` (của Scenario Outline) và Data Table là gì?"
    options:
      - "Không khác nhau, chỉ là hai tên gọi"
      - "Mỗi dòng `Examples` là một lần chạy Scenario; Data Table là dữ liệu truyền cho **một** bước"
      - "Data Table chỉ dùng được với `Given`"
    answer: 1
    explain: "5 dòng `Examples` = 5 lần chạy. Một Data Table 5 dòng = một lần gọi method với `List` có 5 phần tử."
  - q: "Bạn muốn mọi Scenario trong file đều bắt đầu bằng bước đăng nhập. Dùng gì?"
    options:
      - "`Background`"
      - "`Scenario Outline`"
      - "Tag `@smoke`"
    answer: 0
    explain: "Các bước trong `Background` chạy trước mỗi Scenario của file đó."
  - q: "Có `@After(order = 1)` và `@After(order = 2)`. Hook nào chạy trước?"
    options:
      - "`order = 1`"
      - "`order = 2`"
      - "Ngẫu nhiên"
    answer: 1
    explain: "Với `@Before` số nhỏ chạy trước; với `@After` thì ngược lại, số lớn chạy trước, như xếp chồng bát."
  - q: "Nên đặt `driver.quit()` ở đâu trong dự án Cucumber?"
    options:
      - "Ở cuối step `Then` cuối cùng"
      - "Trong hook `@After`, vì nó luôn chạy kể cả khi Scenario fail"
      - "Không cần, Cucumber tự đóng trình duyệt"
    answer: 1
    explain: "Nếu đặt trong step `Then`, khi một bước trước đó fail thì step đó bị bỏ qua và trình duyệt không bao giờ được đóng."
  - q: "`LoginSteps` và `CartSteps` cần dùng chung một `WebDriver`. Cách làm đúng với PicoContainer?"
    options:
      - "Khai báo `public static WebDriver driver` trong `Hooks`"
      - "Cả hai class nhận cùng một `TestContext` qua constructor"
      - "Mỗi class tự `new ChromeDriver()`"
    answer: 1
    explain: "PicoContainer tạo một `TestContext` cho mỗi Scenario và tiêm cùng object đó vào mọi class cần nó (dependency injection)."
  - q: "Trong runner class, `@IncludeTags(\"smoke\")` làm gì?"
    options:
      - "Gắn tag `@smoke` cho mọi Scenario"
      - "Chỉ chạy các Scenario có tag `@smoke`"
      - "Bỏ qua các Scenario có tag `@smoke`"
    answer: 1
    explain: "Tag giúp chọn chạy một nhóm kịch bản. Lưu ý trong `@IncludeTags` viết tên tag không có dấu `@`."
  - q: "Step definition nào được viết đúng tinh thần Page Object Model?"
    options:
      - '`loginPage.loginAs(username, password);`'
      - '`driver.findElement(By.id("login-btn")).click();`'
      - '`new WebDriverWait(driver, Duration.ofSeconds(5)).until(...)`'
    answer: 0
    explain: "Step chỉ gọi page object và assert. Locator và wait được giấu trong page object."
---

Mười câu để ôn lại cả chương. Đừng lo nếu sai vài câu: đọc phần giải thích, quay lại trang tương ứng rồi thử lại.
