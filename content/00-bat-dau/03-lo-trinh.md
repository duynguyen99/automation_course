---
title: "Con đường phía trước"
type: read
minutes: 6
---

Hãy coi việc học automation như xây một ngôi nhà: không thể lợp mái khi chưa đổ móng. Mỗi chương trong sổ tay là một tầng, và tầng trên **đứng trên** tầng dưới.

## Bốn chặng đường

| Chặng | Chương | Bạn sẽ làm được gì |
|---|---|---|
| **1. Móng nhà: Java** | 1–4 | Đọc và viết code Java: biến, điều kiện, vòng lặp, method, class, List, xử lý lỗi |
| **2. Đồ nghề: Công cụ & JUnit** | 5–6 | Dùng IntelliJ, Maven, Git như kỹ sư thật; viết những bài test đầu tiên |
| **3. Điều khiển trình duyệt** | 7–9 | Hiểu cấu tạo trang web, dùng Selenium thao tác tự động, tổ chức code theo Page Object Model |
| **4. Làm như đi làm thật** | 10–13 | Viết kịch bản BDD với Cucumber, xuất báo cáo, chạy test tự động trên GitHub, làm đồ án cho CV |

## Vì sao lại theo đúng thứ tự này?

Mỗi bước đều là **điều kiện cần** cho bước sau. Thử tưởng tượng đi tắt sẽ ra sao:

**Java trước Selenium.** Mọi dòng code Selenium đều là code Java:

```java
driver.findElement(By.id("login-button")).click();
```

Chưa biết Java, dòng này trông như mật mã. Học Java xong, bạn đọc nó như một câu tiếng Việt: *"trình duyệt ơi, tìm phần tử có id là login-button, rồi click vào nó"*. Người học Selenium khi chưa vững Java thường chỉ biết copy code trên mạng, gặp lỗi là bế tắc.

**OOP (chương 3) trước Page Object Model (chương 9).** Page Object Model, cách tổ chức code test mà hầu hết công ty dùng, thực chất là áp dụng class, kế thừa và đóng gói vào việc test. Hiểu OOP rồi thì POM chỉ còn là "à, ra là vậy".

**JUnit (chương 6) trước Selenium (chương 8).** Selenium chỉ biết *điều khiển* trình duyệt. Còn việc *kiểm tra* đúng sai, báo pass/fail, chạy hàng loạt test là việc của JUnit. Học JUnit trên những đoạn code nhỏ, không có trình duyệt, sẽ dễ hơn nhiều so với vừa học JUnit vừa vật lộn với trình duyệt.

**Web (chương 7) trước Selenium (chương 8).** Muốn bảo code "click vào nút Đăng nhập", bạn phải chỉ ra được *nút nào*. Việc đó gọi là viết **locator** (CSS selector, XPath), và nó đòi hỏi hiểu cấu trúc HTML của trang. Phần lớn lỗi Selenium của người mới là do locator sai, nên chương này rất đáng đầu tư.

**Cucumber (chương 10) gần cuối.** Cucumber là một lớp "bọc" bên ngoài: câu chữ Gherkin ở trên, bên dưới vẫn là Java, Selenium và Page Object. Học Cucumber khi chưa có những thứ đó giống như học trang trí nội thất cho một ngôi nhà chưa có tường.

## Vì sao chặng Java dài nhất?

Chặng 1 chiếm gần một nửa cuốn sổ, và đó là chủ ý. Người chuyển ngành thường bỏ cuộc không phải vì Selenium khó, mà vì nền Java yếu nên càng học càng rối. Dành nhiều thời gian cho móng nhà sẽ giúp các chặng sau đi nhanh hơn rất nhiều.

## Bạn không cần cài gì cả (lúc này)

Mọi bài thực hành đều chạy ngay trên trang web này. Code bạn viết được gửi tới một máy chủ có sẵn Java để chạy, rồi kết quả được gửi về. Đến chương 5, khi đã vững tay, bạn mới cài công cụ lên máy của mình.

Trang sau sẽ trả lời câu hỏi mà ai cũng thắc mắc: *học chừng này có đủ để đi làm không?*
