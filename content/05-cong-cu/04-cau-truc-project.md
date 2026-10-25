---
title: "Cấu trúc một project Maven"
type: read
minutes: 5
---

Trong một siêu thị, rau ở quầy rau, sữa ở quầy sữa. Bạn đến siêu thị nào cũng tìm được đồ. Maven làm y như vậy với code: **mọi project Maven trên thế giới đều xếp file theo cùng một cách**. Nhờ đó, ngày đầu đi làm, mở project của công ty ra là bạn biết ngay test nằm ở đâu.

## Cây thư mục chuẩn

```text
tramoc-autotest/
├── pom.xml                      ← "danh sách nguyên liệu" của project
├── src/
│   ├── main/
│   │   ├── java/                ← code chính của ứng dụng
│   │   └── resources/           ← file cấu hình cho code chính
│   └── test/
│       ├── java/                ← CODE TEST: nơi bạn làm việc nhiều nhất
│       │   └── vn/tramoc/
│       │       └── LoginTest.java
│       └── resources/           ← dữ liệu test: file .properties, .csv, .feature
└── target/                      ← Maven tự sinh ra khi build, KHÔNG sửa tay
```

| Thư mục | Chứa gì | Ví dụ trong dự án automation |
|---|---|---|
| `src/main/java` | code của sản phẩm | với dự án chỉ có test, thư mục này thường gần như trống |
| `src/test/java` | các class test | `LoginTest.java`, page object `LoginPage.java` |
| `src/test/resources` | file không phải Java mà test cần | `config.properties` (URL trang web), `users.csv`, file kịch bản `.feature` của Cucumber |
| `target` | kết quả build: file `.class`, báo cáo test | `target/surefire-reports/` chứa báo cáo sau khi chạy test |

Khi bạn bấm chạy test, Maven biên dịch code trong `src/test/java` rồi bỏ kết quả vào `target/test-classes`. Thư mục `target` có thể xóa bất cứ lúc nào, lần build sau Maven sẽ tạo lại. Chính vì vậy sau này ta sẽ **không** đưa nó lên Git.

## Package và thư mục đi đôi với nhau

Trong Java, **package** là "họ" của một class, giúp class cùng tên ở hai nơi không đụng nhau. Package luôn khớp với thư mục:

```java
// File: src/test/java/vn/tramoc/LoginTest.java
package vn.tramoc;

class LoginTest { ... }
```

Package `vn.tramoc` nằm ở thư mục `vn/tramoc/`. Sai một chữ là IntelliJ gạch đỏ ngay.

> Trên trang web này, bài JUnit dùng **default package** (không có dòng `package`) cho gọn. Trong project thật, luôn đặt class vào một package.

## IntelliJ tô màu thư mục

Trong cột **Project**, IntelliJ tô màu để bạn biết thư mục nào làm gì:

| Màu biểu tượng | Ý nghĩa |
|---|---|
| Xanh dương | **Sources Root**: code chính (`src/main/java`) |
| Xanh lá | **Test Sources Root**: code test (`src/test/java`) |
| Có sọc vàng | **Resources** |
| Cam / bị làm mờ | **Excluded**: bị bỏ qua, ví dụ `target` |

Nếu bạn tạo class test mà không chạy được, hãy kiểm tra xem nó có nằm trong thư mục **xanh lá** không. Đó là lỗi người mới hay gặp nhất: đặt test vào `src/main/java`.

## Thử trên máy bạn

- [ ] Trong project `tramoc-autotest`, chuột phải `src/test/java` → **New → Package**, đặt tên `vn.tramoc`.
- [ ] Nếu chưa có thư mục `src/test/resources`, chuột phải `src/test` → **New → Directory**, IntelliJ sẽ gợi ý sẵn `resources`.
