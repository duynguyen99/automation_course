---
title: "Nối chuỗi: ghép chữ với biến"
type: code
minutes: 5
seed: |
  public class Main {
      public static void main(String[] args) {
          String tenTest = "Đăng nhập";
          int thoiGian = 3;
          String ketQua = "PASS";

          // In ra: Test Đăng nhập chạy trong 3 giây: PASS

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String tenTest = "Đăng nhập";
          int thoiGian = 3;
          String ketQua = "PASS";

          System.out.println("Test " + tenTest + " chạy trong " + thoiGian + " giây: " + ketQua);
      }
  }
tests:
  - text: 'Console in ra `Test Đăng nhập chạy trong 3 giây: PASS`'
    stdout: { equals: "Test Đăng nhập chạy trong 3 giây: PASS" }
  - text: 'Dùng cả 3 biến `tenTest`, `thoiGian`, `ketQua` trong câu lệnh in'
    source: 'println\s*\(.*tenTest.*thoiGian.*ketQua.*\)'
hints:
  - 'Đừng quên dấu cách ở trong ngoặc kép: `"Test "` chứ không phải `"Test"`.'
---

Dấu `+` khi đứng cạnh một String sẽ **nối chuỗi** (*string concatenation*): ghép các mảnh lại thành một câu dài.

```java
String ten = "Lan";
int tuoi = 24;
System.out.println("Bạn " + ten + " năm nay " + tuoi + " tuổi");
// Bạn Lan năm nay 24 tuổi
```

Số (như `tuoi`) cũng được tự động biến thành chữ khi nối với String.

## Chú ý dấu cách

Java không tự thêm dấu cách. `"Bạn" + ten` sẽ thành `BạnLan`. Dấu cách phải nằm **trong** ngoặc kép.

## Một cái bẫy thú vị

```java
System.out.println("Tổng: " + 2 + 3);   // Tổng: 23  (nối chữ)
System.out.println("Tổng: " + (2 + 3)); // Tổng: 5   (tính trước)
```

Java đọc từ trái sang phải. Gặp String trước thì mọi dấu `+` sau đó đều là nối chữ. Muốn tính trước thì dùng ngoặc tròn.

## Đến lượt bạn

Dùng các biến có sẵn để in ra đúng câu:

```
Test Đăng nhập chạy trong 3 giây: PASS
```
