---
title: "Mảng: một dãy hộp liền nhau"
type: code
minutes: 7
seed: |
  public class Main {
      public static void main(String[] args) {
          // Tạo mảng trinhDuyet ở đây

          // In ra 3 dòng theo yêu cầu

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String[] trinhDuyet = {"Chrome", "Firefox", "Edge", "Safari"};

          System.out.println(trinhDuyet.length);
          System.out.println(trinhDuyet[0]);
          System.out.println(trinhDuyet[trinhDuyet.length - 1]);
      }
  }
tests:
  - text: 'Khai báo mảng `String[] trinhDuyet` chứa `"Chrome"`, `"Firefox"`, `"Edge"`, `"Safari"` (đúng thứ tự)'
    source: 'String\s*\[\s*\]\s*trinhDuyet\s*=\s*(new\s+String\s*\[\s*\]\s*)?\{\s*"Chrome"\s*,\s*"Firefox"\s*,\s*"Edge"\s*,\s*"Safari"\s*\}'
  - text: 'Console in ra `4`, `Chrome`, `Safari`'
    stdout: { equals: "4\nChrome\nSafari" }
  - text: 'Dùng `trinhDuyet.length` để lấy số phần tử'
    source: 'trinhDuyet\.length'
  - text: 'Lấy phần tử cuối bằng `trinhDuyet.length - 1` (để code vẫn đúng khi thêm trình duyệt mới)'
    source: 'trinhDuyet\s*\[\s*trinhDuyet\.length\s*-\s*1\s*\]'
hints:
  - 'Phần tử đầu tiên là `trinhDuyet[0]`.'
  - 'Mảng có 4 phần tử thì chỉ số cuối là 3, tức là `length - 1`.'
---

Muốn chạy test trên 4 trình duyệt thì tạo 4 biến `String`? Có cách gọn hơn nhiều: **mảng** (*array*), một biến chứa **nhiều giá trị cùng kiểu**, xếp theo thứ tự.

```java
String[] trinhDuyet = {"Chrome", "Firefox", "Edge"};
int[] diem = {8, 6, 9, 10};
```

`String[]` đọc là "mảng các String".

## Lấy phần tử theo chỉ số

Mỗi phần tử có một **chỉ số** (*index*), và **chỉ số bắt đầu từ 0**:

| Chỉ số | 0 | 1 | 2 |
|---|---|---|---|
| Giá trị | `"Chrome"` | `"Firefox"` | `"Edge"` |

```java
System.out.println(trinhDuyet[0]);      // Chrome
System.out.println(trinhDuyet[2]);      // Edge
System.out.println(trinhDuyet.length);  // 3  (số phần tử)
trinhDuyet[1] = "Opera";                // thay phần tử thứ hai
```

Vì đếm từ 0, phần tử **cuối cùng** luôn có chỉ số `length - 1`. Nếu lấy `trinhDuyet[3]` khi mảng chỉ có 3 phần tử, chương trình sẽ báo lỗi `ArrayIndexOutOfBoundsException`. Thử xem!

## Đến lượt bạn

1. Tạo mảng `trinhDuyet` gồm `"Chrome"`, `"Firefox"`, `"Edge"`, `"Safari"`.
2. In ra số phần tử của mảng.
3. In ra phần tử đầu tiên.
4. In ra phần tử cuối cùng bằng `length - 1`.
