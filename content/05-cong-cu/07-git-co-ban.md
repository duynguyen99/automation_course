---
title: "Git cơ bản: lưu lại lịch sử code"
type: read
minutes: 8
---

Bạn từng có thư mục kiểu này chưa: `baocao.docx`, `baocao_final.docx`, `baocao_final_sua.docx`, `baocao_final_THATSU.docx`? **Git** sinh ra để chấm dứt cảnh đó. Git là **hệ thống quản lý phiên bản** (*version control*): nó chụp lại "ảnh" của toàn bộ project mỗi khi bạn muốn, và cho bạn quay lại bất kỳ ảnh nào trong quá khứ.

Ở công ty, **mọi** dòng code test đều được quản lý bằng Git. Nhà tuyển dụng gần như chắc chắn sẽ hỏi bạn về nó.

## Cài Git và khai báo tên

1. Vào **git-scm.com**, tải **Git for Windows**, chạy bộ cài. Hầu hết các màn hình cứ để mặc định và bấm **Next**. Riêng màn hình *"Adjusting the name of the initial branch"*, chọn **Override the default branch name** và để là `main`.
2. Mở cmd mới, kiểm tra: `git --version` (ví dụ `git version 2.5x.x.windows.1`).
3. Khai báo bạn là ai (chỉ làm **một lần** trên mỗi máy). Mỗi ảnh chụp sẽ được ký tên này:

```bash
git config --global user.name "Nguyen Thi Lan"
git config --global user.email "lan.nguyen@example.com"
```

## Ba khu vực của Git

Hãy tưởng tượng bạn đi siêu thị:

| Khu vực | Giống như | Lệnh đưa file vào |
|---|---|---|
| **Working directory** (thư mục làm việc) | kệ hàng: file bạn đang sửa | (bạn sửa file bình thường) |
| **Staging area** (khu chuẩn bị) | giỏ hàng: những thay đổi bạn **chọn** để lưu | `git add` |
| **Repository** (kho lịch sử) | hóa đơn đã thanh toán: ảnh chụp được lưu vĩnh viễn | `git commit` |

Mỗi lần **commit** là một ảnh chụp có kèm lời nhắn, tên người làm và thời gian.

## Năm lệnh đầu tiên

Mở Terminal trong IntelliJ (`Alt+F12`), đang đứng ở thư mục project:

```bash
git init                         # 1. Biến thư mục này thành một kho Git (chỉ làm 1 lần)
git status                       # 2. Xem file nào mới, file nào đã sửa
git add .                        # 3. Bỏ TẤT CẢ thay đổi vào "giỏ" (dấu chấm = mọi thứ)
git commit -m "Thêm test đăng nhập"   # 4. Chụp ảnh, kèm lời nhắn
git log --oneline                # 5. Xem lịch sử các lần commit
```

Kết quả `git log --oneline` trông như sau, mỗi dòng một commit, mới nhất ở trên cùng:

```text
a3f9c21 Thêm test đăng nhập
7b1e004 Tạo project Maven
```

Dãy `a3f9c21` là **mã commit** (*commit hash*), giống mã đơn hàng: mỗi commit một mã duy nhất.

> `git status` là lệnh bạn nên gõ **nhiều nhất**. Trước khi `add`, trước khi `commit`, cứ `git status` để biết mình đang ở đâu. Nó không bao giờ làm hỏng gì cả.

Lời nhắn commit nên ngắn gọn và nói rõ **đã làm gì**: `"Thêm test giỏ hàng trống"` tốt hơn nhiều so với `"sửa"` hay `"update"`.

## .gitignore: những thứ KHÔNG đưa vào Git

Thư mục `target/` do Maven tự sinh, cài đặt riêng của IntelliJ (`.idea/`) thì mỗi máy một khác. Đưa chúng vào Git chỉ làm kho phình to và gây xung đột. Tạo file tên **`.gitignore`** ở thư mục gốc project (cạnh `pom.xml`):

```text
# Kết quả build của Maven
target/

# Cài đặt riêng của IntelliJ
.idea/
*.iml

# Báo cáo test sinh ra khi chạy
allure-results/
```

Git sẽ coi như những file khớp các dòng trên **không tồn tại**. Hãy tạo `.gitignore` **trước** lần commit đầu tiên.

> Không bao giờ commit mật khẩu thật, token hay thông tin khách hàng vào Git. Lịch sử Git lưu mãi mãi, xóa file ở commit sau thì nó vẫn còn trong commit trước.

## IntelliJ cũng làm được hết

Nếu chưa quen dòng lệnh, IntelliJ có giao diện cho Git: **`Ctrl+K`** mở khung **Commit** (tích file, viết lời nhắn, bấm **Commit**), **Git → Show Git Log** để xem lịch sử. Tuy vậy, hãy biết các lệnh: buổi phỏng vấn sẽ hỏi lệnh, không hỏi nút bấm.

## Thử trên máy bạn

- [ ] Trong project `tramoc-autotest`: tạo `.gitignore` như trên, rồi `git init`, `git add .`, `git commit -m "Tạo project Maven"`.
- [ ] Gõ `git status`: Git báo *nothing to commit, working tree clean*. Gõ `git log --oneline`: thấy đúng một commit của bạn.
