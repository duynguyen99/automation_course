---
title: "Vì sao cần báo cáo test?"
type: read
minutes: 5
---

Thứ Hai, 9 giờ sáng. Quản lý dự án hỏi bạn: *"Bộ test tối qua chạy thế nào? Có được release chiều nay không?"*

Bạn mở máy, cuộn qua 3.000 dòng chữ trắng trên nền đen trong console... và không trả lời được ngay. Đó là lý do mọi đội automation đều cần **báo cáo test** (*test report*).

## Ai đọc báo cáo, và họ cần gì?

| Người đọc | Họ muốn biết |
|---|---|
| Quản lý, Product Owner | Bao nhiêu % pass? Tính năng nào đang hỏng? Release được chưa? |
| Developer | Test nào fail, fail ở bước nào, thông báo lỗi là gì, **ảnh chụp màn hình** lúc fail |
| Tester (chính bạn) | Test nào hay fail thất thường? Test nào chạy chậm? Xu hướng qua nhiều ngày |

Một báo cáo tốt trả lời được những câu đó **trong 30 giây**, không cần đọc code.

## Báo cáo tốt có gì?

- **Tổng quan**: số test pass / fail / bị bỏ qua, biểu đồ tròn, thời gian chạy.
- **Chi tiết từng test**: các bước đã chạy (step), bước nào fail, thông báo lỗi.
- **Bằng chứng**: ảnh chụp màn hình, log, đôi khi cả video lúc test fail. Developer nhìn ảnh là hiểu ngay, không cần chạy lại.
- **Phân nhóm**: theo tính năng (Đăng nhập, Giỏ hàng...), theo mức độ nghiêm trọng.
- **Lịch sử**: hôm qua pass, hôm nay fail, tức là có code mới làm hỏng.

## Bạn đã có những báo cáo nào?

Thật ra bạn đã gặp báo cáo rồi, chỉ là ở dạng đơn giản:

| Công cụ | Báo cáo có sẵn |
|---|---|
| Maven Surefire (JUnit) | File XML/TXT trong `target/surefire-reports` |
| Cucumber | Plugin `pretty` (console), `html:target/cucumber.html`, `json:target/cucumber.json` |
| Sách này | Tab **Kết quả test** và **Kịch bản** chính là một báo cáo thu nhỏ! |

Những báo cáo này đủ cho bạn khi viết test, nhưng chưa đủ "đẹp" và đủ thông tin để gửi cho cả đội. Trang sau, bạn sẽ làm quen **Allure Report**, công cụ báo cáo phổ biến nhất trong các dự án Java ở Việt Nam.

> Trong chương này, phần lớn là **bài đọc** vì báo cáo và CI chạy trên máy của bạn và trên GitHub, không chạy trong trình duyệt. Hãy đọc kỹ: đây là những thứ nhà tuyển dụng rất hay hỏi ("Bạn đã dùng Allure chưa? CI/CD của dự án chạy thế nào?").
