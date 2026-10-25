---
title: "DevTools: kính lúp của tester"
type: read
minutes: 8
---

Trang web thật có hàng nghìn dòng HTML. Không ai đọc từ đầu đến cuối để tìm một cái nút. Thay vào đó, ta dùng **DevTools** (*Developer Tools*): bộ công cụ có sẵn trong Chrome và Edge, cho bạn "mổ xẻ" bất kỳ trang nào. Đây là công cụ tester web mở nhiều nhất trong ngày, chỉ sau trình duyệt.

Hãy mở trang mẫu `http://localhost:4000/practice/login.html` trong Chrome và làm theo từng bước.

## Mở DevTools

| Cách | Phím |
|---|---|
| Mở / đóng DevTools | **`F12`** hoặc `Ctrl+Shift+I` |
| Mở thẳng vào phần tử dưới chuột | chuột phải lên phần tử → **Inspect** (Kiểm tra) |
| Bật chế độ "chỉ vào để soi" | `Ctrl+Shift+C`, rồi rê chuột lên trang |

## Tab Elements: xem cây DOM

Tab **Elements** hiển thị **DOM hiện tại** của trang dưới dạng cây, bấm tam giác ▸ để mở rộng. Rê chuột lên một dòng, phần tử tương ứng trên trang được tô màu.

Thử ngay: chuột phải vào ô **Tên đăng nhập** → **Inspect**. Dòng được chọn sẽ là:

```html
<input type="text" id="username" name="username" placeholder="Nhập tên đăng nhập" autocomplete="username">
```

Bạn vừa tìm ra `id` của ô nhập mà không cần đọc mã nguồn. Bên phải (khung **Styles**) là CSS của phần tử, tester ít khi cần đến.

> Nhớ lại trang HTML: DOM có thể thay đổi. Gõ sai mật khẩu rồi bấm **Đăng nhập**, nhìn tab Elements: thẻ `div#error-message` vừa mất class `hidden` và có thêm dòng chữ lỗi. DevTools cho bạn thấy điều đó **ngay lúc nó xảy ra**.

## Ctrl+F trong Elements: thử locator trước khi viết code

Đây là thủ thuật **quan trọng nhất** của trang này. Khi đang ở tab Elements, nhấn **`Ctrl+F`**. Một ô tìm kiếm hiện ra ở dưới, ô này nhận được:

- chữ thường (tìm theo nội dung),
- **CSS selector**, ví dụ `#login-btn`,
- **XPath**, ví dụ `//button[text()='Đăng nhập']`.

Bên phải ô tìm kiếm hiện số kết quả, kiểu **`1 of 1`**. Đó là điều bạn muốn thấy với một locator tốt: **đúng một** kết quả, và đúng phần tử bạn cần. Nếu thấy `1 of 3` thì locator đang chọn thừa; `0 of 0` thì sai.

> Tạo thói quen: **mọi locator đều thử bằng Ctrl+F trước** khi dán vào code Java. Mất 5 giây, tiết kiệm 5 phút chạy test rồi chờ nó fail.

## Tab Console: hỏi trình duyệt trực tiếp

Tab **Console** cho phép gõ lệnh JavaScript. Bạn không cần biết JavaScript, chỉ cần hai "thần chú" này:

```text
$$('.add-to-cart')
$x('//button[text()="Đăng nhập"]')
```

| Lệnh | Ý nghĩa |
|---|---|
| `$$('css')` | tìm mọi phần tử khớp **CSS selector**, trả về một danh sách |
| `$x('xpath')` | tìm mọi phần tử khớp **XPath** |

Kết quả hiện dạng `(6) [button.btn.add-to-cart, ...]`: số trong ngoặc là số phần tử tìm được. Rê chuột lên từng phần tử trong danh sách, nó sẽ được tô sáng trên trang. Thử ở `products.html` với `$$('.add-to-cart')` để thấy 6 nút.

> Lần đầu dán code vào Console, Chrome có thể cảnh báo và yêu cầu bạn gõ `allow pasting`. Đó là cơ chế chống lừa đảo, bạn cứ gõ theo.

## Tab Network: xem request và response

Tab **Network** ghi lại mọi request mà trang gửi đi. Mở tab này **trước**, rồi tải lại trang (`F5`):

| Cột | Ý nghĩa |
|---|---|
| **Name** | file / địa chỉ được tải |
| **Status** | mã trạng thái: `200`, `404`, `500`... |
| **Type** | loại: `document` (HTML), `stylesheet` (CSS), `script` (JS), `fetch` (dữ liệu) |
| **Time** | mất bao lâu |

Bấm vào một dòng để xem chi tiết: **Headers** (địa chỉ, method, status), **Response** (nội dung server trả về). Một vài tình huống tester dùng Network:

- Nút **Đặt hàng** bấm không phản ứng? Mở Network xem có request nào bị `500` không. Chụp màn hình đính kèm bug report, dev sẽ cảm ơn bạn.
- Trang tải chậm? Cột **Time** cho biết chính xác file nào chậm.

Bạn sẽ quay lại tab Network khi học test API ở chương bonus.

## Thử ngay trên trang mẫu

Mở `http://localhost:4000/practice/products.html`, rồi:

1. `F12` → **Elements** → `Ctrl+F`, gõ `.product-card`. Bạn thấy `1 of 6`?
2. Gõ `[data-id="5"]`. Có mấy kết quả? (Gợi ý: cả thẻ `article` lẫn nút đều có `data-id`.)
3. Sang **Console**, gõ `$$('button[disabled]')`. Nút nào bị vô hiệu hóa?
