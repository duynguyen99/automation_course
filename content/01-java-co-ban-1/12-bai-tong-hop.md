---
title: "Bài tổng hợp: Báo cáo kết quả test"
type: code
minutes: 10
seed: |
  public class Main {
      public static void main(String[] args) {
          String tenDuAn = "Website bán hàng";
          int tongTest = 40;
          int soPass = 34;
          int soSkip = 2;

          // Viết code của bạn ở đây

      }
  }
solution: |
  public class Main {
      public static void main(String[] args) {
          String tenDuAn = "Website bán hàng";
          int tongTest = 40;
          int soPass = 34;
          int soSkip = 2;

          int soFail = tongTest - soPass - soSkip;
          double tyLePass = soPass * 100.0 / tongTest;

          System.out.println("=== BÁO CÁO: " + tenDuAn + " ===");
          System.out.println("Tổng: " + tongTest);
          System.out.println("Pass: " + soPass);
          System.out.println("Fail: " + soFail);
          System.out.println("Skip: " + soSkip);
          System.out.println("Tỷ lệ pass: " + tyLePass + "%");
      }
  }
tests:
  - text: 'Dòng 1: `=== BÁO CÁO: Website bán hàng ===` (dùng biến `tenDuAn`)'
    stdout: { regex: '^=== BÁO CÁO: Website bán hàng ===\n' }
  - text: 'Dòng 2 đến 5: `Tổng: 40`, `Pass: 34`, `Fail: 4`, `Skip: 2`'
    stdout: { includes: "Tổng: 40\nPass: 34\nFail: 4\nSkip: 2" }
  - text: 'Dòng cuối: `Tỷ lệ pass: 85.0%`'
    stdout: { regex: '\nTỷ lệ pass: 85\.0%$' }
  - text: 'Tính số fail bằng biến, không gõ thẳng số 4'
    source: '=\s*tongTest\s*-\s*soPass\s*-\s*soSkip'
  - text: 'Tỷ lệ pass là biến kiểu `double`'
    source: 'double\s+\w+\s*='
  - text: 'Dùng biến `tenDuAn` khi in tiêu đề'
    source: 'println\s*\(.*tenDuAn'
hints:
  - 'Số fail = tổng − pass − skip.'
  - 'Muốn kết quả có phần thập phân thì nhân với `100.0` (có `.0`) thay vì `100`. Khi đó Java hiểu đây là phép tính số thực.'
  - 'Đừng quên dấu `%` ở cuối dòng tỷ lệ: `... + tyLePass + "%"`.'
---

Đây là bài đầu tiên giống công việc thật! Sau mỗi lần chạy, bộ test tự động luôn in ra một bản **báo cáo** (*report*) tóm tắt kết quả.

Bạn sẽ dùng mọi thứ đã học: biến, kiểu dữ liệu, phép tính, nối chuỗi và println.

## Yêu cầu

Dự án có 40 test case: 34 pass, 2 bị bỏ qua (*skip*), số còn lại là fail. Hãy in ra Console **đúng 6 dòng** như sau:

```
=== BÁO CÁO: Website bán hàng ===
Tổng: 40
Pass: 34
Fail: 4
Skip: 2
Tỷ lệ pass: 85.0%
```

Yêu cầu thêm:

- Tính **số fail** từ các biến có sẵn.
- Tính **tỷ lệ pass** vào một biến kiểu `double` (34 ÷ 40 × 100 = 85.0).
- Dùng biến, không gõ cứng con số. Nếu ngày mai dự án có 50 test, chỉ cần sửa con số ở đầu chương trình là báo cáo tự đúng. Đây chính là tư duy của automation!

> Bài này hơi dài, cứ làm từng dòng một và bấm Chạy thường xuyên để xem tiến triển.
