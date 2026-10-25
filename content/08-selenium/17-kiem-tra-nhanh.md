---
title: "Kiểm tra nhanh: Selenium WebDriver"
type: quiz
minutes: 6
questions:
  - q: "Khi bạn gọi `element.click()`, lệnh đi qua những chặng nào?"
    options:
      - "Code Java → Chrome, trực tiếp"
      - "Code Java → giao thức W3C WebDriver → chromedriver → Chrome"
      - "Code Java → Selenium Manager → Chrome"
    answer: 1
    explain: "Selenium Manager chỉ lo tải driver phù hợp. Lệnh thật đi qua giao thức W3C WebDriver tới chromedriver, rồi chromedriver điều khiển Chrome."
  - q: "`driver.findElements(By.id(\"khong-co\"))` khi không có phần tử nào khớp sẽ..."
    options:
      - "Ném `NoSuchElementException`"
      - "Trả về `null`"
      - "Trả về một list rỗng"
    answer: 2
    explain: "Chỉ `findElement` (số ít) mới ném exception. `findElements` trả về list rỗng."
  - q: "Thứ tự ưu tiên locator nên dùng là gì?"
    options:
      - "XPath → CSS → name → id"
      - "id → name → CSS → XPath"
      - "Luôn dùng XPath tuyệt đối cho chắc"
    answer: 1
    explain: "Locator càng đơn giản, càng nhanh và càng ít bị gãy khi giao diện thay đổi."
  - q: "Để chọn mục \"Giá giảm dần\" (value `price-desc`) trong dropdown `#sort`, cách nào đúng?"
    options:
      - "`driver.findElement(By.id(\"sort\")).sendKeys(\"price-desc\")`"
      - "`new Select(driver.findElement(By.id(\"sort\"))).selectByValue(\"price-desc\")`"
      - "`driver.switchTo().select(\"price-desc\")`"
    answer: 1
    explain: "Class `Select` có các method `selectByValue`, `selectByVisibleText`, `selectByIndex`."
  - q: "Ô email nằm trong một iframe. Bạn cần làm gì trước khi `findElement` nó?"
    options:
      - "`driver.switchTo().frame(...)`"
      - "`driver.switchTo().window(...)`"
      - "Không cần gì, Selenium tự tìm trong iframe"
    answer: 0
    explain: "Và nhớ `driver.switchTo().defaultContent()` khi muốn quay lại trang chính."
  - q: "Sau khi bấm link mở tab mới, Selenium đang \"đứng\" ở đâu?"
    options:
      - "Ở tab mới, tự động"
      - "Vẫn ở tab cũ, cho tới khi bạn `switchTo().window(...)`"
      - "Không ở tab nào cả"
    answer: 1
    explain: "Dùng `getWindowHandles()` để tìm handle của tab mới rồi chuyển sang."
  - q: "Hộp thoại confirm \"Bạn có chắc muốn xóa giỏ hàng?\" đang mở. Muốn bấm Hủy thì gọi gì?"
    options:
      - "`alert.accept()`"
      - "`alert.dismiss()`"
      - "`driver.findElement(By.id(\"cancel\")).click()`"
    answer: 1
    explain: "`accept()` là OK, `dismiss()` là Hủy. Hộp thoại JavaScript không phải HTML nên không `findElement` được."
  - q: "Vì sao đặt `driver.quit()` trong `@AfterEach`?"
    options:
      - "Để nó luôn chạy sau mỗi test, kể cả khi test fail, tránh để lại các cửa sổ Chrome mồ côi"
      - "Vì JUnit bắt buộc phải có `@AfterEach`"
      - "Để test chạy nhanh hơn"
    answer: 0
    explain: "Mỗi test mở trình duyệt riêng và tự dọn dẹp: test độc lập, không ảnh hưởng nhau."
---

Tám câu hỏi tổng kết chương Selenium. Nếu câu nào làm bạn lăn tăn, hãy quay lại bài tương ứng đọc lại phần giải thích, rồi sang bài tổng hợp cuối chương nhé!
