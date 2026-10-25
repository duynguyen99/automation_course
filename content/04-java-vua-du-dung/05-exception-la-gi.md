---
title: "Exception là gì?"
type: read
minutes: 6
---

Bạn đã gặp cảnh này rồi: chương trình đang chạy thì Console hiện một đống chữ đỏ, và mọi thứ dừng lại. Đó là một **exception** (ngoại lệ): một sự cố xảy ra **lúc chương trình đang chạy**, khiến Java không thể làm tiếp dòng code hiện tại.

Exception khác với lỗi biên dịch:

| | Lỗi biên dịch (*compile error*) | Exception |
|---|---|---|
| Khi nào | trước khi chạy | trong lúc chạy |
| Ví dụ | thiếu dấu `;`, sai tên biến | lấy phần tử thứ 10 của mảng 3 phần tử |
| Java có chạy không | không chạy dòng nào | chạy tới chỗ có sự cố thì dừng |

## Đọc một stack trace

```java
public class Main {
    public static void main(String[] args) {
        String[] trinhDuyet = {"Chrome", "Firefox"};
        System.out.println("Bắt đầu test");
        System.out.println(trinhDuyet[2]);
        System.out.println("Kết thúc test");
    }
}
```

Console in ra:

```
Bắt đầu test
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 2 out of bounds for length 2
	at Main.main(Main.java:5)
```

Đọc từng phần:

1. **Tên exception**: `ArrayIndexOutOfBoundsException`, tức là "chỉ số nằm ngoài mảng".
2. **Thông điệp** (*message*): `Index 2 out of bounds for length 2`, mảng chỉ có 2 phần tử mà bạn đòi vị trí số 2.
3. **Nơi xảy ra**: `at Main.main(Main.java:5)`, file `Main.java`, **dòng 5**.

Đoạn chữ này gọi là **stack trace**. Để ý: dòng "Kết thúc test" **không bao giờ được in**. Exception làm chương trình dừng ngay tại chỗ.

> Khi gặp stack trace, đừng hoảng. Hãy tìm **tên exception**, đọc **message**, rồi tìm dòng `at ...` đầu tiên trỏ vào **file của bạn**. 90% trường hợp lỗi nằm ngay đó.

## Những exception bạn sẽ gặp nhiều nhất

| Exception | Nghĩa | Ví dụ gây ra |
|---|---|---|
| `NullPointerException` | gọi method trên một biến đang là `null` | `String s = null; s.length();` |
| `ArrayIndexOutOfBoundsException`, `IndexOutOfBoundsException` | chỉ số vượt ngoài mảng/List | `list.get(5)` khi list có 3 phần tử |
| `NumberFormatException` | đổi chữ thành số thất bại | `Integer.parseInt("abc")` |
| `ArithmeticException` | phép toán không hợp lệ | `10 / 0` với số nguyên |
| `IllegalArgumentException` | tham số truyền vào không hợp lệ | bạn sẽ tự ném nó ở trang sau |

`Integer.parseInt("185")` là một method static rất hay dùng: đổi chữ `"185"` thành số `185`. Chữ lấy từ trang web luôn là `String`, nên tester gọi nó thường xuyên. Nhưng nếu chữ không phải là số, nó ném `NumberFormatException`.

## Exception trong thế giới test

- Trong Selenium: tìm không thấy phần tử trên trang thì ném `NoSuchElementException`; đợi quá lâu mà điều kiện chưa xảy ra thì ném `TimeoutException`.
- Trong JUnit/AssertJ: khi `assertThat(thucTe).isEqualTo(mongDoi)` thấy không khớp, nó ném ra một `AssertionError` (nói chính xác thì đây là một *Error*, "anh em họ" của exception, nhưng được ném và bắt theo đúng cùng một cơ chế). **Một test fail thực chất là một lỗi được ném ra**, và JUnit bắt lấy nó để báo cáo.

Vì vậy, hiểu exception là hiểu vì sao test của bạn fail. Trang tiếp theo, bạn sẽ học cách **bắt** exception để chương trình không bị dừng đột ngột.

> Java chia exception làm hai nhóm. Nhóm **checked** (như `IOException` khi đọc file) bắt buộc bạn phải xử lý hoặc khai báo `throws`, nếu không Java không cho biên dịch. Nhóm **unchecked** (tất cả các exception trong bảng trên) thì không bắt buộc. Bạn sẽ gặp nhóm checked ở bài đọc file cấu hình.
