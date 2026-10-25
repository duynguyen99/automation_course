---
title: "Chạy test bằng lệnh Maven"
type: read
minutes: 7
---

Trong IntelliJ, bấm nút ▶ là chạy được test. Vậy tại sao phải học lệnh? Vì máy chủ **CI** (chương 11), nơi test tự chạy mỗi đêm, không có ai ngồi bấm chuột cả. Nó chỉ chạy đúng một dòng lệnh: `mvn clean test`. Nếu lệnh đó chạy được trên máy bạn, nó sẽ chạy được ở mọi nơi.

## Gõ lệnh Maven ở đâu?

| Cách | Làm thế nào | Cần cài Maven riêng? |
|---|---|---|
| **Run Anything** | nhấn `Ctrl` hai lần, gõ `mvn clean test`, Enter | Không, dùng Maven có sẵn trong IntelliJ |
| **Cửa sổ Maven** | bấm chữ **m** bên phải → **Lifecycle** → nháy đúp **test** | Không |
| **Terminal / cmd** | `Alt+F12`, gõ lệnh | **Có** |

Muốn gõ `mvn` trong cmd: tải file `apache-maven-3.9.x-bin.zip` ở **maven.apache.org**, giải nén vào `C:\tools\`, rồi thêm thư mục `C:\tools\apache-maven-3.9.x\bin` vào PATH (tìm "Edit the system environment variables" trong Windows). Mở cmd mới, gõ `mvn -v` để kiểm tra: dòng đầu là `Apache Maven 3.9...`, có một dòng `Java version: 21...`.

> Nhiều project có sẵn file **`mvnw.cmd`** (*Maven Wrapper*) ở thư mục gốc. Khi đó gõ `mvnw.cmd clean test` thay cho `mvn clean test`, máy không cần cài Maven, wrapper tự tải đúng phiên bản cho project.

## Vòng đời build (lifecycle)

Maven làm việc theo các **giai đoạn** (*phase*) nối tiếp nhau, giống dây chuyền đóng gói trà:

```text
validate → compile → test-compile → test → package → verify → install
```

Khi bạn yêu cầu một giai đoạn, Maven chạy **tất cả giai đoạn đứng trước nó**. Gõ `mvn test` thì Maven tự kiểm tra pom, biên dịch code chính, biên dịch code test, rồi mới chạy test.

## Các lệnh tester dùng hằng ngày

| Lệnh | Làm gì |
|---|---|
| `mvn clean` | xóa thư mục `target/` (dọn sạch kết quả cũ) |
| `mvn test` | biên dịch và chạy **toàn bộ** test |
| `mvn clean test` | dọn sạch rồi chạy lại từ đầu. **Lệnh quan trọng nhất** |
| `mvn test -Dtest=LoginTest` | chỉ chạy class `LoginTest` |
| `mvn test -Dtest=LoginTest#loginWithWrongPassword` | chỉ chạy **một** method test |
| `mvn test -Dtest="Login*"` | chạy mọi class có tên bắt đầu bằng `Login` |

`-D` nghĩa là "truyền một thiết lập cho Maven". Ở đây ta đặt thiết lập `test` bằng tên class muốn chạy.

> **PowerShell** hiểu sai một số tham số có dấu chấm hoặc dấu `#`. Nếu lệnh báo lỗi lạ, hãy bọc tham số trong ngoặc kép: `mvn test "-Dtest=LoginTest#loginWithWrongPassword"`. Trong `cmd` thì không cần.

## Đọc kết quả

Sau khi chạy `mvn clean test`, cuối màn hình sẽ có một đoạn như sau:

```text
[INFO] Results:
[INFO]
[ERROR] Failures:
[ERROR]   LoginTest.loginWithWrongPassword:31
expected: "Sai tên đăng nhập hoặc mật khẩu"
 but was: "Đăng nhập thành công"
[INFO]
[ERROR] Tests run: 5, Failures: 1, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD FAILURE
[INFO] ------------------------------------------------------------------------
```

Hãy đọc từ dưới lên:

| Dòng | Ý nghĩa |
|---|---|
| `BUILD SUCCESS` / `BUILD FAILURE` | tất cả test pass / có ít nhất một test không pass |
| `Tests run: 5` | đã chạy 5 test |
| `Failures: 1` | 1 test **fail**: chạy xong nhưng kết quả sai so với mong đợi (có thể là bug!) |
| `Errors: 0` | test bị **lỗi** giữa chừng do exception bất ngờ (thường là lỗi code test) |
| `Skipped: 0` | test bị **bỏ qua** có chủ đích |
| `LoginTest.loginWithWrongPassword:31` | test nào fail, ở dòng số mấy |

Báo cáo chi tiết của từng class test nằm trong `target/surefire-reports/`. Chương 11, bạn sẽ biến chúng thành báo cáo đẹp bằng Allure.

## Thử trên máy bạn

- [ ] Nhấn `Ctrl` hai lần, chạy `mvn clean test`. Project chưa có test nào nên bạn sẽ thấy `BUILD SUCCESS` với `No tests to run` hoặc `Tests run: 0`. Vậy là Maven đã hoạt động!
