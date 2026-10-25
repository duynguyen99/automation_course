---
title: "Duyệt mảng: đi qua từng phần tử"
type: code
minutes: 8
seed: |
  public class Main {
      public static void main(String[] args) {
          String[] ketQua = {"PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS"};
          System.out.println(demPass(ketQua));
      }

      static int demPass(String[] ketQua) {
          int soPass = 0;
          // Duyệt qua mảng và đếm số "PASS"

          return soPass;
      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String[] ketQua = {"PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS"};
          System.out.println(demPass(ketQua));
      }

      static int demPass(String[] ketQua) {
          int soPass = 0;
          for (String kq : ketQua) {
              if (kq.equals("PASS")) {
                  soPass++;
              }
          }
          return soPass;
      }
  }
checks: |
  eq("t1", () -> call("demPass", (Object) new String[]{"PASS", "FAIL", "PASS", "PASS", "FAIL", "PASS"}), 4, "demPass({PASS, FAIL, PASS, PASS, FAIL, PASS})");
  eq("t2", () -> call("demPass", (Object) new String[]{"FAIL", "FAIL"}), 0, "demPass({FAIL, FAIL})");
  eq("t3", () -> call("demPass", (Object) new String[]{}), 0, "demPass({}) với mảng rỗng");
  eq("t4", () -> call("demPass", (Object) new String[]{new String("PASS"), "SKIP", "PASS"}), 2, "demPass({PASS, SKIP, PASS})");
tests:
  - text: 'Mảng mẫu có 4 cái `"PASS"` → trả về `4`'
    java: t1
  - text: 'Toàn `"FAIL"` → trả về `0`'
    java: t2
  - text: 'Mảng rỗng → trả về `0`'
    java: t3
  - text: 'Không đếm nhầm `"SKIP"` và so sánh bằng `equals`'
    java: t4
  - text: 'Dùng vòng lặp (`for` hoặc for-each)'
    source: 'for\s*\('
hints:
  - 'Cấu trúc: `for (String kq : ketQua) { if (kq.equals("PASS")) { soPass++; } }`'
---

Mảng và vòng lặp là cặp đôi hoàn hảo. Có hai cách đi qua (**duyệt**) từng phần tử:

### Cách 1: `for` với chỉ số

```java
String[] trinhDuyet = {"Chrome", "Firefox", "Edge"};

for (int i = 0; i < trinhDuyet.length; i++) {
    System.out.println(i + ": " + trinhDuyet[i]);
}
```

Đây là lý do lập trình viên thích đếm từ 0: `i` chạy từ `0` đến `length - 1`, khớp với chỉ số của mảng.

### Cách 2: for-each, gọn hơn

```java
for (String td : trinhDuyet) {
    System.out.println("Chạy test trên " + td);
}
```

Đọc là: *"với mỗi `td` trong `trinhDuyet`..."*. Dùng khi chỉ cần giá trị, không cần biết chỉ số. Đây là cách bạn sẽ dùng nhiều nhất khi duyệt danh sách phần tử trên trang web bằng Selenium.

## Mẫu "biến đếm"

Để đếm những phần tử thỏa mãn một điều kiện: tạo biến đếm bằng 0, duyệt mảng, gặp phần tử phù hợp thì tăng biến đếm.

```java
int dem = 0;
for (int d : diem) {
    if (d >= 5) {
        dem++;
    }
}
```

## Đến lượt bạn

Viết method `demPass` đếm xem trong mảng kết quả có bao nhiêu phần tử là `"PASS"`. Nhớ bài trước: so sánh String thì dùng `equals`!
