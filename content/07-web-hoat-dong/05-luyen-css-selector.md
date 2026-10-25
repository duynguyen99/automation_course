---
title: "Luyện tập: CSS selector"
type: locator
minutes: 14
locator:
  - prompt: 'Tìm ô nhập **tên đăng nhập** bằng `id`'
    accept: css
    answer: '#username'
    html: |
      <form id="login-form">
        <label>Tên đăng nhập <input type="text" id="username" name="username"></label>
        <label>Mật khẩu <input type="password" id="password" name="password"></label>
        <button type="submit" id="login-btn" class="btn btn-primary">Đăng nhập</button>
      </form>
  - prompt: 'Tìm **tất cả** nút "Thêm vào giỏ" (dùng `class`)'
    accept: css
    answer: '.add-to-cart'
    html: |
      <div class="product-card">
        <h3 class="product-name">Trà Shan Tuyết</h3>
        <button class="btn add-to-cart">Thêm vào giỏ</button>
      </div>
      <div class="product-card">
        <h3 class="product-name">Trà Ô Long</h3>
        <button class="btn add-to-cart">Thêm vào giỏ</button>
      </div>
      <button class="btn">Xem thêm</button>
  - prompt: 'Tìm ô nhập có thuộc tính `name="email"`'
    accept: css
    answer: 'input[name="email"]'
    html: |
      <form>
        <input type="text" name="fullname" placeholder="Họ tên">
        <input type="email" name="email" placeholder="Email">
        <input type="tel" name="phone" placeholder="Số điện thoại">
      </form>
  - prompt: 'Chỉ tìm **tên sản phẩm** nằm trong thẻ có class `product-card` (không lấy tiêu đề trang)'
    accept: css
    answer: '.product-card .product-name'
    html: |
      <h1 class="product-name">Tất cả sản phẩm</h1>
      <div class="product-card"><h3 class="product-name">Trà Sen</h3><span class="price">420.000₫</span></div>
      <div class="product-card"><h3 class="product-name">Trà Nhài</h3><span class="price">150.000₫</span></div>
  - prompt: 'Tìm dòng chữ **"Hết hàng"** màu đỏ: phần tử có **cả hai** class `stock` và `out-of-stock`'
    accept: css
    answer: '.stock.out-of-stock'
    html: |
      <article class="product-card" data-id="4">
        <h3 class="product-name">Trà Nhài Thái Nguyên</h3>
        <span class="stock">Còn 20 sản phẩm</span>
      </article>
      <article class="product-card" data-id="5">
        <h3 class="product-name">Hồng Trà Hà Giang</h3>
        <span class="stock out-of-stock">Hết hàng</span>
      </article>
      <p class="out-of-stock-note">Sản phẩm hết hàng sẽ về trong tuần tới</p>
  - prompt: 'Tìm các nút **đang bị vô hiệu hóa** (có thuộc tính `disabled`)'
    accept: css
    answer: 'button[disabled]'
    html: |
      <div class="product-card" data-id="3">
        <h3 class="product-name">Trà Sen Tây Hồ</h3>
        <button class="btn add-to-cart" data-id="3">Thêm vào giỏ</button>
      </div>
      <div class="product-card" data-id="5">
        <h3 class="product-name">Hồng Trà Hà Giang</h3>
        <button class="btn add-to-cart" data-id="5" disabled>Hết hàng</button>
      </div>
      <button id="checkout-btn" class="btn" disabled>Thanh toán</button>
  - prompt: 'Tìm các ô nhập có `placeholder` **chứa** chữ `Tìm`'
    accept: css
    answer: 'input[placeholder*="Tìm"]'
    html: |
      <input type="text" id="search" placeholder="Tìm sản phẩm...">
      <input type="email" id="newsletter-email" placeholder="Email của bạn">
      <input type="text" class="order-search" placeholder="Tìm theo mã đơn">
  - prompt: 'Chỉ lấy các `article` là **con trực tiếp** của `#product-list` (không lấy sản phẩm trong khung "Gợi ý cho bạn")'
    accept: css
    answer: '#product-list > article'
    html: |
      <div id="product-list">
        <article class="product-card" data-id="1"><h3 class="product-name">Trà Shan Tuyết</h3></article>
        <article class="product-card" data-id="2"><h3 class="product-name">Trà Ô Long Lâm Đồng</h3></article>
        <div class="suggest">
          <p>Gợi ý cho bạn</p>
          <article class="product-card" data-id="6"><h3 class="product-name">Ấm Tử Sa Mini</h3></article>
        </div>
      </div>
  - prompt: 'Tìm **hàng thứ 2** trong phần thân bảng (đơn TM1002) bằng `:nth-child`'
    accept: css
    answer: 'tbody tr:nth-child(2)'
    html: |
      <table class="orders">
        <thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Trạng thái</th></tr></thead>
        <tbody>
          <tr><td>TM1001</td><td>Nguyễn Thị Lan</td><td>Đã giao</td></tr>
          <tr><td>TM1002</td><td>Trần Minh Khoa</td><td>Đang giao</td></tr>
          <tr><td>TM1003</td><td>Lê Hoàng Mai</td><td>Đã hủy</td></tr>
        </tbody>
      </table>
---

Lý thuyết đủ rồi, giờ là lúc luyện tay! Mỗi bài dưới đây có:

- **Bên trái**: mã HTML của một đoạn trang web.
- **Bên phải**: trang web đó được hiển thị thật.
- **Ô nhập**: gõ CSS selector, các phần tử khớp sẽ được **tô vàng** ngay lập tức.

Nhắc lại các mẫu hay dùng nhất:

| Mẫu | Ý nghĩa |
|---|---|
| `#login-btn` | phần tử có `id="login-btn"` |
| `.price` | phần tử có class `price` |
| `input[name="email"]` | thẻ `input` có thuộc tính `name="email"` |
| `.card .title` | `.title` nằm **bên trong** `.card` |
| `.stock.out-of-stock` | có **cả hai** class |
| `[placeholder*="Tìm"]` | thuộc tính **chứa** một đoạn chữ |
| `#list > article` | `article` là **con trực tiếp** của `#list` |
| `tr:nth-child(2)` | `tr` là con **thứ 2** của cha nó |

Khi locator khớp **đúng và đủ** các phần tử cần tìm (không thừa, không thiếu), bài sẽ được đánh dấu xanh.
