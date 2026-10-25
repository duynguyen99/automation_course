---
title: "Vòng lặp for: lặp lại có đếm"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          // Dùng vòng lặp for để in 5 dòng

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          for (int i = 1; i <= 5; i++) {
              System.out.println("Đang chạy test case số " + i);
          }
      }
  }
tests:
  - text: 'Console in ra 5 dòng, từ `Đang chạy test case số 1` đến `Đang chạy test case số 5`'
    stdout: { equals: "Đang chạy test case số 1\nĐang chạy test case số 2\nĐang chạy test case số 3\nĐang chạy test case số 4\nĐang chạy test case số 5" }
  - text: 'Dùng vòng lặp `for`'
    source: 'for\s*\('
  - text: 'Chỉ viết `System.out.println` **một lần** (để vòng lặp làm phần còn lại)'
    notSource: 'println[\s\S]*println'
hints:
  - 'Bắt đầu từ `int i = 1` và lặp khi `i <= 5`.'
  - 'Nối chuỗi với biến đếm: `"Đang chạy test case số " + i`'
---

Giả sử cần chạy 100 test case. Chẳng lẽ viết 100 dòng `println`? Không cần! **Vòng lặp** (*loop*) giúp lặp lại một đoạn code nhiều lần.

```java
for (int i = 1; i <= 3; i++) {
    System.out.println("Lần thứ " + i);
}
```

Console:

```
Lần thứ 1
Lần thứ 2
Lần thứ 3
```

## Ba phần trong ngoặc của `for`

`for (bắt đầu; điều kiện; bước nhảy)`

1. **`int i = 1`**: tạo biến đếm `i`, bắt đầu từ 1. Phần này chỉ chạy một lần.
2. **`i <= 3`**: trước mỗi vòng, Java kiểm tra điều kiện. Còn đúng thì chạy tiếp, sai thì dừng.
3. **`i++`**: sau mỗi vòng, tăng `i` thêm 1 (`i++` là viết tắt của `i = i + 1`).

Hình dung như một tester chăm chỉ: *"Bắt đầu từ test số 1. Còn test thì chạy. Xong một test thì chuyển sang test tiếp theo."*

> Lập trình viên thường đếm từ 0: `for (int i = 0; i < 3; i++)` cũng lặp 3 lần (0, 1, 2). Bạn sẽ hiểu vì sao ở trang về mảng.

## Đến lượt bạn

Dùng **một** vòng lặp `for` để in ra:

```
Đang chạy test case số 1
Đang chạy test case số 2
Đang chạy test case số 3
Đang chạy test case số 4
Đang chạy test case số 5
```
