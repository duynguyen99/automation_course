---
title: "PageFactory và @FindBy: bạn sẽ gặp ở dự án cũ"
type: read
minutes: 5
---

Khi đọc code của các dự án đã có từ lâu, hoặc các bài hướng dẫn trên mạng, bạn rất dễ gặp Page Object trông như thế này:

```java
public class LoginPage {
    @FindBy(id = "username")
    private WebElement usernameInput;

    @FindBy(id = "login-btn")
    private WebElement loginButton;

    public LoginPage(WebDriver driver) {
        PageFactory.initElements(driver, this);
    }

    public void clickLogin() {
        loginButton.click();
    }
}
```

Đây là **PageFactory**, một tiện ích có sẵn trong Selenium từ rất lâu. Bạn cần **đọc hiểu** được nó, nhưng không cần dùng nó cho dự án mới.

## Nó hoạt động thế nào?

- **`@FindBy(id = "...")`** là annotation gắn lên field kiểu `WebElement`, mô tả locator. Ngoài `id` còn có `css`, `xpath`, `name`...
- **`PageFactory.initElements(driver, this)`** "bơm" vào mỗi field một object đại diện (*proxy*). Mỗi lần bạn dùng field (ví dụ `loginButton.click()`), proxy mới thực sự đi tìm phần tử trên trang.

Nhìn qua thì gọn: không cần viết `driver.findElement(...)`.

## Vì sao team hiện đại chọn By + explicit wait?

| | PageFactory + `@FindBy` | `By` + `WebDriverWait` (cách bạn đã học) |
|---|---|---|
| Chờ đợi | Không tự chờ phần tử hiện ra hay bấm được. Thường bị "vá" bằng implicit wait | Mỗi thao tác chờ đúng điều kiện qua `BasePage` |
| Locator dùng lại được không? | Bị "khóa" trong annotation, khó dùng trong `wait.until(...)` | `By` là object bình thường, đưa vào bất kỳ đâu |
| Locator động (ví dụ `data-id` theo tham số) | Không làm được, annotation chỉ nhận hằng số | Dễ: `By.cssSelector(".add-to-cart[data-id='" + id + "']")` |
| Lỗi khi debug | Lỗi xuất phát từ proxy, khó đọc | Rõ ràng: chờ điều kiện gì, trên locator nào |
| Tình trạng | Chính đội ngũ Selenium khuyên không nên dùng | Được khuyên dùng |

Một câu hay được trích dẫn từ một thành viên đội Selenium: *"Đừng dùng PageFactory"*. Lý do chính nằm ở dòng đầu tiên của bảng: web hiện đại tải dữ liệu bất đồng bộ liên tục, và một framework không chờ đợi tốt sẽ cho ra test flaky.

## Lời khuyên khi đi làm

- Vào một dự án đang dùng PageFactory: đừng vội viết lại cả framework. Hãy đọc hiểu, viết theo đúng phong cách của team, và nếu có cơ hội thì đề xuất chuyển dần sang `By` + `BasePage`.
- Bắt đầu dự án mới: dùng cách bạn đã học trong chương này.
- Khi phỏng vấn được hỏi *"PageFactory là gì?"*: giải thích được `@FindBy`, `initElements`, **và** nêu được hạn chế về chờ đợi. Câu trả lời đó cho thấy bạn hiểu sâu chứ không chỉ học thuộc.
