---
title: "Lambda và Stream: xử lý List gọn gàng"
type: code
minutes: 10
seed: |
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          List<Integer> gia = List.of(185000, 240000, 420000, 150000, 210000, 560000);
          List<String> ten = List.of("  Trà Sen Tây Hồ ", "Ấm Tử Sa Mini", " Trà Shan Tuyết");

          System.out.println("Số món trên 200000: " + demGiaTren(gia, 200000));
          System.out.println("Giá tăng dần: " + sapXepTang(gia));
          System.out.println("Tên đã làm sạch: " + lamSachTen(ten));
      }

      static long demGiaTren(List<Integer> gia, int nguong) {
          return 0; // dùng stream().filter(...).count()
      }

      static List<Integer> sapXepTang(List<Integer> gia) {
          return gia; // dùng stream().sorted().toList()
      }

      static List<String> lamSachTen(List<String> ten) {
          return ten; // dùng stream().map(...).toList()
      }
  }
solution: |
  import java.util.List;

  public class Main {
      public static void main(String[] args) {
          List<Integer> gia = List.of(185000, 240000, 420000, 150000, 210000, 560000);
          List<String> ten = List.of("  Trà Sen Tây Hồ ", "Ấm Tử Sa Mini", " Trà Shan Tuyết");

          System.out.println("Số món trên 200000: " + demGiaTren(gia, 200000));
          System.out.println("Giá tăng dần: " + sapXepTang(gia));
          System.out.println("Tên đã làm sạch: " + lamSachTen(ten));
      }

      static long demGiaTren(List<Integer> gia, int nguong) {
          return gia.stream().filter(g -> g > nguong).count();
      }

      static List<Integer> sapXepTang(List<Integer> gia) {
          return gia.stream().sorted().toList();
      }

      static List<String> lamSachTen(List<String> ten) {
          return ten.stream().map(t -> t.trim()).toList();
      }
  }
checks: |
  eq("count", () -> call("demGiaTren", java.util.List.of(50, 300, 200, 900), 200), 2, "demGiaTren([50, 300, 200, 900], 200)");
  eq("sort", () -> call("sapXepTang", java.util.List.of(300, 100, 200)), java.util.List.of(100, 200, 300), "sapXepTang([300, 100, 200])");
  ok("orig", () -> { java.util.List<Integer> goc = new java.util.ArrayList<>(java.util.List.of(3, 1, 2)); call("sapXepTang", goc); return goc.equals(java.util.List.of(3, 1, 2)); }, "sapXepTang không được sửa list gốc");
  eq("map", () -> call("lamSachTen", java.util.List.of(" Chrome ", "Edge  ")), java.util.List.of("Chrome", "Edge"), "lamSachTen([\" Chrome \", \"Edge  \"])");
tests:
  - text: '`demGiaTren([50, 300, 200, 900], 200)` trả về `2`'
    java: count
  - text: '`sapXepTang([300, 100, 200])` trả về `[100, 200, 300]`'
    java: sort
  - text: '`sapXepTang` không làm thay đổi list gốc'
    java: orig
  - text: '`lamSachTen` bỏ dấu cách hai đầu của từng tên'
    java: map
  - text: 'Dùng `stream()` và lambda `->`'
    source: '\.stream\(\)[\s\S]*->'
  - text: 'Console in đúng 3 dòng theo đề'
    stdout: { equals: "Số món trên 200000: 4\nGiá tăng dần: [150000, 185000, 210000, 240000, 420000, 560000]\nTên đã làm sạch: [Trà Sen Tây Hồ, Ấm Tử Sa Mini, Trà Shan Tuyết]" }
hints:
  - '`return gia.stream().filter(g -> g > nguong).count();`'
  - '`return gia.stream().sorted().toList();`'
  - '`return ten.stream().map(t -> t.trim()).toList();`'
---

Ở trang "Duyệt List", để lọc một danh sách bạn phải viết 5–6 dòng: tạo list rỗng, `for`, `if`, `add`... Java có một cách viết ngắn hơn nhiều, đọc lên như một câu mô tả: **Stream**.

```java
long soMon = gia.stream()
                .filter(g -> g > 200000)
                .count();
```

Đọc là: *"lấy dòng chảy các giá, **lọc** những giá lớn hơn 200000, rồi **đếm**"*.

## Lambda: một hàm viết tắt

`g -> g > 200000` là một **lambda**, một "hàm mini" không cần tên:

- Bên trái `->`: tham số (`g`, mỗi giá trong danh sách).
- Bên phải `->`: kết quả (`g > 200000`, đúng hay sai).

Viết đầy đủ thì nó tương đương một method như `static boolean lonHon200k(int g) { return g > 200000; }`, nhưng lambda gọn hơn nhiều và nằm ngay chỗ cần dùng.

## Các bước hay dùng của Stream

| Bước | Làm gì | Ví dụ |
|---|---|---|
| `filter(x -> điều kiện)` | giữ lại phần tử thỏa điều kiện | `.filter(g -> g > 200000)` |
| `map(x -> giá trị mới)` | biến đổi từng phần tử | `.map(t -> t.trim())` |
| `sorted()` | sắp xếp tăng dần | `.sorted()` |
| `count()` | đếm (kết thúc, trả về `long`) | `.count()` |
| `toList()` | gom lại thành List mới (kết thúc) | `.toList()` |

Một stream bắt đầu bằng `.stream()`, nối các bước ở giữa, và **kết thúc** bằng một bước như `count()` hay `toList()`. Stream **không sửa list gốc**, nó luôn tạo ra kết quả mới.

> `count()` trả về kiểu `long`, một kiểu số nguyên "dài" hơn `int` (chứa được số rất lớn). Dùng y như `int`.

> List tạo bởi `toList()` **không sửa được** (giống `List.of`). Nếu cần thêm bớt, hãy copy sang `new ArrayList<>(...)`.

## Đây là cách tester xử lý dữ liệu trang web

Khi học Selenium, bạn sẽ viết những dòng như:

```java
List<String> tenSanPham = driver.findElements(By.cssSelector(".product-name"))
        .stream()
        .map(e -> e.getText())
        .toList();
```

Lấy tất cả thẻ tên sản phẩm, đọc chữ của từng thẻ, gom thành `List<String>` để so sánh với kết quả mong đợi. Kiểm tra trang sản phẩm đã sắp xếp đúng chưa? So danh sách giá trên trang với chính nó sau khi `.sorted()`!

## Đến lượt bạn

Viết lại 3 method, mỗi method **một dòng `return`** dùng stream:

1. `demGiaTren(gia, nguong)`: đếm số giá **lớn hơn** `nguong` (`filter` + `count`).
2. `sapXepTang(gia)`: trả về list mới đã sắp xếp tăng dần (`sorted` + `toList`).
3. `lamSachTen(ten)`: trả về list mới mà mỗi tên đã bỏ dấu cách hai đầu (`map` + `toList`).

```
Số món trên 200000: 4
Giá tăng dần: [150000, 185000, 210000, 240000, 420000, 560000]
Tên đã làm sạch: [Trà Sen Tây Hồ, Ấm Tử Sa Mini, Trà Shan Tuyết]
```
