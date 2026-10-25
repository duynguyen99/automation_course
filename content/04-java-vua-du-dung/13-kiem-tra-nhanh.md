---
title: "Kiểm tra nhanh: Java vừa đủ dùng"
type: quiz
minutes: 5
questions:
  - q: "Vì sao dùng `ArrayList` thay cho mảng khi lưu danh sách sản phẩm tìm thấy trên trang?"
    options:
      - "ArrayList tự co giãn, không cần biết trước có bao nhiêu phần tử"
      - "ArrayList chạy nhanh gấp đôi mảng"
      - "Mảng không chứa được String"
    answer: 0
    explain: "Mảng có kích thước cố định, còn số phần tử trên trang web thì thay đổi."
  - q: "Muốn tạo List chứa các số nguyên, cách viết nào đúng?"
    options:
      - "`List<int> ds = new ArrayList<>();`"
      - "`List<Integer> ds = new ArrayList<>();`"
      - "`List ds<int> = new ArrayList();`"
    answer: 1
    explain: "Trong ngoặc nhọn phải là kiểu object, nên dùng `Integer` thay cho `int`."
  - q: '`Map<String, String> m = new HashMap<>(); m.put("browser", "chrome"); m.put("browser", "firefox");` Lúc này `m.size()` và `m.get("browser")` là gì?'
    options:
      - "`2` và `chrome`"
      - "`2` và `firefox`"
      - "`1` và `firefox`"
    answer: 2
    explain: "Khóa trong Map là duy nhất. `put` lần hai ghi đè giá trị cũ."
  - q: "Trong `try`, dòng thứ 2 ném ra exception và có `catch` phù hợp. Dòng thứ 3 trong `try` thì sao?"
    options:
      - "Vẫn chạy bình thường"
      - "Bị bỏ qua, chương trình nhảy thẳng vào catch"
      - "Chạy sau khi catch xong"
    answer: 1
    explain: "Gặp sự cố, phần còn lại của `try` bị bỏ qua."
  - q: "Vì sao `driver.quit()` nên đặt trong `finally`?"
    options:
      - "Vì finally chạy nhanh hơn"
      - "Vì Selenium bắt buộc như vậy"
      - "Vì finally luôn chạy, dù test pass hay ném exception, nên trình duyệt luôn được đóng"
    answer: 2
    explain: "Nếu đặt cuối `try`, một bước lỗi sẽ khiến trình duyệt bị bỏ mở."
  - q: '`throw new IllegalArgumentException("Giá không được âm");` làm gì?'
    options:
      - "Ném ra một exception kèm thông điệp, method dừng ngay tại đó"
      - "In dòng chữ ra Console rồi chạy tiếp"
      - "Bắt một exception do Java ném ra"
    answer: 0
    explain: "`throw` là ném, `catch` mới là bắt."
  - q: "Ưu điểm lớn nhất của `enum TestStatus { PASSED, FAILED, SKIPPED }` so với dùng String?"
    options:
      - "Tốn ít bộ nhớ hơn"
      - "Gõ sai giá trị (như `TestStatus.PASS`) bị Java báo lỗi ngay lúc biên dịch"
      - "In ra đẹp hơn"
    answer: 1
    explain: "Với String, `\"Pased\"` vẫn hợp lệ và bug chỉ lộ ra lúc chạy, có khi không bao giờ lộ."
  - q: '`List.of(5, 12, 8).stream().filter(x -> x > 6).count()` trả về bao nhiêu?'
    options:
      - "1"
      - "2"
      - "3"
    answer: 1
    explain: "Chỉ 12 và 8 lớn hơn 6."
  - q: "Vì sao nên để `baseUrl`, `browser` trong file `config.properties` thay vì viết thẳng vào code?"
    options:
      - "Để đổi môi trường hay trình duyệt chỉ cần sửa một file, không phải sửa code test"
      - "Vì Java không cho viết URL trong code"
      - "Để chương trình biên dịch nhanh hơn"
    answer: 0
    explain: "Tách cấu hình khỏi code là thói quen cơ bản của mọi framework automation."
---

Chín câu hỏi tổng kết chương. Những công cụ này sẽ xuất hiện trong **mọi** file test bạn viết từ chương sau trở đi.
