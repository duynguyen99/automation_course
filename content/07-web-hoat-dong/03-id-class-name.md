---
title: "id, class, name: thuộc tính tester cần biết"
type: read
minutes: 6
---

Một test Selenium luôn bắt đầu bằng câu hỏi: *"phần tử mình cần nằm ở đâu?"*. Cách mô tả vị trí đó gọi là **locator** (bộ định vị). Locator tốt dựa vào những **thuộc tính** ổn định, ít thay đổi. Đây là những thuộc tính bạn sẽ tìm đầu tiên.

## id: số căn cước của phần tử

```html
<button id="login-btn">Đăng nhập</button>
```

Theo quy chuẩn HTML, mỗi `id` chỉ được xuất hiện **một lần** trên trang. Giống số căn cước: một người, một số. Vì vậy `id` là cách tìm phần tử **nhanh và chắc chắn nhất**.

> Quy chuẩn nói vậy, nhưng dev đôi khi vẫn lỡ đặt trùng `id`. Khi thử locator trong DevTools (trang 6), nếu thấy hơn một kết quả, đó là một lỗi nhỏ đáng báo cho dev.

## class: nhóm trang phục

```html
<button class="btn add-to-cart">Thêm vào giỏ</button>
```

`class` dùng để **trang trí** (CSS) và **phân nhóm**. Một phần tử có thể có **nhiều class**, cách nhau bằng dấu cách: nút trên có hai class `btn` và `add-to-cart`. Nhiều phần tử có thể dùng chung một class: cả 6 nút "Thêm vào giỏ" đều có class `add-to-cart`.

- Muốn lấy **tất cả** nút thêm vào giỏ: tìm theo class là hợp lý.
- Cẩn thận với class chỉ để trang trí như `btn`, `red`, `mt-2`: dev đổi giao diện là chúng đổi theo.

## name: tên của ô nhập trong form

```html
<input type="email" id="email" name="email">
<input type="radio" id="ship-standard" name="shipping" value="standard">
<input type="radio" id="ship-express" name="shipping" value="express">
```

`name` là tên dữ liệu được gửi lên server khi bấm nút gửi form. Các ô `input`, `select` thường có nó. Với **radio** (chọn một trong nhiều), các lựa chọn cùng nhóm **dùng chung** `name` (ở đây là `shipping`), nên muốn chọn đúng một ô thì dùng `id` hoặc `value`.

## data-*: thuộc tính dành riêng cho test

```html
<article class="product-card" data-id="3" data-category="tra-uop">
<button data-testid="checkout-submit">Đặt hàng</button>
```

Mọi thuộc tính bắt đầu bằng `data-` là thuộc tính **tự đặt**, trình duyệt không dùng đến chúng. Nhiều team thống nhất thêm `data-testid` (hoặc `data-test`, `data-qa`) **chỉ để phục vụ test**. Dev đổi giao diện, đổi chữ, đổi class thoải mái, miễn là không đụng vào `data-testid`, test của bạn vẫn chạy.

> Nếu dự án của bạn chưa có `data-testid`, hãy đề nghị với dev. Đó là một trong những đề xuất "ăn điểm" nhất mà một tester automation có thể đưa ra.

## Những thuộc tính khác cũng hữu ích

| Thuộc tính | Ví dụ | Dùng khi |
|---|---|---|
| `type` | `type="password"`, `type="checkbox"` | phân biệt loại ô nhập |
| `placeholder` | `placeholder="Tìm sản phẩm..."` | ô nhập không có id |
| `href` | `href="/practice/cart.html"` | tìm đường link theo địa chỉ |
| `value` | `value="HN"` | lựa chọn trong `select`, radio |
| `disabled` | `<button disabled>Hết hàng</button>` | kiểm tra nút bị vô hiệu hóa |
| `aria-label`, `role` | `aria-label="Sắp xếp"`, `role="alert"` | thuộc tính hỗ trợ người khiếm thị, thường khá ổn định |

## Còn nội dung chữ thì sao?

Đôi khi phần tử không có thuộc tính nào tốt, ví dụ các ô trong bảng đơn hàng ở `table.html`:

```html
<tr><td>TM1002</td><td>Trần Minh Khoa</td><td>TP. Hồ Chí Minh</td>...</tr>
```

Khi đó ta tìm theo **chữ hiển thị** ("hàng có chữ TM1002"). CSS selector không làm được việc này, nhưng **XPath** thì được. Ta sẽ học cả hai, CSS trước.
