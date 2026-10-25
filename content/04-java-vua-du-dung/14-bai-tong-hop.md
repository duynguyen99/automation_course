---
title: "Bài tổng hợp: Báo cáo kết quả test"
type: code
minutes: 20
files:
  - name: TestStatus.java
    readonly: true
    content: |
      public enum TestStatus {
          PASSED, FAILED, SKIPPED
      }
  - name: Main.java
    content: |
      import java.util.HashMap;
      import java.util.List;
      import java.util.Map;

      public class Main {
          public static void main(String[] args) {
              List<String> lanChay1 = List.of(
                      "Đăng nhập đúng; PASSED",
                      "Đăng nhập sai mật khẩu; PASSED",
                      "Tài khoản bị khóa; failed",
                      "",
                      "Tìm kiếm sản phẩm; PASSED",
                      "Thanh toán; SKIPPED");
              List<String> lanChay2 = List.of("Đăng nhập đúng; PASSED", "Thanh toán PASSED");
              List<String> lanChay3 = List.of("Giỏ hàng; BROKEN");

              System.out.println(baoCao(demKetQua(lanChay1)));
              // Chạy lanChay2 và lanChay3, bắt lỗi và in "Lỗi dữ liệu: " + message

          }

          static TestStatus docTrangThai(String dong) {
              // Bước 1: tách dòng, đổi phần sau dấu ; thành TestStatus
              return TestStatus.PASSED;
          }

          static Map<String, Integer> demKetQua(List<String> dong) {
              Map<String, Integer> dem = new HashMap<>();
              // Bước 2: khởi tạo 3 khóa bằng 0, rồi đếm

              return dem;
          }

          static String baoCao(Map<String, Integer> dem) {
              // Bước 3: trình bày bằng String.format
              return "";
          }
      }
solution:
  Main.java: |
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;

    public class Main {
        public static void main(String[] args) {
            List<String> lanChay1 = List.of(
                    "Đăng nhập đúng; PASSED",
                    "Đăng nhập sai mật khẩu; PASSED",
                    "Tài khoản bị khóa; failed",
                    "",
                    "Tìm kiếm sản phẩm; PASSED",
                    "Thanh toán; SKIPPED");
            List<String> lanChay2 = List.of("Đăng nhập đúng; PASSED", "Thanh toán PASSED");
            List<String> lanChay3 = List.of("Giỏ hàng; BROKEN");

            System.out.println(baoCao(demKetQua(lanChay1)));
            try {
                System.out.println(baoCao(demKetQua(lanChay2)));
            } catch (IllegalArgumentException e) {
                System.out.println("Lỗi dữ liệu: " + e.getMessage());
            }
            try {
                System.out.println(baoCao(demKetQua(lanChay3)));
            } catch (IllegalArgumentException e) {
                System.out.println("Lỗi dữ liệu: " + e.getMessage());
            }
        }

        static TestStatus docTrangThai(String dong) {
            String[] phan = dong.split(";");
            if (phan.length != 2) {
                throw new IllegalArgumentException("Dòng không hợp lệ: " + dong);
            }
            String chu = phan[1].trim().toUpperCase();
            try {
                return TestStatus.valueOf(chu);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ: " + chu);
            }
        }

        static Map<String, Integer> demKetQua(List<String> dong) {
            Map<String, Integer> dem = new HashMap<>();
            for (TestStatus s : TestStatus.values()) {
                dem.put(s.name(), 0);
            }
            for (String d : dong) {
                if (!d.trim().isEmpty()) {
                    String khoa = docTrangThai(d).name();
                    dem.put(khoa, dem.get(khoa) + 1);
                }
            }
            return dem;
        }

        static String baoCao(Map<String, Integer> dem) {
            int dat = dem.get("PASSED");
            int khongDat = dem.get("FAILED");
            int boQua = dem.get("SKIPPED");
            int tong = dat + khongDat + boQua;
            int tiLe = 0;
            if (tong > 0) {
                tiLe = dat * 100 / tong;
            }
            return String.format("Tổng: %d | Đạt: %d | Không đạt: %d | Bỏ qua: %d | Tỉ lệ đạt: %d%%",
                    tong, dat, khongDat, boQua, tiLe);
        }
    }
checks: |
  eq("p1", () -> String.valueOf(call("docTrangThai", "Mở trang chủ; FAILED")), "FAILED", "docTrangThai(\"Mở trang chủ; FAILED\")");
  eq("p2", () -> String.valueOf(call("docTrangThai", "  Đổi mật khẩu ;skipped  ")), "SKIPPED", "docTrangThai(\"  Đổi mật khẩu ;skipped  \")");
  ok("bad1", () -> { try { call("docTrangThai", "Thêm vào giỏ PASSED"); return false; } catch (IllegalArgumentException e) { return "Dòng không hợp lệ: Thêm vào giỏ PASSED".equals(e.getMessage()); } }, "docTrangThai(\"Thêm vào giỏ PASSED\") phải ném IllegalArgumentException với message: Dòng không hợp lệ: Thêm vào giỏ PASSED");
  ok("bad2", () -> { try { call("docTrangThai", "A; B; PASSED"); return false; } catch (IllegalArgumentException e) { return "Dòng không hợp lệ: A; B; PASSED".equals(e.getMessage()); } }, "Dòng có 2 dấu ; (\"A; B; PASSED\") cũng là dòng không hợp lệ");
  ok("bad3", () -> { try { call("docTrangThai", "Giỏ hàng; done"); return false; } catch (IllegalArgumentException e) { return "Trạng thái không hợp lệ: DONE".equals(e.getMessage()); } }, "docTrangThai(\"Giỏ hàng; done\") phải ném IllegalArgumentException với message: Trạng thái không hợp lệ: DONE");
  eq("count", () -> call("demKetQua", java.util.List.of("a; PASSED", "b; FAILED", "   ", "c; passed")), java.util.Map.of("PASSED", 2, "FAILED", 1, "SKIPPED", 0), "demKetQua([a PASSED, b FAILED, dòng trống, c passed])");
  eq("empty", () -> call("demKetQua", java.util.List.of()), java.util.Map.of("PASSED", 0, "FAILED", 0, "SKIPPED", 0), "demKetQua([]) với list rỗng");
  throwsEx("countBad", () -> call("demKetQua", java.util.List.of("a; PASSED", "hỏng")), "IllegalArgumentException", "demKetQua có dòng \"hỏng\"");
  eq("report", () -> call("baoCao", java.util.Map.of("PASSED", 1, "FAILED", 1, "SKIPPED", 2)), "Tổng: 4 | Đạt: 1 | Không đạt: 1 | Bỏ qua: 2 | Tỉ lệ đạt: 25%", "baoCao({PASSED=1, FAILED=1, SKIPPED=2})");
  eq("report0", () -> call("baoCao", java.util.Map.of("PASSED", 0, "FAILED", 0, "SKIPPED", 0)), "Tổng: 0 | Đạt: 0 | Không đạt: 0 | Bỏ qua: 0 | Tỉ lệ đạt: 0%", "baoCao khi chưa có test nào");
tests:
  - text: '`docTrangThai` đọc đúng trạng thái `FAILED`'
    java: p1
  - text: 'Bỏ dấu cách thừa và chấp nhận chữ thường (`skipped` → `SKIPPED`)'
    java: p2
  - text: 'Dòng thiếu dấu `;` → `IllegalArgumentException` với message `Dòng không hợp lệ: ...`'
    java: bad1
  - text: 'Dòng có hai dấu `;` cũng không hợp lệ'
    java: bad2
  - text: 'Trạng thái lạ → message `Trạng thái không hợp lệ: DONE`'
    java: bad3
  - text: '`demKetQua` đếm đúng và bỏ qua dòng trống'
    java: count
  - text: 'List rỗng → cả 3 khóa đều bằng `0`'
    java: empty
  - text: 'Có dòng hỏng thì `demKetQua` không nuốt lỗi, để exception bay ra ngoài'
    java: countBad
  - text: '`baoCao` trình bày đúng mẫu, tỉ lệ `25%`'
    java: report
  - text: '`baoCao` không chia cho 0 khi chưa có test nào'
    java: report0
  - text: 'Console in đúng 3 dòng theo đề'
    stdout: { equals: "Tổng: 5 | Đạt: 3 | Không đạt: 1 | Bỏ qua: 1 | Tỉ lệ đạt: 60%\nLỗi dữ liệu: Dòng không hợp lệ: Thanh toán PASSED\nLỗi dữ liệu: Trạng thái không hợp lệ: BROKEN" }
hints:
  - '`docTrangThai`: `String[] phan = dong.split(";");`, kiểm tra `phan.length != 2` thì ném lỗi. Phần trạng thái: `phan[1].trim().toUpperCase()`.'
  - '`TestStatus.valueOf(chu)` tự ném `IllegalArgumentException` khi chữ không khớp, nhưng message của nó bằng tiếng Anh. Bọc nó trong `try / catch`, rồi trong `catch` ném một `IllegalArgumentException` mới với message của bạn.'
  - '`demKetQua`: duyệt `TestStatus.values()` để `put(s.name(), 0)`. Đếm: `dem.put(khoa, dem.get(khoa) + 1);`. Bỏ dòng trống bằng `if (!d.trim().isEmpty())`.'
---

Bài cuối của phần Java! Sau mỗi lần chạy, bộ test xuất ra một file kết quả, mỗi dòng có dạng `tên test; TRẠNG THÁI`. Nhiệm vụ của bạn: đọc dữ liệu đó, đếm, và in ra **một dòng báo cáo** cho cả đội. Dữ liệu thật thì không bao giờ sạch: có dòng trống, có chữ thường, có dòng bị hỏng.

## Một công cụ mới: `split`

```java
String[] phan = "Đăng nhập đúng; PASSED".split(";");
// phan[0] = "Đăng nhập đúng"
// phan[1] = " PASSED"   (để ý dấu cách ở đầu, cần trim)
// phan.length = 2
```

`split(";")` cắt chuỗi tại mỗi dấu `;` và trả về một **mảng** các phần. Không có dấu `;` nào thì mảng chỉ có 1 phần.

## Bước 1: `docTrangThai(dong)`

Đọc **một** dòng, trả về `TestStatus`:

- Tách bằng `split(";")`. Nếu số phần **khác 2** → ném `IllegalArgumentException` với message `Dòng không hợp lệ: ` + dòng gốc.
- Lấy phần thứ hai, bỏ dấu cách hai đầu, đổi thành chữ **hoa** (để `failed` cũng được chấp nhận).
- Đổi sang enum bằng `TestStatus.valueOf(...)`. Nếu chữ không khớp → ném `IllegalArgumentException` với message `Trạng thái không hợp lệ: ` + chữ đã đổi hoa (ví dụ `BROKEN`).

## Bước 2: `demKetQua(dong)`

Trả về `Map<String, Integer>` luôn có đủ 3 khóa `PASSED`, `FAILED`, `SKIPPED`:

- Bắt đầu cả 3 khóa bằng `0` (gợi ý: duyệt `TestStatus.values()`, dùng `s.name()` để lấy tên dạng String).
- Duyệt từng dòng. Dòng trống (hoặc toàn dấu cách) thì **bỏ qua**. Dòng còn lại gọi `docTrangThai` rồi tăng đếm.
- **Không** bắt lỗi ở đây. Dữ liệu hỏng thì để exception bay ra cho nơi gọi biết.

## Bước 3: `baoCao(dem)`

Dùng `String.format` trả về đúng mẫu:

```
Tổng: 5 | Đạt: 3 | Không đạt: 1 | Bỏ qua: 1 | Tỉ lệ đạt: 60%
```

Tỉ lệ đạt = số đạt × 100 / tổng (chia số nguyên). Nếu tổng bằng 0 thì tỉ lệ là `0`.

## Bước 4: `main`

Dòng đầu (`lanChay1`) đã có sẵn. Thêm phần chạy `lanChay2` và `lanChay3`, mỗi lần bọc trong `try / catch (IllegalArgumentException e)` và in `Lỗi dữ liệu: ` + message:

```
Tổng: 5 | Đạt: 3 | Không đạt: 1 | Bỏ qua: 1 | Tỉ lệ đạt: 60%
Lỗi dữ liệu: Dòng không hợp lệ: Thanh toán PASSED
Lỗi dữ liệu: Trạng thái không hợp lệ: BROKEN
```

## Bạn vừa dùng gì?

List, Map, enum, exception (cả ném, bắt và ném lại với message rõ hơn), `String.format`... gần như toàn bộ chương này trong một bài. Đây đúng là loại code "hậu trường" mà một framework automation có: đọc dữ liệu, kiểm tra, tổng hợp, báo cáo.

> Hoàn thành bài này, bạn đã có đủ Java để bước vào thế giới automation. Chương tiếp theo sẽ giới thiệu các công cụ của nghề: Maven, IDE, Git. Rồi sau đó là JUnit và Selenium, nơi bạn sẽ thấy từng khái niệm của hai chương vừa qua xuất hiện lại.
