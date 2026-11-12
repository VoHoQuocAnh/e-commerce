<!-- docs/DEPLOYMENT_GUIDE.md -->
# Hướng Dẫn Khởi Chạy & Triển Khai (Local & Docker)

## Cách 1: Chạy toàn bộ hệ thống bằng Docker Compose (Khuyên dùng — 1 lệnh duy nhất)

Yêu cầu máy đã cài đặt **Docker Desktop**.

```bash
# Tại thư mục gốc d:\e-commerce
docker compose up --build -d
```

Docker Compose sẽ tự động:
1. Khởi tạo **MySQL 8.0** (cổng `3307`) và **Redis 7** (cổng `6379`).
2. Build **Backend (`calem_server`)**, tự động chạy `npx sequelize-cli db:migrate` và `npx sequelize-cli db:seed:all` để nạp tài khoản mẫu + bộ sưu tập quần áo CALEM.CLUB, sau đó mở API tại `http://localhost:5000/api/v1`.
3. Build **Frontend (`calem_client`)** với Nginx SPA tại `http://localhost:5173`.

---

## Cách 2: Chạy môi trường Development (Node.js trên máy kết hợp MySQL & Redis Docker)

### Bước 1: Bật MySQL và Redis bằng Docker
```bash
docker compose up -d mysql redis
```

### Bước 2: Cài đặt & chạy Backend (`server`)
```bash
cd server
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
Server sẽ lắng nghe tại `http://localhost:5000`.

### Bước 3: Cài đặt & chạy Frontend (`client`)
Mở một terminal mới:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Truy cập website tại `http://localhost:5173`.

---

## Tài khoản & Mã giảm giá mẫu (Đã nạp sẵn qua Seeder)

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Quản trị viên (Admin)** | `admin@calemstudio.vn` | `Admin@123` |
| **Khách hàng (User)** | `khachhang@calemstudio.vn` | `User@123` |

- **Mã giảm giá dùng thử ở bước Checkout**:
  - `CALEM10`: Giảm 10% (tối đa 80.000đ) cho đơn từ 300.000đ.
  - `CHAOBAN50K`: Giảm trực tiếp 50.000đ cho đơn từ 400.000đ.
