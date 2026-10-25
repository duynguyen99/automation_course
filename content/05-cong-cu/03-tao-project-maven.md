---
title: "Tạo project Maven trong IntelliJ"
type: read
minutes: 6
---

Một bộ test automation thật không phải một file `Main.java` lẻ loi. Nó gồm hàng chục class, cần thêm thư viện (JUnit, AssertJ, Selenium), và phải chạy được giống hệt nhau trên máy bạn, máy đồng nghiệp và máy chủ CI. Người lo tất cả những việc đó là **Maven**.

## Maven là gì?

**Maven** là một **công cụ build** (*build tool*). Hãy hình dung nó như người quản lý bếp:

- Bạn ghi vào một tờ "danh sách nguyên liệu" (file `pom.xml`): "tôi cần JUnit bản 6.1.3, Selenium bản 4.51.0".
- Maven tự đi **tải** những thư viện đó từ kho trên mạng (**Maven Central**) về máy.
- Bạn ra lệnh "chạy test", Maven tự biên dịch code rồi chạy toàn bộ test, in báo cáo.

Không có Maven, bạn phải tự tải từng file `.jar` thư viện, tự nhét vào đúng chỗ, và cầu mong đồng nghiệp làm y như vậy. Khóa học dùng **Maven 3.9**. IntelliJ đã có sẵn Maven bên trong, bạn **không cần cài riêng** để bắt đầu.

## Các bước tạo project

1. Mở IntelliJ, ở màn hình Welcome bấm **New Project**. (Nếu đang mở project khác: **File → New → Project...**)
2. Cột bên trái chọn **Java**.
3. Điền thông tin:

| Ô | Điền gì | Ví dụ |
|---|---|---|
| **Name** | tên project | `tramoc-autotest` |
| **Location** | thư mục chứa project | `C:\Users\Lan\projects` |
| **Create Git repository** | để trống lúc này (bài Git sẽ làm tay) | |
| **Build system** | chọn **Maven** | |
| **JDK** | chọn **21** (Temurin) | `temurin-21` |
| **Add sample code** | có thể tích để có sẵn một `Main.java` | |

4. Mở mục **Advanced Settings** ở dưới cùng:
   - **GroupId**: "họ" của project, thường là tên miền công ty viết ngược, ví dụ `vn.tramoc`.
   - **ArtifactId**: "tên" của project, thường trùng với Name: `tramoc-autotest`.
5. Bấm **Create**. Lần đầu IntelliJ có thể mất một lúc để tải và "lập chỉ mục" (*indexing*), thanh tiến trình chạy ở góc dưới bên phải. Hãy đợi nó xong.

> Tên project và thư mục nên dùng **chữ thường, không dấu, không khoảng trắng**, nối bằng gạch ngang. Đường dẫn có dấu tiếng Việt hoặc khoảng trắng đôi khi làm công cụ báo lỗi rất khó hiểu.

## Bạn sẽ thấy gì?

Cột **Project** bên trái hiện ra một cây thư mục và một file tên là **`pom.xml`** đang mở. Đây là hai nhân vật chính của hai trang tiếp theo:

- Cây thư mục: Maven quy định sẵn **đặt file nào ở đâu**.
- `pom.xml`: tờ **danh sách nguyên liệu** của project.

Nếu bạn tích **Add sample code**, mở `src/main/java/.../Main.java` và bấm nút ▶ xanh cạnh `main`. Khung **Run** hiện ra lời chào mà code mẫu in ra (kiểu `Hello and welcome!`), chúc mừng, bạn vừa chạy Java trên máy của chính mình!

## Thử trên máy bạn

- [ ] Tạo project Maven `tramoc-autotest` với JDK 21.
- [ ] Chạy được `Main.java` mẫu và thấy kết quả ở khung **Run**.
