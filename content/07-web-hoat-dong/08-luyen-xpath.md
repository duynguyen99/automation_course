---
title: "Luyện tập: XPath"
type: locator
minutes: 15
locator:
  - prompt: 'Tìm **nút** có chữ `Đăng nhập` bằng `text()` (không lấy tiêu đề và đường link cùng chữ)'
    accept: xpath
    answer: '#login-btn'
    html: |
      <nav><a href="/practice/login.html" id="nav-login">Đăng nhập</a></nav>
      <h1>Đăng nhập</h1>
      <form id="login-form">
        <input type="text" name="username" placeholder="Nhập tên đăng nhập">
        <input type="password" name="password" placeholder="Nhập mật khẩu">
        <button type="submit" id="login-btn" class="btn">Đăng nhập</button>
      </form>
  - prompt: 'Tìm ô `td` chứa mã đơn **TM1003**'
    accept: xpath
    answer: 'tbody tr:nth-child(3) td:nth-child(1)'
    html: &orders |
      <table class="orders">
        <thead>
          <tr><th>Mã đơn</th><th>Khách hàng</th><th>Thành phố</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr>
        </thead>
        <tbody>
          <tr><td>TM1001</td><td>Nguyễn Thị Lan</td><td>Hà Nội</td><td>370.000₫</td><td><span class="badge">Đã giao</span></td><td><button class="btn secondary view">Xem</button></td></tr>
          <tr><td>TM1002</td><td>Trần Minh Khoa</td><td>TP. Hồ Chí Minh</td><td>840.000₫</td><td><span class="badge">Đang giao</span></td><td><button class="btn secondary view">Xem</button></td></tr>
          <tr><td>TM1003</td><td>Lê Hoàng Mai</td><td>Đà Nẵng</td><td>150.000₫</td><td><span class="badge">Đã hủy</span></td><td><button class="btn secondary view">Xem</button></td></tr>
          <tr><td>TM1004</td><td>Phạm Quốc Bảo</td><td>Cần Thơ</td><td>560.000₫</td><td><span class="badge">Đang giao</span></td><td><button class="btn secondary view">Xem</button></td></tr>
          <tr><td>TM1005</td><td>Võ Thu Hà</td><td>Hà Nội</td><td>1.240.000₫</td><td><span class="badge">Chờ xác nhận</span></td><td><button class="btn secondary view">Xem</button></td></tr>
        </tbody>
      </table>
  - prompt: 'Tìm **tên khách hàng** của đơn **TM1002**: ô đứng ngay sau ô mã đơn (dùng `following-sibling`)'
    accept: xpath
    answer: 'tbody tr:nth-child(2) td:nth-child(2)'
    html: *orders
  - prompt: 'Tìm nút **Xem** của đơn **TM1004** (tìm hàng có ô TM1004, rồi lấy nút bên trong hàng đó)'
    accept: xpath
    answer: 'tbody tr:nth-child(4) button'
    html: *orders
  - prompt: 'Tìm **cả hàng** `tr` của mọi đơn có trạng thái **Đang giao**'
    accept: xpath
    answer: 'tbody tr:nth-child(2), tbody tr:nth-child(4)'
    html: *orders
  - prompt: 'Tìm **thẻ sản phẩm** (`article`) có tên chứa chữ `Trà Sen` (dùng `contains()`)'
    accept: xpath
    answer: 'article[data-id="3"]'
    html: &products |
      <div id="product-list">
        <article class="product-card" data-id="1" data-category="tra-xanh">
          <h3 class="product-name">Trà Shan Tuyết</h3>
          <span class="price">185.000₫</span>
          <button class="btn add-to-cart" data-id="1">
            Thêm vào giỏ
          </button>
        </article>
        <article class="product-card" data-id="3" data-category="tra-uop">
          <h3 class="product-name">Trà Sen Tây Hồ</h3>
          <span class="price">420.000₫</span>
          <button class="btn add-to-cart" data-id="3">
            Thêm vào giỏ
          </button>
        </article>
        <article class="product-card" data-id="5" data-category="hong-tra">
          <h3 class="product-name">Hồng Trà Hà Giang</h3>
          <span class="price">210.000₫</span>
          <button class="btn add-to-cart" data-id="5" disabled>
            Hết hàng
          </button>
        </article>
        <article class="product-card" data-id="6" data-category="dung-cu">
          <h3 class="product-name">Ấm Tử Sa Mini</h3>
          <span class="price">560.000₫</span>
          <button class="btn add-to-cart" data-id="6">
            Thêm vào giỏ
          </button>
        </article>
      </div>
  - prompt: 'Tìm mọi nút có chữ `Thêm vào giỏ`. Để ý khoảng trắng và xuống dòng trong HTML: hãy dùng `normalize-space()`'
    accept: xpath
    answer: '.add-to-cart:not([disabled])'
    html: *products
  - prompt: 'Tìm **giá tiền** của sản phẩm `Ấm Tử Sa Mini` (đi từ tên sản phẩm sang anh em của nó)'
    accept: xpath
    answer: 'article[data-id="6"] .price'
    html: *products
---

Giờ đến lượt XPath! Cách làm giống bài luyện CSS: gõ XPath vào ô nhập (bắt đầu bằng `//`), phần tử khớp được **tô vàng**. Bài chỉ xanh khi XPath chọn **đúng và đủ** các phần tử cần tìm.

Bảng đơn hàng và danh sách sản phẩm ở đây giống hệt trang `table.html` và `products.html` của Tiệm Trà Mộc, nên XPath bạn viết hôm nay sẽ dùng lại được ở chương Selenium.

Nhắc lại các mẫu hay dùng:

| Mẫu | Ý nghĩa |
|---|---|
| `//button[text()='Đăng nhập']` | nút có chữ bằng đúng "Đăng nhập" |
| `//h3[contains(text(), 'Trà')]` | chữ chứa "Trà" |
| `//button[normalize-space()='Xem']` | chữ (bỏ khoảng trắng thừa) bằng "Xem" |
| `//td[text()='TM1001']/following-sibling::td[1]` | ô ngay sau ô TM1001 |
| `//tr[td[text()='TM1001']]//button` | nút nằm trong hàng có ô TM1001 |
| `//span[text()='Đã giao']/ancestor::tr` | hàng `tr` bao quanh chữ "Đã giao" |
| `//h3[text()='...']/..` | phần tử cha của tiêu đề |

> Gõ sai cú pháp (thiếu ngoặc, thiếu nháy) thì ô nhập sẽ báo "XPath chưa đúng cú pháp". Đếm lại từng cặp `[ ]`, `( )` và `' '`.
