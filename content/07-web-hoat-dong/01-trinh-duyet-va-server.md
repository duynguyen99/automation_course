---
title: "Trình duyệt, server và HTTP"
type: read
minutes: 6
---

Trước khi điều khiển trình duyệt bằng code, ta cần hiểu chuyện gì xảy ra trong một giây kể từ lúc bạn gõ địa chỉ và nhấn Enter. Hãy hình dung bạn gọi món ở **Tiệm Trà Mộc**:

| Ở quán trà | Trên web |
|---|---|
| Bạn (khách) | **trình duyệt** (*browser*): Chrome, Edge, Firefox |
| Phiếu gọi món | **HTTP request** (yêu cầu) |
| Nhà bếp | **server** (máy chủ) |
| Khay đồ uống mang ra | **HTTP response** (phản hồi): thường là một trang HTML |

## URL: địa chỉ của một trang

```text
http://localhost:4000/practice/products.html?sort=price-asc
└─┬─┘  └───┬───┘ └┬─┘ └──────────┬────────┘ └──────┬─────┘
giao thức  tên máy cổng       đường dẫn         tham số
```

| Phần | Ý nghĩa |
|---|---|
| `http` / `https` | **giao thức**: "ngôn ngữ" trình duyệt và server nói với nhau. `https` là bản có mã hóa, an toàn hơn |
| `localhost` | tên máy chủ. `localhost` nghĩa là "chính máy này" (trang mẫu của khóa học chạy ngay trên máy). Trang thật có tên như `tramoc.vn` |
| `4000` | **cổng** (*port*): số "cửa" trên máy chủ. Không ghi thì mặc định là 80 (http) hoặc 443 (https) |
| `/practice/products.html` | **đường dẫn**: trang nào trên server |
| `?sort=price-asc` | **query parameter**: thông tin gửi kèm, dạng `tên=giá trị`, nhiều cái nối bằng `&` |

Bạn đã thấy một tham số như vậy rồi: đăng nhập đúng ở trang mẫu sẽ chuyển tới `account.html?name=Lan`.

## Request và response

Mỗi lần trình duyệt cần một thứ gì đó (trang HTML, ảnh, file CSS, dữ liệu sản phẩm), nó gửi một **request** gồm:

- **Method**: loại yêu cầu. `GET` = "cho tôi xem" (mở trang, tải sản phẩm). `POST` = "tôi gửi dữ liệu lên" (đăng nhập, đặt hàng).
- **URL**: muốn lấy cái gì.
- Có thể có thêm **body**: dữ liệu gửi đi, ví dụ tên đăng nhập và mật khẩu.

Server trả lại một **response** gồm **status code** (mã trạng thái) và nội dung. Tester nên thuộc vài mã này:

| Mã | Nghĩa | Ví dụ |
|---|---|---|
| `200` OK | thành công | mở trang sản phẩm |
| `201` Created | đã tạo mới | đặt hàng thành công |
| `301` / `302` | chuyển hướng sang địa chỉ khác | |
| `400` Bad Request | dữ liệu gửi lên sai | số lượng âm |
| `401` Unauthorized | chưa đăng nhập / sai thông tin | sai mật khẩu |
| `403` Forbidden | không có quyền | tài khoản bị khóa |
| `404` Not Found | không tìm thấy | gõ sai đường dẫn |
| `500` Internal Server Error | server bị lỗi | **gần như chắc chắn là bug**, báo ngay! |

Nhóm `4xx` thường là lỗi phía người gửi, nhóm `5xx` là lỗi phía server.

## Một trang web được ghép từ nhiều mảnh

Khi bạn mở `products.html`, trình duyệt không chỉ gửi một request. Nó tải về:

- **HTML**: bộ khung và nội dung (tiêu đề, nút, ô nhập).
- **CSS**: trang trí (màu, cỡ chữ, bố cục).
- **JavaScript**: làm trang "sống": lọc sản phẩm khi bạn gõ tìm kiếm, hiện thông báo "Đã thêm vào giỏ hàng"...

Selenium làm việc với trang **sau khi** trình duyệt đã ghép xong những mảnh này. Vì thế ở các trang tiếp theo, ta học cách đọc HTML: nơi chứa mọi nút bấm và ô nhập mà test của bạn sẽ chạm vào.

> Ở chương bonus về API, bạn sẽ tự gửi request bằng code (REST Assured) mà không cần trình duyệt. Trang mẫu có sẵn API tại `http://localhost:4000/practice/api/products` (mở thử trong trình duyệt xem!).
