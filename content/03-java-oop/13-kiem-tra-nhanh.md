---
title: "Kiểm tra nhanh: Hướng đối tượng"
type: quiz
minutes: 5
questions:
  - q: "Câu nào mô tả đúng quan hệ giữa class và object?"
    options:
      - "Class là một object đặc biệt"
      - "Class là bản thiết kế, object là thứ cụ thể được tạo ra từ bản thiết kế đó"
      - "Mỗi class chỉ tạo được đúng một object"
    answer: 1
    explain: "Một class (khuôn bánh) tạo được bao nhiêu object (chiếc bánh) cũng được."
  - q: "Đâu là constructor hợp lệ của class `Product`?"
    options:
      - "`public void Product(String name) { ... }`"
      - "`public String Product(String name) { ... }`"
      - "`public Product(String name) { ... }`"
    answer: 2
    explain: "Constructor trùng tên class và không có kiểu trả về, kể cả `void`."
  - q: 'Trong constructor có tham số `price`, dòng `price = price;` làm gì?'
    options:
      - "Gán tham số vào thuộc tính price của object"
      - "Không có tác dụng gì: tham số được gán cho chính nó"
      - "Báo lỗi biên dịch"
    answer: 1
    explain: "Phải viết `this.price = price;` thì thuộc tính mới nhận được giá trị."
  - q: "Vì sao nên để thuộc tính `price` là `private` và đổi giá qua `setPrice(...)`?"
    options:
      - "Để setter kiểm tra dữ liệu, chặn những giá trị sai như giá âm"
      - "Để chương trình chạy nhanh hơn"
      - "Vì Java bắt buộc mọi thuộc tính phải private"
    answer: 0
    explain: "Đó là đóng gói: giấu dữ liệu, chỉ mở ra những 'nút bấm' an toàn."
  - q: "Thuộc tính `static int count` trong class `TestCase` có đặc điểm gì?"
    options:
      - "Mỗi object TestCase có một count riêng"
      - "Cả class chỉ có một count, mọi object dùng chung"
      - "count không bao giờ thay đổi được"
    answer: 1
    explain: "`static` thuộc về class, giống tấm bảng tin chung ở sảnh ký túc xá."
  - q: '`public class LoginPage extends BasePage` nghĩa là gì?'
    options:
      - "LoginPage thừa hưởng thuộc tính và method của BasePage"
      - "BasePage thừa hưởng mọi thứ của LoginPage"
      - "LoginPage và BasePage là hai tên gọi của cùng một class"
    answer: 0
    explain: "LoginPage là class con, BasePage là class cha."
  - q: "Trong Selenium, `WebDriver driver = new ChromeDriver();` cho thấy điều gì?"
    options:
      - "WebDriver là class con của ChromeDriver"
      - "WebDriver là interface, ChromeDriver là một class implements nó"
      - "Dòng này sai vì kiểu hai bên không giống nhau"
    answer: 1
    explain: "Biến có kiểu interface có thể trỏ tới bất kỳ object nào implements interface đó."
  - q: "Điều nào ĐÚNG với abstract class?"
    options:
      - "Có thể `new` trực tiếp như class thường"
      - "Chỉ được chứa method abstract"
      - "Có thể chứa cả method viết sẵn lẫn method abstract, và không thể `new` trực tiếp"
    answer: 2
    explain: "Abstract class là khung sườn có sẵn một nửa, con điền nốt phần còn thiếu."
  - q: '`Browser[] ds = { new ChromeBrowser(), new FirefoxBrowser() };` rồi gọi `ds[1].open("a.html")`. Method `open` của ai chạy?'
    options:
      - "Của interface Browser"
      - "Của ChromeBrowser"
      - "Của FirefoxBrowser"
    answer: 2
    explain: "Đa hình: object thật ở vị trí 1 là FirefoxBrowser, nên open() của nó chạy."
---

Chín câu hỏi tổng kết chương Java hướng đối tượng. Đây là những khái niệm mà phỏng vấn automation tester **gần như chắc chắn** sẽ hỏi, nên hãy đọc kỹ phần giải thích sau mỗi câu nhé.
