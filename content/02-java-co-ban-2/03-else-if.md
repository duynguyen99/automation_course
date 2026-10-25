---
title: "else if: nhiều lựa chọn"
type: code
minutes: 7
seed: |
  public class Main {
      // Đừng sửa phần main, hãy viết code trong method xepLoai bên dưới
      public static void main(String[] args) {
          System.out.println(xepLoai(1));
          System.out.println(xepLoai(3));
          System.out.println(xepLoai(7));
      }

      static String xepLoai(int thoiGianTai) {
          // Viết if / else if / else ở đây
          return "";
      }
  }
solution: |
  public class Main {
      // Đừng sửa phần main, hãy viết code trong method xepLoai bên dưới
      public static void main(String[] args) {
          System.out.println(xepLoai(1));
          System.out.println(xepLoai(3));
          System.out.println(xepLoai(7));
      }

      static String xepLoai(int thoiGianTai) {
          if (thoiGianTai <= 2) {
              return "Nhanh";
          } else if (thoiGianTai <= 5) {
              return "Chấp nhận được";
          } else {
              return "Quá chậm";
          }
      }
  }
checks: |
  eq("t1", () -> call("xepLoai", 2), "Nhanh", "xepLoai(2)");
  eq("t2", () -> call("xepLoai", 5), "Chấp nhận được", "xepLoai(5)");
  eq("t3", () -> call("xepLoai", 6), "Quá chậm", "xepLoai(6)");
  eq("t4", () -> call("xepLoai", 0), "Nhanh", "xepLoai(0)");
tests:
  - text: 'Tải trong `2` giây → `"Nhanh"`'
    java: t1
  - text: 'Tải trong `5` giây → `"Chấp nhận được"`'
    java: t2
  - text: 'Tải trong `6` giây → `"Quá chậm"`'
    java: t3
  - text: 'Tải trong `0` giây → `"Nhanh"`'
    java: t4
  - text: 'Dùng `else if`'
    source: 'else\s+if\s*\('
hints:
  - 'Trong method này, thay vì `println`, bạn dùng `return "Nhanh";` để trả kết quả về. Trang sau sẽ giải thích kỹ `return`.'
  - 'Java kiểm tra từ trên xuống và dừng ở điều kiện **đầu tiên** đúng. Vì vậy chỉ cần `thoiGianTai <= 5` ở nhánh thứ hai, không cần viết thêm `> 2`.'
---

Khi có **nhiều hơn hai** trường hợp, ta nối thêm `else if`:

```java
int diem = 7;

if (diem >= 9) {
    System.out.println("Xuất sắc");
} else if (diem >= 7) {
    System.out.println("Khá");
} else if (diem >= 5) {
    System.out.println("Trung bình");
} else {
    System.out.println("Chưa đạt");
}
// In ra: Khá
```

Java kiểm tra **lần lượt từ trên xuống**. Gặp điều kiện đúng đầu tiên thì chạy nhánh đó rồi **bỏ qua tất cả phần còn lại**.

## Một điều mới trong bài này

Lần này code nằm trong một **method** tên `xepLoai` (method là một đoạn code có tên, bạn sẽ học kỹ ở cuối chương). Trong đó:

- `thoiGianTai` là con số được đưa vào để kiểm tra.
- Thay vì in ra, bạn dùng `return "..."` để **trả kết quả về**.

Máy chấm sẽ gọi `xepLoai` với nhiều con số khác nhau để thử code của bạn. Đây cũng chính là cách tester kiểm tra: **thử nhiều đầu vào, so sánh đầu ra**.

## Đến lượt bạn

Viết method `xepLoai` theo quy tắc:

| Thời gian tải | Trả về |
|---|---|
| từ 2 giây trở xuống | `"Nhanh"` |
| trên 2, tối đa 5 giây | `"Chấp nhận được"` |
| trên 5 giây | `"Quá chậm"` |
