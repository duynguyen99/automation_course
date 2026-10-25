---
title: "Kiểm tra nhanh: Điều kiện, vòng lặp, method"
type: quiz
minutes: 5
questions:
  - q: "So sánh hai String `a` và `b` có cùng nội dung không, cách nào đúng?"
    options:
      - "`a == b`"
      - "`a.equals(b)`"
      - "`a = b`"
    answer: 1
    explain: "`==` với String so sánh vị trí trong bộ nhớ, không so sánh nội dung."
  - q: '`int x = 7; if (x > 10) { A } else if (x > 5) { B } else { C }`: nhánh nào chạy?'
    options:
      - "A"
      - "B"
      - "Cả B và C"
    answer: 1
    explain: "7 > 5 là đúng đầu tiên nên chạy B, rồi bỏ qua phần còn lại."
  - q: "`true && false` cho ra gì?"
    options:
      - "`true`"
      - "`false`"
    answer: 1
    explain: "`&&` chỉ đúng khi cả hai vế đều đúng."
  - q: "`for (int i = 0; i < 4; i++)` lặp bao nhiêu lần?"
    options:
      - "3 lần"
      - "4 lần"
      - "5 lần"
    answer: 1
    explain: "i chạy qua 0, 1, 2, 3, tức là 4 lần."
  - q: 'Với `String[] ds = {"A", "B", "C"};`, `ds[3]` cho ra gì?'
    options:
      - '`"C"`'
      - "`null`"
      - "Lỗi `ArrayIndexOutOfBoundsException`"
    answer: 2
    explain: "Mảng 3 phần tử chỉ có chỉ số 0, 1, 2."
  - q: "Trong `static int tinh(int a)`, chữ `int` đứng trước `tinh` nghĩa là gì?"
    options:
      - "Method trả về một số nguyên"
      - "Method chỉ chạy được một lần"
      - "Tên của tham số"
    answer: 0
    explain: "Đó là kiểu trả về. `void` thì có nghĩa là không trả về gì."
  - q: '`"  Hi  ".trim().length()` bằng bao nhiêu?'
    options:
      - "6"
      - "4"
      - "2"
    answer: 2
    explain: '`trim()` cho ra `"Hi"`, dài 2 ký tự.'
  - q: "Vòng lặp `while` nguy hiểm nhất khi nào?"
    options:
      - "Khi điều kiện không bao giờ trở thành sai, gây ra vòng lặp vô hạn"
      - "Khi dùng chung với if"
      - "Khi lặp nhiều hơn 10 lần"
    answer: 0
    explain: "Luôn đảm bảo có thứ gì đó trong vòng lặp làm điều kiện thay đổi."
---

Tám câu hỏi tổng kết chương 2. Qua được trang này nghĩa là bạn đã nắm vững những khái niệm lập trình cốt lõi nhất!
