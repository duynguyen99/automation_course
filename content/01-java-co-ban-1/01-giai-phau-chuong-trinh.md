---
title: "Giải phẫu một chương trình Java"
type: read
minutes: 5
---

Ở trang trước bạn đã chạy chương trình này:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Xin chào!");
    }
}
```

Năm dòng code, nhưng mỗi dòng đều có lý do. Hãy mổ xẻ từng phần.

## 1. `public class Main { ... }`: cái hộp chứa mọi thứ

Trong Java, mọi đoạn code đều phải nằm trong một **class**. Hãy hình dung class như một **tập hồ sơ**: nó có tên (`Main`), và mọi thứ bên trong được bọc giữa cặp ngoặc nhọn `{` và `}`.

- `public` nghĩa là "công khai", ai cũng dùng được. Bây giờ bạn cứ coi nó là từ bắt buộc.
- `class` báo cho Java biết "đây là một class".
- `Main` là tên của class. Trong sách này, class của bạn luôn tên là `Main`.

## 2. `public static void main(String[] args)`: cửa chính

Đây là **method main**, tức là điểm bắt đầu. Khi chạy chương trình, Java đi thẳng vào đây và thực hiện từng dòng bên trong, từ trên xuống dưới.

Dòng này nhìn đáng sợ, nhưng bạn **chỉ cần chép y nguyên**. Ý nghĩa của từng từ (`static`, `void`, `String[] args`) sẽ được giải thích dần ở các chương sau.

## 3. `System.out.println(...)`: câu lệnh

Đây là một **câu lệnh** (*statement*), ra lệnh cho máy tính làm một việc. Như bạn đã biết, câu lệnh này in một dòng chữ ra Console.

Mỗi câu lệnh **kết thúc bằng dấu chấm phẩy `;`**, giống như dấu chấm kết thúc một câu văn. Quên dấu `;` là lỗi phổ biến nhất của người mới, và bạn sẽ gặp nó nhiều lần. Đừng lo!

## 4. Các cặp ngoặc nhọn `{ }`

Mỗi dấu `{` mở ra một khối, và phải có một dấu `}` đóng lại. Chúng lồng nhau như những chiếc hộp:

```
class Main {                 ← mở hộp class
    main(...) {              ← mở hộp main
        câu lệnh;
    }                        ← đóng hộp main
}                            ← đóng hộp class
```

Việc thụt đầu dòng (4 dấu cách) giúp **con người** dễ nhìn ra hộp nào nằm trong hộp nào. Java không bắt buộc thụt lề, nhưng mọi lập trình viên đều làm vậy.

## 5. Java phân biệt chữ HOA và chữ thường

`System` khác `system`. `Main` khác `main`. Viết `system.out.println` là Java sẽ báo lỗi ngay. Hãy để ý điều này mỗi khi gõ code.

> **Tóm tắt:** class `Main` → method `main` → các câu lệnh chạy từ trên xuống, mỗi câu kết thúc bằng `;`.
