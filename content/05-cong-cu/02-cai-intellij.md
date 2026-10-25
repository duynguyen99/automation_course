---
title: "Cài IntelliJ IDEA"
type: read
minutes: 6
---

Viết Java bằng Notepad cũng được, giống như nấu cơm bằng nồi gang trên bếp củi: được, nhưng mệt. Kỹ sư dùng một **IDE** (*Integrated Development Environment*, môi trường phát triển tích hợp): một phần mềm gom trình soạn code, nút chạy, công cụ tìm lỗi, Maven, Git... vào một chỗ.

Với Java, IDE phổ biến nhất là **IntelliJ IDEA** của hãng JetBrains. Hầu hết các team automation ở Việt Nam đều dùng nó.

## Bản nào miễn phí?

Từ bản 2025.3, JetBrains gộp hai bản cũ (*Community* miễn phí và *Ultimate* trả phí) thành **một bộ cài duy nhất** tên là **IntelliJ IDEA**. Mọi thứ khóa học cần (Java, Maven, Git, JUnit, Cucumber) đều nằm trong phần **miễn phí**. Chỉ vài tính năng nâng cao (ví dụ công cụ cho Spring, database) mới cần mua.

> Nếu trang tải hoặc bài hướng dẫn trên mạng vẫn ghi **IntelliJ IDEA Community Edition**, cứ tải bản đó. Với người học automation, hai bản dùng y như nhau.

## Các bước cài đặt

1. Vào **jetbrains.com/idea/download**, chọn **Windows**, tải file `.exe`.
2. Chạy bộ cài. Ở màn hình **Installation Options**, nên tích:
   - **Create Desktop Shortcut**: tạo biểu tượng ngoài màn hình.
   - **Add "Open Folder as Project"**: chuột phải vào thư mục là mở được bằng IntelliJ.
   - **Add "bin" folder to the PATH**: tùy chọn, không bắt buộc.
3. Bấm **Install**, đợi xong. Có thể bộ cài đề nghị khởi động lại máy, cứ làm theo.
4. Mở IntelliJ lần đầu: đồng ý điều khoản, chọn giao diện sáng hoặc tối tùy thích. Nếu được hỏi dùng thử tính năng trả phí, bạn có thể bỏ qua; phần miễn phí vẫn dùng được mãi mãi.

## IntelliJ cũng tải được JDK

Nếu trang trước bạn gặp khó khi cài JDK, có một lối tắt: khi tạo project (trang sau), ô **JDK** có mục **Download JDK...**. Chọn **Version 21**, **Vendor: Eclipse Temurin**, bấm **Download**, IntelliJ tự lo phần còn lại.

Nhược điểm: JDK đó chỉ IntelliJ biết. Gõ `java -version` ở cmd vẫn có thể báo lỗi. Vì vậy cách tốt nhất vẫn là cài JDK như trang trước, rồi để IntelliJ tự nhận ra nó.

## Một vòng quanh giao diện

| Khu vực | Dùng để |
|---|---|
| **Project** (cột bên trái, `Alt+1`) | xem cây thư mục và file của project |
| **Editor** (giữa) | viết code, mỗi file một tab |
| Nút ▶ xanh cạnh tên class/method | chạy chương trình hoặc chạy một test |
| **Run** (khung dưới) | xem kết quả, giống khung Console của trang này |
| **Maven** (biểu tượng chữ **m** bên phải) | chạy lệnh Maven, tải lại thư viện |
| **Terminal** (`Alt+F12`) | cửa sổ dòng lệnh ngay trong IntelliJ |

Vài phím tắt đáng nhớ ngay từ đầu:

| Phím | Tác dụng |
|---|---|
| `Ctrl+Space` | gợi ý code |
| `Alt+Enter` | "sửa giúp tôi": thêm import, sửa lỗi nhỏ |
| `Ctrl+Alt+L` | căn chỉnh lại code cho đẹp |
| `Shift` hai lần | tìm bất cứ thứ gì (file, class, cài đặt) |
| `Ctrl` hai lần | **Run Anything**: gõ một lệnh như `mvn clean test` |

> Đừng cố học hết phím tắt. Mỗi tuần nhớ thêm một phím là đủ. `Alt+Enter` là phím bạn sẽ dùng nhiều nhất.

## Thử trên máy bạn

- [ ] Cài xong IntelliJ IDEA và mở được màn hình **Welcome**.
- [ ] Bấm `Shift` hai lần, gõ `theme` để thử đổi giao diện sáng/tối.
