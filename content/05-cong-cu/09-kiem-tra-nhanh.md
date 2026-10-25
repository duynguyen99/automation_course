---
title: "Kiểm tra nhanh: Đồ nghề của dev"
type: quiz
minutes: 5
questions:
  - q: "Bạn gõ `java -version` và thấy `'java' is not recognized...`. Việc đầu tiên nên làm là gì?"
    options:
      - "Cài lại Windows"
      - "Đóng cửa sổ dòng lệnh, mở lại cửa sổ mới rồi gõ lại"
      - "Cài thêm IntelliJ"
    answer: 1
    explain: "Cửa sổ mở trước khi cài xong JDK chưa biết PATH mới. Nếu mở lại vẫn lỗi, kiểm tra mục Add to PATH khi cài."
  - q: "Trong project Maven, class `LoginTest.java` nên nằm ở thư mục nào?"
    options:
      - "`src/main/java`"
      - "`src/test/java`"
      - "`target/`"
    answer: 1
    explain: "Code test nằm trong `src/test/java` (IntelliJ tô màu xanh lá). `target/` do Maven tự sinh ra."
  - q: "Ba phần nào tạo nên tọa độ của một dependency trong `pom.xml`?"
    options:
      - "`groupId`, `artifactId`, `version`"
      - "`name`, `url`, `scope`"
      - "`package`, `class`, `method`"
    answer: 0
    explain: "Ví dụ `org.seleniumhq.selenium` : `selenium-java` : `4.51.0`."
  - q: "`<scope>test</scope>` trên dependency `assertj-core` nghĩa là gì?"
    options:
      - "Thư viện chỉ được tải khi có lỗi"
      - "Thư viện chỉ dùng được cho code trong `src/test`"
      - "Thư viện đang ở bản thử nghiệm"
    answer: 1
    explain: "Thư viện test không cần (và không nên) đi vào code sản phẩm."
  - q: "Bạn chỉ muốn chạy class `CartTest`. Lệnh nào đúng?"
    options:
      - "`mvn clean`"
      - "`mvn test -Dtest=CartTest`"
      - "`mvn run CartTest`"
    answer: 1
    explain: "`-Dtest=` chọn class (hoặc `Class#method`) cần chạy. `mvn clean` chỉ xóa thư mục `target/`."
  - q: "Kết quả cuối có `Tests run: 8, Failures: 2, Errors: 0, Skipped: 1`. Câu nào đúng?"
    options:
      - "Cả 8 test đều pass"
      - "2 test cho kết quả sai so với mong đợi, 1 test bị bỏ qua"
      - "2 test bị bỏ qua, 1 test lỗi"
    answer: 1
    explain: "Failures là test chạy xong nhưng kết quả sai, rất có thể là bug. Lúc này Maven báo BUILD FAILURE."
  - q: "Vì sao nên ghi `target/` vào file `.gitignore`?"
    options:
      - "Vì Maven tự sinh lại nó mỗi lần build, không cần lưu vào Git"
      - "Vì `target/` chứa mật khẩu"
      - "Vì Git không đọc được thư mục tên `target`"
    answer: 0
    explain: "Chỉ lưu vào Git những gì con người viết ra. Kết quả build thì sinh lại được."
  - q: "Thứ tự nào đúng để lưu thay đổi vào lịch sử Git?"
    options:
      - "`git commit` rồi `git add`"
      - "`git add` rồi `git commit`"
      - "`git push` rồi `git add`"
    answer: 1
    explain: "`add` bỏ thay đổi vào giỏ (staging), `commit` thanh toán và lưu ảnh chụp. `push` mới đẩy lên GitHub."
  - q: "Ở công ty, muốn thêm một test mới vào nhánh `main`, quy trình chuẩn là gì?"
    options:
      - "Sửa thẳng trên `main` rồi `git push`"
      - "Tạo branch mới, commit, push, mở pull request để được review rồi merge"
      - "Gửi file test qua email cho trưởng nhóm"
    answer: 1
    explain: "Pull request cho đồng nghiệp review và cho CI chạy test trước khi code vào nhánh chính."
---

Chín câu hỏi để chắc rằng "bàn làm việc" của bạn đã sẵn sàng. Từ chương sau, bạn có thể làm bài trên trang này, rồi chép sang project `tramoc-autotest` trên máy để chạy bằng `mvn clean test` cho quen tay.
