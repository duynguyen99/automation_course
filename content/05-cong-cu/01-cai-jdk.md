---
title: "Cài JDK 21 trên Windows"
type: read
minutes: 7
---

Từ chương 1 đến giờ, code của bạn chạy trên máy chủ của trang web này. Người đi làm thì không như vậy: họ viết và chạy test ngay trên **laptop của mình**. Chương này giúp bạn dựng một "bàn làm việc" giống hệt kỹ sư thật. Hãy coi nó như dọn bếp trước khi nấu: hơi mất công một lần, nhưng nấu bao nhiêu món sau đó cũng nhẹ nhàng.

## JDK là gì?

Để máy tính hiểu được code Java, bạn cần cài **JDK** (*Java Development Kit*, bộ công cụ phát triển Java). Trong đó có hai thứ quan trọng:

| Công cụ | Việc nó làm |
|---|---|
| `javac` | **biên dịch** (*compile*): dịch file `.java` thành file `.class` mà máy hiểu được |
| `java` | **chạy** chương trình đã biên dịch |

Khóa học dùng **Java 21**, một bản **LTS** (*Long-Term Support*, được hỗ trợ lâu dài). Rất nhiều công ty ở Việt Nam đang dùng Java 21 cho dự án automation. Bạn có thể thấy Java 25 (LTS mới hơn, ra tháng 9/2025); mọi thứ trong khóa học chạy tốt trên cả hai, nhưng hãy cài 21 để giống với bài học nhất.

> JUnit 6, thư viện test ở chương sau, cần **Java 17 trở lên**. Java 21 thoải mái đáp ứng.

## Các bước cài đặt

Có nhiều "nhà phân phối" JDK miễn phí và giống nhau về chất lượng. Ta dùng **Eclipse Temurin**, bản phổ biến nhất:

1. Mở trình duyệt, vào **adoptium.net**.
2. Chọn phiên bản **21 - LTS**, hệ điều hành **Windows**, kiến trúc **x64**, rồi tải file **`.msi`** (bộ cài).
3. Mở file vừa tải, bấm **Next** đến màn hình **Custom Setup**. Ở đây có một danh sách tính năng:
   - **Add to PATH**: để mặc định (đã được chọn).
   - **Set JAVA_HOME variable**: bấm vào biểu tượng ổ đĩa bên cạnh, chọn **"Will be installed on local hard drive"**. Mục này mặc định **không** được chọn, nhưng Maven và nhiều công cụ khác cần nó.
4. Bấm **Next**, **Install**, đợi chạy xong rồi **Finish**.

**PATH** là danh sách những thư mục mà Windows tìm đến khi bạn gõ một lệnh. Nhờ có Java trong PATH, bạn gõ `java` ở bất kỳ đâu cũng được. **JAVA_HOME** là một biến cho các công cụ khác biết "Java nằm ở thư mục nào".

## Kiểm tra: `java -version`

Mở cửa sổ dòng lệnh: bấm phím **Windows**, gõ `cmd` (hoặc `PowerShell`), Enter. Gõ lệnh sau rồi Enter:

```text
java -version
```

Nếu cài đúng, bạn sẽ thấy đại khái như sau (số phiên bản nhỏ có thể khác):

```text
openjdk version "21.0.8" 2025-07-15 LTS
OpenJDK Runtime Environment Temurin-21.0.8+9 (build 21.0.8+9-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.8+9 (build 21.0.8+9-LTS, mixed mode, sharing)
```

Dòng đầu tiên phải có số **21**. Kiểm tra thêm trình biên dịch và biến JAVA_HOME:

```text
javac -version
echo %JAVA_HOME%
```

Lệnh `echo` ở trên dành cho `cmd`. Nếu dùng PowerShell, gõ `echo $env:JAVA_HOME`. Kết quả nên là một đường dẫn kiểu `C:\Program Files\Eclipse Adoptium\jdk-21...`.

## Khi có lỗi

| Bạn thấy | Nguyên nhân hay gặp | Cách xử lý |
|---|---|---|
| `'java' is not recognized as an internal or external command` | Cửa sổ dòng lệnh được mở **trước** khi cài xong, hoặc chưa có trong PATH | Đóng hết cửa sổ cmd, mở lại. Nếu vẫn lỗi, cài lại và nhớ để **Add to PATH** |
| Hiện phiên bản `1.8` hoặc `17` | Máy đã có Java cũ và nó đứng trước trong PATH | Gỡ bản cũ trong **Settings → Apps**, hoặc đưa thư mục JDK 21 lên đầu PATH |
| `echo %JAVA_HOME%` in ra nguyên chữ `%JAVA_HOME%` | Chưa bật **Set JAVA_HOME** | Chạy lại file `.msi`, chọn **Change**, bật mục đó |

> Gặp lỗi khi cài đặt là chuyện **rất bình thường**, kể cả với lập trình viên lâu năm. Đọc kỹ thông báo lỗi, đối chiếu với bảng trên, và đừng ngại copy nguyên câu lỗi lên Google.

## Thử trên máy bạn

- [ ] Cài Temurin 21 có bật JAVA_HOME.
- [ ] `java -version` in ra số 21.
- [ ] `javac -version` in ra `javac 21...`.

Xong ba việc này, trang sau ta sẽ cài "căn bếp" chính: IntelliJ IDEA.
