# Deploy QA Academy

App gồm hai phần, deploy ở hai nơi:

| Phần | Ở đâu | Vì sao |
|---|---|---|
| Trang học (Next.js) | **Vercel** (miễn phí) | Nhanh, tự build mỗi lần push code |
| Runner: chạy Java, Chrome, website mẫu | **Oracle Cloud Free** (máy ảo ARM, miễn phí) | Cần Java + Chrome chạy liên tục, Vercel không làm được |

```
Học viên ──HTTPS + mật khẩu──► Vercel (trang học, /api/run) ──HTTPS + RUNNER_TOKEN──► Oracle VM (Caddy → runner)
```

Bạn sẽ cần chuẩn bị:
- **`SITE_PASSWORD`**: mật khẩu chung để vào trang học. Gửi mật khẩu này cho người học.
- **`RUNNER_TOKEN`**: chuỗi bí mật dài, chỉ Vercel và runner biết. Tạo bằng lệnh `openssl rand -hex 32`, hoặc gõ một chuỗi ngẫu nhiên dài trên 40 ký tự.

---

## Phần 1: Runner trên Oracle Cloud

### 1.1 Tạo máy ảo

1. Đăng ký https://www.oracle.com/cloud/free/. Cần thẻ để xác minh, nhưng gói Always Free không bị trừ tiền.
2. Vào **Compute → Instances → Create instance**:
   - Image: **Ubuntu 24.04**
   - Shape: **Ampere (VM.Standard.A1.Flex)**, chọn **2 OCPU, 12 GB RAM** (vẫn nằm trong gói miễn phí)
   - Tải **SSH private key** về máy và giữ cẩn thận.
3. Ghi lại **Public IP**, ví dụ `140.238.12.34`.

### 1.2 Mở cổng 80 và 443

Oracle chặn cổng ở **hai lớp**, phải mở cả hai:

1. Trên web: vào **Networking → Virtual Cloud Networks →** VCN của máy → **Security Lists → Default** → **Add Ingress Rules**. Source `0.0.0.0/0`, TCP, destination port `80`. Lặp lại cho `443`.
2. Trong máy ảo (sau khi SSH vào, xem bước 1.3):

```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

### 1.3 Cài Docker và chạy runner

```bash
ssh -i duong-dan-toi-private-key ubuntu@140.238.12.34

# Cài Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu && newgrp docker

# Chặn code học viên gọi vào dịch vụ metadata nội bộ của Oracle (chứa thông tin máy chủ)
sudo iptables -I DOCKER-USER -d 169.254.0.0/16 -j DROP
sudo netfilter-persistent save

# Lấy code (repo private: dùng Personal Access Token của GitHub thay cho mật khẩu)
git clone https://github.com/<ban>/<repo>.git qa-academy
cd qa-academy
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Trong `deploy/.env`, điền:
- `RUNNER_DOMAIN`: dùng IP theo dạng sslip.io, ví dụ IP `140.238.12.34` thì ghi `140-238-12-34.sslip.io`. Không cần mua tên miền.
- `RUNNER_TOKEN`: chuỗi bí mật đã chuẩn bị.

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

Lần build đầu mất khoảng 5–10 phút, vì phải tải Java, Chromium và thư viện. Kiểm tra:

```bash
curl https://140-238-12-34.sslip.io/health          # {"ok":true,"java":"openjdk version \"21..."}
curl -I https://140-238-12-34.sslip.io/practice/    # 200: website mẫu Tiệm Trà Mộc
```

Cập nhật khi có code mới:

```bash
cd ~/qa-academy && git pull
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build
```

---

## Phần 2: Trang học trên Vercel

1. Đẩy code lên GitHub.
2. Vào https://vercel.com, đăng nhập bằng GitHub → **Add New → Project** → chọn repo. Framework sẽ tự nhận là Next.js.
3. Trước khi bấm Deploy, mở **Environment Variables** và thêm:

| Tên | Giá trị |
|---|---|
| `SITE_PASSWORD` | mật khẩu chung cho người học |
| `RUNNER_URL` | `https://140-238-12-34.sslip.io` |
| `RUNNER_TOKEN` | đúng chuỗi trong `deploy/.env` |
| `NEXT_PUBLIC_PRACTICE_URL` | `https://140-238-12-34.sslip.io/practice` |

4. Bấm **Deploy**. Mỗi lần push code lên nhánh chính, Vercel sẽ tự deploy lại.

Khi mở trang, trình duyệt sẽ hỏi tên đăng nhập và mật khẩu. Tên gõ gì cũng được, mật khẩu là `SITE_PASSWORD`.

---

## Lưu ý

- **Tiến độ học** lưu trong trình duyệt và gắn với địa chỉ trang. Trang trên Vercel là một địa chỉ mới, nên muốn mang tiến độ từ máy local lên: ở trang chủ bản local bấm **"tải file tiến độ"**, rồi ở trang chủ bản Vercel bấm **"mở lại ở máy kia"**.
- **Bảo mật**: runner chạy code Java tùy ý của người học. Cách deploy này phù hợp cho **một nhóm nhỏ người quen**. Các lớp bảo vệ đã có:
  - mật khẩu vào trang học;
  - token giữa Vercel và runner;
  - container chạy bằng user thường, có giới hạn RAM, CPU và số process;
  - chặn truy cập metadata của Oracle.

  Code học viên vẫn chạy chung user với runner. Nếu muốn mở công khai, cần thêm: chạy mỗi bài trong một sandbox riêng (ví dụ gVisor hoặc container dùng một lần), giới hạn số lần chạy cho mỗi người, và tài khoản đăng nhập riêng cho từng người.
- Mỗi bài Selenium dùng khoảng 500 MB RAM. Với 12 GB RAM, có thể tăng `RUNNER_CONCURRENCY` lên 4.
