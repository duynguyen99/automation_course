---
title: "GitHub, branch và pull request"
type: read
minutes: 8
---

Git lưu lịch sử trên **máy bạn**. Nhưng nếu laptop hỏng thì sao? Và đồng nghiệp lấy code của bạn bằng cách nào? Câu trả lời là **GitHub**: một trang web lưu các kho Git trên mạng (gọi là **remote repository**), nơi cả team cùng làm việc.

> Với người mới tìm việc, GitHub còn là **CV thứ hai**. Một kho `tramoc-autotest` gọn gàng, commit rõ ràng, có README, nói với nhà tuyển dụng nhiều hơn mọi lời giới thiệu.

## Đưa project lên GitHub lần đầu

1. Tạo tài khoản ở **github.com** (nên đặt username chuyên nghiệp, ví dụ `lannguyen-qa`).
2. Bấm **+** góc trên bên phải → **New repository**. Đặt tên `tramoc-autotest`, chọn **Public** (để nhà tuyển dụng xem được) hoặc **Private**. **Không** tích *Add a README* (project của bạn đã có commit rồi).
3. Bấm **Create repository**. GitHub hiện sẵn mấy lệnh, bạn chạy trong Terminal của project:

```bash
git remote add origin https://github.com/lannguyen-qa/tramoc-autotest.git
git branch -M main
git push -u origin main
```

| Lệnh | Ý nghĩa |
|---|---|
| `git remote add origin <url>` | khai báo kho trên mạng, đặt biệt danh là `origin` |
| `git branch -M main` | đảm bảo nhánh chính tên là `main` |
| `git push -u origin main` | **đẩy** các commit lên GitHub. `-u` ghi nhớ để lần sau chỉ cần gõ `git push` |

Lần push đầu, một cửa sổ đăng nhập GitHub sẽ bật lên (đó là *Git Credential Manager*, có sẵn trong Git for Windows). Đăng nhập bằng trình duyệt là xong, lần sau không phải làm lại. Tải lại trang GitHub: code của bạn đã ở đó!

## Branch: làm việc trên "bản nháp"

Nhánh `main` là bản code **chính thức** mà cả team tin dùng. Không ai sửa thẳng lên đó. Muốn thêm test mới, bạn tạo một **branch** (nhánh): một bản sao để thử nghiệm thoải mái, làm hỏng cũng không ảnh hưởng ai.

```bash
git switch -c test/cart-total        # tạo nhánh mới và chuyển sang nó
# ... viết test, rồi:
git add .
git commit -m "Thêm test tổng tiền giỏ hàng"
git push -u origin test/cart-total   # đẩy nhánh mới lên GitHub
```

`git branch` liệt kê các nhánh (dấu `*` là nhánh đang đứng). `git switch main` để quay về nhánh chính.

## Pull request: xin phép gộp code

Khi test trên nhánh đã xong, bạn mở một **pull request** (gọi tắt **PR**): lời đề nghị "hãy xem và gộp nhánh của tôi vào `main`".

1. Sau khi push nhánh, GitHub hiện nút **Compare & pull request**. Bấm vào.
2. Viết **tiêu đề** và **mô tả**: thêm test gì, chạy thế nào, kết quả ra sao.
3. Chọn **Reviewers**: đồng nghiệp sẽ đọc code, để lại bình luận, yêu cầu sửa nếu cần. Bạn sửa trên chính nhánh đó, commit và push tiếp, PR tự cập nhật.
4. Các **check** tự động (chương 11 bạn sẽ cài CI để chạy `mvn clean test` ở đây) phải xanh.
5. Khi được duyệt (*Approve*), bấm **Merge pull request**. Code của bạn chính thức vào `main`.

Cuối cùng, cập nhật máy bạn với `main` mới nhất:

```bash
git switch main
git pull          # kéo các commit mới từ GitHub về máy
```

## Toàn cảnh một ngày làm việc

```text
git switch main → git pull → git switch -c <nhánh mới>
→ viết test → git add → git commit → git push
→ mở Pull Request → review, sửa → Merge → quay lại bước đầu
```

Đây là quy trình bạn sẽ lặp lại hằng ngày ở bất kỳ công ty nào. Nghe nhiều bước, nhưng sau một tuần nó sẽ thành phản xạ.

| Lệnh | Hướng | Nhớ nhanh |
|---|---|---|
| `git push` | máy bạn → GitHub | **đẩy** lên |
| `git pull` | GitHub → máy bạn | **kéo** về |
| `git clone <url>` | tải nguyên một kho về lần đầu | ngày đầu đi làm, bạn sẽ `clone` project của công ty |

## Thử trên máy bạn

- [ ] Push project `tramoc-autotest` lên GitHub.
- [ ] Tạo nhánh `docs/readme`, thêm file `README.md` một dòng giới thiệu, commit, push, mở một pull request rồi tự merge nó.
