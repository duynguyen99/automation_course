---
title: "CSS selector chi tiết"
type: read
minutes: 9
---

**CSS selector** là cú pháp mà dân làm web dùng để chọn phần tử cần trang trí. Selenium mượn luôn cú pháp này để **tìm** phần tử. Nó ngắn, nhanh và là loại locator bạn sẽ dùng nhiều nhất.

Các ví dụ dưới đây dựa trên đoạn HTML này (trích từ trang sản phẩm và đăng nhập của Tiệm Trà Mộc):

```html
<div id="product-list">
  <article class="product-card" data-id="1" data-category="tra-xanh">
    <h3 class="product-name">Trà Shan Tuyết</h3>
    <span class="price">185.000₫</span>
    <button class="btn add-to-cart" data-id="1">Thêm vào giỏ</button>
  </article>
  <article class="product-card" data-id="5" data-category="hong-tra">
    <h3 class="product-name">Hồng Trà Hà Giang</h3>
    <span class="price">210.000₫</span>
    <span class="stock out-of-stock">Hết hàng</span>
    <button class="btn add-to-cart" data-id="5" disabled>Hết hàng</button>
  </article>
</div>
<input type="text" id="search" placeholder="Tìm sản phẩm...">
```

## 1. Năm mẫu cơ bản

| Selector | Chọn | Ví dụ khớp |
|---|---|---|
| `button` | theo **tên thẻ** | cả hai nút |
| `#search` | theo **id** (dấu `#`) | ô tìm kiếm |
| `.price` | theo **class** (dấu `.`) | cả hai giá tiền |
| `[data-id="5"]` | theo **thuộc tính** | thẻ `article` số 5 **và** nút số 5 |
| `button[data-id="5"]` | thẻ + thuộc tính | chỉ nút số 5 |

Ghép thẻ với id/class/thuộc tính (viết **liền nhau**, không dấu cách) để chọn chặt hơn: `input#search`, `span.price`, `article[data-category="hong-tra"]`.

## 2. Nhiều class cùng lúc

```css
.stock.out-of-stock
```

Hai class viết **liền nhau** nghĩa là phần tử phải có **cả hai** class. Selector trên chỉ chọn dòng "Hết hàng", không chọn những dòng `.stock` thường. Tương tự, `.btn.add-to-cart` = phần tử có cả `btn` lẫn `add-to-cart`.

> Chú ý dấu cách! `.btn.add-to-cart` (liền) và `.btn .add-to-cart` (có cách) mang nghĩa **hoàn toàn khác**, xem mục 4.

## 3. So khớp một phần giá trị thuộc tính

| Selector | Nghĩa | Ví dụ |
|---|---|---|
| `[attr="x"]` | bằng đúng `x` | `[data-category="tra-xanh"]` |
| `[attr*="x"]` | **chứa** `x` | `[placeholder*="Tìm"]` |
| `[attr^="x"]` | **bắt đầu** bằng `x` | `[href^="/practice/"]` |
| `[attr$="x"]` | **kết thúc** bằng `x` | `[href$="cart.html"]` |
| `[attr]` | chỉ cần **có** thuộc tính đó | `button[disabled]`: các nút bị vô hiệu hóa |

`*=` rất có ích khi id có phần đuôi thay đổi, ví dụ `id="product-3821"`: dùng `[id^="product-"]`.

## 4. Quan hệ cha con

| Selector | Nghĩa |
|---|---|
| `A B` (dấu cách) | `B` nằm **bên trong** `A`, ở bất kỳ độ sâu nào (**descendant**) |
| `A > B` | `B` là **con trực tiếp** của `A` (**child**) |

```css
#product-list .price           /* mọi giá tiền nằm trong danh sách sản phẩm */
#product-list > article        /* các article là con trực tiếp của #product-list */
article[data-id="5"] button    /* nút nằm trong sản phẩm số 5 */
```

Mẫu `cha con` cực kỳ hay dùng: khi có nhiều nút giống hệt nhau, ta khoanh vùng theo "hộp" chứa nó trước, rồi mới tìm nút bên trong.

## 5. Vị trí: :nth-child và bạn bè

| Selector | Nghĩa |
|---|---|
| `li:first-child` | `li` là con **đầu tiên** của cha nó |
| `li:last-child` | con **cuối cùng** |
| `tr:nth-child(2)` | `tr` là con **thứ 2** của cha (đếm từ **1**, không phải 0 như mảng Java!) |
| `article:nth-of-type(2)` | `article` thứ 2 **trong số các `article`** cùng cha |
| `button:not([disabled])` | nút **không** bị vô hiệu hóa |

`:nth-child(n)` đếm **tất cả** các con, bất kể là thẻ gì, rồi mới kiểm tra tên thẻ. Ví dụ trong `article` thứ hai ở trên, `span:nth-child(2)` khớp giá tiền (con thứ 2 là một `span`), nhưng `span:nth-child(1)` không khớp gì vì con đầu tiên là `h3`.

> Locator dựa vào vị trí (`:nth-child`) dễ gãy: sản phẩm mới được thêm lên đầu là test chọn nhầm. Chỉ dùng khi thứ tự chính là điều bạn muốn kiểm tra, ví dụ "sau khi sắp xếp, sản phẩm đầu tiên phải là Trà Nhài".

## 6. CSS không làm được gì?

- **Không tìm theo nội dung chữ.** Không có CSS selector nào nghĩa là "nút có chữ Đăng nhập".
- **Không đi ngược lên cha.** Từ giá tiền không thể "leo lên" thẻ sản phẩm chứa nó.

Hai việc đó là sở trường của **XPath** (trang 7). Còn lại, hãy ưu tiên CSS.

## Tóm tắt bỏ túi

| Mục đích | Mẫu |
|---|---|
| theo id | `#login-btn` |
| theo class | `.add-to-cart` |
| có cả hai class | `.stock.out-of-stock` |
| theo thuộc tính | `input[name="email"]` |
| thuộc tính chứa | `[placeholder*="Tìm"]` |
| bên trong | `.product-card .price` |
| con trực tiếp | `#product-list > article` |
| theo vị trí | `tr:nth-child(2)` |

Trang sau, bạn luyện tay ngay trên những đoạn HTML thật.
