---
title: "ArrayList: mảng biết co giãn"
type: code
minutes: 8
seed: |
  import java.util.ArrayList;
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          // Tạo List gioHang và làm theo đề bài

      }
  }
solution: |
  import java.util.ArrayList;
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          List<String> gioHang = new ArrayList<>();
          gioHang.add("Trà Shan Tuyết");
          gioHang.add("Trà Sen Tây Hồ");
          gioHang.add("Ấm Tử Sa Mini");
          System.out.println("Giỏ hàng có " + gioHang.size() + " món");

          gioHang.remove("Ấm Tử Sa Mini");
          System.out.println("Còn lại: " + gioHang);
          System.out.println("Có Trà Sen Tây Hồ? " + gioHang.contains("Trà Sen Tây Hồ"));
          System.out.println("Món đầu tiên: " + gioHang.get(0));
      }
  }
tests:
  - text: 'Tạo list bằng `new ArrayList<>()`'
    source: 'List\s*<\s*String\s*>\s+gioHang\s*=\s*new\s+ArrayList\s*<\s*(String)?\s*>\s*\(\s*\)'
  - text: 'Dùng `add`, `remove`, `contains` và `get`'
    source: '\.add\([\s\S]*\.remove\([\s\S]*\.contains\([\s\S]*\.get\('
  - text: 'Đếm số món bằng `size()`, không viết cứng số 3'
    source: 'gioHang\.size\(\)'
  - text: 'Console in đúng 4 dòng theo đề'
    stdout: { equals: "Giỏ hàng có 3 món\nCòn lại: [Trà Shan Tuyết, Trà Sen Tây Hồ]\nCó Trà Sen Tây Hồ? true\nMón đầu tiên: Trà Shan Tuyết" }
hints:
  - 'Tạo list: `List<String> gioHang = new ArrayList<>();`, thêm món: `gioHang.add("Trà Shan Tuyết");`'
  - 'In cả list bằng phép nối chuỗi: `"Còn lại: " + gioHang` sẽ ra dạng `[món 1, món 2]`.'
  - 'Xóa theo tên: `gioHang.remove("Ấm Tử Sa Mini");`. Lấy món đầu: `gioHang.get(0)`.'
---

Mảng ở chương 2 có một điểm yếu: **kích thước cố định**. Tạo mảng 3 ô thì mãi mãi là 3 ô. Nhưng giỏ hàng thì lúc 1 món, lúc 10 món. Và khi Selenium tìm "tất cả sản phẩm trên trang", nó cũng không biết trước sẽ có bao nhiêu.

**`ArrayList`** là một danh sách **tự co giãn**: thêm vào thì dài ra, xóa đi thì ngắn lại.

```java
import java.util.ArrayList;
import java.util.List;

List<String> trinhDuyet = new ArrayList<>();
trinhDuyet.add("Chrome");
trinhDuyet.add("Firefox");
System.out.println(trinhDuyet.size());   // 2
```

## Đọc từng phần

- `import java.util.ArrayList;`: `ArrayList` nằm trong "ngăn" `java.util` của Java (mỗi ngăn như vậy gọi là một **package**), nên phải **import** (khai báo mượn) ở đầu file. `String` thì không cần vì nó ở ngăn mặc định.
- `List<String>`: một danh sách **chỉ chứa String**. Phần trong ngoặc nhọn `< >` nói kiểu của từng phần tử.
- Bên trái là `List` (một **interface**, nhớ chương trước chứ?), bên phải là `ArrayList` (class implements nó). Giống hệt `WebDriver driver = new ChromeDriver();`.
- `new ArrayList<>()`: dấu `<>` rỗng vì Java tự đoán được kiểu từ bên trái.

## Những method dùng nhiều nhất

| Method | Làm gì | Ví dụ |
|---|---|---|
| `add(x)` | thêm vào cuối | `ds.add("Edge")` |
| `get(i)` | lấy phần tử ở vị trí i (đếm từ 0) | `ds.get(0)` |
| `size()` | số phần tử | `ds.size()` |
| `remove(x)` | xóa phần tử x | `ds.remove("Edge")` |
| `contains(x)` | có chứa x không | `ds.contains("Chrome")` |
| `isEmpty()` | danh sách có rỗng không | `ds.isEmpty()` |

In thẳng cả list ra cũng được: `System.out.println(ds)` cho ra `[Chrome, Firefox]`, rất tiện khi muốn xem nhanh.

> **List chứa số** phải viết `List<Integer>`, không phải `List<int>`. `Integer` là "phiên bản object" của `int`. Java tự đổi qua lại giữa hai kiểu này nên bạn cứ `add(5)` hay `int x = ds.get(0);` như bình thường.

## Đến lượt bạn

1. Tạo `List<String> gioHang = new ArrayList<>();`
2. Thêm lần lượt: `Trà Shan Tuyết`, `Trà Sen Tây Hồ`, `Ấm Tử Sa Mini`, rồi in số món (dùng `size()`).
3. Xóa `Ấm Tử Sa Mini`, in cả list.
4. In xem list có chứa `Trà Sen Tây Hồ` không (dùng `contains`), rồi in món đầu tiên (dùng `get`).

```
Giỏ hàng có 3 món
Còn lại: [Trà Shan Tuyết, Trà Sen Tây Hồ]
Có Trà Sen Tây Hồ? true
Món đầu tiên: Trà Shan Tuyết
```
