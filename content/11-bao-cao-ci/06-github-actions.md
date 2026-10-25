---
title: "GitHub Actions: test tự chạy mỗi khi có code mới"
type: read
minutes: 10
---

Hãy tưởng tượng mỗi lần developer đẩy code lên GitHub, có một "người máy" tự động: lấy code về, cài Java, chạy toàn bộ test, rồi báo kết quả ngay trên trang GitHub. Nếu test fail, người máy chặn không cho gộp code vào nhánh chính. Đó là **CI** (*Continuous Integration*, tích hợp liên tục), và **GitHub Actions** là công cụ CI miễn phí có sẵn trong GitHub.

Với automation tester, CI là nơi test **thực sự tạo ra giá trị**: test không chỉ chạy khi bạn nhớ bấm, mà chạy **mỗi lần** có thay đổi.

## File workflow

Bạn tạo file `.github/workflows/ui-tests.yml` trong repository. Định dạng **YAML**: thụt lề bằng dấu cách (không dùng Tab), cặp `tên: giá trị`, dấu `-` cho danh sách.

```yaml
name: UI tests

on:
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Lấy code về
        uses: actions/checkout@v5

      - name: Cài Java 21
        uses: actions/setup-java@v5
        with:
          distribution: temurin
          java-version: '21'
          cache: maven

      - name: Chạy test
        run: mvn -B test -Dheadless=true

      - name: Lưu báo cáo
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: |
            target/surefire-reports
            target/allure-results
            target/cucumber-report.html
```

## Đọc từng phần

| Phần | Ý nghĩa |
|---|---|
| `name` | Tên workflow, hiện trong tab **Actions** của GitHub |
| `on` | **Khi nào** chạy: khi `push` lên nhánh `main`, khi có `pull_request`, và `workflow_dispatch` cho phép bấm nút chạy bằng tay |
| `jobs.test` | Một công việc tên `test` |
| `runs-on: ubuntu-latest` | Chạy trên một máy ảo Linux do GitHub cấp, mới tinh mỗi lần |
| `steps` | Các bước, chạy lần lượt từ trên xuống |
| `uses: actions/checkout@v5` | Dùng một *action* có sẵn để lấy code của repository về máy ảo |
| `actions/setup-java` | Cài JDK 21 bản **Temurin**; `cache: maven` lưu thư viện Maven đã tải, lần sau chạy nhanh hơn |
| `run: mvn -B test ...` | Chạy lệnh như trên máy bạn. `-B` (*batch mode*) giúp log gọn, không có thanh tiến trình |
| `if: always()` | Bước này chạy **kể cả khi** bước trước fail. Lúc test fail mới là lúc cần báo cáo nhất! |
| `upload-artifact` | Đóng gói thư mục báo cáo thành file zip, tải về được từ trang kết quả của lần chạy |

> **Còn Chrome?** Máy `ubuntu-latest` của GitHub đã **cài sẵn Google Chrome**, và Selenium Manager tự tải ChromeDriver phù hợp. Bạn không cần thêm bước nào. Chỉ nhớ chạy **headless** (ở đây qua `-Dheadless=true`, như mẹo ở trang trước), vì máy ảo không có màn hình.

> Số phiên bản sau dấu `@` (như `@v5`) thỉnh thoảng tăng lên. Khi tạo workflow mới, hãy mở trang của action trên GitHub Marketplace để xem bản mới nhất.

## Kết quả trông thế nào?

- Trong tab **Actions** của repository: mỗi lần chạy là một dòng, dấu ✓ xanh hoặc ✗ đỏ. Bấm vào để xem log từng bước.
- Trên mỗi **Pull Request**: GitHub hiện kết quả kiểm tra ngay dưới phần mô tả. Đội có thể cấu hình "không cho merge khi test đỏ" (*branch protection*).
- Phần **Artifacts** ở cuối trang kết quả: tải file `test-reports.zip` để xem báo cáo, ảnh chụp màn hình.

## Chạy theo lịch

Bộ regression lớn thường chạy **hằng đêm** thay vì mỗi lần push. Thêm vào phần `on`:

```yaml
on:
  schedule:
    - cron: '0 18 * * *'   # 18:00 giờ UTC = 1 giờ sáng giờ Việt Nam
```

Kết hợp với tag: mỗi lần push chạy `@smoke` (5 phút), mỗi đêm chạy `@regression` (1 tiếng).

## Ghi nhớ

- CI = test tự chạy mỗi khi có thay đổi. GitHub Actions cấu hình bằng file YAML trong `.github/workflows/`.
- Các bước chính: **checkout → setup-java → `mvn -B test` → upload báo cáo** (`if: always()`).
- Trên CI luôn chạy **headless**. Chrome đã có sẵn trên `ubuntu-latest`.
- Ở các công ty bạn cũng sẽ gặp **Jenkins**, **GitLab CI**, **Azure DevOps**. Ý tưởng giống hệt, chỉ khác cú pháp file cấu hình.
