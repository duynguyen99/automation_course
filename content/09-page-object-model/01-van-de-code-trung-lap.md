---
title: "Vấn đề: code test trùng lặp, locator rải rác"
type: read
minutes: 6
---

Tưởng tượng bạn vừa viết xong 30 test cho Tiệm Trà Mộc. Test nào cũng phải đăng nhập trước, nên dòng này xuất hiện trong cả 30 file:

```java
driver.findElement(By.id("username")).sendKeys("lan");
driver.findElement(By.id("password")).sendKeys("matkhau123");
driver.findElement(By.id("login-btn")).click();
```

Một sáng thứ Hai, lập trình viên đổi id của nút từ `login-btn` thành `btn-login` cho "đẹp hơn". Bộ test của bạn **đỏ rực 30 test**. Bạn phải mở 30 file, tìm và sửa 30 chỗ. Sót một chỗ? Thêm một test fail không ai hiểu vì sao.

## Ba "mùi" của code test chưa được tổ chức

1. **Locator rải rác**: `By.id("login-btn")` nằm ở khắp nơi. Một thay đổi giao diện kéo theo hàng chục chỗ sửa.
2. **Trùng lặp thao tác**: cùng một chuỗi bước (đăng nhập, thêm vào giỏ...) được copy-paste nhiều lần.
3. **Khó đọc**: test toàn `findElement`, `By.cssSelector`, `wait.until`... Người đọc (kể cả bạn sau 3 tháng) phải "dịch" từng dòng mới hiểu test đang kiểm tra **điều gì**.

Nhìn lại bài tổng hợp chương trước: test `placeOrderWithTwoProducts` dài hơn 30 dòng, và không có dòng nào nói lên ý nghĩa nghiệp vụ như "khách thêm hai sản phẩm vào giỏ".

## Giải pháp: Page Object Model

**Page Object Model** (POM) là mẫu thiết kế (*design pattern*) phổ biến nhất trong automation web. Ý tưởng rất đơn giản:

> Mỗi trang (hoặc mỗi phần lớn của trang) được đại diện bởi **một class**. Class đó giữ **locator** của trang và cung cấp **method** cho những việc người dùng làm trên trang.

Nhớ chương OOP chứ? Đây chính là **đóng gói** (*encapsulation*): giấu chi tiết "làm thế nào" vào bên trong class, chỉ để lộ ra "làm gì".

Trước khi có POM:

```java
driver.findElement(By.id("username")).sendKeys("lan");
driver.findElement(By.id("password")).sendKeys("matkhau123");
driver.findElement(By.id("login-btn")).click();
String text = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("welcome"))).getText();
assertThat(text).isEqualTo("Xin chào, Lan");
```

Sau khi có POM:

```java
AccountPage account = new LoginPage(driver).open().loginAs("lan", "matkhau123");
assertThat(account.welcomeText()).isEqualTo("Xin chào, Lan");
```

Đọc lên như một câu tiếng Việt: *"mở trang đăng nhập, đăng nhập bằng lan, rồi kiểm tra lời chào"*. Và khi id của nút đổi? Bạn sửa **đúng một dòng** trong class `LoginPage`, cả 30 test lại xanh.

## Chương này bạn sẽ xây gì?

Từng bước một, bạn sẽ dựng một **framework** nhỏ, giống hệt cấu trúc của các dự án thật:

| Thành phần | Vai trò |
|---|---|
| **Page Object** (`LoginPage`, `ProductsPage`...) | Locator + thao tác của từng trang |
| **BasePage** | Các method chờ dùng chung: click, gõ, đọc chữ có sẵn `WebDriverWait` |
| **BaseTest** | Mở/đóng trình duyệt cho mọi test class |
| **config.properties** | Địa chỉ website, thời gian chờ... không viết cứng trong code |
| **Test class** | Chỉ còn kịch bản và assertion, ngắn và dễ đọc |

Khi đi phỏng vấn, câu *"Bạn tổ chức framework automation như thế nào?"* gần như chắc chắn sẽ được hỏi. Hết chương này, bạn sẽ trả lời được bằng chính code mình viết.
