---
title: "HTML: thẻ, thuộc tính và cây DOM"
type: read
minutes: 7
---

**HTML** (*HyperText Markup Language*) là ngôn ngữ mô tả **nội dung** của một trang web: chỗ này là tiêu đề, chỗ kia là ô nhập, đây là nút bấm. HTML không phải ngôn ngữ lập trình, nó không tính toán gì cả. Nó giống bản vẽ mặt bằng của một ngôi nhà.

## Thẻ (tag)

HTML được viết bằng các **thẻ** (*tag*), đặt trong dấu `< >`:

```html
<h1>Đăng nhập</h1>
```

- `<h1>` là **thẻ mở**, `</h1>` là **thẻ đóng** (có dấu `/`).
- `Đăng nhập` ở giữa là **nội dung chữ** (*text*) của thẻ.
- Cả cụm từ thẻ mở đến thẻ đóng gọi là một **phần tử** (*element*).

Một số thẻ không có nội dung nên không cần thẻ đóng, ví dụ `<input>` (ô nhập) và `<img>` (ảnh).

Những thẻ tester gặp hằng ngày:

| Thẻ | Là gì | Trên trang mẫu |
|---|---|---|
| `h1`, `h2`, `h3` | tiêu đề, cấp 1 lớn nhất | `<h1>Đăng nhập</h1>` |
| `p` | đoạn văn | mô tả dưới tiêu đề |
| `a` | đường link | "Sản phẩm", "Giỏ hàng" ở thanh menu |
| `button` | nút bấm | "Đăng nhập", "Thêm vào giỏ" |
| `input` | ô nhập, checkbox, radio | ô tên đăng nhập, ô mật khẩu |
| `select` + `option` | danh sách thả xuống | ô "Sắp xếp", ô "Tỉnh/thành" |
| `form` | biểu mẫu, gom các ô nhập | form đăng nhập |
| `table`, `tr`, `td` | bảng, hàng, ô | bảng đơn hàng |
| `div`, `span` | "hộp" chung để nhóm và trang trí | thẻ sản phẩm, giá tiền |
| `label` | nhãn chữ đi kèm ô nhập | "Tên đăng nhập" |

## Thuộc tính (attribute)

Thẻ mở có thể mang thêm **thuộc tính** (*attribute*), dạng `tên="giá trị"`, để mô tả chi tiết hơn:

```html
<input type="password" id="password" name="password" placeholder="Nhập mật khẩu">
```

Phần tử này là một ô nhập (`input`) với 4 thuộc tính: kiểu `password` (chữ gõ vào hiện thành dấu chấm), `id`, `name`, và dòng chữ gợi ý mờ `placeholder`. Thuộc tính chính là "dấu vân tay" giúp ta tìm đúng phần tử, trang sau sẽ nói kỹ.

## Lồng nhau và cây DOM

Phần tử có thể nằm **bên trong** phần tử khác. Đây là form đăng nhập của trang mẫu (rút gọn):

```html
<form id="login-form">
  <label>Tên đăng nhập
    <input type="text" id="username" name="username">
  </label>
  <label>Mật khẩu
    <input type="password" id="password" name="password">
  </label>
  <div id="error-message" class="alert alert-error hidden"></div>
  <button type="submit" class="btn" id="login-btn">Đăng nhập</button>
</form>
```

Khi tải trang, trình duyệt đọc HTML và dựng nó thành một **cây** gọi là **DOM** (*Document Object Model*):

```text
form#login-form
├── label
│   └── input#username
├── label
│   └── input#password
├── div#error-message
└── button#login-btn
```

Ta gọi tên các mối quan hệ như trong gia phả:

| Quan hệ | Ví dụ |
|---|---|
| **cha** (*parent*) | `form` là cha của `button` |
| **con** (*child*) | `input#username` là con của `label` thứ nhất |
| **con cháu** (*descendant*): con, cháu, chắt... | `input#username` là con cháu của `form` |
| **anh em** (*sibling*): cùng một cha | hai `label`, `div` và `button` là anh em |

> **HTML** là file gửi từ server, còn **DOM** là cây "đang sống" trong trình duyệt. JavaScript có thể thay đổi DOM bất cứ lúc nào: thêm thẻ sản phẩm, hiện thông báo lỗi... Selenium luôn làm việc với **DOM hiện tại**, không phải file HTML gốc. Đó là lý do có những phần tử "lúc có lúc không", bạn sẽ học cách chờ chúng ở chương 8.

## Đọc một thẻ sản phẩm

Trang `products.html` vẽ mỗi sản phẩm như sau:

```html
<article class="product-card" data-id="3" data-category="tra-uop">
  <h3 class="product-name">Trà Sen Tây Hồ</h3>
  <span class="price">420.000₫</span>
  <span class="stock">Còn 3 sản phẩm</span>
  <button class="btn add-to-cart" data-id="3">Thêm vào giỏ</button>
</article>
```

Bạn đọc được không? Một "bài báo" (`article`) mang class `product-card`, sản phẩm số 3, loại trà ướp. Bên trong có tên, giá, tồn kho và nút "Thêm vào giỏ". Đọc HTML thành thạo như vậy là bạn đã đi được nửa đường tới locator rồi.
