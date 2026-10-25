---
title: "Kiểm tra nhanh: Biến và kiểu dữ liệu"
type: quiz
minutes: 4
questions:
  - q: "Câu lệnh nào in ra chữ rồi **xuống dòng**?"
    options:
      - '`System.out.print("Hi");`'
      - '`System.out.println("Hi");`'
      - '`System.out.printline("Hi");`'
    answer: 1
    explain: "`ln` là viết tắt của *line*: in xong thì xuống dòng."
  - q: "Lỗi `';' expected` nghĩa là gì?"
    options:
      - "Thiếu dấu chấm phẩy ở cuối câu lệnh"
      - "Thừa dấu chấm phẩy"
      - "Sai tên biến"
    answer: 0
    explain: "Mỗi câu lệnh Java đều kết thúc bằng `;`."
  - q: "Muốn lưu giá tiền `199.99`, dùng kiểu nào?"
    options:
      - "`int`"
      - "`boolean`"
      - "`double`"
    answer: 2
    explain: "`int` chỉ chứa số nguyên. Số thập phân thì dùng `double`."
  - q: '`int ketQua = 9 / 2;` thì `ketQua` bằng bao nhiêu?'
    options:
      - "`4.5`"
      - "`4`"
      - "`5`"
    answer: 1
    explain: "Chia hai số `int` thì Java bỏ phần thập phân (không làm tròn), nên được `4`."
  - q: 'Đoạn code sau in ra gì? `String ten = "Mai"; System.out.println("ten");`'
    options:
      - "`Mai`"
      - "`ten`"
      - "Báo lỗi"
    answer: 1
    explain: 'Có dấu ngoặc kép nên `"ten"` chỉ là chữ, không phải tên biến.'
  - q: "Tên biến nào được đặt đúng quy tắc camelCase?"
    options:
      - "`so test case`"
      - "`SoTestCase`"
      - "`soTestCase`"
    answer: 2
    explain: "Bắt đầu bằng chữ thường, mỗi từ tiếp theo viết hoa chữ đầu."
  - q: '`System.out.println("Kết quả: " + 1 + 1);` in ra gì?'
    options:
      - "`Kết quả: 2`"
      - "`Kết quả: 11`"
      - "Báo lỗi"
    answer: 1
    explain: "Gặp String trước nên các dấu `+` sau đều là nối chữ. Muốn ra 2 thì viết `(1 + 1)`."
---

Bảy câu ôn lại chương này. Đúng hết mới được đóng dấu **ĐẠT**, nhưng bạn được làm lại các câu sai thoải mái.
