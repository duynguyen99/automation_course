---
title: "XPath: tìm theo chữ và theo họ hàng"
type: read
minutes: 10
---

CSS selector có hai điểm yếu: không tìm được theo **chữ hiển thị**, và không đi **ngược lên** phần tử cha. **XPath** (*XML Path Language*) làm được cả hai. Nó dài hơn CSS một chút, nhưng là "vũ khí bí mật" cho những trang không có id, như bảng đơn hàng `table.html`:

```html
<table class="orders">
  <tbody>
    <tr><td>TM1001</td><td>Nguyễn Thị Lan</td><td>Hà Nội</td><td>370.000₫</td>
        <td><span class="badge">Đã giao</span></td><td><button class="btn secondary view">Xem</button></td></tr>
    <tr><td>TM1002</td><td>Trần Minh Khoa</td><td>TP. Hồ Chí Minh</td><td>840.000₫</td>
        <td><span class="badge">Đang giao</span></td><td><button class="btn secondary view">Xem</button></td></tr>
    ...
  </tbody>
</table>
```

Năm nút "Xem" giống hệt nhau, không id, không class riêng. Làm sao bấm đúng nút của đơn **TM1002**? Đọc hết trang này bạn sẽ biết.

## Tuyệt đối và tương đối

```text
/html/body/main/table/tbody/tr[2]/td[6]/button     ← XPath tuyệt đối (absolute)
//button[@id='login-btn']                          ← XPath tương đối (relative)
```

- Bắt đầu bằng **một** dấu `/`: đi từng bậc từ gốc trang. Thêm một thẻ `div` ở đâu đó là gãy. **Đừng dùng.**
- Bắt đầu bằng **hai** dấu `//`: "tìm ở **bất kỳ đâu** trong trang". Luôn dùng kiểu này.

## Cú pháp cơ bản: //thẻ[điều kiện]

| XPath | Nghĩa | CSS tương đương |
|---|---|---|
| `//button` | mọi thẻ `button` | `button` |
| `//input[@id='username']` | `input` có `id="username"` | `input#username` |
| `//*[@id='username']` | **bất kỳ thẻ nào** có id đó (`*` = mọi thẻ) | `#username` |
| `//input[@name='email']` | theo thuộc tính `name` | `input[name="email"]` |
| `//button[@class='btn add-to-cart']` | class **bằng đúng** cả chuỗi | (khác `.add-to-cart`!) |

Thuộc tính luôn có `@` đứng trước. Giá trị nằm trong nháy đơn `'...'` hoặc nháy kép `"..."`. Trong Java ta hay dùng nháy đơn cho XPath, để khỏi đụng với nháy kép của String.

> Cẩn thận: `@class='add-to-cart'` chỉ khớp khi thuộc tính class **chỉ có đúng** chữ đó. Nút có `class="btn add-to-cart"` sẽ **không** khớp. Với class, hãy dùng `contains(@class, 'add-to-cart')` (mục sau) hoặc quay về CSS `.add-to-cart`.

## Tìm theo chữ: text(), contains(), normalize-space()

| XPath | Nghĩa |
|---|---|
| `//button[text()='Đăng nhập']` | nút có chữ **bằng đúng** "Đăng nhập" |
| `//td[text()='TM1002']` | ô bảng có chữ TM1002 |
| `//h3[contains(text(), 'Trà Sen')]` | chữ **chứa** "Trà Sen" |
| `//*[contains(@class, 'add-to-cart')]` | thuộc tính class **chứa** "add-to-cart" |
| `//input[starts-with(@id, 'ship-')]` | id **bắt đầu** bằng "ship-" |
| `//button[normalize-space()='Thêm vào giỏ']` | chữ (đã bỏ khoảng trắng thừa) bằng "Thêm vào giỏ" |

`normalize-space()` gọt bỏ dấu cách và xuống dòng thừa ở hai đầu, gộp nhiều dấu cách ở giữa thành một. Dev hay viết HTML kiểu:

```html
<button class="btn">
    Thêm vào giỏ
</button>
```

Khi đó `text()='Thêm vào giỏ'` **không** khớp (vì có xuống dòng và dấu cách), còn `normalize-space()='Thêm vào giỏ'` thì khớp. Khi tìm theo chữ, ưu tiên `normalize-space()`.

Ghép nhiều điều kiện bằng `and` / `or`:

```text
//input[@type='radio' and @name='shipping']
//button[contains(@class, 'add-to-cart') and not(@disabled)]
```

## Đi theo họ hàng: cha, anh em, con

Đây là phần CSS không làm được. Dấu `/` (một gạch) giữa hai bước nghĩa là **con trực tiếp**, `//` nghĩa là **con cháu ở bất kỳ độ sâu nào**.

| XPath | Nghĩa |
|---|---|
| `//td[text()='TM1002']/..` | **cha** của ô TM1002, tức là cả hàng `tr` |
| `//td[text()='TM1002']/parent::tr` | như trên, viết rõ ràng hơn |
| `//td[text()='TM1002']/following-sibling::td` | các ô **anh em đứng sau** ô TM1002 trong cùng hàng |
| `//td[text()='TM1002']/following-sibling::td[1]` | ô ngay sau nó: "Trần Minh Khoa" |
| `//td[text()='Trần Minh Khoa']/preceding-sibling::td` | các ô **đứng trước**: "TM1002" |
| `//span[text()='Hết hàng']/ancestor::article` | **tổ tiên** `article` bao quanh chữ "Hết hàng" |

Và đây là lời giải cho câu đố đầu trang, bấm nút "Xem" của đơn TM1002:

```text
//tr[td[text()='TM1002']]//button
```

Đọc là: *"tìm hàng `tr` **có chứa** một ô `td` với chữ TM1002, rồi tìm `button` bên trong hàng đó"*. Điều kiện trong `[...]` có thể là cả một đường dẫn con, không chỉ thuộc tính. Cách viết tương đương: `//td[text()='TM1002']/..//button`.

Mẫu "tìm hàng theo một ô, rồi lấy ô khác trong hàng" là mẫu XPath **phổ biến nhất** khi làm việc với bảng. Hãy thuộc nó.

## Chỉ số: đếm từ 1, và cẩn thận với dấu ngoặc

| XPath | Nghĩa |
|---|---|
| `//tbody/tr[2]` | `tr` là con thứ 2 của `tbody` |
| `//tr[2]/td[4]` | ô thứ 4 của hàng thứ 2 (trong mỗi bảng) |
| `(//button[text()='Xem'])[1]` | nút "Xem" **đầu tiên trên cả trang** |
| `(//button[text()='Xem'])[last()]` | nút "Xem" cuối cùng |

XPath đếm từ **1** (không phải 0). Và có một bẫy kinh điển: `//td[1]` nghĩa là "mọi ô là **con đầu tiên của cha nó**", với bảng 5 hàng sẽ ra 5 ô! Muốn lấy "cái đầu tiên trong toàn bộ kết quả" phải bọc ngoặc: `(//td)[1]`.

## So sánh nhanh CSS và XPath

| Việc cần làm | CSS | XPath |
|---|---|---|
| theo id | `#login-btn` | `//*[@id='login-btn']` |
| theo class | `.price` | `//*[contains(@class,'price')]` |
| bên trong | `.product-card .price` | `//*[contains(@class,'product-card')]//*[contains(@class,'price')]` |
| theo chữ | **không làm được** | `//button[text()='Đăng nhập']` |
| lên cha | **không làm được** | `//td[text()='TM1002']/..` |

CSS ngắn gọn hơn hẳn cho các việc thông thường. XPath tỏa sáng khi cần **chữ** hoặc **họ hàng**. Kỹ sư giỏi dùng cả hai, đúng lúc.

> Nhớ thử mọi XPath bằng `Ctrl+F` trong tab Elements, hoặc `$x('...')` trong Console, trước khi đưa vào code.
