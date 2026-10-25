---
title: "Tại sao cần viết test bằng code?"
type: read
minutes: 5
---

Ở chương 2, bạn đã viết method `kiemTraTieuDe` trả về `"PASS"` hoặc `"FAIL"`, rồi tự `System.out.println` ra để nhìn. Cách đó chạy được, nhưng thử tưởng tượng project có **500 kiểm tra** như vậy:

- Ai sẽ đọc 500 dòng in ra để tìm dòng nào là `FAIL`?
- Một kiểm tra bị lỗi giữa chừng, các kiểm tra phía sau có còn chạy không?
- Làm sao máy CI biết "hôm nay có bao nhiêu cái hỏng" để gửi email báo cho team?

Các **test framework** (khung chạy test) được sinh ra để giải quyết đúng những câu hỏi đó.

## JUnit: người tổ chức buổi thi

**JUnit** là test framework phổ biến nhất của Java. Bạn viết mỗi test là một method có đánh dấu `@Test`, còn JUnit lo phần còn lại:

| JUnit làm | Nghĩa là bạn không phải |
|---|---|
| tự tìm và chạy mọi method có `@Test` | tự gọi từng method trong `main` |
| chạy từng test **độc lập**: một test fail, các test khác vẫn chạy | lo một lỗi làm dừng cả chương trình |
| báo cáo rõ: bao nhiêu pass, bao nhiêu fail, fail ở đâu, vì sao | tự in và tự đếm |
| chạy được từ IntelliJ, từ `mvn test`, từ máy CI | viết thêm gì cả |

Khóa học dùng **JUnit 6** (phần viết test gọi là **Jupiter**, package `org.junit.jupiter.api`). Trên mạng bạn sẽ gặp nhiều bài về JUnit 5: cách viết test gần như giống hệt. Còn JUnit 4 (dùng `@Before`, `org.junit.Test`) đã cũ, gặp trong project cũ thì nhận ra là được.

## AssertJ: người chấm điểm nói rõ ràng

Một test phải **kiểm tra** (*assert*) kết quả. Thư viện **AssertJ** giúp câu kiểm tra đọc như tiếng Anh:

```java
assertThat(tongTien).isEqualTo(370000);
assertThat(tieuDe).startsWith("Đăng nhập");
assertThat(danhSachSanPham).hasSize(6);
```

Và khi sai, nó báo **cụ thể** chứ không chỉ "FAIL":

```text
expected: 370000
 but was: 340000
```

## Unit test là gì? Liên quan gì đến tester?

**Unit test** là test cho một "đơn vị" nhỏ của code, thường là một method hoặc một class: hàm tính tiền, hàm kiểm tra số điện thoại... Chúng chạy cực nhanh, hàng nghìn test trong vài giây.

Bạn học làm **automation tester web**, vậy sao phải học unit test? Vì:

1. **Test Selenium cũng là test JUnit.** Chương 8, mỗi kịch bản "mở trình duyệt, đăng nhập, kiểm tra lời chào" chính là một method `@Test`, kết thúc bằng một `assertThat(...)`. Mọi thứ ở chương này bạn sẽ dùng lại nguyên vẹn.
2. Bạn sẽ **đọc code** của dev và đôi khi viết test ở mức nhỏ. Hiểu unit test giúp bạn nói chuyện cùng ngôn ngữ với họ.
3. Tư duy test (giá trị biên, dữ liệu sai, trường hợp đặc biệt) giống nhau ở mọi tầng.

> Một test tốt giống một nhân chứng đáng tin: chỉ nói **pass** khi mọi thứ đúng, và khi **fail** thì chỉ rõ chỗ sai. Cả chương này là về cách viết những "nhân chứng" như vậy.
