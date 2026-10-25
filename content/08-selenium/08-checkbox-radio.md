---
title: "Checkbox và radio button"
type: code
minutes: 8
practice: checkout.html
seed: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/checkout.html");
              WebElement standard = driver.findElement(By.id("ship-standard"));
              WebElement express = driver.findElement(By.id("ship-express"));
              WebElement agree = driver.findElement(By.id("agree"));

              // 1. In trạng thái ban đầu của "Tiêu chuẩn"

              // 2. Chọn giao hàng hỏa tốc

              // 3. Tick "Tôi đồng ý" (chỉ khi chưa được tick)

              // 4. In trạng thái sau khi chọn

          } finally {
              driver.quit();
          }
      }
  }
solution: |
  import org.openqa.selenium.By;
  import org.openqa.selenium.WebDriver;
  import org.openqa.selenium.WebElement;
  import org.openqa.selenium.chrome.ChromeDriver;

  public class Main {
      public static void main(String[] args) {
          WebDriver driver = new ChromeDriver();
          try {
              driver.get("http://localhost:4000/practice/checkout.html");
              WebElement standard = driver.findElement(By.id("ship-standard"));
              WebElement express = driver.findElement(By.id("ship-express"));
              WebElement agree = driver.findElement(By.id("agree"));

              System.out.println("Ban đầu - Tiêu chuẩn: " + standard.isSelected());

              express.click();
              if (!agree.isSelected()) {
                  agree.click();
              }

              System.out.println("Tiêu chuẩn: " + standard.isSelected());
              System.out.println("Hỏa tốc: " + express.isSelected());
              System.out.println("Đồng ý: " + agree.isSelected());
          } finally {
              driver.quit();
          }
      }
  }
tests:
  - text: 'Dùng `isSelected()` để đọc trạng thái'
    source: '\.isSelected\(\)'
  - text: 'Chỉ tick checkbox khi nó chưa được chọn (`if (!agree.isSelected())`)'
    source: 'if\s*\(\s*!\s*agree\.isSelected\(\)\s*\)'
  - text: 'Console in đúng 4 dòng theo đề bài'
    stdout: { equals: "Ban đầu - Tiêu chuẩn: true\nTiêu chuẩn: false\nHỏa tốc: true\nĐồng ý: true" }
hints:
  - 'Chọn radio chỉ cần `express.click();`. Radio cùng `name` tự bỏ chọn nhau.'
  - '`if (!agree.isSelected()) { agree.click(); }`'
timeout: 90
---

Ở trang thanh toán có hai loại ô chọn quen thuộc:

- **Checkbox** (ô vuông): bật/tắt độc lập. Ví dụ "Tôi đồng ý với điều khoản mua hàng".
- **Radio button** (ô tròn): trong một nhóm cùng `name`, chỉ được chọn **một**. Ví dụ "Tiêu chuẩn" hay "Hỏa tốc".

## Chọn và kiểm tra

```java
WebElement express = driver.findElement(By.id("ship-express"));
express.click();                         // chọn radio "Hỏa tốc"
boolean chosen = express.isSelected();   // true
```

- Với cả checkbox và radio, chọn bằng **`click()`** và đọc bằng **`isSelected()`**.
- Bấm vào radio "Hỏa tốc" thì radio "Tiêu chuẩn" (cùng `name="shipping"`) **tự động** bỏ chọn.

## Cái bẫy của checkbox

`click()` vào checkbox là **đảo** trạng thái: đang tick thì thành bỏ tick! Nếu trang đã tick sẵn (hoặc lần chạy trước để lại), một cú `click()` sẽ làm hỏng test. Vì vậy, dân automation luôn hỏi trước rồi mới bấm:

```java
if (!agree.isSelected()) {
    agree.click();
}
```

Đọc thành lời: *"Nếu chưa được tick thì mới tick"*. Chạy bao nhiêu lần, kết quả vẫn như nhau.

## Đến lượt bạn

Trên `checkout.html`, in ra **4 dòng**:

1. Trước khi làm gì: `Ban đầu - Tiêu chuẩn: true` (radio "Tiêu chuẩn" được chọn sẵn)
2. Chọn radio `#ship-express`, tick checkbox `#agree` bằng mẫu `if (!agree.isSelected())`. Sau đó in:
   - `Tiêu chuẩn: false`
   - `Hỏa tốc: true`
   - `Đồng ý: true`
