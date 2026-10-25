---
title: "Class và object: khuôn bánh và chiếc bánh"
type: read
minutes: 6
---

Đến giờ, mọi chương trình của bạn đều nằm gọn trong một class `Main`. Với vài chục dòng thì ổn. Nhưng một bộ test thật có hàng trăm test case, hàng chục trang web, mỗi trang có nhiều ô nhập và nút bấm. Nếu dồn hết vào một chỗ, code sẽ rối như một ngăn kéo không chia ô.

Java giải quyết chuyện này bằng **lập trình hướng đối tượng** (*Object-Oriented Programming*, viết tắt **OOP**): gom dữ liệu và hành động liên quan vào cùng một "món đồ".

## Khuôn bánh và chiếc bánh

Hãy nghĩ tới chiếc **khuôn bánh trung thu**:

- Cái **khuôn** quy định hình dạng: tròn hay vuông, hoa văn gì, nặng bao nhiêu gram.
- Từ một khuôn, bạn đúc ra **nhiều chiếc bánh**. Chiếc nhân đậu xanh, chiếc nhân thập cẩm. Cùng hình dạng, nhưng nhân bên trong khác nhau.

Trong Java:

| Đời thường | Java | Ví dụ |
|---|---|---|
| Cái khuôn, bản thiết kế | **class** | `Product` (mô tả một sản phẩm *nói chung*) |
| Chiếc bánh, ngôi nhà thật | **object** (đối tượng) | sản phẩm "Trà Sen Tây Hồ", giá 420000 |

**Class** là bản mô tả. **Object** là một "món" cụ thể được tạo ra từ bản mô tả đó. Một class có thể tạo ra bao nhiêu object cũng được.

## Một object có gì?

Nhìn vào trang sản phẩm của Tiệm Trà Mộc, mỗi thẻ sản phẩm đều có:

- **Dữ liệu** mà nó *biết*: tên, giá, số lượng còn trong kho. Trong Java gọi là **thuộc tính** (*field*).
- **Hành động** mà nó *làm được*: tính tiền khi mua 3 hộp, kiểm tra còn hàng không. Trong Java gọi là **method**.

Tất cả sáu thẻ sản phẩm đều có chung "khuôn" đó, chỉ khác giá trị bên trong. Vậy là: **một class `Product`, sáu object**.

## Bạn đã dùng object từ lâu rồi

Còn nhớ `String` chứ? `String` chính là một class có sẵn của Java. Mỗi đoạn chữ bạn tạo là một object:

```java
String ten = "Trà Sen Tây Hồ";
System.out.println(ten.length());       // 14
System.out.println(ten.toUpperCase());  // TRÀ SEN TÂY HỒ
```

`ten` biết nội dung của nó (dữ liệu) và có các method như `length()`, `toUpperCase()` (hành động). Dấu chấm `.` nghĩa là *"của object này"*: `ten.length()` đọc là "độ dài **của** `ten`".

> Mẹo nhận biết: tên class luôn **viết hoa chữ cái đầu** (`String`, `Product`, `LoginPage`). Tên biến và method viết thường chữ đầu (`ten`, `length()`).

## Vì sao tester cần OOP?

Khi học Selenium, dòng code đầu tiên bạn viết sẽ là:

```java
WebDriver driver = new ChromeDriver();
```

Nghĩa là: tạo một object trình duyệt Chrome. Sau đó bạn ra lệnh cho nó: `driver.get(...)` để mở trang, `driver.quit()` để đóng.

Xa hơn nữa, bạn sẽ học **Page Object Model** (POM): mỗi trang web được viết thành một class. Trang đăng nhập là class `LoginPage` với các method `enterUsername(...)`, `clickLogin()`. Test chỉ việc tạo object `LoginPage` và gọi method, đọc lên gần như tiếng Anh thông thường.

Cả chương này là để chuẩn bị cho khoảnh khắc đó. Trang tiếp theo, bạn sẽ tự tay viết class đầu tiên.
