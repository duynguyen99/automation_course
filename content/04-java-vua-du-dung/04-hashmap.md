---
title: "HashMap: tra cứu theo khóa"
type: code
minutes: 9
seed: |
  import java.util.HashMap;
  import java.util.Map;

  public class Main {
      public static void main(String[] args) {
          Map<String, String> taiKhoan = new HashMap<>();
          // Thêm 3 tài khoản test bằng put

          System.out.println("Có " + taiKhoan.size() + " tài khoản test");
          System.out.println(dangNhap(taiKhoan, "lan", "matkhau123"));
          System.out.println(dangNhap(taiKhoan, "lan", "123456"));
          System.out.println(dangNhap(taiKhoan, "hung", "matkhau123"));
      }

      static String dangNhap(Map<String, String> taiKhoan, String user, String pass) {
          // Viết logic tra cứu ở đây
          return "";
      }
  }
solution: |
  import java.util.HashMap;
  import java.util.Map;

  public class Main {
      public static void main(String[] args) {
          Map<String, String> taiKhoan = new HashMap<>();
          taiKhoan.put("lan", "matkhau123");
          taiKhoan.put("khoa", "matkhau123");
          taiKhoan.put("mai", "maitra2026");

          System.out.println("Có " + taiKhoan.size() + " tài khoản test");
          System.out.println(dangNhap(taiKhoan, "lan", "matkhau123"));
          System.out.println(dangNhap(taiKhoan, "lan", "123456"));
          System.out.println(dangNhap(taiKhoan, "hung", "matkhau123"));
      }

      static String dangNhap(Map<String, String> taiKhoan, String user, String pass) {
          if (!taiKhoan.containsKey(user)) {
              return "Tài khoản không tồn tại";
          }
          if (taiKhoan.get(user).equals(pass)) {
              return "Đăng nhập thành công";
          }
          return "Sai mật khẩu";
      }
  }
checks: |
  eq("ok", () -> call("dangNhap", java.util.Map.of("an", "abc123", "binh", "xyz789"), "binh", "xyz789"), "Đăng nhập thành công", "dangNhap({an, binh}, \"binh\", \"xyz789\")");
  eq("wrong", () -> call("dangNhap", java.util.Map.of("an", "abc123", "binh", "xyz789"), "an", "xyz789"), "Sai mật khẩu", "dangNhap({an, binh}, \"an\", \"xyz789\")");
  eq("missing", () -> call("dangNhap", java.util.Map.of("an", "abc123"), "chi", "abc123"), "Tài khoản không tồn tại", "dangNhap({an}, \"chi\", \"abc123\")");
  eq("empty", () -> call("dangNhap", java.util.Map.of(), "an", "abc123"), "Tài khoản không tồn tại", "dangNhap({}, \"an\", \"abc123\") với Map rỗng");
tests:
  - text: 'Đúng tài khoản và mật khẩu → `Đăng nhập thành công`'
    java: ok
  - text: 'Sai mật khẩu → `Sai mật khẩu`'
    java: wrong
  - text: 'Tài khoản không có trong Map → `Tài khoản không tồn tại`'
    java: missing
  - text: 'Map rỗng cũng không bị lỗi'
    java: empty
  - text: 'Thêm dữ liệu bằng `put`'
    source: 'taiKhoan\.put\s*\('
  - text: 'Console in đúng 4 dòng theo đề'
    stdout: { equals: "Có 3 tài khoản test\nĐăng nhập thành công\nSai mật khẩu\nTài khoản không tồn tại" }
hints:
  - 'Thêm: `taiKhoan.put("lan", "matkhau123");`. Làm tương tự cho `khoa` và `mai`.'
  - 'Kiểm tra trước: `if (!taiKhoan.containsKey(user)) { return "Tài khoản không tồn tại"; }`. Nếu không kiểm tra, `get` sẽ trả về `null` và `.equals` trên `null` làm chương trình bị lỗi.'
  - 'Sau đó so sánh: `taiKhoan.get(user).equals(pass)`.'
---

List giống một hàng người xếp hàng: muốn tìm ai phải đi dọc từ đầu tới cuối. Nhưng nhiều khi bạn muốn **tra cứu thẳng**: "mật khẩu của tài khoản `lan` là gì?", "trình duyệt cấu hình là gì?". Lúc đó dùng **Map**.

## Cuốn danh bạ điện thoại

Map giống cuốn danh bạ: mỗi dòng gồm một **khóa** (*key*, tên người) và một **giá trị** (*value*, số điện thoại). Tra theo tên là ra số ngay, không cần đọc từ đầu.

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> bangGia = new HashMap<>();
bangGia.put("Trà Shan Tuyết", 185000);
bangGia.put("Trà Sen Tây Hồ", 420000);

System.out.println(bangGia.get("Trà Sen Tây Hồ"));   // 420000
System.out.println(bangGia.get("Cà phê"));           // null (không có khóa này)
```

`Map<String, Integer>` nghĩa là: khóa kiểu `String`, giá trị kiểu `Integer`.

| Method | Làm gì |
|---|---|
| `put(k, v)` | thêm cặp k → v. Nếu khóa k đã có thì **ghi đè** giá trị cũ |
| `get(k)` | lấy giá trị của k, không có thì trả về `null` |
| `getOrDefault(k, macDinh)` | như `get`, nhưng không có thì trả về `macDinh` |
| `containsKey(k)` | có khóa k không |
| `size()` | số cặp khóa-giá trị |
| `keySet()` | tập hợp các khóa, dùng để duyệt: `for (String k : bangGia.keySet())` |

> Khóa trong Map là **duy nhất**. `put("lan", "a")` rồi `put("lan", "b")` thì Map vẫn chỉ có một khóa `lan`, giá trị là `"b"`.

> `HashMap` **không giữ thứ tự** lúc bạn thêm vào. Đừng viết test phụ thuộc vào thứ tự in ra của một HashMap.

## Map trong công việc tester

- **Dữ liệu test**: tài khoản → mật khẩu, mã giảm giá → phần trăm giảm.
- **Cấu hình**: `"browser"` → `"chrome"`, `"baseUrl"` → `"http://localhost:4000/practice/"`.
- **Đếm kết quả**: `"PASSED"` → 8, `"FAILED"` → 2. Bạn sẽ làm việc này ở bài tổng hợp.

## Đến lượt bạn

1. Trong `main`, thêm 3 tài khoản test bằng `put`:

| Tài khoản | Mật khẩu |
|---|---|
| `lan` | `matkhau123` |
| `khoa` | `matkhau123` |
| `mai` | `maitra2026` |

2. Viết `dangNhap(taiKhoan, user, pass)`:
   - Không có tài khoản `user` trong Map → `Tài khoản không tồn tại`
   - Có, và mật khẩu khớp → `Đăng nhập thành công`
   - Có, nhưng sai mật khẩu → `Sai mật khẩu`

```
Có 3 tài khoản test
Đăng nhập thành công
Sai mật khẩu
Tài khoản không tồn tại
```
